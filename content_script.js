

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
}

initContentScript();
