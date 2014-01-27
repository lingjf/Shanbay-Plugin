
var selectWord = null;


function speak(utterance) {	
	chrome.tts.speak(utterance);
}


function loadContentScriptInAllTabs() {
  chrome.windows.getAll({'populate': true}, function(windows) {
    for (var i = 0; i < windows.length; i++) {
      var tabs = windows[i].tabs;
      for (var j = 0; j < tabs.length; j++) {
        chrome.tabs.executeScript(
            tabs[j].id,
            {file: 'lib/keycode.js', allFrames: true});
        chrome.tabs.executeScript(
            tabs[j].id,
            {file: 'content_script.js', allFrames: true});
      }
    }
  });
}

function initBackground() {
	loadContentScriptInAllTabs();

	chrome.runtime.onMessage.addListener(function(request, sender,
			sendResponse) {
		if (request['select']) {
			selectWord
		 = request['select'];
			console.log("background.js select : " + selectWord
			);
			speak(selectWord);

		} 
	});

}

initBackground();
