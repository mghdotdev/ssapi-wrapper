import {SearchState} from './SearchState';

export class AutocompleteState extends SearchState {
	
	static DEFAULT_STATE = {
		...SearchState.DEFAULT_STATE,
		suggestions: {
			count: 5
		}
	}

	constructor() {
		super(...arguments);
	}

	suggestionCount (count) {
		this.state.suggestion.count = count;

		return this;
	}

};
