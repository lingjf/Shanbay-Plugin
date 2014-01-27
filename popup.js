var selectWord = null;
var selectObject = null;


function reviewWord() {
	if (selectObject && selectObject.learning_id) { 
		var url = "http://www.shanbay.com/review/learning/" + selectObject.learning_id;
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
					window.location.reload();
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
					window.location.reload();
				}
			},
			error : function() {
				
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


function getWord(w) {
	var url = "http://www.shanbay.com/api/v1/bdc/search/?word=" + w;
	$.ajax({
		url : url,
		type : 'GET',
		dataType : 'JSON',
		contentType : "application/json; charset=utf-8",
		success : function(data) {
			console.log(data);

			if (data.status_code == 0 && data.msg == "SUCCESS") {
				selectObject = data.data;
				// data.data.learning_id
				// data.data.audio
				// data.data.retention
				// data.data.target_retention
				$('#word').html(data.data.content);
				$('#pronunciation').html("[" + data.data.pronunciation + "]");
				$('#pronunciation').mouseenter(mp3Speak);	


				$('#definition').html(data.data.definition);

				if (data.data.learning_id != undefined && data.data.learning_id != 0) { 
					if (data.data.retention != undefined && data.data.target_retention != undefined) { 
						$('#current_retention').html(data.data.retention);
						$('#target_retention').html(data.data.target_retention);

						var percentage = data.data.retention * 100.0 / data.data.target_retention;
						if (percentage < 3.0) {
							percentage = 3.0;
						}
						$('#current_retention').css("width", "" + percentage + "%");

						$('#old_review').click(reviewWord);
						$('#old_forget').click(forgetWord);

						$('#oldword').show();
					}
				} else {
					$('#new_adding').click(addingWord);
					$('#newword').show();
				}

				
			}
		},
		error : function() {
			
		},
		complete : function() {
			
		}
	});
}

$(document).ready(function() {

	chrome.runtime.getBackgroundPage(function(backgroundPage) {
		selectWord = backgroundPage.selectWord;
		getWord(selectWord);
	});

});

$(window).unload(function() {
});
