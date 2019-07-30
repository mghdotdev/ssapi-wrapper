(function( angular ) {

	var ngModule = angular.module( 'SSAPI_Demo', [] );

	ngModule.controller('SSAPI_Demo_Controller', function( $scope, $location ) {

		// define searchspring api client
		$scope.ss = new SSAPI.Client( 'your_site_id', { resultsPerPage: 10, 'sort.relevance': 'desc' } );
		$scope.ss.setState( $location.search() );

		// define range filter model holder
		$scope.formData = {
			ranges: [],
			query: $scope.ss.state.params.q
		};

		// define search callback
		$scope.ss.on('search', function( data, response, requestParams ) {

			// define data
			$scope.data = data;

			// create pages array
			$scope.data.pagination.pages = Array.apply( null, { length: $scope.data.pagination.totalPages } ).map(function( v, n ) {
				return ( n + 1 );
			});
			
			// update url with parameters passed to API
			var paramBlacklist = [ /resultsFormat/, /siteId/, /bgfilter\..*/ ];
			var params = Object.assign( {}, requestParams );
			Object.keys( params ).forEach(function( param ) {
				var test = paramBlacklist.some(function( expr ) {
					return expr.test( param );
				});
				if ( test ) {
					delete params[ param ];
				}
			});
			$location.search( params );

			// refresh digest
			$scope.$evalAsync();

		});

		// initial search
		$scope.ss.query( $scope.formData.query ).search();


	});

})( angular );
