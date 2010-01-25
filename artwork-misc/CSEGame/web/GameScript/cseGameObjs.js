/** 
 * @fileoverview Contains various game Objects
 * @author Andrew Huynh
 */

/**
 * Create a new NPC object
 * @class The NPC object represents a NPC on the map, handling
 * movement and interaction.
 * @constructor
 * @author Andrew Huynh
 * @param {JSONNPC} npcData JSON NPC object returned from server
 * @param {int} x X coordinate of spawn point
 * @param {int} y Y coordinate of spawn point
 */
function NPC(npcData, x, y) {
    this.name    = npcData.name;
    this.options = npcData.options;
    this.script  = npcData.script;
    this.flags   = npcData.flags;
    this.id      = npcData.id.trim();
    this.spawnX  = x;
    this.spawnY  = y;
}

NPC.prototype = {
    flags:      null,
    id:         null,
    options:    null,
    script:     null,
    spawnX:     0,
    spawnY:     0
};

NPC.prototype.show = function() {
        var npcStr = [];
        npcStr.push("<div id='"+this.id+"x" + this.spawnX + "x" + this.spawnY+ "' frames='2' frameNum='0' style='z-index: 4; position: absolute; overflow: hidden; width: 24px; height: 26px; top: ");
        
        var trueY = (this.spawnY*24) - 2;
        
        npcStr.push(trueY +"px; left: "+ (this.spawnX*24) +"px'>");
        npcStr.push("<div id='npc' class='npc"+ this.id +"' onmouseup='ctxt.show(this,event)' onmouseover='tip.showTTip(this, event)' onmouseout='tip.hideTTip()' type='npc' ");
        npcStr.push("npcName='"+ this.name +"' options='"+ this.options + "' script='" + this.script + "'></div></div>");
        
        document.getElementById('players').innerHTML += npcStr.join('');
}

// Prototype //==================================
/**
 * Create a new Player object
 * @class The Player object represents a player on the map, handling
 * movement and interaction.
 * @constructor
 * @author Andrew Huynh
 * @param {int} gX Global X coordinate
 * @param {int} gY Global Y coordinate
 * @param {int} lX Local X coordinate
 * @param {int} lY Local Y coordinate
 */
function Player(gX, gY, lX, lY)
{
    this.globalX = gX;
    this.globalY = gY;
    this.localX = lX;
    this.localY = lY;    
    this.dir = 4;
    this.frame = 0;
    this.name = "Player" + Math.floor(Math.random()*10);
}

Player.prototype = {
    // Various Vars //===========================
    /** Current direction player is facing  @type {int} */
    dir:                null,
    /** @private */
    frame:              null,
    /** Local X Coordinate  @type {int} */
    localX:             null,
    /** Local Y Coordinate  @type {int} */
    localY:             null,
    /** Global X Coordinate @type {int} */
    globalX:            null,
    /** Global Y Coordinate @type {int} */
    globalY:            null,
    /** Player name @type {String} */
    name:               null,
    /** @private */
    pObj:               null,
    /** @private */
    pScroll:            null
};

//===============================================
// changeDirection
/**
 * Changes the direciton in which the player facing.
 * @param {int} newDir New direction to face (1 = West, 2 = North, 3 = East, 4 = South)
 */
Player.prototype.changeDirection = function(newDir) {
    // Check for valid direction
    if(this.dir != newDir && newDir >= 1 && newDir <= 4) {
        this.dir = newDir;
        this.pObj.className = "player" + this.dir;
    }
};

//===============================================
// direction
/**
 * Returns the current direction of the player.
 */
Player.prototype.direction = function() {
    return this.dir;
};

//===============================================
// doMove
/**
 * Move the player's avatar.
 * @param {int} dir Direction of movement
 * @param {int} cx Old X position of character.
 * @param {int} cy Old Y position of character.
 * @param {int} nx New X position of character.
 * @param {int} ny New Y position of character.
 */
Player.prototype.doMove = function(dir, cx, cy, nx, ny) {
    //game.checkCharEvents(dir, cx, cy)
    if(this.frame >= 8) { this.frame = -1; }
    
    this.frame++;

    // Recalculate coordinates
    this.globalX = Math.floor(nx/20);
    this.globalY = Math.floor(ny/20);

    this.localX = nx - (this.globalX*20);
    this.localY = ny - (this.globalY*20);

    this.changeDirection(dir);
    this.movePlayer(cx, cy);
    this.updateFrame();
};

/** Get player's local X coordinate */
Player.prototype.getLocalX  = function(){  return this.localX; };
/** Get player's local Y coordinate */
Player.prototype.getLocalY  = function(){  return this.localY; };
/** Get player's global X coordinate */
Player.prototype.getGlobalX = function(){  return this.globalX; };
/** Get player's global Y coordinate */
Player.prototype.getGlobalY = function(){  return this.globalY; };
/** Get player's map X coordinate */
Player.prototype.getMapX    = function(){  return ((this.globalX*20) - (-this.localX)); };
/** Get player's map Y coordinate */
Player.prototype.getMapY    = function(){  return ((this.globalY*20) - (-this.localY)); };      
   
//===============================================
// movePlayer
/**
 * Move player to cx, cy. (This is instant no animation done here.)
 * @param {int} cx X position to move to.
 * @param {int} cy Y position to move to.
 */
Player.prototype.movePlayer = function(cx, cy)  {
        this.pScroll.style.top = (cy-9)  + "px";
        this.pScroll.style.left = cx + "px";        
};

