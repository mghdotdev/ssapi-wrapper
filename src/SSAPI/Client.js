import State from './State'
import Request from './Request'

const EVENTS = {
	SEARCH: 'search'
};

class Client {

	constructor( siteId, defaultSearchParams = {} ) {

		if ( siteId == undefined ) {
			throw new TypeError( '[SSAPI][Client] - `siteId` is undefined.' );
		}

		this.state = new State( siteId, defaultSearchParams );

		this.endpoint = 'https://api.searchspring.net/api/search/search.json';
		this.method = 'GET';
		this.data = {};
		this.events = {
			[ EVENTS.SEARCH ]: () => {}
		};

	}

	async search() {

		const response = await new Request(
			this.endpoint,
			this.method,
			this.state.output()
		).send();

		this.data = response;

		this.events[ EVENTS.SEARCH ]( response );

		return response;

	}

	on( event, callback ) {

		if ( typeof this.events[ event ] != 'function' ) {
			throw new Error( `[SSAPI][Client].on - Event "${ event }" does not exist.` );
		}

		this.events[ event ] = callback;	

	}

	reset() {

		this.state.reset();

		return this;

	}

	clearFacets() {

		this.state.clearFacets();

		return this;

	}

	setDefault( defaultParams ) {

		this.state.setDefault( defaultParams );

		return this;

	}

	lock() {

		this.state.lock();

		return this;

	}

	perPage( n ) {

		this.state.perPage( n );

		return this;

	}

	page( n ) {

		this.state.page( n );

		return this;

	}

	sort( field, direction ) {

		this.state.sort( field, direction );

		return this;

	}

	filter( field, value ) {

		this.state
			.page( 1 )
			.toggleFilter( field, value, false );

		return this;

	}

	backgroundFilter( field, value ) {

		this.state
			.page( 1 )
			.toggleFilter( field, value, true );

		return this;

	}

	query( q ) {

		this.state.query( q );

		return this;
	}

}

export default Client