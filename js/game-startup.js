/**
 * @fileoverview Contains miscellaneous functions to start up the
 * Game engine.
 * @author Andrew Huynh
 */

/** Used for easy debugging @private */
var jsgeConsole = null;
/** Global log function */
function log(msg)   { 
    if(jsgeConsole) 
        jsgeConsole.logClr(msg, 1); 
}

/* Benchmark variables @private */
var bMark, bMark2;

/* Global game object @type {GameEngine} */
var game = null;
/**
 * Called by <body onload=''> or a similar method to start up the GameEngine.
 */
function loadMap() {
    // Prepare console (for logging, messages, etc).
    jsgeConsole = new Console();
    jsgeConsole.Initialize();

    bMark = new Date();
    
    // Initialize Game Engine.
    game = new GameEngine( false );
    game.Initialize();
    
    // Set game status.
    game.gameDraw.setStatus("Loading Game...");
    
    // A little break so the status is shown.
    window.setTimeout(loadMap2, 500);
}

/**
 * Called by body onload='' or a similar method to start up the GameEngine in map edit mode
 */
function loadMapEditor() {
    // Prepare console (for logging, messages, etc).
    jsgeConsole = new Console();
    jsgeConsole.Initialize();

    bMark = new Date();
    
    // Initialize Game Engine.
    game = new GameEngine( true );
    game.Initialize();
    
    // Set game status.
    game.gameDraw.setStatus("Loading Game...");
    
    // A little break so the status is shown.
    window.setTimeout(loadMap2, 500);    
}

/**
 * Continuation of the loadMap, loads the map, objects, NPCS, players. Also starts up the game 
 * animation engine.
 */
function loadMap2() {       
    bMark2 = (new Date()).getTime();
    
    // Load Map Terrain & Objects
    game.loadMap();
    
    // Load NPCs
    game.loadNPC();
    
    // Load PC's
    game.loadPlayer();
    
    log("Map Load Time: " + ((new Date()).getTime() - bMark2) + "ms");
    
    // Hide status and start animation engine.
    game.gameDraw.setStatus(null);
    game.start();
    
    //console.chatHandler.startUpdate();
    
    log("Total Load Time: " + ((new Date()).getTime() - bMark.getTime()) + "ms");
}

