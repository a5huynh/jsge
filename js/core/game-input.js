/**
 * @fileoverview Contains the GameInput class. Part of the core game engine classes.
 * @see GameEngine
 * @see GameDraw
 * @author Andrew Huynh
 */

// Global Vars //===============
/** Global EventHandler object @private @type {EventHandler} */
var events = null;
/** Key code of last key pressed @private @type {int} */
var lastKey = 0;
//==============================

//=============================================================================
/**
 * Creates a GameInput object.
 * @class Takes user input and determines what to do with it.
 * @author Andrew Huynh
 * @constructor
 */
//=============================================================================
// Prototype //================= 
function GameInput(){}
GameInput.prototype =   {
    /** Console input object @private @type {DOMElement} */
    consoleInput:   null,    
    /** Movement thread ID @private @type {long} */
    moveThread:     null
};

//====================================================
// Initialize
/**
 * Initialize EventsHandler, and add events to be taken care of.
 */
GameInput.prototype.Initialize = function() {
    // Initialize EventHandler
    events = new EventHandler();
    events.Initialize();
    
    // Basic keyboard/mouse handlers
    
    if( !game.mapEdit ) {
        events.addEventHandler(this.mouseInput, "MOUSE");
    }
    
    events.addEventHandler(this.keyboardInput, "KEY")
    
    // Drag and drop event handlers.
    //events.addEventHandler(pack._mouseDown, "MOUSE");
    //events.addEventHandler(pack._drag, "MOUSEMOVE");
    //events.addEventHandler(pack._mouseUp, "MOUSEUP");
};

//=====================================================
// keyboardInput
/**
 * Called by EventHandler whenever there is keyboard input.
 * @param {bool} up key released[true]/pressed[false].
 * @param {int} keyCode keyboard code for key pressed.
 * @param {Event} event event object.
 */
GameInput.prototype.keyboardInput = function(up, keyCode, event)    {    
    if(up)  {
        // The user is still moving? Cancel movement.
        if(this.moveThread) {
            window.clearInterval(this.moveThread);
            this.moveThread = null;
            lastKey = 0;
            game.player.frame = -1;
            window.setTimeout(move, 110);
        }
        // "T" pressed.
        else if(keyCode == 84 && !this.consoleInput)  {
            jsgeConsole.showInput();
            this.consoleInput = true;
        }
        // Enter pressed.
        else if(keyCode == 13 && this.consoleInput) {
            jsgeConsole.parseInput();
            this.consoleInput = false;
        }
    }
    else if(!this.consoleInput && !this.moveThread) {   
        // Check for W, A, S, D and Arrow (Up, Down, Left, Right) keys.
        switch(keyCode) {
            case 65: lastKey = 37; break;
            case 68: lastKey = 39; break;
            case 83: lastKey = 40; break;
            case 87: lastKey = 38; break;
            default: lastKey = (keyCode >= 37 && keyCode <= 40) ? keyCode : 0;
        }

        // Valid movement key? If not, exit funtion.
        if(lastKey == 0)    return;
        
        // Stop script engine if running.
        if(game.sEngine.isRunning())    game.sEngine.stop();
        
        // Create new movement thread.
        this.moveThread = window.setInterval(move, 110);
    }
};

//=====================================================
// mouseInput
/**
 * Called by EventHandler whenever mouse input occurs.
 * @param {int} mouseButton Mouse button pressed.
 * @param {Object} targetObj Object mouse clicked on (if any).
 * @param {int} posX Mouse X position.
 * @param {int} posY Mouse Y position.
 * @param {Event} event Event object.
 */
GameInput.prototype.mouseInput = function(mouseButton, targetObj, posX, posY, event) {
    // Hide context menu when mouse click is outside menu.
    if(mouseButton == events.MOUSELEFT && ctxt && ctxt.isVisible && (targetObj.id.indexOf("ctxt") == -1))
       ctxt.hide();
};