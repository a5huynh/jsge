//=============================================================================
//
// Node Class
// Author: Andrew Huynh
// Description: Used in conjunction with Astar to determine the shortest path
//  between two points on a grid.
//
//=============================================================================
// Prototype //==================================
function Node(parentNode, cx, cy, g, h) {
	this.parent = parentNode;
	this.x = cx;
	this.y = cy;
	this.g = g;
	this.h = h;
	this.f = g + h;
};
//=============================================================================
//
// Astar Class
// Author: Andrew Huynh
// Description: Determines the shortest path between two points on a grid filled
//  with obstacles by using the A* Algorithm
//
//=============================================================================

// Global Vars //================================
// Constants //==================================
var NUM_ROWS = 10;
var NUM_COLS = 10;

// Prototype //==================================
function Astar(){}
Astar.prototype = {

	// Various Vars //=======================
	_open:		[],
	_path:		[],
	_avail:		null,
	_sx:		0,
	_sy:		0,
	_dx:		0,
	_dy:		0,

	// Public Functions //===================
	findPath:	{},

	// Private Functions //==================
	_CreateNode:	{},
	_fillChildren:	{},
	_getBestNode:	{},
	_isAvailable:	{},
	_printArray:	{},
	_printNode:	{},
	_ValidTile:	{}
};

//===============================================
// findPath : Public
// Description: Uses the A* algorithm to find the
//  the shortest path.
//===============================================
Astar.prototype.findPath = function(srcX, srcY, dstX, dstY) {

	this._sx = srcX;
	this._sy = srcY;

	this._dx = dstX;
	this._dy = dstY;

	// Used to quickly determine avialable nodes.
	this._avail 	= new Array(NUM_ROWS * NUM_COLS);
	this._open 	= new Array();
	this._path 	= new Array();

	var node = new Node(null, 0, 0, 0, distance(dstX-srcX, dstY-srcY));

	this._open.push(node);
	this._avail[node.y*NUM_ROWS -(-node.x)] = 1;

	var bestNode = null;

	for(var count = 0; count < 100; count++) {

		bestNode = this._getBestNode();

		if(bestNode == null)	break;

		this._path.push(bestNode);

		if(bestNode.x == this._dx && bestNode.y == this._dy)
			break;

		this._fillChildren(bestNode);
	}

	// Get the path follow by algorithm.
	var retArray = [];
	var node = this._path.pop();

	// If last node placed is not the dest, path not found.
	if(distance(dstX-node.x, dstY-node.y) != 0)
		return null;

	log("Path Taken: ");
	do {
		retArray.push(node);
		this._printNode(node);
		node = node.parent;
	} while(node != null);

	retArray.reverse();

	return retArray;
};

//===============================================
// showNodes : Public
// Description: Shows the nodes that were accessed
//  by the algorithm.
//===============================================
Astar.prototype.showNodes = function() {
	for(var y = 0; y < NUM_ROWS; y++) {
		for(var x = 0; x < NUM_COLS; x++) {
			if(this._avail[y*NUM_ROWS + x]) {
				colorNode(x, y, this._avail[y*NUM_ROWS+x]);
			}
		}
	}
};

//===============================================
// _fillChildren : Private
// Description: Adds the child nodes a [node] into
//  the nodes array.
//===============================================
Astar.prototype._fillChildren = function(node) {

	// Top (North) Tile.
	if(this._ValidTile(node.x, node.y-1))
		this._CreateNode(node, node.x, node.y-1);

	// Right (East) Tile.
	if(this._ValidTile(node.x+1, node.y))
		this._CreateNode(node, node.x+1, node.y);

	// Bottom (South) Tile.
	if(this._ValidTile(node.x, node.y+1))
		this._CreateNode(node, node.x, node.y+1);

	// Left (West) Tile.
	if(this._ValidTile(node.x-1, node.y))
		this._CreateNode(node, node.x-1, node.y);
};

