$(document).ready(function() {

	if (preference.get().TtsSpeakOut) {
		$("#ttsSpeakOut").button("toggle");
	}

	$("#ttsSpeakOut input").change(function() {
		preference.set({TtsSpeakOut: this.checked});
	});

	var RealtimeQuery = window.localStorage["RealtimeQuery"];
	if (RealtimeQuery == undefined) {
		RealtimeQuery = "false";
	}

	if (preference.get().RealtimeQuery) {
		$("#RealtimeQuery").button("toggle");
	}

	$("#RealtimeQuery input").change(function() {
		preference.set({RealtimeQuery: this.checked});
	});
});
