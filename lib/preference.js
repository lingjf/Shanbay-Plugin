
var preference = {
	defaults : {
		TtsSpeakOut : true,
		RealtimeQuery : true
	},

	get : function() {
		if (typeof window.localStorage.preference === "undefined") {
			window.localStorage.preference = JSON.stringify(this.defaults);
		}

		return JSON.parse(window.localStorage.preference);
	},

	set : function(got) {
		var org = this.get();

		for (i in got) {
			if(got.hasOwnProperty(i)) {
				org[i] = got[i];
			}
		}
		window.localStorage.preference = JSON.stringify(org);
	}

}


