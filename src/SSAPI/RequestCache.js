class RequestCache {

	constructor( throttleTime = 1000 ) {

		this.store = new Map();
		this.throttleTime = throttleTime;

	}

	access( key ) {

		const record = this.store.get( key );

		if ( record ) {

			const now = Date.now();
			
			if ( record.timestamp - now > this.throttleTime ) {
				return this.remove( key );
			}

			return record.data;

		}

		return null;

	}

	insert( key, value ) {

		const record = {
			timestamp: Date.now(),
			data: value
		};

		this.store.set( key, record );

		return true;

	}

	purge() {

		this.store.clear();

		return true;

	}

	remove( key ) {

		return this.store.delete( key );

	}

}

export default RequestCache