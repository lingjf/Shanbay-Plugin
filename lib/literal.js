


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
	for (i in wordlist) {
		if (re.test(wordlist[i])) {
			c = c + 1;
			if (maximum > 0 && c > maximum) {
				result.push([" ", "..."]);
				break;
			}
			result.push([wordlist[i], ""]);
		}
	}
	return result;
}