/** Set player's local X coordinate */
Player.prototype.setLocalX  = function(i){    this.localX = i; };
/** Set player's local Y coordinate */
Player.prototype.setLocalY  = function(i){    this.localY = i; };
/** Set player's global X coordinate */
Player.prototype.setGlobalX = function(i){    this.globalX = i; };
/** Set player's global Y coordinate */
Player.prototype.setGlobalY = function(i){    this.globalY = i; };

//===============================================
// show
/**
 * Display player on map
 */
Player.prototype.show = function() {
    var playerStr = new Array();
    playerStr.push("<div id='userScroll' style='z-index: 5; position: absolute; overflow: hidden; width: 24px; height: 36px; top: "+ ((this.getMapY()*24) - 9) +"px; left: "+ (this.getMapX()*24) +"px'>");
    playerStr.push("<div id='user' class='player3' onmouseover='tip.showTTip(this, event)' onmouseout='tip.hideTTip()' type='player'></div></div>");

    document.getElementById('players').innerHTML += playerStr.join('');
    this.pObj = document.getElementById('user');
    this.pScroll = document.getElementById('userScroll');
};
    
//===============================================
// updateFrame
/**
 * Updates the frame of animation of the character.
 */
Player.prototype.updateFrame = function() {
    this.pScroll.scrollLeft = this.frame*24;
};

// Prototype //==================================
/** 
 * Create a new Console object
 * @class The console object handles chat messages, chat commands,
 * and other stuff
 * @constructor
 * @author Andrew Huynh
 */
function Console(){}
Console.prototype = {
    /** System msg flag @final @type {int} */
    MSG_SYSTEM:     1,
    /** Red msg flag @final @type {int} */
    MSG_RED:        2,
    /** Blue msg flag @final @type {int} */
    MSG_BLUE:       3,
    
    // Various Vars //===========================
    /** ChatHandler object @private @type {ChatHandler} */
    chatHandler:    null,
    /** Console DIV object @private @type {DOMElement} */
    cObj:           null,
    /** Input object @private @type {DOMElement} */
    input:          null,
    /** Input DIV object @private @type {DOMElement} */
    inputDiv:       null
};    

//===============================================
// Initialize
/**
 * Intialize the console, preparing it to receive and handle messages.
 */
Console.prototype.Initialize = function() {
        
    // Intialize necessary variables.
    this.cObj = document.getElementById('console');
    this.input = document.getElementById('consoleInput');        
    this.log("Welcome to [Insert Awesome Game Name Here]");
    this.inputDiv = document.getElementById('cInputDiv');   
    
    // Initialize chat handler, preparing for updates.
    // Handles any chat-specific features. (Updates, etc).
    this.chatHandler = new ChatHandler();    
    this.chatHandler.Initialize(this.cObj);
};

//===============================================
// log
/**
 * Basic log functions, passes data along to logClr.
 * @param {String} msg Message to display in console.
 */
Console.prototype.log = function(msg) {
    this.logClr(msg, 0);
};

//===============================================
// logClr
/**
 * Formats the message and displays it in the console.
 * @param {String} msg Message to display in console.
 * @param {int} type Type of message.
 */
Console.prototype.logClr = function(msg, type) {
    if(msg != null && this.cObj) {
        var oldStuff = this.cObj.innerHTML;

        // Msg Types
        if(type == this.MSG_SYSTEM)   msg = "<font class='cSystem'>"+ msg +"</font>";
        else if(type == this.MSG_RED) msg = "<font class='cRed'>"+ msg +"</font>";

        if(oldStuff.length < 2000) 
            this.cObj.innerHTML = oldStuff + "&nbsp;" + msg + "<br>";
        else 
            this.cObj.innerHTML = "&nbsp;" + msg + "<br>";

        this.cObj.scrollTop += 20;
    }
};

//===============================================
// showInput
/**
 * Shows an input field for user.
 */
Console.prototype.showInput = function() {
    this.inputDiv.style.visibility = "visible";
    this.input.disabled = false;
    this.input.focus();
};

//===============================================
// parseInput
/**
 * Parse input from user, doing specific actions when necessary. Also hides 
 * the input field.
 * @private
 */
Console.prototype.parseInput = function() {
    // Remove focus from input and hide it
    this.input.blur();
    this.input.disabled = true;
    this.inputDiv.style.visibility = "hidden";

    // Retrieve input and remove any trailing whitespace
    var inputStr = this.input.value.trim();
    this.input.value = "";

    // Check for valid input
    if(inputStr == null || inputStr == "")
        return;       

    // Determine what to do with output
    if(inputStr.indexOf("red:") == 0)
        this.logClr(inputStr, this.MSG_RED);
    else if(inputStr.indexOf('/clear') == 0)
        this.cObj.innerHTML = "";
    else if(inputStr.indexOf('/joel') == 0)
        this.logClr('ITS THE JOEL MONSTER, AHHHHHH!!!', this.MSG_RED);
    else if(inputStr.indexOf('/andrew') == 0)
        this.logClr('The guy who made this. I think he deserves some pizza', this.MSG_SYSTEM); 
    else if(inputStr.indexOf('script:') == 0 )
        game.sEngine.execScript(inputStr.substring(inputStr.indexOf(':')+1));
    else
        this.chatHandler.postMsg('all', encodeURIComponent(inputStr));
};
