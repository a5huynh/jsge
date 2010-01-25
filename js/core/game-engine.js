/**
 * @fileoverview Contains the GameEngine Class.
 * @author Andrew Huynh
 */
 
// Global Vars //====================
/** Sprite cache, initialize storage. @member GameEngine @private @type {Array} */
var spriteCache = [];

/** List of objects to animate. @member GameEngine @private @type {Array} */
var animObjs    = [];

/** List of NPCs to animate and keep track of @member GameEngine @private @type {Array} */
var npcObjs     = [];

/**
 * Create a new GameEngine object. Call Initialize to prepare the GameEngine
 *  for it's tasks. Calling the start() function will power up the GameEngine and
 *  allow it to start animation, updating, etc.
 * @class The main class that delegates specific game functions to other classes
 * provides an interface in which to easily interact with other Core classes.
 * @constructor
 * @author Andrew Huynh
 */
function GameEngine( mapEditMode ) {
    this.mapEdit = mapEditMode;
}

GameEngine.prototype =  {
    /** Animation thread ID @private @type {long} */
    thread:         null,
    /** Public access to GameDraw object  @type {GameDraw} */
    gameDraw:       null,
    /** Public access to GameInput object  @type {GameInput} */
    gameInput:      null,
    /** Public access to ScriptEngine object  @type {ScriptEngine} */
    sEngine:        null,
    /** Public access to Player object  @type {Player} */
    player:         null
};

/**
 * Initialize GameDraw, GameInput, and ScriptEngine.
 */
GameEngine.prototype.Initialize = function()  {
   // Ready rendering engine.
    this.gameDraw = new GameDraw();
    this.gameDraw.Initialize();
    this.gameDraw.setStatus(null);

    // Ready input handler.
    this.gameInput = new GameInput();
    this.gameInput.Initialize();

    // Prepare ScriptEngine
    this.sEngine = new ScriptEngine();
    this.sEngine.Initialize();        
};

/**
 * Adds a spawning point for a specific NPC. The game engine uses this
 * data to move the NPC about by requesting data about the NPC from the 
 * server.
 * @param {int} id NPC id to keep track of.
 * @param {int} x X coordinate of spawn point
 * @param {int} y Y coordinate of spawn point
 */
GameEngine.prototype.addSpawnPoint = function(id, x, y) {
    /* TODO: Check for duplicate spawn point */
    npcObjs.push(this.gameDraw.loadNPC(id, x, y));
}

/**
 * Loads map. Requests list of maps to load (in order),
 * calls on GameDraw to load the map correctly (registers animation, 
 * add objects, etc) and also prepares the Player object.
 */
GameEngine.prototype.loadMap = function() {
    // Retrieve Player's location... TODO: Retrieve from database...
    // [0]   - Top left corner map (Other maps are retrieve based on that map)
    // [1-2] - Global Pos
    // [3-4] - Local Pos
    var posData = '';
    if( this.mapEdit ) {
        posData = "map0001.json:0:0:1:1";
    } else {
        posData = "map0001.json:1:1:12:12";
    }
    
    // Get map sections
    posData = posData.split(':');
    
    // Start loading map pieces.
    this.gameDraw.loadMap(posData[0]);

    // Prepare Player object. (mapPieces[9-12] hold the (server) saved position of the player.
    this.player = new Player(posData[1], posData[2], posData[3], posData[4]);
};

/**
 * Loads NPC for map(s).
 */
GameEngine.prototype.loadNPC = function() {
    // Draws an NPC on screen. Interaction depends on NPC type.
    this.addSpawnPoint(1, 30, 29);
};

/**
 * Places player in the correct position (the middle of screen) and makes player's avatar visible.
 */
GameEngine.prototype.loadPlayer = function()  {
    // Show Player on map
    this.player.show();
    
    // Center map on player.
    $('#scroll').scrollTop(  (this.player.getMapY()-document.jsge.MAP_MID)*document.jsge.SPRITE_SIZE );
    $('#scroll').scrollLeft( (this.player.getMapX()-document.jsge.MAP_MID)*document.jsge.SPRITE_SIZE );        
};

/**
 * Starts the animation/update thread.
 */
