import axios from 'axios'
import { throttleAdapterEnhancer } from 'axios-extensions'
import qs from 'qs'

const THROTTLE_MS = 30000;
const http = axios.create({
	adapter: throttleAdapterEnhancer( axios.defaults.adapter, { threshold: THROTTLE_MS } )
});

class Request {

	constructor( endpoint, method, params ) {
		this.endpoint = endpoint;
		this.method = method;
		this.params = params;
	}

	send() {

		return http({
			url: this.endpoint,
			method: this.method,
			params: { ...this.params },
			paramsSerializer: ( params ) => {
				return qs.stringify( params, { arrayFormat: 'repeat' } );
			},
			responseType: 'json'
		})
		.then(( response ) => {

			if ( response && response.status == 200 ) {

				return response.data;

			}
			else {

				console.error( `[SSAPI][Request].send - Error with response.`, response );

				return {};

			}

		})
		.catch(( error ) => {

			console.error( `[SSAPI][Request].send - Error! ${ error }` );

		});

	}

}

export default Request