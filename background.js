
var selectWord = null;


function ttsSpeak(utterance) {	
  if (utterance !== undefined && utterance !== null && utterance.length > 0) {
    // var ttsSpeakOut = window.localStorage["ttsSpeakOut"];
    // if (ttsSpeakOut == undefined) {
    //   ttsSpeakOut = "true";
    // }

    console.log(preference.get());

    if (preference.get().TtsSpeakOut) { 
      chrome.tts.speak(utterance, {'rate': 0.8});
    }
  }
}


function loadContentScriptInAllTabs() {
  chrome.windows.getAll({'populate': true}, function(windows) {
    for (var i = 0; i < windows.length; i++) {
      var tabs = windows[i].tabs;
      for (var j = 0; j < tabs.length; j++) {

        chrome.tabs.executeScript(
            tabs[j].id,
            {file: 'content_script.js', allFrames: true});
      }
    }
  });
}

function initBackground() {
	loadContentScriptInAllTabs();

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
		if (request['select'] != undefined) {
			selectWord = request['select'];
			console.log("background.js select : " + selectWord);
			ttsSpeak(selectWord);
		} 
	});

}

initBackground();
