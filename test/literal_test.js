
test( "areEnglish", function() {
  equal(areEnglish("a"), true, "Passed!");
  equal(areEnglish("ab"), true, "Passed!");
  equal(areEnglish("A-z x's"), true, "Passed!");

  equal(areEnglish("abc*"), false, "Passed!");
  equal(areEnglish("a中"), false, "Passed!");
});

test( "isChinese", function() {
  equal(isChinese("中"), true, "Passed!");
  equal(isChinese("国"), true, "Passed!");

  equal(isChinese("a"), false, "Passed!");
  equal(isChinese(" "), false, "Passed!");
  equal(isChinese("の"), false, "Passed!");
});

test( "areChinese", function() {
  equal(areChinese("中"), true, "Passed!");
  equal(areChinese("中国"), true, "Passed!");
  equal(areChinese("中 国"), true, "Passed!");

  equal(areChinese("abc"), false, "Passed!");
  equal(areChinese("a中"), false, "Passed!");
});

test( "hasChinese", function() {
  equal(hasChinese("中"), true, "Passed!");
  equal(hasChinese("中国"), true, "Passed!");
  equal(hasChinese("中 国"), true, "Passed!");

  equal(hasChinese("abc"), false, "Passed!");
  equal(hasChinese("a中"), true, "Passed!");
});

test( "isJapanese", function() {
  equal(isJapanese("中"), false, "Passed!");
  equal(isJapanese("国"), false, "Passed!");

  equal(isJapanese("a"), false, "Passed!");
  equal(isJapanese(" "), false, "Passed!");
  equal(isJapanese("の"), true, "Passed!");
});


test( "isWildCard", function() {
  equal( isWildCard('abc'), false,"Passed!" );
  equal( isWildCard('abc*'), true,"Passed!" );
  equal( isWildCard('ab*c'), true,"Passed!" );
  equal( isWildCard('a*bc'), true,"Passed!" );
  equal( isWildCard('*abc'), true,"Passed!" );

  equal( isWildCard('?abc'), true,"Passed!" );
  equal( isWildCard('a?bc'), true,"Passed!" );
  equal( isWildCard('ab?c'), true,"Passed!" );
  equal( isWildCard('abc?'), true,"Passed!" );

  equal( isWildCard('ab[cd]'), true,"Passed!" );
});

test( "wildCard2Regex", function() {
  equal( wildCard2Regex('ab*c'), "^ab.*c$","Passed!" );
  equal( wildCard2Regex('ab?c'), "^ab.c$","Passed!" );
});

test( "getCandidate", function() {

	var e1 = [
              ["abaca", ""],
              ["aback", ""],
              ["abacus", ""],
              ["abacuses", ""] 
           ];

	var a1 = getCandidate('abac*', 0);
	deepEqual(a1, e1, "Passed!" );
});

test( "getSimilarity", function() {

  var e1 = [
            "abloom",
            "blood",
            "bloom",
            "blooms",
            "bloomy",
            "boom",
            "broom",
            "gloom",
            "loom"
          ];

  var a1 = getSimilarity('bloom', 0);
  deepEqual(a1, e1, "Passed!" );
});

test( "getSimilarity2", function() {

  var e1 = [];

  var a1 = getSimilarity('tremendous', 0);
  deepEqual(a1, e1, "Passed!" );
});


