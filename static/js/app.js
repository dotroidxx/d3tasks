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

			// フォームラベルの制御
			$("label").inFieldLabels();
			$("input").attr("autocomplete", "off");

			// 入力フォームの制御
			$("#input-box-buttom").click(function(){
				$("#input-box").animate({
					height:'toggle',
					opacity:'toggle'
				},'slow');
			});

			$(".droppable").sortable({
					items:".task-list",
					connectWith:$(".droppable"),
					update:D3T.updateHandler
			});

			// bind Button click 
			$("#create-task-button").click(D3T.createHandler);

/*
			$(".droppable").disableSelection();
			$(".droppable").droppable({
				tolerance: 'pointer',
				hoverClass:'dragenter',
				accept:'.draggable',
				drop:function(e, ui){
					this.insertBefore(ui.draggable.element, this.childNodes[0]);
					console.log("droped");
				}});
*/
		},
		createHandler: function(){
		
			var text = $("#task").val();
			if (text === ""){
	
				$.jGrowl("Oops! Task Text is require item");

				return;
			}
			Task.Context = text;
			D3T.create();

		},
		updateHandler: function(e, ui){
			console.log($(ui.item).attr("id") + "is update");
			var task = D3T.getHiddenValue(Number($(ui.item).attr("id").substring(3)));
			console.log(task);

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

			var taskItem = null;	/* main element */
			var taskContent = null;	/* view element */
			var valStatus = null;	/* hidden element for status */
			var valComplete = null;	/* hidden element for isComplete */
			var valCancel = null;	/* hidden element for isCancel */
			var valUseLimit = null;	/* hidden element for isUseLimit */
			var valPlanDate = null;	/* hidden element for PlanDate */

			var taskStatus; /* for isOnly = true Case */
			var taskKey;    /* for isOnly = true Case */

			$.each(json, function() {

				//console.log("id is " + this.KeyID);

				taskItem = document.createElement("li");
				taskItem.id = "id_" + this.KeyID;
				//taskItem.attr("id","id_" + this.KeyID)
				//		.attr("class","status_" + this.Status);
				//taskItem.html("<p>" + this.Context + "</p>");

				taskItem.className = "task-list draggable";
				taskContent = document.createElement("p"); //.appendChild(document.createTextNode(this.Context));
				taskContent.id = "context_" + this.KeyID;
				taskContent.className = "task-content";
				taskContent.appendChild(document.createTextNode(this.Context));

				valStatus = D3T.createHiddenElement(this.KeyID, "status", this.Status);
				valComplete = D3T.createHiddenElement(this.KeyID, "complete", this.IsComplete);
				valCancel = D3T.createHiddenElement(this.KeyID, "cancel", this.IsCancel);
				valUseLimit = D3T.createHiddenElement(this.KeyID, "use-limit", this.IsUseLimit);
				valPlanDate = D3T.createHiddenElement(this.KeyID, "plan-date", this.PlanDate);
				
				taskItem.appendChild(taskContent);
				taskItem.appendChild(valStatus);
				taskItem.appendChild(valComplete);
				taskItem.appendChild(valCancel);
				taskItem.appendChild(valUseLimit);
				taskItem.appendChild(valPlanDate);
				
/*
				$(taskItem).draggable({
					cursor:'move',
					opacity:0.5
				
				});
*/
				fragments[this.Status].appendChild(taskItem);
				taskStatus = this.Status;
			
			});

			if (!isOnly){
				var i = 0;
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
		insert:function(status /*int*/, fragment /*fragmentElement*/, val /* object */){
			var elem = document.getElementById("status" + status);
			elem.removeChild(document.getElementById("loading" + status));
			elem.appendChild(fragment);
			elem.value = val;
			console.log(elem.parentNode);		
			
		},
		replace:function(key/* int */,  status/*int*/, fragment /*fragmentElement*/){
			
			var task = document.getElementById("id_" + key);
			var elem = document.getElementById("status" + status);
			
			if (task){
				task.parentNode.removeChild(task);	
			}

			elem.insertBefore(fragment, elem.childNodes[0]);
			
		
		},
		createHiddenElement:function(id /* int */, prefix /* string */, obj /* objct */){
			var elem = document.createElement("input");
			elem.type = "hidden";
			elem.id   = prefix + "_" + id;
			elem.value = obj;
			return elem;
		},
		getHiddenValue:function(id /* int */){
			console.log("param id=" + id);
			var status = document.getElementById("status_" + id).value;
			var isComplete = document.getElementById("complete_" + id).value;
			var isCancel = document.getElementById("cancel_" + id).value;
			var isUseLimit = document.getElementById("use-limit_" + id).value;
			var planDate = document.getElementById("plan-date_" + id).value;
			console.log($("#context_" + id));
			var context = $("#context_" + id).text();

			return {
				Key : "" + id,
				Status: status,
				Context: context,
				UseLimit: isUseLimit,
				LimitDate: planDate
			};
		},
		create: function(){
			D3T.post(APIs.create);
		},
		update: function(){
			D3T.post(APIs.update);
		},
		post: function(address /* string */) {
			
			console.log("Task.Key :" + Task.Key);	
			console.log("Task.Status :" + Task.Status);
			console.log("Task.Context :" + Task.Context);
			console.log("Task.UseLimit :" + Task.UseLimit);
			console.log("Task.LimitDate :" + Task.LimitDate);

			$.ajax({
				type: 'POST',
				url: address,
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

//	D3T.post_test();

});
