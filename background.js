
var selectWord = null;


function ttsSpeak(utterance) {	
  if (utterance !== undefined && utterance !== null && utterance.length > 0) {
    if (areEnglish(utterance) && preference.get().TtsSpeakOut) { 
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
          {file: 'content_script.js', allFrames: true}
        );
      }
    }
  });
}

function initBackground() {
	loadContentScriptInAllTabs();

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request['select'] != undefined) {
			selectWord = request['select'];
			// console.log("background.js select : " + selectWord);
			ttsSpeak(selectWord);
		} 
	});

  chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
      // console.log("This is a first install!");
      chrome.tabs.create({url : 'help.html', selected : true});
    } else if (details.reason == "update") {
      // var thisVersion = chrome.runtime.getManifest().version;
      // console.log("Updated from " + details.previousVersion + " to " + thisVersion  + "!");
      // chrome.tabs.create({url : 'help.html', selected : true});
    }
  });
}

initBackground();
