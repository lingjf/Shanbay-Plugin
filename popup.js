
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
		login_shanbay : null,

		geting : false,
		translating : false,
		adding : false,
		forgeting : false,

		review_options : false,
		similarity : null
	};
}

function gotoURL(url) {
	chrome.tabs.create({url: url});
}


function forgetWord() {
	if (M.learning_id) {
		M.forgeting = true;
		render(); 
		var url = "http://www.shanbay.com/api/v1/bdc/learning/" + M.learning_id;
		$.ajax({
			url : url,
			type : 'PUT',
			dataType : 'JSON',
			contentType : "application/json; charset=utf-8",
			data : '{"retention": 1}',
			success : function(data) {
				// console.log(data);
				if (data.status_code == 0 && data.msg == "SUCCESS") {
					queryWord(M.vocabulary);
				} else {
					M.forgeting = false;
					M.error_msg = "操作失败. " + data.msg;
					render();
				}
			},
			error : function() {
				M.forgeting = false;
				M.error_msg = "操作失败.";
				render();
			},
			complete : function() {
				
			}
		});
	}
}

function addingWord() {
	if (M.vocabulary) { 
		M.adding = true;
		render();
		var url = "http://www.shanbay.com/api/learning/add/" + M.vocabulary;
		$.ajax({
			url : url,
			type : 'GET',
			dataType : 'JSON',
			contentType : "application/json; charset=utf-8",
			success : function(data) {
				//console.log(data);
				if (data['id']) {
					queryWord(M.vocabulary);
				} else {
					M.adding = false;
					M.error_msg = "添加失败.";
					render();
				}
			},
			error : function() {
				M.adding = false;
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
	M.geting = true;
	render();
	var go = M.word;
	var url = "http://www.shanbay.com/api/v1/bdc/search/?word=" + M.word;
	$.ajax({
		url : url,
		type : 'GET',
		dataType : 'JSON',
		contentType : "application/json; charset=utf-8",
		success : function(data) {
			// console.log(data);
			if (go == M.word) {
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
				M.geting = false;
				render();
			}
		},
		error : function() {
			if (go == M.word) {
				M.geting = false;
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

function translateWord(w)
{
	M.translating = true;
	render();
	var url = "http://translate.google.cn/translate_a/t?client=t&sl=zh-CN&tl=en&hl=en&sc=2&ie=UTF-8&oe=UTF-8&prev=btn&srcrom=1&ssel=6&tsel=3&q={{text}}";
	$.ajax({
		url : encodeURI(url.replace("{{text}}", w)),
		type : 'GET',
		success : function(data) {
			// console.log(data);
			var result = eval(data); // JSON.parse(data) does not work 
			// console.log(result);
			var matchs = [];
			var candidate = [];
			for (i in result[1]) {
				for (j in result[1][i][1]) {
					matchs.push(result[1][i][1][j]);
				}
				for (j in result[1][i][2]) {
					var one = result[1][i][2][j][0];
					var des = result[1][i][2][j][1].join("；") + ". " + result[1][i][0];
					candidate.push([one, des]);
				}
			}
			// console.log(matchs);
			// console.log(candidate);
			resetM();
			M.translating = false;
			if (candidate.length == 1) {
				queryWord(candidate[0][0]);
			} else {
				M.candidate = candidate;
				if (M.candidate.length == 0) {
					M.error_msg = "翻译失败，没有对应的单词。 ";
				}
				render();
			}
		},
		error : function() {
			// console.log("translateWord error");
			M.translating = false;
			M.error_msg = "查询失败，<br>可能 . . . ";
			render();
		},
		complete : function() {
			// console.log("translateWord complete");
		}
	});
}

var lastQueried = null;
function onQuery() {
	var queried = $('#queryword').val();

	if (queried === undefined || queried === null) {
		return;
	}
	queried = queried.trim();
	if (queried.length == 0) {
		return;
	}

	if (queried == lastQueried) {
		return;
	}
	lastQueried = queried;

	if (hasChinese(queried)) {
		translateWord(queried);
	} else if (areEnglish(queried)){
		queryWord(queried);
	} else {
		var candidate = getCandidate(queried, 120);
		if (candidate.length == 1) {
			queryWord(candidate[0][0]);
		} else {
			resetM();
			M.candidate = candidate;
			if (M.candidate.length == 0) {
				M.error_msg = "匹配失败，没有相应的单词。 ";
			}
			render();
		}
	}
}

function onChoice() {
	lastQueried = null;
	queryWord($(this).prop("candidate"));
}

function render() {
	if (M.translating || M.geting) {
		$('#queryword').css("background", "rgb(252, 252, 252) url('image/inquire.gif') no-repeat right center");
	} else {
		$('#queryword').css("background", "rgb(252, 252, 252)");
	}

	if (M.candidate != null && M.candidate.length > 1) {
		$('#pp_candidate').empty();
		for (i in M.candidate) {
			var c = $("<a href='#' class='list-group-item'>" + M.candidate[i].join(" ") +"</a>");
			c.prop("candidate", M.candidate[i][0]);
			c.click(onChoice);
			$('#pp_candidate').append(c);
		}
		$('#pp_candidate').show();
	} else {
		$('#pp_candidate').empty();
		$('#pp_candidate').hide();
	}

	if (isValid(M.vocabulary)) {
		$('#pp_heading, #pp_body').show();
		$('#word').html(M.vocabulary);
		$('#pronunciation').html(M.pronunciation ? "[" + M.pronunciation + "]" : "");
		$('#definition').html(M.definition.split('\n').join('<br>'));
		if (M.learning_id != undefined && M.learning_id != null && M.learning_id != 0) { 
			if (M.retention != null && M.target_retention != null) { 
				$('#current_retention').html(M.retention);
				$('#target_retention').html(M.target_retention);
				$('#current_retention').css("width", "" + M.percentage + "%");
			}
			$('#retention').show();
		} else {
			$('#retention').hide();
		} 

		if (M.learning_id != undefined && M.learning_id != null && M.learning_id != 0) { 
			$('#old_forget').show();
			$('#new_adding').hide();
		} else {
			$('#new_adding').show();
			$('#old_forget').hide();
		}

		if (M.adding || M.forgeting) {
			$('#adding_forget_waiting').html("<img src='image/inquire.gif'/>");
		} else {
			$('#adding_forget_waiting').html("");
		}

	} else if (isValid(M.word)) {
		$('#pp_heading').show();
		$('#pp_body').hide();
		
		$('#word').html(M.word);
		$('#pronunciation').html("");

	} else {
		$('#pp_heading, #pp_body').hide();
	}

	if (M.review_options) {
		$('#reviewoptions').show();
		if (M.similarity) {
			$('#similar_list').empty();
			for (i in M.similarity) {
				var c = $("<a href='#' class='list-group-item'>" + M.similarity[i] +"</a>");
				$('#similar_list').append(c);
			}
			$('#similar_list').show();
		} else {
			$('#similar_list').empty();
			$('#similar_list').hide();
		}
	} else {
		$('#reviewoptions').hide();
	}

	if (isValid(M.error_msg)) {
		$('#error_msg').html(M.error_msg).show();
		if (M.login_shanbay) {
			var c = $("<a href='#'>登录扇贝网</a>");
			c.click(function(){gotoURL("http://www.shanbay.com/accounts/login/");});
			$("#error_msg").append(c);
		}
	} else {
		$('#error_msg').html("").hide();
	}
}

function pronunceWord() {
	if (M.audio) {
		var sound = new Howl({urls: [M.audio] }).play();
	}
}

$(document).ready(function() {
	// document.execCommand('paste');
	resetM();

	if (preference.get().RealtimeQuery) {
		$('#queryword').keyup(onQuery);
	} 

	$('#wordquery').click(onQuery);

	$('#old_forget').click(forgetWord);
	$('#new_adding').click(addingWord);

	Mousetrap.bindGlobal('enter', function() {
		onQuery();
		return false;
	});

	Mousetrap.bindGlobal(['ctrl+s', 'command+s'], function() {
		addingWord();
		return false;
	});
	Mousetrap.bind(['s s', 's space'], function() {
		addingWord();
		return false;
	});

	Mousetrap.bindGlobal(['ctrl+f', 'command+f'], function() {
		forgetWord();
		return false;
	});
	Mousetrap.bind('f f', function() {
		forgetWord();
		return false;
	});

	Mousetrap.bindGlobal(['ctrl+p', 'command+p'], function() {
		pronunceWord();
		return false;
	});
	Mousetrap.bind(['p', 'space'], function() {
		pronunceWord();
		return false;
	});

	$('#old_review').click(function() {
		if (M.learning_id) {
			gotoURL("http://www.shanbay.com/review/learning/" + M.learning_id);
		} else {
			M.review_options = !M.review_options;
			render();
		}
	});
	$('#more_review').click(function() {
		M.review_options = !M.review_options;
		render();
	});

	$('#old_iciba_review').click(function() {
		M.vocabulary && gotoURL("http://www.iciba.com/" + M.vocabulary);
	});
	$('#old_youdao_review').click(function() {
		M.vocabulary && gotoURL("http://dict.youdao.com/search?q=" + M.vocabulary);
	});
	$('#old_vocabulary_review').click(function() {
		M.vocabulary && gotoURL("http://www.vocabulary.com/dictionary/" + M.vocabulary);
	});
	$('#old_etymology_review').click(function() {
		M.vocabulary && gotoURL("http://www.etymonline.com/index.php?term=" + M.vocabulary);
	});
	$('#old_shanbay_review').click(function() {
		M.learning_id && gotoURL("http://www.shanbay.com/review/learning/" + M.learning_id);
	});

	$('#old_similar_review').click(function(){
		M.similarity = getSimilarity(M.vocabulary || M.word);
		render();
	});

	$('#pronunciation').mouseenter(pronunceWord);

	chrome.runtime.getBackgroundPage(function(backgroundPage) {
		var word = backgroundPage.selectWord;
		// $('#queryword').prop("placeholder", word);
		$('#queryword').val(word);

		if (areChinese(word)) {
			translateWord(word);
		} else {
			queryWord(word);
		}
	});

});

$(window).unload(function() {
});
