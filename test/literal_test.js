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
  equal( wildCard2Regex('ab*c'), "ab.*c","Passed!" );
  equal( wildCard2Regex('ab?c'), "ab.c","Passed!" );
});

test( "getCandidate", function() {

	var e = [
		"abaca",
		"aback",
		"abacus",
		"abacuses",
		"huckaback"
	];

	var a = getCandidate('abac*', 0);
	deepEqual(a, e, "Passed!" );
});
