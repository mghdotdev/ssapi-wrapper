(function(){

	var SSAPIPlugin = {};
	SSAPIPlugin.install = function( Vue, options ) {

		// expose to proto
		Vue.prototype.$searchSpringClient = new SSAPI.Client( options.siteId, options.defaultParams );

	};

	Vue.use(
		SSAPIPlugin,
		{
			siteId: __CONFIG__.siteId, 
			defaultParams: {
				resultsPerPage: 25
			}
		}
	);

	// ================================================================

	Vue.component(
		'search-results',
		{
			data: function() {
				return {
					searchData: {}
				}
			},
			mounted: function() {

				var vm = this;

				vm.$root.$on( 'ss-search', function( searchPayload ) {

					vm.searchData = searchPayload.response.data;

				});

			},
			template: `
				<ul>
					<li v-for="result in searchData.results">
						{{ result.name }}
					</li>
				</ul>
			`
		}
	);

	Vue.component(
		'search-bar',
		{
			data: function() {
				return {
					query: ''
				}
			},
			methods: {
				search: function() {

					var vm = this;

					vm.$searchSpringClient
						.query( this.query )
						.search()
						.then(function( searchPayload ) {

							vm.$root.$emit( 'ss-search', searchPayload );

						});

				}
			},
			template: `
				<div>
					<form v-on:submit.prevent="search">
						<input type="search" v-model="query" />
						<button type="submit">Search</button>
					</form>
				</div>
			`
		}
	);

	var SearchApp = new Vue({
		el: '#SearchApp'
	});

	


})()