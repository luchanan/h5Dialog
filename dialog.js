(function($,window){
	var flag=false;
	//默认参数
	var defaults={
		showFoot:true,
		showcancel:true,
		showconfirm:true,
		content:'加载中...',
		title:"头部标题",
		cancelText:"取消",
		confirmText:"确定",
		text:"",
		width:"auto",
		height:"auto",
		type:1,
		vertical_align:'middle',
		overlay:true,//显示遮罩层
		overlayHide:true,
		cancel:null,
		confirm:null,
		closed:null,
		timer:null,
		timeoutId:[]
	};
	var Dialog=function(options){
		//参数与默认值替换
		this.settings=$.extend({},defaults,options || {});
	}
	Dialog.prototype={
		create:function(){
			if(flag) return;
			this.html_template();
			$("body").append(this.settings.htmlTemplate);
		},
		open:function(){
			if($(".dialog").size()>0||$(".dialog_tips").size()>0){
				this.closed();
			}
			this.create();
			if(this.settings.overlayHide){
				var _this=this;
				$(".dialog").off("click").on("click",function(event){
					var name=event.target.className;
					if(name=='table_cell'){
						_this.closed();
					}
				});
			}
			//选择
			if(this.settings.type==1){
				this.html_dialog();
				this.cancel();
				this.confirm();
			}
			//提示
			else if(this.settings.type==2){
				if(this.settings.timer==null){
					this.settings.timer=3;
				}
				this.html_tips();
			}
			//加载器
			else if(this.settings.type==0){
				this.settings.timer=null;
				this.html_load();
			}
			//自定义
			else{
				var temp=this.settings.text;
				$(this.settings.htmlTemplate).find(".dialog_content").html(temp);
				this.cancel();
				this.confirm();
			}
			this.autoClose();
		},
		html_load:function(){
			var temp='<div class="dialog_loading bar"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
			$(temp).appendTo($(this.settings.htmlTemplate).find(".dialog_content"));
		},
		html_tips:function(){
			this.closed();
			//var tip=$("<div class='dialog_tips'>"+this.settings.text+"</div>");
			var tip=$("<div>");
			$(tip).attr('class','dialog_tips');
			$(tip).html(this.settings.text);
			$(tip).appendTo("body");
			$(tip).css({
				'margin-left':-$(tip).outerWidth()/2,
				'margin-top':-$(tip).outerHeight()/2,
				'visibility':'hidden'
			});
			this.settings.timeoutId.push(setTimeout(function(){
				$(tip).css({
					'margin-left':-$(tip).outerWidth()/2,
					'margin-top':-$(tip).outerHeight()/2,
					'visibility':'visible'
				});
			},0));

		},
		html_dialog:function(){
			var temp='<div class="dialog_select">\
                        <div class="dialog_detail">'+this.settings.text+'</div>\
                      </div>';
            var footer='';
            if(this.settings.showFoot){
            	footer=$('<div class="dialog_btns flex">');
            	if(this.settings.showcancel){
            		$(footer).append('<a class="dialog_btn cancel flex_item" href="javascript:void(0)">'+this.settings.cancelText+'</a>');
            	}
            	if(this.settings.showconfirm){
            		$(footer).append('<a class="dialog_btn confirm flex_item" href="javascript:void(0)">'+this.settings.confirmText+'</a>');
            	}
            }
            $(temp).append(footer).appendTo($(this.settings.htmlTemplate).find(".dialog_content"));
		},
		html_template:function(){
			this.settings.htmlTemplate=$('<div class="dialog">');
			if(this.settings.overlay){
				$(this.settings.htmlTemplate).addClass('overlay');
			}
			var html='<div class="table">\
						<div class="table_cell" style="vertical-align:'+this.settings.vertical_align+'">\
							<div class="dialog_content">\
							</div>\
						</div>\
					  </div>';
			$(html).appendTo($(this.settings.htmlTemplate));
		},
		cancel:function(){
			var btnCancel=$(this.settings.htmlTemplate).find(".cancel");
			btnCancel.on("click",$.proxy(function(){
				if(!$.isFunction(this.settings.cancel)){
					this.closed();
				}
				else{
					this.settings.cancel();
				}
			},this));
		},
		autoClose:function(){
			var timer=this.settings.timer;
			if(timer!=null){
				this.settings.timeoutId.push(setTimeout($.proxy(function(){
					this.closed();
				},this),timer*1000));
			}
		},
		confirm:function(){
			var btnConfirm=$(this.settings.htmlTemplate).find(".confirm");
			btnConfirm.on("click",$.proxy(function(){
				if($.isFunction(this.settings.confirm)){
					this.settings.confirm();
				}
				else{
					window.location.reload();
				}

			},this));
		},
		closed:function(){
			//$(this.settings.htmlTemplate).remove();
			var _this=this;
			var timeoutLen=this.settings.timeoutId.length;
			$(".dialog").remove();
			$(".dialog_tips").remove();
			for (var i = 0; i<timeoutLen; i++) {
			    clearTimeout(_this.settings.timeoutId[i]);
			}
			//_this.settings.timeoutId=[];
		}
	}
	var dialog=function(options){
		return new Dialog(options);
	}
	window.dialog=$.dialog=dialog;
})(window.jQuery||window.Zepto,window);