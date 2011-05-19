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
		get: '/tasks',
		getOne:'/onetask',
		update: '/update',
		create: '/create'
	}

	return {

		init: function() {

			console.log("app initialized");
			$("label").inFieldLabels();
			$("input").attr("autocomplete", "off");



		},
		getAll: function() {
			D3T.get(APIs.get, false);
		},
		getOne: function(id /* int */ ) {
			D3T.get(APIs.get + "?id=" + id, true);
		},
		get: function(address /* string */, isOnly /* bool */){

			console.log(address);

			$.getJSON(address, function(json){
				D3T.parse(json, isOnly);
			});

		},
		parse: function(json, isOnly){

			console.log(json);
			console.log(isOnly);
			// 
	
			var fragments = [
				document.createDocumentFragment(),
				document.createDocumentFragment(),
				document.createDocumentFragment()
			];

			var taskItem = null;
			var taskStatus; /* for isOnly = true Case */
			var taskKey;    /* for isOnly = true Case */

			$.each(json, function() {

				console.log("id is " + this.KeyID);

				taskItem = document.createElement("div");
				//taskItem.attr("id","id_" + this.KeyID)
				//		.attr("class","status_" + this.Status);
				//taskItem.html("<p>" + this.Context + "</p>");
				taskItem.appendChild(document.createTextNode(this.Context));

				fragments[this.Status].appendChild(taskItem);
				taskStatus = this.Status;
			
			});

			var i;
			if (!isOnly){
				var i;
				for (i = 0; i < 3; i++){
					D3T.insert(i, fragments[i]);
				}
			}else{
				D3T.replace(taskKey,taskStatus,fragments[taskStatus]);
			}
			console.log($("#status0"));
			console.log($("#status1"));
			console.log($("#status2"));

			delete json;

		},
		insert:function(status /*int*/, fragment /*fragmentElement*/){
			var elem = document.getElementById("status" + status);
			elem.removeChild(document.getElementById("loading" + status));
			elem.appendChild(fragment);
			console.log(elem.parentNode);		
			
		},
		replase:function(key/* int */,  status/*int*/, fragment /*fragmentElement*/){
			
			var task = document.getElementById("id_" + key);
			var elem = document.getElementById("status" + status);
			
			if (task){
				task.parentNode.removeChild(task);	
			}

			elem.insertBefore(fragment, elem.childNodes[0]);
			
		
		},
		update: function() {
			
			console.log("Task.Key :" + Task.Key);	
			console.log("Task.Status :" + Task.Status);
			console.log("Task.Context :" + Task.Context);
			console.log("Task.UseLimit :" + Task.UseLimit);
			console.log("Task.LimitDate :" + Task.LimitDate);

			$.ajax({
				type: 'POST',
				url: APIs.update,
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
					D3T.getOne(msg);
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

			//D3T.update();
			Task.Key = '';
			Task.Status = 2;
			Task.Context = 'タスク3';
			Task.UseLimit = true;
			Task.LimitDate = '2011-05-18 14:30:05';

			D3T.update();


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
