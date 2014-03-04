
var M = {
	reset: function() {
		this.word = null;
		this.candidate = null;
		this.vocabulary = null;
		this.pronunciation = null;
		this.audio = null;
		this.frequence = null;
		this.definition = null;
		this.learning_id = null;
		this.retention = null;
		this.target_retention = null;
		this.percentage = null;
		this.errormsg = null;
		this.notlogin = null;

		this.geting = false;
		this.translating = false;
		this.adding = false;
		this.forgeting = false;

		this.review_options = false;
		this.review_typed = null;
		this.review_waiting = false;
		this.refer_list = null;
		this.family_list = null;
		this.synonym_list = null;
		this.similar_list = null;
	}, 

	set: function(s) {
		for (var i in s) {
			this[i] = s[i];
		}
		render();
	}
};

function gotoURL(url) {
	chrome.tabs.create({url: url});
}


function queryWord(word) {
	M.reset();
	M.word = word;
	if (isValid(M.word)) {
		M.geting = true;
		getShanbayWord(M.word, function(target, result, value) {
			if (target != M.word) {
				return;
			}
			if (result === "OK") {
				M.vocabulary = value.content;
				M.pronunciation = value.pronunciation;
				M.audio = value.audio;
				M.definition = value.definition;
				M.learning_id = value.learning_id;
				M.retention = value.retention || 0;
				M.target_retention = value.target_retention || 5;
				var percentage = M.retention * 100.0 / M.target_retention;
				if (percentage < 3.0) {
					percentage = 3.0;
				} else if (percentage > 100.0) {
					percentage = 100.0;
				}
				M.percentage = percentage;

				getFrequency(M.vocabulary, function(target, result, frequence, family) {
					if (target == M.vocabulary && result === "OK") {
						M.frequence = frequence;
						M.family_list = family;
						render();
					}
				});

			} else {
				M.errormsg = result;
			}
			
			M.geting = false;
			render();
		});
	} else {
		M.word = null;
	}
	render();
}

function onForget() {
	if (M.learning_id) {
		M.forgeting = true;
		render();
		forgetShanbayWord(M.learning_id, function(result){
			M.forgeting = false;
			if (result === "OK") {
				queryWord(M.vocabulary);
			} else {
				M.errormsg = result;
				render();
			}
		});
	}
}

function onAdding() {
	if (M.vocabulary) { 
		M.adding = true;
		render();
		addShanbayWord(M.vocabulary, function(result, reason){
			M.adding = false;
			if (result === "OK") {
				queryWord(M.vocabulary);
			} else {
				M.errormsg = result;
				M.notlogin = reason == "notlogin";
				render();
			}
		});
	}
}

function handleChinese(text) {
	M.translating = text;
	render();
	getTranslate(text, function(word, result, translate) {
		if (word == M.translating) {
			M.translating = false;
			if (result !== "OK") {
				M.errormsg = result;
				render();
				return;
			}
			if (translate.length == 1) {
				queryWord(translate[0][0]);
				return;
			} 
			M.candidate = translate;
			render();
		}
	});
}

function handleWildcard(text) {
	var candidate = getCandidate(text, 120);
	if (candidate.length == 0) {
		M.errormsg = "匹配失败，没有相应的单词。";
		render();
	} else if (candidate.length == 1) {
		queryWord(candidate[0][0]);
	} else {
		M.candidate = candidate;
		getChineseFromGoogleTranslate(M.candidate.map(function(d){return d[0].trim();}), function(result, translate) {
			if (result === "OK") {
				M.candidate.forEach(function(d){
					if (translate[d[0]]) d[1] = translate[d[0]][1] ? translate[d[0]][1].join("; ") : translate[d[0]][0];
				})
				render();
			}
		});
		render();
	}
}

function handleSimilar(text) {
	var similars = getSimilars(text, 10);
	M.candidate = similars.map(function(d) {return [d.word, ""];});
	if (M.candidate[0][0] != text) {
		M.candidate.unshift([text, ""]);
	}
	getChineseFromGoogleTranslate(M.candidate.map(function(d){return d[0].trim();}), function(result, translate) {
		if (result === "OK") {
			M.candidate.forEach(function(d){
				if (translate[d[0]]) d[1] = translate[d[0]][1] ? translate[d[0]][1].join("; ") : translate[d[0]][0];
			})
			render();
		}
	});
	render();
}

function handleSentence(text) {
	M.candidate = splitSentence(text).map(function(d){return [d,""];});
	render();
}

var lastQueried = null;
function onCandidate(text) {
	if (text === undefined || text === null) {
		return;
	}
	text = text.trim();
	if (text == lastQueried) {
		return;
	}
	lastQueried = text;

	M.reset();
	if (text.length == 0) {
		render();
		return;
	}

	if (hasChinese(text)) {
		handleChinese(text);
	} else if (areEnglish(text)){
		handleSimilar(text);
	} else {
		handleWildcard(text);
	}
}

