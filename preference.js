
var preference = {
	defaults : {
		TtsSpeakOut : false,
		IncrementalQuery : false
	},

	get : function() {
		if (typeof window.localStorage.preference === "undefined") {
			window.localStorage.preference = JSON.stringify(this.defaults);
		}

		var t = JSON.parse(window.localStorage.preference);
		for (i in this.defaults) {
			if (i in t) {} else {
				t[i] = this.defaults[i];
			}
		}
		return t;
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


