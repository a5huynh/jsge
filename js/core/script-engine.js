/**
 * @fileoverview Contains the Astar and ScriptEngine classes.
 * @author Andrew Huynh
 */

//=============================================================================
/**
 * Creates a Node object
 * @class Used in conjunction with Astar to determine the shortest path between
 * two points on a grid.
 * @author Andrew Huynh
 * @constructer
 * @see Astar
 * @see ScriptEngine 
 */
//=============================================================================
// Prototype //==================================
function Node(parentNode, cx, cy, g, h) {
	this.parent = parentNode;
	this.x = cx;
	this.y = cy;
	this.g = g;
	this.h = h;
	this.f = g + h;
}
//=============================================================================
/**
 * Creates an Astar class.
 * @class Determines the shortest path between two points on a grid filled with obstacles
 *  by using the A* Algorithm.
 * @author Andrew Huynh
 * @constructor
 * @see Node
 * @see ScriptEngine
 */
//=============================================================================
// Global Vars //================================
// Constants //==================================
/* Number of rows in the map @final */
var NUM_ROWS = 60;
/* Number of cols in the map @final */
var NUM_COLS = 60;

// Prototype //==================================
function Astar(){}
Astar.prototype = {
    // Various Vars //=======================
    /** Array of open nodes @private @type {Array} */
    _open:	[],
    /** Holds the path to the destination @private @type {Array} */
    _path:	[],
    /** Array of available nodes @private @type {Array} */
    _avail:	null,
    /** Starting X coordinate @private @type {int} */
    _sx:	0,
    /** Starting Y coordinate @private @type {int} */
    _sy:	0,
    /** Destination X coordinate @private @type {int} */
    _dx:	0,
    /** Destination Y coordinate @private @type {int} */
    _dy:	0
};

//===============================================
// findPath
/**
 * Uses the A* algorithm to find the the shortest path.
 * @param {int} srcX Starting X coordinate.
 * @param {int} srcY Starting Y coordinate.
 * @param {int} dstX End X coordinate.
 * @param {int} dstY End Y coordinate.
 */
Astar.prototype.findPath = function(srcX, srcY, dstX, dstY) {
    // Starting position
    this._sx = srcX;
    this._sy = srcY;

    // End positions
    this._dx = dstX;
    this._dy = dstY;

    // Used to quickly determine avialable nodes.
    this._avail = [];
    this._open  = [];

    // Path from start to finish will be stored here.
    this._path  = [];

    // Create a new node at the starting point.
    var node = new Node(null, this._sx, this._sy, 0, distance(dstX-srcX, dstY-srcY));

    // Add node to open list
    this._open.push(node);

    // Starting node has been 'touched'
    this._avail[node.y*NUM_ROWS -(-node.x)] = 1;

    var bestNode = null;

    // Do A* algorithm.
    for(var count = 0; count < 1000; count++) {               

        // Get best node from open list
        bestNode = this._getBestNode();

        // If there are none, break. No path found.
        if(bestNode == null){ break; }

        // Push the bestNode to path list
        this._path.push(bestNode);

        // If the goal has been reached, break. Path Found.
        if(bestNode.x == this._dx && bestNode.y == this._dy){ break; }

        // Add the children of the bestNode. Rinse. Repeat.
        this._fillChildren(bestNode);
    }

    // Get the path follow by algorithm.
    var retArray = [];
    node = this._path.pop();

    // If last node placed is not the dest, path not found.
    if(distance(dstX-node.x, dstY-node.y) !== 0){ return null; }

    // Extract only the valid path taken, starting from the goal.
    do {
        retArray.push(node);
        node = node.parent;
    } while(node != null);

    // the path is in reverse order, reverse to correct order.
    retArray.reverse();

    // Success!
    return retArray;
};

//===============================================
// _fillChildren
/**
 * Adds the child nodes a [node] into the nodes array.
 * @private
 * @param {Node} node Node to retrieve children of.
 */
Astar.prototype._fillChildren = function(node) {
    // Top (North) Tile.
    if(this._ValidTile(node.x, node.y-1)){ 
        this._CreateNode(node, node.x, node.y-1); }

    // Right (East) Tile.
    if(this._ValidTile(node.x+1, node.y)){ 
        this._CreateNode(node, node.x+1, node.y); }

    // Bottom (South) Tile.
    if(this._ValidTile(node.x, node.y+1)){ 
        this._CreateNode(node, node.x, node.y+1); }

    // Left (West) Tile.
    if(this._ValidTile(node.x-1, node.y)){ 
        this._CreateNode(node, node.x-1, node.y); }
};

//===============================================
// _getBestNode
/**
 * Returns the open node with the lowest F.
 * @private
 */
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
// _CreateNode
/**
 * Creates a new node based on [node].
 * @private
 * @param {Node} node Parent node
 * @param {int} x X coordinate
 * @param {int} y Y coordinate
 */
Astar.prototype._CreateNode = function(node, x, y) {
    var tmp = new Node(node, x, y, node.g+1, distance(this._dx - x, this._dy - y));
    this._avail[y*NUM_ROWS + x] = tmp.f;
    this._open.push(tmp);
};

//===============================================
// _ValidTile
/**
 * Determines whether or not there is an obstacle at [x,y],
 *  or if it has already been added.
 * @private
 * @param {int} x X coordinate of tile/node.
 * @param {int} y Y coordinate of tile/node.
 */
