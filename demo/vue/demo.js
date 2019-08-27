(function(){

	var SSAPIPlugin = {};
	SSAPIPlugin.install = function( Vue, options ) {

		// expose to proto
		Vue.prototype.$searchSpringClient = new SSAPI.Client( options.siteId, options.defaultParams );

		// default params
		Vue.prototype.searchData = {};

		// mixin default stuff
		Vue.mixin({
			created: function() {

				var vm = this;

				vm.$searchSpringClient.on('search', function( data ) {

					vm.searchData = data;

				});

			}
		})

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
			template: `
				<ol>
					<li v-for="result in searchData.results">
						{{ result.name }}
					</li>
				</ol>
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
						.search();

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

	Vue.component(
		'search-per-page',
		{
			data: function() {
				return {
					perPage: [
						20,
						30,
						40,
						500
					],
					selectedPerPage: 20
				}
			},
			watch: {
				selectedPerPage: function( value ) {

					this.$searchSpringClient
						.perPage( value )
						.search();

				}
			},
			template: `
				<div>
					<select v-model="selectedPerPage">
						<option v-for="n in perPage" :value="n">{{ n }}</option>
					</select>
				</div>
			`
		}
	);

	var SearchApp = new Vue({
		el: '#SearchApp'
	});

})();