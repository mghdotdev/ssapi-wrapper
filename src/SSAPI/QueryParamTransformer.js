/* eslint-disable capitalized-comments */
/* eslint-disable multiline-comment-style */


/*

if (state == undefined) {
			throw new TypeError('[SSAPI][Client].setState - `state` is undefined.');
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

		for (let prop in state) {
			let value = state[prop];

			switch (prop) {
				case 'q': {
					this.query(value, false);
					break;
				}
				case 'perPage': {
					this.perPage(value, false);
					break;
				}
				case 'page': {
					this.page(value);
					break;
				}
				default: {
					const testPassed = dynamicSetTests.some((test) => {
						const match = prop.match(test.pattern);
						if (match) {
							if (Array.isArray(value)) {
								value.map((filterValue) => {
									if (filterValue != undefined) {
										this[test.fn](match[test.match], filterValue, false);
									}
								});
							}
							else if (value != undefined) {
								this[test.fn](match[test.match], value, false);
							}

							return true;
						}
					});

					if (!testPassed) {
						this.other(prop, value);

						break;
					}
				}
			}
		}

		this.stateSetFromFunction = true;

*/

import _transform from 'lodash.transform';
import _isEqual from 'lodash.isequal';
import _isObject from 'lodash.isobject';
import flatten from 'flat';

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
const difference = (object, base) => {
	const changes = (o, b) => {
		return _transform(o, (result, value, key) => {
			if (!_isEqual(value, b[key])) {
				result[key] = _isObject(value) && _isObject(b[key]) ? changes(value, b[key]) : value;
			}
		});
	};

	return changes(object, base);
}

export class QueryParamTransformer {
	static from (urlQueryParams, client) {
		if (urlQueryParams === void 0 || urlQueryParams === null) {
			throw new TypeError('[SSAPI][UrlStateTransformer].transform - `urlQueryParams` is undefined.');
		}

		for (const prop in urlQueryParams) {
			const value = urlQueryParams[prop];

			console.log(prop, value);
		}
	}

	static to (state, defaultState = {}) {
		const diff = difference(state, defaultState);
		const flat = flatten(diff);
		console.log('state', state);
		console.log('diff', diff);
		console.log('flatten', flat);
	}
};
