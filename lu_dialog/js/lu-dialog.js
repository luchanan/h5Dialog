(function($,window){
	//默认参数
	var defaults={
		showHead:true,
		showFoot:true,
		showcancel:true,
		showconfirm:true,
		content:'加载中...',
		title:"头部标题",
		cancelText:"取消",
		confirmText:"确定",
		width:"auto",
		height:"auto",
		top:null,
		left:null,
		overlay:true,//显示遮罩层
		cancel:null,
		confirm:null,
		closed:null,
		timer:null,
		opacity:1
	};
	var position={
		left_top:"",
		left_center:"",
		left_bottom:"",
		top_center:"",
		center_center:"",
		bottom_center:"",
		top_right:"",
		right_center:"",
		right_bottom:""
	}
	var Lu_dialog=function(options){
		//参数与默认值替换
		this.settings=$.extend({},defaults,options || {});
		this.init();
	}
	Lu_dialog.prototype={
		init:function(){
			this.create();
		},
		create:function(){
			var header='<div class="lu-dialog-title">'+this.settings.title+'</div>';
			var showheader=this.settings.showHead?header:'';
			var showcancel=this.settings.showconfirm?'<a class="lu-btn cancel">'+this.settings.cancelText+'</a>':'';
			var showconfirm=this.settings.showcancel?'<a class="lu-btn confirm">'+this.settings.confirmText+'</a>':'';
			var footer='<div class="lu-dialog-btns">'+
							showcancel+showconfirm
						+'</div>';
			var showfooter=this.settings.showFoot?footer:'';
			var content='<div class="lu-dialog-content">'+this.settings.content+'</div>';
			var dialog=$("<div>").addClass("lu-dialog").append(showheader+content+showfooter);
			this.overlayTemplate=this.settings.overlay?$("<div>").addClass("lu-mask"):"";
			this.htmlTemplate=$("<div>").addClass("lu-dialog-wrap").prepend(this.overlayTemplate).append(dialog);
			$("body").append(this.htmlTemplate);
			this.cancel();
			this.confirm();
			this.setAttr();
			this.setEffect();
			this.autoClose();
		},
		cancel:function(){
			var btnCancel=this.htmlTemplate.find(".cancel");
			btnCancel.on("click",$.proxy(function(){
				if(!$.isFunction(this.settings.cancel)){
					this.closed();//$.proxy为var _this=this的代替方法;	
				}
				else{
					this.settings.cancel();
				}
			},this));
		},
		autoClose:function(){
			var timer=this.settings.timer;
			if(timer!=null){
				setTimeout($.proxy(function(){
					this.closed();
				},this),timer);
			}
		},
		confirm:function(){
			var btnConfirm=this.htmlTemplate.find(".confirm");
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
			this.htmlTemplate.remove();
		},
		setAttr:function(){
			this.htmlTemplate.children(".lu-dialog").css("width",this.settings.width);
			var width=this.htmlTemplate.children(".lu-dialog").width();
			var height=this.htmlTemplate.children(".lu-dialog").height();
			var left=this.settings.left==null?($(window).width()-width)/2:this.settings.left;
			var top=this.settings.top==null?($(window).height()-height)/2:this.settings.top;
			this.htmlTemplate.children(".lu-dialog").css({
				"top":top,
				"left":left,
				"opacity":this.settings.opacity
			});
		},
		setEffect:function(){
			this.htmlTemplate.children(".lu-mask").addClass("fadein");
			this.htmlTemplate.children(".lu-dialog").addClass("bounceIn");
		}
	}
	var lu_dialog=function(options){
		return new Lu_dialog(options);
	}
	window.Lu_dialog=$.Lu_dialog=lu_dialog;
})(window.jQuery||window.Zepto,window);