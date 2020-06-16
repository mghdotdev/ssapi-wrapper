import State from './State'
import Request from './Request'
import 'custom-event-polyfill'

class Client {

	constructor( siteId, defaultSearchParams = {}, debug = false ) {

		if ( siteId == undefined ) {
			throw new TypeError( '[SSAPI][Client].constructor - `siteId` is undefined.' );
		}

		this.state = new State( siteId, defaultSearchParams, debug );

		this.endpoint = 'https://api.searchspring.net/api/search/search.json';

		this.method = 'GET';

		this.events = [
			'search'
		];

		this.bus = document.createElement( 'div' );

		this.debug = debug;

	}

	search() {

		return new Request(
			this.endpoint,
			this.method,
			this.state.output
		)
		.send()
		.then(( request ) => {

			// dispatch SEARCH event; pass request data
			this.bus.dispatchEvent( new CustomEvent( 'search', { detail: request } ) );

			return request;

		});

	}

	on( event, callback ) {

		if ( this.events.indexOf( event ) === -1 ) {
			throw new Error( `[SSAPI][Client].on - Event "${ event }" does not exist.` );
		}

		this.bus.addEventListener( event, callback, false );

	}
	
	off( event, callback ) {
		
		if ( this.events.indexOf( event ) === -1 ) {
			throw new Error( `[SSAPI][Client].off - Event "${ event }" does not exist.` );
		}

		this.bus.removeEventListener( event, callback, false );

	}

	setState( state ) {

		if ( state == undefined ) {
			throw new TypeError( '[SSAPI][Client].setState - `state` is undefined.' );
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

		for ( let prop in state ) {

			let value = state[ prop ];

			switch( prop ) {
				case 'q': {
					this.query( value );
					break;
				}
				case 'resultsPerPage': {
					this.perPage( value );
					break;
				}
				case 'page': {
					this.page( value );
					break;
				}
				default: {

					const testPassed = dynamicSetTests.some(( test ) => {
						const match = prop.match( test.pattern );
						if ( match ) {

							if ( Array.isArray( value ) ) {
								value.map(( filterValue ) => {

									if ( filterValue != undefined ) {

										this[ test.fn ]( match[ test.match ], filterValue );

									}

								});
							}
							else {

								if ( value != undefined ) {

									this[ test.fn ]( match[ test.match ], value );

								}

							}

							return true;

						}
					});

					if ( !testPassed ) {

						this.other( prop, value );

						break;
					}

				}
			}

		}

		return this;

	}

	other( key, value ) {

		this.state.other( key, value );

		return this;

	}

	reset() {

		this.state.reset();

		return this;

	}

	clearFacets( resetPage = true ) {

		if ( resetPage ) {
			this.state.page( 1 );
		}

		this.state.clearFacets();

		return this;

	}

	clearFilters( resetPage ) {

		this.clearFacets( resetPage );

		return this;

	}

	perPage( n, resetPage = true ) {

		if ( resetPage ) {
			this.state.page( 1 );
		}

		this.state.perPage( n );

		return this;

	}

	page( n ) {

		this.state.page( n );

		return this;

	}

	sort( field, direction ) {

		if ( this.debug ) console.trace( `[SSAPI][Client].sort - field: ${ field } | direction: ${ direction }` );

		this.state.sort( field, direction );

		return this;

	}

	filter( field, value, resetPage = true ) {

		if ( resetPage ) {
			this.state.page( 1 );
		}

		this.state.toggleFilter( field, value, false );

		return this;

	}

	facet( field, value, resetPage ) {

		this.filter( field, value, false );

		return this;

	}

	backgroundFilter( field, value, resetPage = true ) {

		if ( resetPage ) {
			this.state.page( 1 );
		}

		this.state.toggleFilter( field, value, true );

		return this;

	}

	backgroundFacet( field, value, resetPage ) {

		this.backgroundFilter( field, value, resetPage );

		return this;

	}

	query( q, resetPage = true ) {

		if ( resetPage ) {
			this.state.page( 1 );
		}

		this.state.query( q );

		return this;
	}

}

export default Client