Astar.prototype._ValidTile = function(x, y) {
    if(x < 0 || x > (NUM_COLS-1) || y < 0 || y > (NUM_ROWS-1))
            return false;

    if(game.gameDraw.hasCollision(x, y))
        return false;

    return this._isAvailable(x, y);
};

//===============================================
// _isAvailable
/**
 * Determines if the node at [x,y] is still available 
 * (Not on open list or closed list).
 * @private
 * @param {int} x X coordinate of node to check
 * @param {int} y Y coordinate of node to check.
 */
Astar.prototype._isAvailable = function(x, y) {
    return (this._avail[y*NUM_ROWS + x] == null);
};

/* Determine distance between two points @member Astar */
function distance(x, y){ return (Math.sqrt( (x*x) + (y*y) )); }
// End A* Algorithm //=========================================================

//=============================================================================
/**
 * Creates a new ScriptEngine object.
 * @class Handles running scripts stored by items/objects/NPCS
 * @author Andrew Huynh
 * @constructor
 * @see Astar
 * @see Node
 */
// Global Vars //================================
var path = null;
// Prototype //==================================
function ScriptEngine(){}
ScriptEngine.prototype = {
    // Various Vars //===========================
    /** Pathfinder @private @type {Astar} */
    _pathFinder:    new Astar(),
    /** Movement thread ID @private @type {long} */
    _smThread:      null
};    

//===============================================
// execScript
/**
 * Executes a script in the context of the game.
 * @param {String} script script to execute.
 * @param {int} objOption Menu option (Context Menus).
 * @param {int} objNum Menu number (Context Menus).
 */
ScriptEngine.prototype.execScript = function(script, objOption, objNum) {
    // Retrieve info for easy access for script.
    // Technically, the script can use any variable available to ScriptEngine, but
    // storing them in local vars makes script writing easier.      

    // Prepare easy-access variables for script.  
    var obj = null;

    // TODO: Comment.
    if(objOption != null) {   
        obj = {};
        obj.element = objOption;
        obj.num = objNum;
        obj.resID = objOption.className.substring(2);

        var id = objOption.id.split('x');

        if(id.length == 4)
        {                
            var gY = Math.floor(id[0]/3);
            var gX = id[0] - gY*3;

            obj.globalX = gX*20 - (-id[1]);
            obj.globalY = gY*20 - (-id[2]);
            obj.localX = id[1];
            obj.localY = id[2];
            obj.layer = id[3];
        }
    }

    var player = {};
    player.moveTo  = this._moveTo;           // Move to location.
    player.context = this;
    player.x       = game.player.getMapX();  // Player's current X pos.
    player.y       = game.player.getMapY();  // Player's current Y pos.
    player.dir     = game.player.dir;        // Player's facing direction.

    //var disp = { 'show': hud.showStatus };

    jsgeConsole.logClr("Running Script", console.MSG_SYSTEM);

    eval(decodeURIComponent(script));    
};

//===============================================
// Initialize
/**
 * Description: Initializes the ScriptEngine.
 */
ScriptEngine.prototype.Initialize = function() {};

//===============================================
// isRunning
/**
 * Checks to see if a movement thread is running.
 */
ScriptEngine.prototype.isRunning = function() {
    return this._smThread;
};

//===============================================
// _moveTo
/**
 * Description: Finds the shortest path to the destination 
 *  and moves character to that position.
 * @private
 * @param {int} nx X coordinate to move to.
 * @param {int} ny Y coordinate to move to.
 */
ScriptEngine.prototype._moveTo = function(nx, ny) {   
    var thisObj = null;
    if(this.context){ thisObj = this.context; }
    else thisObj = this;
    
    if(thisObj._smThread == null) {
        var bm = (new Date()).getTime();
       
        path = thisObj._pathFinder.findPath(game.player.getMapX(), game.player.getMapY(), nx, ny);
        
        if(path != null) {
            log("Pathfind Benchmark: " + ((new Date()).getTime() - bm) + "ms");
            thisObj._smThread = window.setInterval(thisObj._moveThread, 120);
        }
    }
};

//===============================================
// stop
/**
 * Stops any movement threads.
 */
ScriptEngine.prototype.stop = function() {
    if(this._smThread) {
        window.clearInterval(this._smThread);
    }
    
    this._smThread = null;
};

//===============================================
// _moveThread
/**
 * Moves the player.
 * @private
 */
ScriptEngine.prototype._moveThread = function() {
    if(path.length > 0) {
        
        // Get next grid location.
        var tmp = path.shift();
        
        // Current position.
        var cx = game.player.getMapX();
        var cy = game.player.getMapY();

        // New position.
        var x = tmp.x;
        var y = tmp.y;
        var xPos = x*24;
        var yPos = y*24;

        // Movement Direction
        var dir = detDir(x, y, cx, cy);

        // Scroll Map & move player. (No need to collision detect)
        game.gameDraw.scrollMap(x, y);
        game.player.doMove(dir, xPos, yPos, x, y);
    }
    else {
        game.sEngine.stop();
        game.player.frame = 0;
        game.player.updateFrame();
    }
};

/**
 * Determine direction from two points
 * TODO: Possibly integrate somewhere?
 */
function detDir(nx, ny, cx, cy) {
    if(nx < cx) { return 1; }
    else if(nx > cx){ return 3; }
    else if(ny < cy){ return 2; }
    else if(ny > cy){ return 4; }
}