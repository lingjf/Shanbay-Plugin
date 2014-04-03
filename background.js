
var Selected = {};
var Activity = null;

function getSelected() {
  if (Activity) {
    return Selected[Activity];
  } else {
    return null;
  }
}

function ttsSpeak(utterance) {	
  if (utterance !== undefined && utterance !== null && utterance.length > 0) {
    if (areEnglish(utterance) && preference.get().TtsSpeakOut) { 
      chrome.tts.speak(utterance, {'rate': 0.8});
    }
  }
}

function loadContentScriptInAllTabs() {
  chrome.windows.getAll({'populate': true}, function(wins) {
    for (var i = 0; i < wins.length; i++) {
      var tabs = wins[i].tabs;
      for (var j = 0; j < tabs.length; j++) {
        chrome.tabs.executeScript(tabs[j].id, {file: 'content_script.js', allFrames: true});
      }
    }
  });
}

function initBackground() {
	loadContentScriptInAllTabs();

  chrome.windows.getAll({'populate' : true }, function(wins) {
    wins.forEach(function(win) {
      win.tabs.forEach(function(tab) {
        if (tab != undefined && tab.url.indexOf('chrome') !== 0) {
          if (tab.highlighted) {
            Activity = tab.id;
          }
        }
      });
    });
  });

  chrome.tabs.onActivated.addListener(function(info) {
    Activity = info.tabId;
  });


	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request['select'] != undefined && Activity) {
      Selected[Activity] = request['select'];
			// console.log("background.js select : " + Selected[Activity]);
			ttsSpeak(Selected[Activity]);
		} 
	});

  chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
      chrome.tabs.create({url : 'help.html', selected : true});
    } else if (details.reason == "update") {
      // console.log("Updated from " + details.previousVersion + " to " + chrome.runtime.getManifest().version);
    }
  });
}

initBackground();
