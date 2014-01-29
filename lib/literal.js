


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

