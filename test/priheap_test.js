
test( "priheap", function() {
	var heap = new priheap(3);
	heap.push(3);
	heap.push(1);
	heap.push(2);
	equal(heap.peek(), 1, "Passed!");
	heap.push(4);
	equal(heap.peek(), 2, "Passed!");
	equal(heap.pop(), 2, "Passed!");
	equal(heap.peek(), 3, "Passed!");
});
