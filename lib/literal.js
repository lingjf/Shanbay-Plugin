


function isEnglish(w) {  
    for(var i=0;i<w.length;i++) {
        if(w.charCodeAt(i)>126) {
            return false;
        }
    }
    return true; 
}

function isChinese(w) {
	var re = /[^\u4e00-\u9fa5]/; 
	if(re.test(w)) return false; 
	return true; 
}

function isJapanese(w) {
	var re = /[^\u0800-\u4e00]/; 
	if(re.test(w)) return false; 
	return true; 
}

function isContainChinese(temp)
{
	var cnt = 0;
	for(var i=0;i < temp.length ; i++)
	{
		if(isChinese(temp.charAt(i)))
			cnt++;
	}
	if (cnt > 5) return true;
	return false;
}

function isContainJapanese(temp)
{
	var cnt = 0;
	for(var i=0;i < temp.length ; i++)
	{
		if(isJapanese(temp.charAt(i)))
			cnt++;
	}
	if (cnt > 2) return true;
	return false;
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
		result = word.search(/[\*\?\[\]^$]/);
	}
	return result !== -1;
}

function wildCard2Regex(word)
{
	word = word.replace(/\*/g, '.*');
	word = word.replace(/\?/g, '.');
	return word;
}

function getCandidate(word, maximum)
{
	var result = [];
	var c = 0;
	if (!isWildCard(word)) {
		if (/^[a-zA-Z\s']+$/.test(word)) {
			result.push(word);
		}
		return result;
	}
	var re = new RegExp(wildCard2Regex(word),"i");
	for (i in wordlist) {
		if (re.test(wordlist[i])) {
			c = c + 1;
			if (maximum > 0 && c > maximum) {
				result.push("...");
				break;
			}
			result.push(wordlist[i]);
		}
	}
	return result;
}

