var D3T = (function() {

	var Version = '0.1';
	var Task = {
		Key : '',
		Status: '',
		Context:'',
		UseLimit:'',
		LimitDate:''
	}

	return {

		init: function() {


		},

		get: function() {

		},

		post: function() {
			console.log("Task.Key :" + Task.Key);	
			console.log("Task.Status :" + Task.Status);
			console.log("Task.Context :" + Task.Context);
			console.log("Task.UseLimit :" + Task.UseLimit);
			console.log("Task.LimitDate :" + Task.LimitDate);

			$.ajax({
				type: 'POST',
				url: '/post',
				data:
					{
						task_key: Task.Key,
						status: Task.Status,
						context: Task.Context,
						use_limit: Task.UseLimit,
						limit_date: Task.LimitDate
					},
				success: function(msg) {
					console.log("success :" + msg);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("error :" + textStatus);
				}
			});
		},

		post_test: function() {
			Task.Key = '';
			Task.Status = 1;
			Task.Context = 'タスク１';
			Task.UseLimit = true;
			Task.LimitDate = '2011-05-17T14:30:05Z0700';

			D3T.post();

		},


		__trailing__: null

	}; // end of return
})();


/*
 *
 *
 */
$(document).ready(function(){

	D3T.post_test();

});
