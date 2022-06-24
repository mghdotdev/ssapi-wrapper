export class SearchState {

	static REDIRECT_RESPONSE = {
		DEFAULT: 'direct',
		DIRECT: 'direct',
		FULL: 'full',
		MINIMAL: 'minimal'
	};

	static SORT_DIRECTION = {
		ASC: 'asc',
		DEFAULT: 'asc',
		DESC: 'desc'
	};

	static DEFAULT_STATE = {
		filters: [],
		merchandising: {
			disabled: false,
			landingPage: '',
			segments: []
		},
		pagination: {
			page: 1,
			pageSize: 20
		},
		personalization: {
			cart: '',
			disabled: true,
			lastViewed: '',
			shopper: ''
		},
		search: {
			originalQuery: '',
			query: {
				spellCorrection: false,
				string: ''
			},
			redirectResponse: SearchState.REDIRECT_RESPONSE.DEFAULT,
			subQuery: ''
		},
		siteId: '',
		sorts: [],
		tracking: {
			domain: '',
			userId: ''
		}
	};

	constructor (siteId, passedDefaultParams = {}, debug = false) {
		this.siteId = siteId;
		this.defaultState = {
			...this.constructor.DEFAULT_STATE,
			...passedDefaultParams,
			siteId: siteId
		};
		this.state = {...this.defaultState};
		this.debug = debug;
		this.lockedState = null;
	}

	_compareFilterRanges (range1, range2) {
		return range1.low === range2.low && range1.high === range2.high;
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

		return value1 === value2;

	}

	addFilter (field, value, backgroundFilter = false) {
		if (field === void 0 || field === null) {
			throw new TypeError('[SSAPI][State].addFilter - `field` is undefined.');
		}
		if (value === void 0 || value === null) {
			throw new TypeError('[SSAPI][State].addFilter - `value` is undefined.');
		}

		const filter = {
			background: Boolean(backgroundFilter),
			field: field,
			...Array.isArray(value)
				? {
					type: 'range',
					value: {
						high: value[0],
						low: value[0]
					}
				}
				: {
					type: 'value',
					value
				}
		};

		this.filters.push(filter);

		return this;
	}

	determineFilterTypeFromValue (value) {
		return Array.isArray(value)
			? 'range'
			: 'value';
	}

	removeFilter (field, value, backgroundFilter = false) {
		if (field === void 0 || field === null) {
			throw new TypeError('[SSAPI][State].removeFilter - `field` is undefined.');
		}
		if (value === void 0 || value === null) {
			throw new TypeError('[SSAPI][State].removeFilter - `value` is undefined.');
		}

		this.filters = this.filters.filter(filter => {
			return !(
				filter.field === field &&
				filter.background === backgroundFilter &&
				filter.type === this.determineFilterTypeFromValue(value) &&
				this._compareFilterValues(filter.value, value)
			);
		});

		return this;
	}

	toggleFilter (field, value, backgroundFilter = false) {
		if (field === void 0 || field === null) {
			throw new TypeError('[SSAPI][State].toggleFilter - `field` is undefined.');
		}
		if (value === void 0 || value === null) {
			throw new TypeError('[SSAPI][State].toggleFilter - `value` is undefined.');
		}

		const foundFilter = this.filters.find((filter) => {
			return (
				filter.field === field &&
				filter.background === backgroundFilter &&
				filter.type === this.determineFilterTypeFromValue(value) &&
				this._compareFilterValues(filter.value, value)
			);
		});

		return foundFilter
			? this.removeFilter(field, value, backgroundFilter)
			: this.addFilter(field, value, backgroundFilter);
	}

	query (query, subQuery = '', originalQuery = '', redirectResponse = this.constructor.REDIRECT_RESPONSE.DEFAULT) {
		this.state.search = {
			...this.state.search,
			originalQuery,
			query: {
				spellCorrection: Boolean(originalQuery),
				string: query
			},
			redirectResponse,
			subQuery
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
		if (field === void 0 || field === null) {
			throw new TypeError('[SSAPI][State].sort - "field" is undefined.');
		}

		// Only support single sorting
		this.sorts = [
			{
				direction: direction,
				field: field
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

	merchandising ({disabled, landingPage, segments} = {}) {
		this.state.merchandising = {
			disabled: disabled ?? this.state.merchandising.disabled,
			landingPage: landingPage ?? this.state.merchandising.landingPage,
			segments: segments ?? this.state.merchandising.segments
		};
	}

	other (key, value) {
		this.state[key] = value;

		return this;
	}

	get output () {
		return this.state;
	}

};