function onChoice() {
	lastQueried = null;
	var t = $(this).prop("candidate") || $(this).attr("candidate");
	if (t) {
		queryWord(t);
	}
}

function onPrimary() {
	lastQueried = null;
	var t = M.candidate && M.candidate[0][0];
	if (t) {
		queryWord(M.candidate[0][0]);
	}
}

function render() {
	if (M.translating || M.geting) {
		$('#queryword').css("background", "rgb(252, 252, 252) url('image/inquire.gif') no-repeat right center");
	} else {
		$('#queryword').css("background", "rgb(252, 252, 252)");
	}

	if (M.candidate != null && M.candidate.length > 1) {
		$('#pp_candidate').empty();
		var ul = $("<ul></ul>");
		M.candidate.forEach(function(d){
			var c = "<li><a class='cc' href='#'>" + "<span class='c1'>"+ d[0] + "</span> <span class='c2'>" + d[1] + "</span></a></li>";
			$(c).prop("candidate", d[0]).click(onChoice).appendTo(ul);
		});
		$('#pp_candidate').append(ul);
		$('#pp_candidate').show();
	} else {
		$('#pp_candidate').empty();
		$('#pp_candidate').hide();
	}

	if (isValid(M.vocabulary)) {
		$('#pp_heading, #pp_body').show();
		$('#word').html(M.vocabulary);
		$('#pronunciation').html(M.pronunciation ? "[" + M.pronunciation + "]" : "");
		if (M.frequence) {
			$('#frequence').html(/*M.frequence.pages + "~" + */ M.frequence.fpages + "");
		}

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
		$('#frequence').html("");

	} else {
		$('#pp_heading, #pp_body').hide();
	}

	if (M.review_options) {
		$('#reviewoptions').show();

		if (M.review_typed === "refer") {
			$('#old_refer_review').css("border-bottom", "1px solid rgb(160, 160, 160)");
			if (M.refer_list && M.refer_list.length > 0) {
				$('#reviewcontent').empty();
				var t = M.refer_list.reduce(function(p, c){
					return p + "<div class='refer'>" + c[0] + "：" + c[1].reduce(function(p, c){return p + "<a href='#'>" + c +"</a>";}, "") + "</div>";
				}, "");
				$('#reviewcontent').html(t);
			} else {
				$('#reviewcontent').html(" 无 ");
			}
			$('#reviewcontent').show();
		} else {
			$('#old_refer_review').css("border-bottom", "none");
		}

		if (M.review_typed === "synonym") {
			$('#old_synonym_review').css("border-bottom", "1px solid rgb(160, 160, 160)");
			if (M.synonym_list && M.synonym_list.length > 0) {
				$('#reviewcontent').empty();
				M.synonym_list.forEach(function(c){
					// http://stackoverflow.com/questions/18222409/specifying-a-preferred-line-break-point-in-html-text-in-a-responsive-design
					var p =$("<div class='synonym'>" + c[0] + "：<wbr></div>");
					c[1].forEach(function(d){
						var t = "<a href='#'>" + d +"</a>";
						$(t).prop("candidate", d).click(onChoice).appendTo(p);
					});
					$('#reviewcontent').append(p);
				});
			} else {
				$('#reviewcontent').html(" 无 ");
			}
			$('#reviewcontent').show();
		}  else {
			$('#old_synonym_review').css("border-bottom", "none");
		}

		if (M.review_typed === "family") {
			$('#old_family_review').css("border-bottom", "1px solid rgb(160, 160, 160)");
			if (M.family_list && M.family_list.length > 0) {
				$('#reviewcontent').empty();
				$('#reviewcontent').html(familyTree(M.family_list));
				$('#reviewcontent a.familyword').click(onChoice);
			} else {
				$('#reviewcontent').html(" 无 ");
			}
			$('#reviewcontent').show();
		}  else {
			$('#old_family_review').css("border-bottom", "none");
		}		
		
		if (M.review_typed === "similar") {
			$('#old_similar_review').css("border-bottom", "1px solid rgb(160, 160, 160)");
			if (M.similar_list && M.similar_list.length > 0) {
				$('#reviewcontent').empty();
				M.similar_list.forEach(function(d){
					var p = $("<div class='similar'> </div>");
					$("<a href='#' class='s1'>" + d.word +"</a>").prop("candidate", d.word).click(onChoice).appendTo(p);
					d.frequence && $("<span class='s2'>" + d.frequence + "</span>").appendTo(p);
					d.meaning && $("<span class='s3'>" + d.meaning + "</span>").appendTo(p);
					d.similarity && $("<span class='s2'>" + d.similarity.toFixed(2) + "</span>").appendTo(p);
					$('#reviewcontent').append(p);
				});
			} else {
				$('#reviewcontent').html(" 无 ");
			}
			$('#reviewcontent').show();
		} else {
			$('#old_similar_review').css("border-bottom", "none");
		}

		if (M.review_waiting) {
			$('#reviewcontent').html("<img src='image/inquire.gif'/>");
		} 
	} else {
		$('#reviewoptions').hide();
		$('#reviewcontent').html("");
	} 

	if (isValid(M.errormsg)) {
		$('#errormsg').html(M.errormsg).show();
		if (M.notlogin) {
			var t = "<a href='#'>登录扇贝网</a>";
			$(t).click(function(){gotoURL("http://www.shanbay.com/accounts/login/");}).appendTo($("#errormsg"));
		}
	} else {
		$('#errormsg').html("").hide();
	}
}

