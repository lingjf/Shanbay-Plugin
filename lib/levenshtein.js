// Levenshtein distance
function Levenshtein( str_m, str_n ) { 
  var previous, current, matrix;
  matrix = [];

  if ( str_m == str_n )
    return 0;
  else if ( str_m == '' )
    return str_n.length;
  else if ( str_n == '' )
    return str_m.length;
  else {
    function forEach(array,fn) { 
      for (var i = 0; i < array.length; i++) {
        fn(array[i], i, array);
      }
    }
    previous = [ 0 ];
    forEach( str_m, function( v, i ) { i++, previous[ i ] = i; } );

    matrix[0] = previous;
    forEach( str_n, function( n_val, n_idx ) {
      current = [ ++n_idx ];
      forEach( str_m, function( m_val, m_idx ) {
        m_idx++;
        if ( str_m.charAt( m_idx - 1 ) == str_n.charAt( n_idx - 1 ) )
          current[ m_idx ] = previous[ m_idx - 1 ];
        else
          current[ m_idx ] = Math.min(
              previous[ m_idx ]     + 1   // Deletion
            , current[  m_idx - 1 ] + 1   // Insertion
            , previous[ m_idx - 1 ] + 1   // Subtraction
          );
      });
      previous = current;
      matrix[ matrix.length ] = previous;
    });

    return current[ current.length - 1 ]
  }
}
