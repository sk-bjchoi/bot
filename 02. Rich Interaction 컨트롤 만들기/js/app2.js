/*
Title:		OEngine: a SK Conversation Chatbot Plugin
Author:		Choi jaecheol
Version:	0.2.0
Website:	
License: 	the MIT and GPL licenses.
*/
(function($) {
    
	//Extend the jQuery prototype
    $.fn.extend({
        OEngine: function(options) {
            if (options && typeof(options) == 'object') {
                options = $.extend( {}, $.OEngine.defaults, options );
            }
            this.each(function() {
                new $.OEngine(this, options);
            });
            return;
        }
    });
	
	
	$.OEngine = function(elem, options) {
		
		if (options == undefined) {
			//Set plugin defaults
			width   =  '25%';
			height  =  '100%';
			bgColor =  '#2e3951';
			ctitle  =  "Aibril Chatbot";
			firstMsg  =  "안녕하세요. Aibril Chatbot 입니다.";
			api_key    = "";
		}else{
			//Define plugin options
			width      = (options.width == undefined) ? '25%' :  options.width;
			height     = (options.height == undefined) ? '100%' :  options.height;
			bgColor    = (options.bgColor == undefined) ? '#2e3951' :  options.bgColor;
			ctitle     = (options.ctitle == undefined) ? "Aibril Chatbot" :  options.ctitle;
			firstMsg   = (options.firstMsg == undefined) ? "안녕하세요. Aibril Chatbot 입니다." :  options.firstMsg;
			api_key    = (options.api_key == undefined) ? '' :  options.api_key;
		}
        
        conText = {"timezone":"Asia/Seoul"};
		
		$(elem).html('<div id="sidebar-wrapper" class="chatbotInner" >');
		
		//1th
		$('#sidebar-wrapper').append($('<div/>', {
			class: 'titArea',
			id: 'style-2'
		}));
		$("#style-2").append("<p class='title'>Aibril  <span> A-Chat.</span></p>");

				
		//2th
		$('#sidebar-wrapper').append($('<div/>', {
			class: 'converArea',
			id: 'style-3',
			text: ''
		}));
		
		
		
		// 대화 영역.
		$("#style-3").append("<div id='wsdk_talk_app' class='converScr'></div>");    //watson 
		
		//시간 표시 
		$("#wsdk_talk_app").append("<div id='wsdk_date' style='text-align: center;margin-bottom: 16px;'></div>");
		$("#wsdk_date").append("<span id='wsdk_date_text'>Today , "+convertDate(todaysDate)+"</span>");
		
		// 처음 메시지...
		//$("#wsdk_talk_app").append("<p class='aibril'><span class='box'><span>"+firstMsg+"</span></span></p>");//watson 
		
		
		//채팅부분.(글입력부)
		//3th div
		$('#sidebar-wrapper').append($('<div/>', {
			id: 'question_wrap',
			text: ''
		}));
		
		$("#question_wrap").append("<div class='userInputArea'><input type='text' placeholder='질문을 입력하세요' id='messageText' ><a href='#none' class='enter' id='sendMessage'></a></div>");
		
		
		// options.callback();
//		fnSend(api_key);
		$("#sendMessage").unbind('click').click(function(){
			fnSend(api_key);
		});

		fnInitSend(api_key);
		//------------------------------------------------------------------------------------------------------------------------
		
	}; //End of $.OEngine
	
	document.onkeypress  = function(e){ 
        //크로스도메인허용
        $.support.cors = true;
        
		//key 초기화
		var result = ""; 
		//크롬 계열
		if(typeof(e) != "undefined") {
			result = e.which;
		}else {
			result = event.keyCode;
		}
		if (result == 13){
			//엔터 입력시 실행 함수
			fnSend(api_key);
		}	
	} //End of document.onkeypress
	
})(jQuery);

var conText;
var anythingMsg;
var todaysDate = new Date();

function convertDate(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString();
  var dd  = date.getDate().toString();

  var mmChars = mm.split('');
  var ddChars = dd.split('');

  return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
}


var messagesendFlag = true;
function fnSend(api_key){
	
	if(!messagesendFlag){
		return false;
	}
	
	messagesendFlag = false;
	var msg = $("#messageText").val();
	
	if(msg.trim() == null ){
		messagesendFlag = true;
		return false;
	}
	
	if(msg.trim() == '' ){

		messagesendFlag = true;
		return false;
	}
	
	if(msg.trim() == '처음으로' || msg.trim() == '처음 으로'){
		location.reload();
		return false;
	}
	
	var data ={};
    data.api_key = api_key;
    data.text = msg;
	data.context = JSON.stringify(conText);
	var _url = 'https://oe.aibril.com';

	
	$.ajax({
			type : 'POST',
			crossDomain: true,
			cache: false,
			url : _url + '/api/v1.0/wrks/message/',
			dataType : 'json',
			data: data,
			beforeSend:function(){
				//사용자 메시지 출력창.
				$("#wsdk_talk_app").append("<p class='user'><span>"+msg+"</span></p>");
                $("#messageText").val("Loading...");
                $('#messageText').attr('readonly', true);
                $("#wsdk_talk_app").append("<p class='aibril'><span class='box'><span class='write'></span></span></p>");
            },
			success : function(result){
				/*
				var s = ""
				for (var key in result.output.text) {
				s += result.output.text[key];
//				s += "<br />";
				}
				if(s == ""){
					s = anythingMsg;
				}
				var intent = '';
				var confidence = 0;*/
				
				//$('#wsdk_talk_app').find('.aibril .box').last().html("<span>"+s+"</span>");
				if(result.context.outputtype === undefined || result.context.outputtype === ''){
					getText(result);
				}else if(result.context.outputtype === 'list'){
					getList(result);
				}else if(result.context.outputtype === 'images'){
					getImages(result);
				}
				
				//전역변수.
				result.context.outputtype = "";
				conText = result.context;

			},
			complete:function(){
//				$('#sidebar-wrapper').loading('stop');  //loading start
				$("#messageText").val("");
                $('#messageText').attr('readonly', false);
				$("#wsdk_talk_app").scrollTop(9999);  //scroll Y 재조정.
				messagesendFlag = true;
            },
			error : function(xhr, status, error){
//				$('#sidebar-wrapper').loading('stop');  //loading start
				$("#messageText").val("");
                $('#messageText').attr('readonly', false);
				alert('error' + JSON.stringify(xhr) );
				console.log(error);
			}
	});
}
