const DEFAULT_PARAMS = {
	resultsFormat: 'native'
};

class State {

	constructor( siteId, passedDefaultParams = {} ) {

		this.siteId = siteId;
		this.setDefault( passedDefaultParams );
		this.params = { ...this.defaultParams };
		this.filters = [];
		this.sorting = {};

	}

	compareFilterRanges( range1, range2 ) {
		return ( range1[ 0 ] == range2[ 0 ] && range1[ 1 ] == range2[ 1 ] );
	}

	compareFilterValues( value1, value2 ) {

		const arrayCheck1 = Array.isArray( value1 );
		const arrayCheck2 = Array.isArray( value2 );

		if ( arrayCheck1 && arrayCheck2 ) {
			return this.compareFilterRanges( value1, value2 );
		}
		else if ( arrayCheck1 || arrayCheck2 ) {
			return false;
		}
		else {
			return ( value1 == value2 );
		}

	}

	outputFilters() {

		return this.filters.reduce(( output, filter ) => {

			let keyRoot = `${ filter.type }.${ filter.field }`;

			if ( Array.isArray( filter.value ) ) {
				return {
					...output,
					...(filter.value[0] != undefined && { [ `${ keyRoot }.low` ]: filter.value[0] }),
					...(filter.value[1] != undefined && { [ `${ keyRoot }.high` ]: filter.value[1] })
				};
			}
			else {
				output[ keyRoot ] = output[ keyRoot ] || [];
				output[ keyRoot ].push( filter.value );
			}

			return output;

		}, {});

	}

	outputSort() {

		if ( this.sorting.field && this.sorting.direction ) {

			return { [ `sort.${ this.sorting.field }` ]: this.sorting.direction };

		}

		return;

	}

	transformFilterType( backgroundFilter ) {
		return ( backgroundFilter ) ?
			'bgfilter' :
			'filter';
	}

	addFilter( field, value, backgroundFilter = false ) {

		console.log( 'addedValue', value );

		if ( field == undefined ) {
			throw new TypeError( '[SSAPI][State].addFilter - `field` is undefined.' );
		}
		if ( value == undefined ) {
			throw new TypeError( '[SSAPI][State].addFilter - `value` is undefined.' );
		}

		const filter = {
			field: field,
			value: value,
			type: this.transformFilterType( backgroundFilter )
		};

		this.filters.push( filter );

		return this;

	}

	removeFilter( field, value, backgroundFilter = false ) {

		if ( field == undefined ) {
			throw new TypeError( '[SSAPI][State].removeFilter - `field` is undefined.' );
		}
		if ( value == undefined ) {
			throw new TypeError( '[SSAPI][State].removeFilter - `value` is undefined.' );
		}

		const type = this.transformFilterType( backgroundFilter );

		this.filters = this.filters.filter(( filter ) => {
			return !(
				filter.field == field &&
				filter.type == type &&
				this.compareFilterValues( filter.value, value )
			);
		});

		return this;

	}

	toggleFilter( field, value, backgroundFilter = false ) {

		if ( field == undefined ) {
			throw new TypeError( '[SSAPI][State].toggleFilter - `field` is undefined.' );
		}
		if ( value == undefined ) {
			throw new TypeError( '[SSAPI][State].toggleFilter - `value` is undefined.' );
		}

		const type = this.transformFilterType( backgroundFilter );

		const foundFilter = this.filters.find(( filter ) => {
			return (
				filter.field == field &&
				filter.type == type &&
				this.compareFilterValues( filter.value, value )
			);
		});

		if ( foundFilter ) {
			return this.removeFilter( field, value, backgroundFilter );
		}
		else {
			return this.addFilter( field, value, backgroundFilter );
		}

	}

	query( q ) {

		this.params.q = q;

		return this;

	}

	perPage( n ) {

		this.params.resultsPerPage = n;

		return this;

	}

	page( n ) {

		this.params.page = n;

		return this;

	}

	sort( field, direction = 'asc' ) {

		if ( field == undefined ) {
			throw new TypeError( '[SSAPI][State].sort - "field" is undefined.' );
		}

		this.sorting = { field: field, direction: direction };

		return this;

	}

	setDefault( passedDefaultParams = {} ) {

		if ( typeof passedDefaultParams != 'object' ) {
			throw new TypeError( '[SSAPI][State].setDefault - `passedDefaultParams` is not an object' );
		}

		this.defaultParams = { siteId: this.siteId, ...DEFAULT_PARAMS, ...passedDefaultParams };

		return this;

	}

	lock() {

		this.defaultParams = { ...this.params };

		return this;

	}

	reset() {

		this.params = { ...this.defaultParams };
		this.filters = [];
		this.sorting = {};

		return this;

	}

	clearFacets() {

		this.filters = [];

		return this;

	};

	output() {

		return {
			...this.params,
			...this.outputFilters(),
			...this.outputSort()
		};

	}

}


export default State