//===============================================
// _getBestNode : Private
// Description: Returns the open node with the lowest F
//===============================================
Astar.prototype._getBestNode = function() {
	if(this._open.length > 0) {
		var bestNum = 0;
		var bestF = this._open[0].f;

		// Cycle through open list until the best node is found.
		for(var index = 1; index < this._open.length; index++) {

			var tmpF = this._open[index].f;

			// Favors the last added node if there are nodes with the same F.
			if(tmpF <= bestF) {
				bestNum = index;
				bestF = tmpF;
			}
		}

		// Remove node from open list and place into closed list.
		var bestNode = this._open[bestNum];
		this._open.splice(bestNum, 1);
		return bestNode;
	}

	return null;
};

//===============================================
// _CreateNode : Private
// Description: Creates a new node based on [node].
//===============================================
Astar.prototype._CreateNode = function(node, x, y) {
	var tmp = new Node(node, x, y, node.g+1, distance(this._dx - x, this._dy - y));
	this._avail[y*NUM_ROWS + x] = tmp.f;
	this._open.push(tmp);
};

//===============================================
// _ValidTile : Private
// Description: Determines whether or not there is
//  an obstacle at [x,y], or if it has already been
//  added.
//===============================================
Astar.prototype._ValidTile = function(x, y) {
	if(x < 0 || x > 9 || y < 0 || y > 9)
		return false;

	if(map[y*NUM_ROWS - (-x)])
		return false;

	return this._isAvailable(x, y);
};

//===============================================
// _isAvailable : Private
// Description: Determines if the node at [x,y]
//  is still available (Not on open list or closed list).
//===============================================
Astar.prototype._isAvailable = function(x, y) {
	return (this._avail[y*NUM_ROWS + x] == null);
};

//===============================================
// _printArray : Private
// Description: Prints out the info about nodes in
//  an array.
//===============================================
Astar.prototype._printArray = function(array) {
	for(var i = 0; i < array.length; i++) {
		var tmp = array[i];
		log("(" + tmp.x + ", " + tmp.y + ") F: " + tmp.f);
	}
};

//===============================================
// _printNode : Private
// Description: Prints out info about a node
//===============================================
Astar.prototype._printNode = function(tmp) {
	if(tmp)
		log("(" + tmp.x + ", " + tmp.y + ") F: " + tmp.f);
};


/*
//
//
// Binary Heap Code. (Under Construction)
//
//
//===============================================
// _addToHeap : Private
// Description: Add's node to binary heap
//===============================================
Astar.prototype._addToHeap = function(node) {
	this._open.push(node);

	var pos = this._open.length-1;
	var parent = Math.floor(pos/2);

	// Bubble up.
	for(;;) {
		if(parent == pos)
			break;

		var tmp = this._open[parent];
		if(node.f <= tmp.f) {
			this._open[parent] = this._open[pos];
			this._open[pos] = tmp;
			pos = parent;
		}

		parent = Math.floor(pos/2);
	}
};

//===============================================
// _removeFromHeap : Private
// Description: Remove first node and reorganizes
//  heap.
//===============================================
Astar.prototype._removeFromHeap = function() {
	var retNode = this._open.shift();

	var length = this._open.length;
	var pos = 0;
	var child = pos*2 + 1;
	var node = this._open[pos];

	// Reorganize heap
	for(;;) {
		if(child >= length)
			break;

		var tmp = this._open[child];

		// Check first child.
		if(node.f > tmp.f) {

		}
		// Check second child.
		else {
			child++;
			tmp = this._open[child];

			if(node.f > tmp.f) {
			}
		}
	}
};*/


// Miscellaneous helper functions
function distance(x, y){	return (Math.sqrt( (x*x) + (y*y) ));	}

function log(str){ info.innerHTML += str + "<br>"; }

function colorNode(x, y, f) {
	var obj = document.getElementById(x + "x" + y)
	if(obj.style.backgroundColor != "#00FF00") {
		obj.style.backgroundColor = "#CCC";
		obj.innerHTML = f;
	}
}