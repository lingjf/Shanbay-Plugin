$(document).ready(function() {

	var ttsSpeakOut = window.localStorage["ttsSpeakOut"];
	if (ttsSpeakOut == undefined) {
		ttsSpeakOut = "true";
	}

	if (ttsSpeakOut == "true") {
		$("#ttsSpeakOut").button("toggle");
	}

	$("#ttsSpeakOut input").change(function() {
		window.localStorage["ttsSpeakOut"] = this.checked ? "true" : "false";
	});

	var RealtimeQuery = window.localStorage["RealtimeQuery"];
	if (RealtimeQuery == undefined) {
		RealtimeQuery = "false";
	}

	if (RealtimeQuery == "true") {
		$("#RealtimeQuery").button("toggle");
	}

	$("#RealtimeQuery input").change(function() {
		window.localStorage["RealtimeQuery"] = this.checked ? "true" : "false";
	});
});
