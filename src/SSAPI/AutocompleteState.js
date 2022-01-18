const DEFAULT_PARAMS = {
	disableSpellCorrect: true,
	limit: 4
};

class AutocompleteState {

	constructor( pubId, passedDefaultParams = {}, debug = false ) {
		this.pubId = pubId;
		this.defaultParams = { pubId: this.pubId, ...DEFAULT_PARAMS, ...passedDefaultParams };
		this.params = { ...this.defaultParams };
		this.debug = debug;
	}

	query( query ) {
		this.params.query = query;
		return this;
	}

	get output() {

		return {
			...this.params
		};

	}

};

export {
	AutocompleteState
};
