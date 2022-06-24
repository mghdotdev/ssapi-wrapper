import hash from 'object-hash';
import {RequestCache} from './RequestCache';

const DONE = 4;
const OK = 200;

const cache = new RequestCache(30000);

export class Request {

	constructor (endpoint, payload, queryParams = {}) {
		this.endpoint = endpoint;
		this.payload = payload;
		this.queryParams = queryParams;
	}

	send () {
		return new Promise((resolve, reject) => {
			const cacheKey = hash(this.payload);
			const cacheResponse = cache.access(cacheKey);

			if (cacheResponse != undefined) {
				return resolve(cacheResponse);
			}

			const xhr = new XMLHttpRequest();
			xhr.open('POST', this.endpoint);
			xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
			xhr.responseType = 'json';
			xhr.send(
				JSON.stringify(this.payload)
			);

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
							requestPayload: this.payload,
							requestQueryParams: this.queryParams
						};

						cache.insert(cacheKey, returnObject);

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
