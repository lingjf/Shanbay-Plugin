(function() {
  /* Default comparison function to be used */
  var defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };

  var _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  var _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  /* Push item onto heap, maintaining the heap invariant. */
  var heappush = function(array, item, cmp) {
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };

  /* Pop the smallest item off the heap, maintaining the heap invariant. */
  var heappop = function(array, cmp) {
    var lastelt, returnitem;
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };

 /* Fast version of a heappush followed by a heappop. */
  heappushpop = function(array, item, cmp) {
    var _ref;
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };

  function priheap(maximum, cmp) {
    this.cmp = cmp != null ? cmp : defaultCmp;
    this.nodes = [];
    this.maximum = maximum;
    this.index = 0;
  }

  priheap.prototype.push = function(x) {
    if (this.index >= this.maximum) {
      return heappushpop(this.nodes, x, this.cmp);
    } else {
      this.index++;
      return heappush(this.nodes, x, this.cmp);
    }
  };

  priheap.prototype.pop = function() {
    return heappop(this.nodes, this.cmp);
  };

  priheap.prototype.peek = function() {
    return this.nodes[0];
  };

  priheap.prototype.clear = function() {
    return this.nodes = [];
  };

  priheap.prototype.empty = function() {
    return this.nodes.length === 0;
  };

  priheap.prototype.size = function() {
    return this.nodes.length;
  };

  priheap.prototype.toArray = function() {
    return this.nodes.slice(0);
  };

  window.priheap = priheap;

}).call(this);
