


function isEnglish(w) {  
    for(var i=0;i<w.length;i++) {
        if(w.charCodeAt(i)>126) {
            return false;
        }
    }
    return true; 
}

function areEnglish(w) {
	return /^[a-zA-Z\s\-\']+$/.test(w);
}

function isChinese(c) 
{
	return /[\u4e00-\u9fa5]/.test(c);
}

function areChinese(w) 
{
	return /^[\u4e00-\u9fa5\s]+$/.test(w);
}

function hasChinese(w) 
{
	for(var i = 0; i < w.length; i++) {
		if(isChinese(w.charAt(i))) {
			return true;
		}
	}
	return false;
}

function isJapanese(c) 
{
	return /[\u0800-\u4e00]/.test(c); 
}


function extractEnglish(word)
{
	var patt1 = new RegExp(/([a-zA-Z ]+)/);
	var result = patt1.exec(word)[1];
	
	return result;
}


function isValid(word)
{
	return word !== undefined && word !== null && word.length > 0;
}

function isWildCard(word)
{
	var result = -1;
	if (word) {
		result = word.search(/[\*\?\[\]\^\$]/);
	}
	return result !== -1;
}

function wildCard2Regex(word)
{
	word = word.replace(/\*/g, '.*');
	word = word.replace(/\?/g, '.');
	return '^' + word + '$';
}

function getCandidate(word, maximum)
{
	var result = [];
	var c = 0;
	if (!isWildCard(word)) {
		return result;
	}
	var re = new RegExp(wildCard2Regex(word),"i");
	for (var i = 0; i < wordlist.length; i++) {
		if (re.test(wordlist[i])) {
			c = c + 1;
			if (maximum > 0 && c > maximum) {
				result.push([" ", "..."]);
				return result;
			}
			result.push([wordlist[i], ""]);
		}
	}
	for (var j = 0; j < phrases.length; j++) {
		if (re.test(phrases[j])) {
			c = c + 1;
			if (maximum > 0 && c > maximum) {
				result.push([" ", "..."]);
				return result;
			}
			result.push([phrases[j], ""]);
		}
	}
	return result;
}

function getSimilarity(a, b) {
	//Similarity(A,B)=LCS(A,B)/(LD(A,B)+LCS(A,B))
	var ld = Levenshtein(a, b);
	var lc = LCS(a, b).length;
	return lc / (ld + lc);
}

function getSimilars(word, maximum) {
	var h = new priheap(maximum, function(x,y){return x[1]-y[1];});
	for (var i = 0; i < wordlist.length; i++) {
		h.push([wordlist[i], getSimilarity(word, wordlist[i])]);
	}
	return h.toArray().sort(function(x,y){return y[1]-x[1];}).map(function(d){return {word:d[0], similarity:d[1]};});
}

function getSimilar0(word, maximum) {
	var result = [];
	var c = 0;
	for (var i = 0 ; i < wordlist.length; i++) {
		var d = Levenshtein(word, wordlist[i]);
		if (d == 1) {
			c++;
			if (c > maximum) {
				return result;
			}
			result.push([wordlist[i]]);
		} 
	}
	return result;
}

function isSentence(ss) {
/*	
顿号　　　3001　　、　　　
句号　　　3002　　。　　　
问号　　　FF1F　　？　　　
叹号　　  FF01　　！　　　
逗号　　　FF0C　　，
分号　　　FF1B　　；　　　
冒号　　　FF1A　　：　　　
书名号  　3008　 〈　 3009　　〉　　
书名号  　300A　 《　 300B　　》　　　
引号　　　300C　　「　 300D　　」　　　
引号　　　300E　　『　 300F　　』　　　
括号　　　3010　　【　 3011　　】　　　
括号　　　3014　　〔　 3015　　〕　　
　
引号　　　2018　　‘　　2019　　’　　　
引号　　　201C　　“　　201D　　”　　　
括号　　　FF08　　（　 FF09　　）　　　
破折号　  2014　　—　　　
省略号  　2026　　…　　　
连接号　  2013　　–　　　
间隔号　  FF0E　　．　　　
*/　

	var en = ss.search(/[\s\,\.\(\)\[\]\{\}\<\>\/\?\:\;\"\|\\\~\!\@\#\$\%\^\&\*\_\-\+\=]+/gi);
	if (en != -1) {
		return true;
	}

	var cn = ss.search(/[\u3001\u3002\u3008-\u3015\uff00-\uff20\u2018-\u2026]+/gi);
	if (cn != -1) {
		return true;
	}
	return false;
}

function isPhrase(ss) {
	for (var i = 0; i < phrases.length; i++) {
		if (ss == phrases[i]) {
			return true;
		}
	}
	return false;
}

function splitSentence(sentence) {
	var result = [];
	var duplicated = {};
	// var t = sentence.match(/[a-z\u4e00-\u9fa5]+\s*/gim);
	// var t = sentence.match(/(?:[a-z]+(?:\'s)?[a-z]*)|(?:[\u4e00-\u9fa5]+)/gim);
	var t = sentence.match(/(?:[a-z]+)|(?:[\u4e00-\u9fa5]+)/gim);
	for (var i = 0; t && i < t.length; i++) {
		var v = t[i].trim();
		var e = v.toLowerCase();
		if (areEnglish(e) && e.length < 3) {
			continue;
		}
		var timid = false;
		for (var j = 0; j < timidlist.length; j++) {
			if (e == timidlist[j]) {
				timid = true;
				break;
			}
		}
		if (!timid) {
			if (!duplicated[v]) {
				result.push(v);
				duplicated[v] = true;
			}
		}
	}
	return result;
}

