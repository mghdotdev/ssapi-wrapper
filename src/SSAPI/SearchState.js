export class SearchState {

	static REDIRECT_RESPONSE = {
		DEFAULT: '',
		DIRECT: 'direct',
		FULL: 'full',
		MINIMAL: 'minimal'
	};

	static SORT_DIRECTION = {
		DEFAULT: 'asc',
		ASC: 'asc',
		DESC: 'desc'
	};

	static DEFAULT_STATE = {
		siteId: '',
		sorts: [],
		search: {
			query: {
				string: '',
				spellCorrection: false
			},
			subQuery: '',
			originalQuery: '',
			redirectResponse: ''
		},
		filters: [],
		pagination: {
			page: 1,
			pageSize: 20
		},
		merchandising: {
			disabled: false,
			segments: [],
			landingPage: ''
		},
		tracking: {
			userId: '',
			domain: ''
		},
		personalization: {
			disabled: true,
			cart: '',
			lastViewed: '',
			shopper: ''
		}
	};

	constructor (siteId, passedDefaultParams = {}, debug = false) {
		this.siteId = siteId;
		this.defaultState = {
			...DEFAULT_STATE,
			...passedDefaultParams,
			siteId: siteId
		};
		this.site = {...this.defaultState};
		this.debug = debug;
		this.lockedState = null;
	}

	_compareFilterRanges (range1, range2) {
		return (range1.low == range2.low && range1.high == range2.high);
	}

	_compareFilterValues (value1, value2) {
		const rangeCheck1 = typeof value1 === 'object' && value1.hasOwnProperty('low') && value1.hasOwnProperty('high');
		const rangeCheck2 = typeof value2 === 'object' && value2.hasOwnProperty('low') && value2.hasOwnProperty('high');

		if (rangeCheck1 && rangeCheck2) {
			return this._compareFilterRanges(value1, value2);
		}
		else if (rangeCheck1 || rangeCheck2) {
			return false;
		}
		else {
			return value1 == value2;
		}
	}

	addFilter (field, value, backgroundFilter = false) {
		if (field == undefined) {
			throw new TypeError('[SSAPI][State].addFilter - `field` is undefined.');
		}
		if (value == undefined) {
			throw new TypeError('[SSAPI][State].addFilter - `value` is undefined.');
		}

		const filter = {
			field: field,
			background: !!backgroundFilter,
			...Array.isArray(value)
				? {
					value: {
						low: value[0],
						high: value[0]
					},
					type: 'range'
				}
				: {
					value,
					type: 'value'
				}
		}

		this.filters.push(filter);

		return this;
	}

	removeFilter (field, value, backgroundFilter = false) {
		if (field == undefined) {
			throw new TypeError('[SSAPI][State].removeFilter - `field` is undefined.');
		}
		if (value == undefined) {
			throw new TypeError('[SSAPI][State].removeFilter - `value` is undefined.');
		}

		this.filters = this.filters.filter(filter => {
			return !(
				filter.field == field &&
				filter.background == backgroundFilter &&
				filter.type == type &&
				this._compareFilterValues(filter.value, value)
			);
		});

		return this;
	}

	toggleFilter(field, value, backgroundFilter = false) {
		if (field == undefined) {
			throw new TypeError('[SSAPI][State].toggleFilter - `field` is undefined.');
		}
		if (value == undefined) {
			throw new TypeError('[SSAPI][State].toggleFilter - `value` is undefined.');
		}

		const foundFilter = this.filters.find((filter) => {
			return (
				filter.field == field &&
				filter.background == backgroundFilter &&
				filter.type == type &&
				this._compareFilterValues(filter.value, value)
			);
		});

		return foundFilter
			? this.removeFilter(field, value, backgroundFilter)
			: this.addFilter(field, value, backgroundFilter);
	}

	query (query, subQuery = null, originalQuery = null, redirectResponse = null) {
		this.state.search = {
			...this.state.search,
			query: {
				string: query,
				spellCorrection: !!originalQuery
					? true
					: false
			},
			subQuery,
			originalQuery,
			redirectResponse
		};

		return this;
	}

	perPage (n) {
		this.state.pagination.pageSize = n;

		return this;
	}

	page (n) {
		this.state.pagination.page = n;

		return this;
	}

	sort (field, direction = this.constructor.SORT_DIRECTION.DEFAULT) {
		if (field == undefined) {
			throw new TypeError('[SSAPI][State].sort - "field" is undefined.');
		}

		// Only support single sorting
		this.sorts = [
			{
				field: field,
				direction: direction
			}
		];

		return this;
	}

	lock () {
		this.lockedState = {
			...this.state
		};

		return this;
	};

	reset () {
		this.state = this.lockedState
			? {
				...this.lockedState
			}
			: {
				...this.defaultState
			};

		return this;
	}

	clearFilters () {
		this.filters = this.filters.filter(filter => !filter.background);

		return this;
	};

	other (key, value) {
		this.state[key] = value;

		return this;
	}

	get output () {
		return this.state;
	}

};
