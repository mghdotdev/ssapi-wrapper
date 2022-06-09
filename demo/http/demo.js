(async () => {

	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	const options = {
		siteId: __CONFIG__.siteId, 
		defaultParams: {
			resultsPerPage: 25
		}
	};
	
	const client = new SSAPI.Client( options.siteId, options.defaultParams );

	// autocomplete callback
	client.on('autocomplete', (e) => {

		console.log('autocomplete', e.detail);

	});

	// search callback
	client.on('search', (e) => {

		console.log('search', e.detail);

	});

	const inputElement = document.getElementById('input');
	inputElement.addEventListener('keyup', debounce((e) => {

		client
			.query(e.target.value)
			.autocomplete();

	}, 500));

})();