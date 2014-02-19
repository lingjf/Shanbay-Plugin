

function getSelected() {
	var focused = document.activeElement;
	var selected;
	if (focused) {
		try {
			selected = focused.value.substring(focused.selectionStart, focused.selectionEnd);
		} catch (err) {

		}
	}
	if (selected === undefined) {
		selected = window.getSelection().toString();
	}
	if (selected !== undefined && selected !== null) {
		selected = selected.trim();
		return selected;
	}

	return '';
}

var lastSelected = '';
function onSelected(e) {
	if (!document.hasFocus()) {
		return true;
	}
	var selected = getSelected();
	
	// if (!selected || selected.length > 1000) {
	// 	return true;
	// }
	
	if (selected !== lastSelected) {
		chrome.runtime.sendMessage({
			'select' : selected
		});
		lastSelected = selected;
		// console.log("selected: "  + selected);
	}
}

function initContentScript() {
	document.addEventListener('mouseup', onSelected, false);
	
	window.addEventListener('load', function() {
		var input = document.getElementsByTagName('INPUT');
		for (var i = 0; i < input.length; i++) {
			input[i].addEventListener('select', onSelected);
		}
		var textarea = document.getElementsByTagName('TEXTAREA');
		for (var i = 0; i < textarea.length; i++) {
			textarea[i].addEventListener('select', onSelected);
		}
	});
}

initContentScript();
