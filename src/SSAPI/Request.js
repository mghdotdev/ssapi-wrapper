import hash from 'object-hash';
import {RequestCache} from './RequestCache'

const DONE = 4;
const OK = 200;

const cache = new RequestCache(30000);

class Request {

	constructor (endpoint, method, params) {
		this.endpoint = endpoint;
		this.method = method;
		this.params = params;
	}

	serializeParams (params) {
		return qs.stringify(params, { arrayFormat: 'repeat' })
	}

	buildUrl (endpoint, params) {
		if (endpoint.indexOf('?') > -1) {
			return `${ endpoint }${ params }`;
		}
		else {
			return `${ endpoint }?${ params }`;
		}
	}

	send () {
		return new Promise((resolve, reject) => {
			const cacheResponse = cache.access(url);
			if (cacheResponse != undefined) {
				return resolve(cacheResponse);
			}

			const xhr = new XMLHttpRequest();
			xhr.open(this.method, url);
			xhr.responseType = 'json';
			xhr.send();

			xhr.onreadystatechange = () => {
				if (xhr.readyState == DONE) {
					if (xhr.status == OK) {
						const returnObject = {
							response: {
								status: xhr.status,
								responseURL: xhr.responseURL,
								responseType: xhr.responseType,
								data: (typeof xhr.response == 'object') ? xhr.response : JSON.parse(xhr.response)
							},
							requestParams: { ...this.params },
							requestQueryString: queryString
						};

						cache.insert(url, returnObject);

						resolve(returnObject);
					}
					else {
						console.error(`[SSAPI][Request].send - Error with response.`, `Code: ${ xhr.status }.`);

						reject(xhr);
					}
				}
			};
		});
	}
};

export {
	Request
};