function pronunceWord() {
	if (M.audio) {
		var sound = new Howl({urls: [M.audio] }).play();
	}
}

$(document).ready(function() {
	// document.execCommand('paste');
	M.reset();

	if (preference.get().IncrementalQuery) {
		$('#queryword').keyup(function(event){
			if (event.which == 13) {
				onPrimary();
			} else {
				onCandidate($('#queryword').val());
			}
		});
	} 

	$('#wordquery').click(onPrimary);

	$('#old_forget').click(onForget);
	$('#new_adding').click(onAdding);

	Mousetrap.bindGlobal(['ctrl+s', 'command+s'], function() {
		onAdding();
		return false;
	});
	Mousetrap.bind(['s s', 's space'], function() {
		onAdding();
		return false;
	});

	Mousetrap.bindGlobal(['ctrl+f', 'command+f'], function() {
		onForget();
		return false;
	});
	Mousetrap.bind('f f', function() {
		onForget();
		return false;
	});

	Mousetrap.bindGlobal(['ctrl+i', 'command+i'], function() {
		$('#queryword').focus();
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

	$('#old_refer_review').click(function(){
		M.review_typed = "refer";
		if (M.refer_list == null) {
			M.review_waiting = true;
			getFromIciba(M.vocabulary || M.word, function(r) {
				M.refer_list = r;
				M.review_waiting = false;
				render();
			});
		} 
		render();
	});	

	$('#old_synonym_review').click(function(){
		M.review_typed = "synonym";
		if (M.synonym_list == null) {
			M.review_waiting = true;
			getFromYoudao(M.vocabulary || M.word, function(s) {
				M.synonym_list = s;
				M.review_waiting = false;
				render();
			});
		} 
		render();
	});	

	$('#old_family_review').click(function(){
		M.review_typed = "family";
		if (M.family_list != null) {
			function __travel(data, callback) {
				if (data instanceof Array) {
					for (var i in data) {
						__travel(data[i], callback);
					}
					return;
				}
				callback(data);
				for (var i = 0; data.children && i < data.children.length; i++) {
					__travel(data.children[i], callback);
				}
			}
			var t = [];
			__travel(M.family_list, function(data){
				t.push(data.word);
			});
			getChineseFromGoogleTranslate(t, function(result, translate) {
				if (result == "OK") {
					__travel(M.family_list, function(data) {
						if (translate[data.word]) {
							data.mean = translate[data.word][0];
						}
					});
					render();
				}
			});
		} 
		render();
	});

	$('#old_similar_review').click(function(){
		M.review_typed = "similar";
		if (M.similar_list == null) {
			M.similar_list = getSimilars(M.vocabulary || M.word, 10);
			for (var i = 0; i < M.similar_list.length; i++) {
				if (!M.similar_list[i].frequence) {
					getFrequency(M.similar_list[i].word, function(target, result, frequence, family) {
						if (result === "OK") {
							M.similar_list.forEach(function(d){
								if (d.word == target) d.frequence = frequence.fpages;
							});
							render();
						}
					});
				}
			}
			var t = M.similar_list.filter(function(d){return !d.meaning;}).map(function(x){return x.word;});
			if (t.length > 0) {
				getChineseFromGoogleTranslate(t, function(result, translate) {
					if (result == "OK") {
						M.similar_list.forEach(function(d){
							if (translate[d.word]) d.meaning = translate[d.word][0];
						});
						render();
					}
				});
			}
		}
		render();
	});

	$('#pronunciation').mouseenter(pronunceWord);

	chrome.runtime.getBackgroundPage(function(backgroundPage) {
		var words = backgroundPage.selectWord;
		// $('#queryword').prop("placeholder", words);
		
		if (words && words.length > 0) {
			$('#queryword').blur();
			$('#queryword').val(words);

			if (isSentence(words) && !isPhrase(words)) {
				handleSentence(words)
			} else if (hasChinese(words)) {
				handleChinese(words);
			} else {
				queryWord(words);
			} 
		} else {
			$('#queryword').focus();
		}
		
	});

});

$(window).unload(function() {
});





