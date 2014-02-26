$(document).ready(function() {

	if (preference.get().TtsSpeakOut) {
		$("#ttsSpeakOut").button("toggle");
	}

	$("#ttsSpeakOut input").change(function() {
		preference.set({TtsSpeakOut: this.checked});
	});

	if (preference.get().IncrementalQuery) {
		$("#IncrementalQuery").button("toggle");
	}

	$("#IncrementalQuery input").change(function() {
		preference.set({IncrementalQuery: this.checked});
	});
});
