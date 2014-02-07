
var M = {};

function resetM() {
	M = {
		word : null,
		candidate : null,
		vocabulary : null,
		pronunciation : null,
		audio : null,
		definition : null,
		learning_id : null,
		retention : null,
		target_retention : null,
		percentage : null,
		error_msg : null,
		login_shanbay : null
	};
}


function loginShanbay() {
	chrome.tabs.create({
        url:"http://www.shanbay.com/accounts/login/"
    })
}


function reviewWord_shanbay() {
	if (M.learning_id) { 
		var url = "http://www.shanbay.com/review/learning/" + M.learning_id;
		chrome.tabs.create({
			url : url,
			selected : true
		});
	}
}

function reviewWord_iciba() {
	if (M.vocabulary) { 
		var url = "http://www.iciba.com/" + M.vocabulary;
		chrome.tabs.create({
			url : url,
			selected : true
		});
	}
}

function reviewWord_youdao() {
	if (M.vocabulary) { 
		var url = "http://dict.youdao.com/search?q=" + M.vocabulary;
		chrome.tabs.create({
			url : url,
			selected : true
		});
	}
}

function reviewWord_vocabulary() {
	if (M.vocabulary) { 
		var url = "http://www.vocabulary.com/dictionary/" + M.vocabulary;
		chrome.tabs.create({
			url : url,
			selected : true
		});
	}
}

function reviewWord_etymology() {
	if (M.vocabulary) { 
		var url = "http://www.etymonline.com/index.php?term=" + M.vocabulary;
		chrome.tabs.create({
			url : url,
			selected : true
		});
	}
}

function forgetWord() {
	if (M.vocabulary) { 
		var url = "http://www.shanbay.com/api/v1/bdc/learning/" + M.vocabulary;
		$.ajax({
			url : url,
			type : 'PUT',
			dataType : 'JSON',
			contentType : "application/json; charset=utf-8",
			data : '{"retention": 1}',
			success : function(data) {
				console.log(data);
				if (data.status_code == 0 && data.msg == "SUCCESS") {
					queryWord(M.vocabulary);
				} else {
					M.error_msg = "操作失败. " + data.msg;
					render();
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
	if (M.vocabulary) { 
		var url = "http://www.shanbay.com/api/learning/add/" + M.vocabulary;
		$.ajax({
			url : url,
			type : 'GET',
			dataType : 'JSON',
			contentType : "application/json; charset=utf-8",
			success : function(data) {
				console.log(data);
				if (data['id']) {
					// window.location.reload();
					queryWord(M.vocabulary);
				} else {
					M.error_msg = "添加失败.";
					render();
				}
			},
			error : function() {
				M.error_msg = "添加失败，<br>可能没有";
				M.login_shanbay = true;
				render();
			},
			complete : function() {
				
			}
		});
	}
}

function getWord() {
	var getting = M.word;
	var url = "http://www.shanbay.com/api/v1/bdc/search/?word=" + M.word;
	$.ajax({
		url : url,
		type : 'GET',
		dataType : 'JSON',
		contentType : "application/json; charset=utf-8",
		success : function(data) {
			console.log(data);
			if (getting == M.word) {
				if (data.status_code == 0 && data.msg == "SUCCESS") {

					M.vocabulary = data.data.content;
					M.pronunciation = data.data.pronunciation;
					M.audio = data.data.audio;
					M.definition = data.data.definition;
					M.learning_id = data.data.learning_id;
					M.retention = data.data.retention;
					M.target_retention = data.data.target_retention;
					var percentage = data.data.retention * 100.0 / data.data.target_retention;
					if (percentage < 3.0) {
						percentage = 3.0;
					} else if (percentage > 100.0) {
						percentage = 100.0;
					}
					M.percentage = percentage;
				} else {
					M.error_msg = data.msg;
				}
				render();
			}
		},
		error : function() {
			if (getting == M.word) {
				M.error_msg = "查询失败，<br>可能 . . . ";
				render();
			}
		},
		complete : function() {
			// console.log("getWord complete");
		}
	});
}


function queryWord(w) {
	resetM();
	M.word = w;
	if (isValid(M.word)) {
		getWord();
	} else {
		M.word = null;
	}
	render();
}

function onQuery() {
	var queried = $('#queryword').val();

	if (queried !== undefined && queried !== null) {
		queried = queried.trim();
		var candidate = getCanditate(queried, 120);
		if (candidate.length == 1) {
			queryWord(candidate[0]);
		} else {
			resetM();
			M.candidate = candidate;
			render();
		}
	}
}

function onSelect() {
	queryWord($(this).text());
}

function pronunceWord() {
	var sound = new Howl({urls: [M.audio] }).play();
}

function render() {
	$('#pp_candidate, #pp_heading, #pp_body').hide();
	$('#oldword, #newword').hide();
	$("#error_msg").hide();

	if (M.candidate != null && M.candidate.length > 1) {
		$('#pp_candidate').empty();
		for (i in M.candidate) {
			var c = $("<a href='#' class='list-group-item'>" + M.candidate[i] +"</a>");
			c.click(onSelect);
			$('#pp_candidate').append(c);
		}
		$('#pp_candidate').show();
	} else {
		$('#pp_candidate').empty();
		$('#pp_candidate').hide();
	}

	if (M.vocabulary != null && M.vocabulary.length > 1) {
		$('#pp_heading, #pp_body').show();
		$('#word').html(M.vocabulary);
		$('#pronunciation').html("[" + M.pronunciation + "]").mouseenter(pronunceWord);
		$('#definition').html(M.definition.split('\n').join('<br>'));
		if (M.learning_id != undefined && M.learning_id != null && M.learning_id != 0) { 
			if (M.retention != null && M.target_retention != null) { 
				$('#current_retention').html(M.retention);
				$('#target_retention').html(M.target_retention);
				$('#current_retention').css("width", "" + M.percentage + "%");
			}
			$('#oldword').show();
		} else {
			
			$('#newword').show();
		}	

	} else if (M.word != null && M.word.length > 1) {
		$('#pp_heading, #pp_body').show();
		
		$('#word').html(M.word);
		$('#pronunciation').html("");
		$('#definition').html("<img src='image/inquire.gif'/>");
	}

	if (M.error_msg != null) {
		$('#error_msg').html(M.error_msg).show();
		if (M.login_shanbay) {
			var c = $("<a href='#'>登录扇贝网</a>");
			c.click(loginShanbay);
			$("#error_msg").append(c);
		}
	} else {
		$('#error_msg').html("");
		$('#error_msg').hide();
	}
}


$(document).ready(function() {
	// document.execCommand('paste');
	resetM();

	if (preference.get().RealtimeQuery) {
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
