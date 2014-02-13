

function getFromIciba(word, callback){
    var url = "http://www.iciba.com/" + word.toLowerCase();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 ) {
        	if(xhr.status == 200) {
				var ReferType = ["复数", "过去式", "过去分词", "现在分词", "第三人称单数", "比较级", "最高级"];
	        	var ReferList = []; 
	        	var DeriveType = ["派生词"];
	        	var DeriveList = [];
	        	var t0 = $(xhr.responseText.replace(/<img[^>]*>/g,"")).find('.group_prons .group_inf');
	        	t0.each(function(index) {    		
	    			var t1 = $(this).find('ul li');
	    			t1.each(function(j) {
	    				var v = this.innerText.trim().split('：');
	    				var d = v[0].trim();
	    				var c = v[1] ? v[1].trim().split(' ') : null;
	    				if (c) {
	    					for (var i = 0; i < c.length; i++) {
	    						c[i] = c[i].trim();
	    					}
	    				}
	    				if (ReferType.indexOf(d) !== -1 && c && c.length > 0) {
							ReferList.push([d, c]);
	    				}
	    				if (DeriveType.indexOf(d) !== -1 && c && c.length > 0) {
							DeriveList.push([d, c]);
	    				}
	    			});
	        	});
	        	// console.log(ReferList);
	            callback(ReferList, DeriveList);
        	} else {
        		callback([], []);
        	}
        } 
    }
    xhr.send();
}

function getFromYoudao(word, callback){
	var url = "http://dict.youdao.com/search?q=" + word.toLowerCase();
	var parse = function(data) {
		var SynonymList = []; 
    	var t0 = $(data.replace(/<img[^>]*>/g,"")).find('#synonyms');
    	t0.each(function() {    		
			var t1 = $(this).find('ul li');
			t1.each(function(){
				var d = this.innerText.trim();
				var c = [];
				var t2 = $(this).next('p');
				var t3 = t2.find('a');
				t3.each(function(){
					c.push(this.innerText.trim());
				});
				SynonymList.push([d, c]);
			});
    	});
    	// console.log(SynonymList);
    	return SynonymList;
    };
	$.get(url, function(data){
			callback(parse(data));
		}).fail(function(){
			callback([]);
		});
}

