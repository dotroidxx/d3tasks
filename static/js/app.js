var D3T = (function() {

	var Version = '0.1';
	var Task = {
		Key : '',
		Status: '',
		Context:'',
		UseLimit:'',
		LimitDate:''
	}

	var APIs = {
		getUrl: '/tasks',
		postUrl: '/post'
	}

	return {

		init: function() {

			console.log("app initialized");

		},
		getAll: function() {
			D3T.get(APIs.getUrl);
		},
		getOne: function(id /* int */ ) {
			D3T.get(APIs.getUrl + "?id=" + id);
		},
		get: function(address /* string */){

			console.log(address);

			$.getJSON(address, D3T.parse);

		},
		parse: function(json){

			console.log(json);
			console.log(json.length);
			// 
			var dfTodo = document.createDocumentFragment();
			var dfDoing = document.createDocumentFragment();
			var dfDone = document.createDocumentFragment();
			
			var taskItem = null;
			
			$.each(json, function() {

				console.log("id is " + this.KeyID);

				taskItem = document.createElement("div");
				//taskItem.attr("id","id_" + this.KeyID)
				//		.attr("class","status_" + this.Status);
				//taskItem.html("<p>" + this.Context + "</p>");
				taskItem.appendChild(document.createTextNode(this.Context));

				switch(this.Status){
					case 0:
						console.log("Add TodoBox:" + this.KeyID);
						dfTodo.appendChild(taskItem);
						break;
					case 1:
						console.log("Add DoingBox:" + this.KeyID);
						dfDoing.appendChild(taskItem);
						break;
					case 2:
						console.log("Add DoneBox:" + this.KeyID);
						dfDone.appendChild(taskItem);
						break;
					default:
						console.log("Unknown Status Data Arrival");
				}
				
			});

			var todo = document.getElementById("status0");
			var doing = document.getElementById("status1");
			var done = document.getElementById("status2");

			todo.removeChild(document.getElementById("loading0"));
			todo.appendChild(dfTodo);
			doing.removeChild(document.getElementById("loading1"));
			doing.appendChild(dfDoing);
			done.removeChild(document.getElementById("loading2"));
			done.appendChild(dfDone);

			console.log($("#status0"));
			console.log($("#status1"));
			console.log($("#status2"));

			delete json;

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
			Task.LimitDate = '2011-05-18 14:30:05';

			//D3T.post();
			Task.Key = '';
			Task.Status = 2;
			Task.Context = 'タスク3';
			Task.UseLimit = true;
			Task.LimitDate = '2011-05-18 14:30:05';

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

//	D3T.post_test();

});
