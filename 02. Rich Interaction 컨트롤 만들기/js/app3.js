/*
Title:		OEngine: a SK Conversation Chatbot Plugin
Author:		Choi jaecheol
Version:	0.2.0
Website:	
License: 	the MIT and GPL licenses.
*/
var msgTimer;
var msgList;
var msgCounter = 0;
function getText(result) {
	var s = ""
	for (var key in result.output.text) {
	s += result.output.text[key];
//				s += "<br />";
	}
	if(s == ""){
		s = anythingMsg;
	}
		
	$('#wsdk_talk_app').find('.aibril .box').last().html("<span>"+s+"</span>");	
}


function getList(result) {
	var s = ""
	for (var key in result.output.text) {
	s += result.output.text[key];
//				s += "<br />";
	}
	if(s == ""){
		s = anythingMsg;
	}
				
	$('#wsdk_talk_app').find('.aibril .box').last().html("<span>"+s+"</span>");
	$('#wsdk_talk_app').find('.aibril .box').last().attr('style', 'border-radius : 0 14px 0 0;background-color: #eee;');
	$('#wsdk_talk_app').find('.aibril').last().attr('style', 'margin-bottom : 1px;');
	var lastWidth = $('#wsdk_talk_app').find('.aibril .box').last()[0].clientWidth;
	
	
	for (var list in result.context.userList) {
		$("#wsdk_talk_app").append("<p class = 'msglist'><a href='#none'><span class='box' style = 'width : "+lastWidth+"px;' title = '"+result.context.userList[list]+"' onclick='clickList(this);'> > "+ list + ". " + result.context.userList[list] + "</span></a></p>");
	}

	$('#wsdk_talk_app').find('.msglist .box').last().attr('style', 'width : '+lastWidth+'px; border-radius : 0 0 14px 14px; margin-bottom : 15px;');
}

function clickList(obj) {
	$("#messageText").val(obj.title);
	fnSend(api_key);
}

function getImages(result) {
	var s = ""
	for (var key in result.output.text) {
	s += result.output.text[key];
//				s += "<br />";
	}
	if(s == ""){
		s = anythingMsg;
	}
	
	conText.outputtype = "";
				
	$('#wsdk_talk_app').find('.aibril .box').last().html("<span>"+s+"</span>");
	
	var divMessage = ""	
		+ "<div class='swiper-container'>"
		+ "<div class='swiper-button-next'></div>"
		+ "<div class='swiper-button-prev'></div>"
		+ "<div class='swiper-wrapper'>"
		;
		
	for (var list in result.context.userList) {
		//result.context.userList[list]
		divMessage += ""			
			+ "<div class='swiper-slide'>"
			+ "<div class='swiper-slide-inner'>"
			+ "<form>"
			+ "<span class='img-load'>"
			+"<input type='button' class='list-image'"
			+" title='"+result.context.userList[list].text+"' "
			+" onclick='clickList(this);' style=background-image:url('./images/add/" + result.context.userList[list].image + "') background-repeat:no-repeat;>"
			+ "</span>"	
			+ "</form>"
			+ "</div>"
			+ "</div>"
			;
	}
	
	divMessage += ""
		+ "</div>"
		+ "<div class='swiper-pagination'></div>"
		+ "</div>"
		;	
	
	
	//$("#wsdk_talk_app").append("<div class='swiper-container'><div class='swiper-wrapper'><div class='swiper-slide'>Slide 1</div><div class='swiper-slide'>Slide 2</div><div class='swiper-slide'>Slide 3</div><div class='swiper-slide'>Slide 4</div><div class='swiper-slide'>Slide 5</div><div class='swiper-slide'>Slide 6</div><div class='swiper-slide'>Slide 7</div><div class='swiper-slide'>Slide 8</div><div class='swiper-slide'>Slide 9</div><div class='swiper-slide'>Slide 10</div> </div> <div class='swiper-button-next'></div> <div class='swiper-button-prev'></div> </div>");
	$("#wsdk_talk_app").append(divMessage);
	
	/*
    var swiper = new Swiper('.swiper-container', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });*/
	var swiper = new Swiper('.swiper-container', {
		slidesPerView: 'auto',
		paginationClickable: true,
		spaceBetween: 10,
		freeMode: true,
		//pagination: '.swiper-pagination',
		//nextButton: '.swiper-button-next',
		//prevButton: '.swiper-button-prev',
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
	  }
	});	
}

function fnInitSend(api_key){
	
	var data ={};
    data.api_key = api_key;
    data.text = "start!!";
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
                $("#messageText").val("Loading...");
                $('#messageText').attr('readonly', true);
                $("#wsdk_talk_app").append("<p class='aibril'><span class='box'><span class='write'></span></span></p>");
            },
			success : function(result){
				getText(result);
				conText = result.context;

			},
			complete:function(){
				$("#messageText").val("");
                $('#messageText').attr('readonly', false);
				$("#wsdk_talk_app").scrollTop(9999);  //scroll Y 재조정.
				messagesendFlag = true;
            },
			error : function(xhr, status, error){
				$("#messageText").val("");
                $('#messageText').attr('readonly', false);
				alert('error' + JSON.stringify(xhr) );
				console.log(error);
			}
	});
}
