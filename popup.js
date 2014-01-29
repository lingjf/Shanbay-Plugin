var selectWord = null;
var selectObject = null;

function loginShanbay() {
	chrome.tabs.create({
        url:"http://www.shanbay.com/accounts/login/"
    })
}


function reviewWord_shanbay() {
	if (selectObject && selectObject.learning_id) { 
		var url = "http://www.shanbay.com/review/learning/" + selectObject.learning_id;
		chrome.tabs.create({
			url : url,
			selected : true
		});
	}
}

function reviewWord_iciba() {
	if (selectObject && selectObject.content) { 
		var url = "http://www.iciba.com/" + selectObject.content;
		chrome.tabs.create({
			url : url,
			selected : true
		});
	}
}

function reviewWord_youdao() {
	if (selectObject && selectObject.content) { 
		var url = "http://dict.youdao.com/search?q=" + selectObject.content;
		chrome.tabs.create({
			url : url,
			selected : true
		});
	}
}

function reviewWord_vocabulary() {
	if (selectObject && selectObject.content) { 
		var url = "http://www.vocabulary.com/dictionary/" + selectObject.content;
		chrome.tabs.create({
			url : url,
			selected : true
		});
	}
}

function reviewWord_etymology() {
	if (selectObject && selectObject.content) { 
		var url = "http://www.etymonline.com/index.php?term=" + selectObject.content;
		chrome.tabs.create({
			url : url,
			selected : true
		});
	}
}

function forgetWord() {
	if (selectObject && selectObject.learning_id) { 
		var url = "http://www.shanbay.com/api/v1/bdc/learning/" + selectObject.learning_id;
		$.ajax({
			url : url,
			type : 'PUT',
			dataType : 'JSON',
			contentType : "application/json; charset=utf-8",
			data : '{"retention": 1}',
			success : function(data) {
				console.log(data);
				if (data.status_code == 0 && data.msg == "SUCCESS") {
					// window.location.reload();
					queryWord(selectObject.content);
				}
			},
			error : function() {
				
			},
			complete : function() {
				
			}
		});
	}
}

function addingWord() {
	if (selectObject && selectObject.content) { 
		var url = "http://www.shanbay.com/api/learning/add/" + selectObject.content;
		$.ajax({
			url : url,
			type : 'GET',
			dataType : 'JSON',
			contentType : "application/json; charset=utf-8",
			success : function(data) {
				console.log(data);
				if (data['id']) {
					// window.location.reload();
					queryWord(selectObject.content);
				}
			},
			error : function() {
				$("#error_msg").html("添加失败，<br>可能没有<a href='#'>登录扇贝网</a>。").show();
				$("#error_msg").click(loginShanbay);
			},
			complete : function() {
				
			}
		});
	}
}

function mp3Speak(utterance) {
	var sound = new Howl({
		urls: [selectObject.audio]
	}).play();
}


function getWord() {
	var url = "http://www.shanbay.com/api/v1/bdc/search/?word=" + selectWord;
	$.ajax({
		url : url,
		type : 'GET',
		dataType : 'JSON',
		contentType : "application/json; charset=utf-8",
		success : function(data) {
			console.log(data);
			if (data.status_code == 0 && data.msg == "SUCCESS") {
				selectObject = data.data;
				showWord();
			} else {
				$('#definition').html(data.msg);
			}
		},
		error : function() {
			console.log("getWord error");
			$("#error_msg").html("查询失败，<br>可能 . . . ").show();
		},
		complete : function() {
			console.log("getWord complete");
		}
	});
}

function showWord() {
	$('#word').html(selectObject.content);
	$('#pronunciation').html("[" + selectObject.pronunciation + "]");
	$('#pronunciation').mouseenter(mp3Speak);

	$('#definition').html(selectObject.definition.split('\n').join('<br>'));

	if (selectObject.learning_id != undefined && selectObject.learning_id != 0) { 
		if (selectObject.retention != undefined && selectObject.target_retention != undefined) { 
			$('#current_retention').html(selectObject.retention);
			$('#target_retention').html(selectObject.target_retention);

			var percentage = selectObject.retention * 100.0 / selectObject.target_retention;
			if (percentage < 3.0) {
				percentage = 3.0;
			} else if (percentage > 100.0) {
				percentage = 100.0;
			}
			$('#current_retention').css("width", "" + percentage + "%");
		}

		$('#oldword').show();
		
	} else {
		
		$('#newword').show();
	}	
}

function queryWord(w) {
	selectWord = w;
	if (selectWord !== undefined && selectWord !== null && selectWord.length > 0) {
		$('#pp_heading, #pp_body').show();

		$('#word').html(selectWord);
		$('#pronunciation').html("");
		$('#definition').html("<img src='image/inquire.gif'/>");

		$('#oldword').hide();
		$('#newword').hide();
		$("#error_msg").hide();
		
		getWord();
		
	} else {
		$('#pp_heading, #pp_body').hide();
	}
}

function onQuery() {
	var queried = $('#queryword').val();

	if (queried !== undefined && queried !== null) {
		queried = queried.trim();
		if (/^[a-zA-Z\s']+$/.test(queried)) {
			queryWord(queried);
		}
	}
}

$(document).ready(function() {
	// document.execCommand('paste');

	var RealtimeQuery = window.localStorage["RealtimeQuery"];
	if (RealtimeQuery == undefined) {
		RealtimeQuery = "true";
	}
	if (RealtimeQuery == "true") {
		$('#queryword').keyup(onQuery);
	} else {
		$('#queryword').change(onQuery);
	}

	$('#wordquery').click(onQuery);

	$('#old_review').click(reviewWord_shanbay);
	$('#old_iciba_review').click(reviewWord_iciba);
	$('#old_youdao_review').click(reviewWord_youdao);
	$('#old_vocabulary_review').click(reviewWord_vocabulary);
	$('#old_etymology_review').click(reviewWord_etymology);
	$('#old_shanbay_review').click(reviewWord_shanbay);

	$('#old_forget').click(forgetWord);
	$('#new_adding').click(addingWord);

	chrome.runtime.getBackgroundPage(function(backgroundPage) {
		queryWord(backgroundPage.selectWord);
	});

});

$(window).unload(function() {
});
