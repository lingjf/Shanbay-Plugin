function getSelected() {
	var focused = document.activeElement;
	var selected;
	if (focused) {
		try {
			selected = focused.value.substring(focused.selectionStart,
					focused.selectionEnd);
		} catch (err) {

		}
	}
	if (selected === undefined) {
		selected = window.getSelection().toString();
	}
	selected = selected.trim().match(/^[a-zA-Z\s']+$/);

	if (selected !== undefined && selected !== null && selected.length > 0) {
		return selected[0];
	}

	return null;
}

function onSelected(e) {
	if (!document.hasFocus()) {
		return true;
	}
	var speaking = keyEventToString(e) === "Control";
	var selected = getSelected();
	if (selected !== null) {
		chrome.runtime.sendMessage({
			'select' : selected
		});
		console.log("selected: "  + selected);
	}
}

function initContentScript() {

	document.addEventListener('mouseup', onSelected, false);

	//document.addEventListener('keydown', onSpeeked, false);
}

initContentScript();
