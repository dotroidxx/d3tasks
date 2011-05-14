var D3T = (function() {
	
	var Version = "0.1";
	var Task =(function(){
		var Key;
		var Status;
		var Context;
		var UseLimit;
		var LimitDate;

	})();

	return {

		init : function(){


		},
		
		get : function(){

		},

		post : function(){
			$.ajax({
				type: "POST",
				url: "/post",
				data: 
					{
						task_key:D3T.Task.Key,
						status : D3T.Task.Status,
						context : D3T.Task.Context,
						use_limit : D3T.Task.UseLimit,
						limit_date : D3T.Task.LimitDate
					},
				success: function(msg){
					alart(msg);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
					alert(textStatus);
				},
			});
		},

		post_test : function(){
			D3T.Task.Key = "";
			D3T.Task.Status = 1;
			D3T.Task.Context = "タスク１";
			D3T.Task.UseLimit = True;
			D3T.Task.LimitDate = "2011/05/17 14:30";

			D3T.post();

		},
		
		
		__trailing__:null
		
	}; // end of return 
})();
