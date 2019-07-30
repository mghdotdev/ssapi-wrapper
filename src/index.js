import Client from './SSAPI/Client.js'

// static methods
const createPages = ( pagination ) => {
	const pages = [];
	for( let i = 1; i <= pagination.totalPages; i++ ) {
		pages.push( i );
	}
	return pages;
};

export {
	Client,
	createPages
}