GameEngine.prototype.start = function()   {
    // A mock 'thread', run is called every 200ms.
    if(this.thread == null)
        this.thread = window.setInterval(this.run, 500);
};

/**
 * Stops the GameEngine animation/update thread.
 */
GameEngine.prototype.stopThread = function()  {
    window.clearInterval(this.thread);
};

/**
 * Register an object with the GameEngine for animation.
 * @param {Object} obj Object to be registered for animation.
 */
GameEngine.prototype.regAnimation = function(obj) {    
    // Add to end of animObjs array.
    animObjs.push(obj);
};

/** 
 * Called every 200ms. Animates registered objects that are viewable by the 
 * player. Also handles updates and such.
 * @private
 */
GameEngine.prototype.run = function() {
    
    // Get player's position.
    var playerX = game.player.getMapX();
    var playerY = game.player.getMapY();

    // Loop through all registered objects.
    for(var i = 0; i < animObjs.length; i++) {
        var obj = animObjs[i];
        var pos = obj.id.split('x');

        var gY = Math.floor(pos[0]/3);
        var gX = pos[0] - gY*3;

        var objX = gX*document.jsge.MAP_SIZE + parseInt(pos[1]);
        var objY = gY*document.jsge.MAP_SIZE + parseInt(pos[2]);

        // Verify that user can actually 'see' the object.
        var isX = (objX > (playerX-document.jsge.MAP_MID-1) && objX < (playerX+document.jsge.MAP_MID+1));
        var isY = (objY > (playerY-document.jsge.MAP_MID-1) && objY < (playerY+document.jsge.MAP_MID+1));

        if(isX && isY) {               
            // Animate objects within player's view.
            var frameNum = obj.getAttribute('frameNum');
            var maxFrames = obj.getAttribute('frames');
            var frameSize = obj.getAttribute('frameSize');

            if(frameNum == maxFrames)
                frameNum = 0;

            obj.scrollLeft = frameNum*frameSize;

            frameNum++;
            animObjs[i].setAttribute('frameNum', frameNum);
        }
    }
    
    // Loop through all npcs
    for(var i = 0; i < npcObjs.length; i++) {
        var obj = npcObjs[i];
        
        if(npcObjs[i] == null) {
            break;
        }
        
        var npc = document.getElementById(obj.id + "x" + obj.spawnX + "x" + obj.spawnY);
        
        if(npc == null)
            log("NPC is NULL")
        
        // Animate objects within player's view.
        var frameNum = npc.getAttribute('frameNum');
        var maxFrames = npc.getAttribute('frames');
        
        if(frameNum == maxFrames)
            frameNum = 0;
        
        npc.scrollLeft = frameNum*24;

        frameNum++;
        npc.setAttribute('frameNum', frameNum);
    }
};

/** Does the calculations involved in player movement @member GameEngine @private */
function move()
{        
    var key = lastKey;
    var dir = key - 36;
    
    // Get current player's position.
    var newX = game.player.getMapX();
    var newY = game.player.getMapY();
    
    // Turn position to pixels.
    var xPos = newX*document.jsge.SPRITE_SIZE;
    var yPos = newY*document.jsge.SPRITE_SIZE;
    
    var half_size = document.jsge.SPRITE_SIZE/2;
    
    // Determine offset
    if(key == 37 && xPos > 0)
        xPos -= half_size;
    else if(key == 38 && yPos > 0)
        yPos -= half_size;
    else if(key == 39 && xPos < 1416)
        xPos -= -half_size;
    else if(key == 40 && yPos < 1416)
        yPos -= -half_size;

    // Determine new grid coordinates.
    switch(dir) {
        case 1: newX -= 1; break;
        case 2: newY -= 1; break;
        case 3: newX -= -1; break;
        case 4: newY -= -1; break;
    }
            
    // Collision? If yes, reset xPos, yPos to oldX, oldY. If not, scroll map
    if(game.gameDraw.hasCollision(newX, newY)) {
        newX = game.player.getMapX();
        newY = game.player.getMapY();
        xPos = newX * document.jsge.SPRITE_SIZE;
        yPos = newY * document.jsge.SPRITE_SIZE;
    }
    else game.gameDraw.scrollMap(newX, newY);
        
    // Move player.
    game.player.doMove(dir, xPos, yPos, newX, newY);
}
