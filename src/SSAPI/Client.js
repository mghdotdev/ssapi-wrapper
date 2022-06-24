/* eslint-disable no-console */
import {SearchState} from './SearchState';
import {AutocompleteState} from './AutocompleteState';
import {Request} from './Request';
import 'custom-event-polyfill';

class Client {

	constructor (siteId, defaultSearchParams = {}, defaultAutocompleteParams = {}, debug = false) {
		if (siteId === void 0 || siteId === null) {
			throw new TypeError('[SSAPI][Client].constructor - `siteId` is undefined.');
		}

		this.states = {
			autocomplete: new AutocompleteState(siteId, defaultAutocompleteParams, debug),
			search: new SearchState(siteId, defaultSearchParams, debug)
		};

		this.endpoints = {
			autocomplete: 'https://snapi.kube.searchspring.io/api/v1/autocomplete',
			meta: 'https://snapi.kube.searchspring.io/api/v1/meta',
			search: 'https://snapi.kube.searchspring.io/api/v1/search'
		};

		this.events = [
			'autocomplete',
			'search',
			'meta'
		];

		this.bus = document.createElement('div');

		this.debug = debug;

		this.stateSetFromFunction = false;
	}

	search () {
		return new Request(
			this.endpoints.search,
			this.states.search.output
		)
			.send()
			.then((request) => {
			// Dispatch SEARCH event; pass request data
				this.bus.dispatchEvent(new CustomEvent('search', {detail: request}));

				this.afterSearch(request);

				return request;
			});
	}

	autocomplete () {
		return new Request(
			this.endpoints.autocomplete,
			this.states.autocomplete.output
		)
			.send()
			.then((request) => {
			// Store suggested query from autocomplete response
				this.suggestedQuery = request?.response?.data?.suggested?.text;

				// Dispatch AUTOCOMPLETE event; pass request data
				this.bus.dispatchEvent(new CustomEvent('autocomplete', {detail: request}));

				return request;
			});

	}

	meta () {
		return new Request(
			this.endpoints.meta,
			{
				siteId: this.siteId
			}
		)
			.send()
			.then(request => {
			// Dispatch META event; pass request data
				this.bus.dispatchEvent(new CustomEvent('meta', {detail: request}));

				return request;
			});
	}

	on (event, callback) {
		if (this.events.indexOf(event) === -1) {
			throw new Error(`[SSAPI][Client].on - Event "${ event }" does not exist.`);
		}

		this.bus.addEventListener(event, callback, false);
	}

	off (event, callback) {
		if (this.events.indexOf(event) === -1) {
			throw new Error(`[SSAPI][Client].off - Event "${ event }" does not exist.`);
		}

		this.bus.removeEventListener(event, callback, false);
	}

	afterSearch (request) {
		// Fix state for first response after state set from function
		/*
		 * If (this.stateSetFromFunction) {
		 *
		 * this.stateSetFromFunction = false;
		 *
		 * // reset filters
		 * this.states.search.filters = this.states.search.filters.filter(filter => filter.type === 'bgfilter');
		 *
		 * // re-add filters to the state from the summary
		 * if (request.response.data && request.response.data.filterSummary && request.response.data.filterSummary.length > 0) {
		 *
		 * request.response.data.filterSummary.map(filter => {
		 * this.filter(filter.field, (typeof filter.value === 'object') ? [ filter.value.rangeLow, filter.value.rangeHigh ] : filter.value);
		 * });
		 *
		 * }
		 *
		 * }
		 */
	}

	setState (state) {
		if (state == undefined) {
			throw new TypeError('[SSAPI][Client].setState - `state` is undefined.');
		}

		const dynamicSetTests = [
			{
				pattern: /^sort\.(.*)$/,
				fn: 'sort',
				match: 1
			},
			{
				pattern: /^filter\.(.*)$/,
				fn: 'filter',
				match: 1
			},
			{
				pattern: /^bgfilter\.(.*)$/,
				fn: 'backgroundFilter',
				match: 1
			}
		];

		for (let prop in state) {
			let value = state[prop];

			switch (prop) {
				case 'q': {
					this.query(value, false);
					break;
				}
				case 'perPage': {
					this.perPage(value, false);
					break;
				}
				case 'page': {
					this.page(value);
					break;
				}
				default: {
					const testPassed = dynamicSetTests.some((test) => {
						const match = prop.match(test.pattern);
						if (match) {
							if (Array.isArray(value)) {
								value.map((filterValue) => {
									if (filterValue != undefined) {
										this[test.fn](match[test.match], filterValue, false);
									}
								});
							}
							else if (value != undefined) {
								this[test.fn](match[test.match], value, false);
							}

							return true;
						}
					});

					if (!testPassed) {
						this.other(prop, value);

						break;
					}
				}
			}
		}

		this.stateSetFromFunction = true;

		return this;
	}

	other (key, value) {
		this.states.search.other(key, value);

		return this;
	}

	reset () {
		this.states.search.reset();

		return this;
	}

	lock () {
		this.states.search.lock();

		return this;
	}

	clearFilters (resetPage = true) {
		if (resetPage) {
			this.states.search.page(1);
		}

		this.states.search.clearFacets();

		return this;
	}

	perPage (n, resetPage = true) {
		if (resetPage) {
			this.states.search.page(1);
		}

		this.states.search.perPage(n);

		return this;
	}

	page (n) {
		this.states.search.page(n);

		return this;
	}

	sort (field, direction) {
		if (this.debug) {
			console.trace(`[SSAPI][Client].sort - field: ${ field } | direction: ${ direction }`);
		}

		this.states.search.sort(field, direction);

		return this;
	}

	filter (field, value, resetPage = true) {
		if (resetPage) {
			this.states.search.page(1);
		}

		this.states.search.toggleFilter(field, value, false);

		return this;
	}

	backgroundFilter (field, value, resetPage = true) {
		if (resetPage) {
			this.states.search.page(1);
		}

		this.states.search.toggleFilter(field, value, true);

		return this;
	}

	query (queryOrSearch, resetPage = true) {
		if (resetPage) {
			this.states.search.page(1);
		}

		const search = typeof queryOrSearch === 'string'
			? {
				query: queryOrSearch
			}
			: {
				originalQuery: queryOrSearch.originalQuery,
				query: queryOrSearch.query,
				redirectResponse: queryOrSearch.redirectResponse,
				subQuery: queryOrSearch.subQuery
			};

		this.states.search.query(search.query, search.subQuery, search.originalQuery, search.redirectResponse);
		this.states.autocomplete.query(search.query, search.subQuery, search.originalQuery, search.redirectResponse);

		return this;
	}

};

export {
	Client
};
