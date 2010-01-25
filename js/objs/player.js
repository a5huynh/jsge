/** 
 * @fileoverview Contains code pertaining to the Player object
 * @author Andrew Huynh
 */

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
    
    /** Current health of player @type{int} */
    hp:                 null, 
    /** Current magic of player @type{int} */
    mp:                 null,     
    
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
        this.pObj.removeClass('player' + this.dir).addClass('player' + newDir);
        this.dir = newDir;
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
    this.globalX = Math.floor(nx/document.jsge.MAP_SIZE);
    this.globalY = Math.floor(ny/document.jsge.MAP_SIZE);

    this.localX = nx - (this.globalX*document.jsge.MAP_SIZE);
    this.localY = ny - (this.globalY*document.jsge.MAP_SIZE);

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
Player.prototype.getMapX    = function(){  return ((this.globalX*document.jsge.MAP_SIZE) + parseInt(this.localX)); };
/** Get player's map Y coordinate */
Player.prototype.getMapY    = function(){  return ((this.globalY*document.jsge.MAP_SIZE) + parseInt(this.localY)); };      
   
//===============================================
// movePlayer
/**
 * Move player to cx, cy. (This is instant no animation done here.)
 * @param {int} cx X position to move to.
 * @param {int} cy Y position to move to.
 */
Player.prototype.movePlayer = function(cx, cy)  {
    this.pScroll.css('top', (cy-9) + 'px');
    this.pScroll.css('left', cx + 'px');
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
    
    var p_width = document.jsge.SPRITE_SIZE;
        
    playerStr.push("<div id='userScroll' style='width: "+ p_width +"px; height: 36px; top: "+ ((this.getMapY()*p_width) - 9) +"px; left: "+ (this.getMapX()*p_width) +"px'>");
    playerStr.push("<div id='user' class='player4' onmouseover='document.jsge._tip.showTTip(this, event)' onmouseout='document.jsge._tip.hideTTip()' type='player'></div></div>");

    $('#players').append(playerStr.join(''));
    
    this.pObj = $('#user');
    this.pScroll = $('#userScroll');
};
    
//===============================================
// updateFrame
/**
 * Updates the frame of animation of the character.
 */
Player.prototype.updateFrame = function() {
    this.pScroll.scrollLeft(this.frame*document.jsge.SPRITE_SIZE);
};