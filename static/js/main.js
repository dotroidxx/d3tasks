require([
		"https://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js",
		"https://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js",
],
function(){

	console.log("Google Libs Loaded");

	require([
		"/static/js/object.js",
		"/static/js/jquery.jgrowl.js",
	],
	function(){

		console.log("Lib Loaded");

		require(["/static/js/app.js"],
				function(){
	
					$.jGrowl("app.js is Loaded");
					console.log("app.js Loaded");
					D3T.init();
				
					require.ready(function(){

						// when the page is loaded
						console.log("start getAll");
						D3T.getAll();

					});
				});
	});

});
