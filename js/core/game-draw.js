/**
 * @fileoverview Contains the classes necessary for the GUI of the game.
 *  Part of the core game engine classes.
 * @see GameEngine
 * @see GameInput
 * @author Andrew Huynh
 */

// Global Functions //===========================
/** 
 * Get the screen position of an element.
 * @param {Element} e Element to get position of.
 */
function getPosition(e) {
    var pos = {x:0, y:0};
    
    while(e.offsetParent) {
        pos.x += e.offsetLeft;
        pos.y  += e.offsetTop;
        e     = e.offsetParent;
    }

    pos.x += e.offsetLeft;
    pos.y += e.offsetTop;

    return pos;
}

// Prototype //==================================
/** 
 * Create a new GameDraw object.
 * @class Handles the 'rendering' of maps, game objects, npcs, etc. Jobs are handed 
 * off to respective classes (i.e Pack, ContextMenu)
 * @author Andrew Huynh
 * @constructor
 */
function GameDraw(){}
GameDraw.prototype =    {
    // Various Vars //===========================
    /** Map scroll DIV element @private @type {DOMElement} */
    mapScroll:      null,
    /** DIV element that holds game status messages @private @type {DOMElement} */
    status:         null
};

//===============================================
// hasCollision
/**
 * Determines whether or not a collision occurs at [cx,cy].
 * @param {int} cx Map X coordinate.
 * @param {int} cy Map Y coordinate.
 */
GameDraw.prototype.hasCollision = function(cx, cy)  {       
    // Determine Global Coordinates
    var gX = Math.floor(cx/document.jsge.MAP_SIZE);
    var gY = Math.floor(cy/document.jsge.MAP_SIZE);

    // Determine Map Section
    var mapSectX = cx - gX*document.jsge.MAP_SIZE;
    var mapSectY = cy - gY*document.jsge.MAP_SIZE;
    var mapSection = (gY*3) + parseInt(gX);

    // Does an object exist at that point?
    return (document.getElementById(mapSection + "x" + mapSectX + "x" + mapSectY + "x2") != null);
};

//===============================================
// Initialize
/**
 * Initialize GUI classes, prepares for 'rendering'.
 * Creates new objects of, and initializes {@link Tooltip}, {@link ContextMenu},
 * {@link HUD}, and {@link Pack}
 */
GameDraw.prototype.Initialize = function()  {
    // Initialize tooltip.
    document.jsge._tip = new Tooltip();
    document.jsge._tip.Initialize();

    // Initialize ContextMenu
    if( !game.mapEdit ) {
        document.jsge._ctxt = new ContextMenu();
        document.jsge._ctxt.Initialize();

        // Initialize HUD
        document.jsge._hud = new HUD();
        document.jsge._hud.Initialize();

        // Initialize Pack
        document.jsge._pack = new Pack();
        document.jsge._pack.Initialize();
        document.jsge._pack.addItem(1);
        document.jsge._pack.addItem(1);
    }

    // Retrieve status pane.
    this.status = $('#status');

    // Prepare map sections and map scroll pane.
    this.mapScroll =  $('#scroll');
    for(var i = 0; i < document.jsge.NUM_MAP_PANELS; i++) {
        document.jsge.map_sections[i] = $('#map' + (i+1));
    }
};

//===============================================
// loadMap
/** 
 * Takes the file name of the top-left corner map and proceeds to
 * load every other section of the map depending from information 
 * gathered from the first map. Every map has data about the maps
 * to the top, right, bottom, and left of it, and thus this function
 * utilizes that information, to easily load the entire map using only
 * the name of one.
 * @param {String} map Map to load.
 */
var mapNum = 0;
GameDraw.prototype.loadMapCallBack = function(mapData) {

    // Animated objects in map section. (Stored to be registerd for
    // animation later)
    var animObjs = [];

    // Holds the map tile before rendering.
    var mapArray = [];
    
    // Verify that the map was loaded/parsed correctly
    if(mapData.terrain) {         
    
        // Load terrain.
        for(var y = 0; y < document.jsge.MAP_SIZE; y++) {
            for(var x = 0; x < document.jsge.MAP_SIZE; x++)
                mapArray.push("<div class='sp" + mapData.terrain.charAt(y*document.jsge.MAP_SIZE-(-x)) +" sprite' style='top: "+ y*document.jsge.SPRITE_SIZE +"px; left: "+ x*document.jsge.SPRITE_SIZE +"px'></div>");
        }
    
        // Load map objects.
        var curLayer = 0;
        for(var i = 0; i < mapData.objs.length; i++) {
        
            // Retrieve map object
            var mObj = mapData.objs[i];
        
            // Determine if it's simply a layer indicator, if not continue.
            if(mObj.layer){ curLayer = mObj.layer; }
            else {
                var interactStr = " ";
            
                // Check if object has user interactions
                if(mObj.objid) {
                    var result = null;
                
                    // Check to see if the object is in the cache.
                    for(var j = 0; j < document.jsge.obj_cache.length; j++) {
                        var item = document.jsge.obj_cache[j];
                        if(item.id == mObj.objid) {
                            result = item;
                            break;
                        }
                    }
                
                    /*
                    // If the object isn't in the cache, request from server.
                    if(!result || !result.id) {
                        result = req.sendRequest(null, "GET", "objectQuery?id="+ mObj.objid +"&type=mapObj", false);
                        if(result.indexOf('ERROR') != -1) {
                            log("Error Connecting to Database!!!");
                            log(result);
                            return;
                        }
                        result = eval("(" + result + ")");
                    }
                
                    if(result) {            
                        // Add necessary data for tooltips.
                        interactStr = "options='"+ result.options +"' objName='"+ result.name +"' script='"+ result.script +"'";
                        interactStr += " onmouseover='document.jsge._tip.showTTip(this)' onmouseout='document.jsge._tip.hideTTip(this)'";
                        interactStr += " onmouseup='document.jsge._ctxt.show(this,event)' ";
                        // Cache object
                        this.objCache.push(result);
                    }*/
                }
            
                // Create unique id. (Not truly unique, since two objects in the same layer, at the same place
                //  will have the same id).
                var idStr = mapNum + "x" + mObj.x + "x" + mObj.y + "x" + curLayer;
            
                // Correct any offsets.
                var xPos = mObj.x*document.jsge.SPRITE_SIZE;
                var yPos = mObj.y*document.jsge.SPRITE_SIZE - (mObj.height - document.jsge.SPRITE_SIZE);
            
                // Animated objects requires special attention.
                if(mObj.frames) {
                    mapArray.push("<div id='"+ idStr + "' frameNum='0' frames='"+ mObj.frames+"' frameSize='"+ mObj.width +"' style='overflow: hidden; z-index: "+ curLayer + "; position: absolute; width: "+ mObj.width + "px;");
                    mapArray.push(" height: "+ mObj.height + "px; top: "+ yPos + "px; left: "+ xPos + "px;'><div class='sp"+ mObj.id +"'></div></div>");
                    animObjs.push(idStr);
                }
                else {
                    mapArray.push("<div id='"+ idStr +"' class='sprite sp"+ mObj.id +"' style='top: "+ yPos +"px; left: "+ xPos +"px;'");
                    mapArray.push(" "+ interactStr + " type='object'></div>");
                }
            } 
        }
    
        // Place mapdata into place.
        document.jsge.map_sections[mapNum].html( mapArray.join('') );
    
        // Cache map.
        document.jsge.map_cache.push(mapData);
    
        // Register any animated tiles.
        for(var i = 0; i < animObjs.length; i++)
            game.regAnimation(document.getElementById(animObjs[i]));
        
        if(mapNum == 8)
            return;
    
        // Determine which way to go...
        if( mapNum != 0 && (mapNum%3) == 0)
            mapFile = document.jsge.map_cache[mapNum-3].south;
        else
            mapFile = mapData.east;       
            
        mapNum++;
        
        game.gameDraw.loadMap(mapFile);
    }    
};

GameDraw.prototype.loadMap = function(map) {        
    // Request map data from server.
    $.getJSON('data/' + map, null, this.loadMapCallBack);
};

GameDraw.prototype.loadWest = function() {
    
    // TODO, grab dynamically
    jsgeConsole.log('Loading west side!');
    
    // Do some magic!
    
    // Clear east side section and shift map right
        
    // Move character to middle.
    //game.player.movePlayer( 36, game.player.getMapY() );
        
}

//===============================================
// loadNPC
/**
 * Creates a 'spawn point' for an NPC.
 * @param {int} id NPC's ID
 * @param {int} x Spawn point X coordinate (Global Coordinates)
 * @param {int} y Spawn point Y coordinate (Global Coordinates)
 */
GameDraw.prototype.loadNPC = function(id, x, y) {
    // Get NPC information from database.
    /*
        var npcData = eval("(" + req.sendRequest(null, "GET", "objectQuery?id=" + id + "&type=npc", false) + ")");
              
        var npc =  new NPC(npcData, x, y);
        npc.show();
        
        return npc;
    */
    
        return null;
        
    //} catch(err){ log("Couldn't get NPC INFO"); }
}

//===============================================
// setStatus
/**
 * Sets the status msg to [msg]. Hides when [msg] is null.
 * @param {String} msg Status text to display.
 */
GameDraw.prototype.setStatus = function(msg)    {    
    // If [msg] is null, hide status.
    if(msg == null) this.status.css('visibility', 'hidden');
    // Otherwise, show status and set text to [msg].
    else if(this.status) {
        this.status.html(msg).css('visibility', 'visible');
    }
};

//===============================================
// scrollMap
/**
 * Centers map on [cx, cy]. Remember that [cx] and [cy] are
 * <b><u>Global</u></b> coordinates(0-MAP_SIZE*3), not local ones(0-MAP_SIZE).
 * @param {int} cx Map X Coordinate.
 * @param {int{ cy Map Y Coordinate.
 */
GameDraw.prototype.scrollMap = function(cx, cy) {
    
    // Infinite world!
    if( cx <= 12 ) {
        this.loadWest();
    }
    
    if( (cy-document.jsge.MAP_MID) >= 0 && (cy+document.jsge.MAP_MID) < document.jsge.MAP_SIZE*3)
        this.mapScroll.scrollTop( (cy-document.jsge.MAP_MID)*document.jsge.SPRITE_SIZE );

    if( (cx-document.jsge.MAP_MID) >= 0 && (cx+document.jsge.MAP_MID) < document.jsge.MAP_SIZE*3)
        this.mapScroll.scrollLeft( (cx-document.jsge.MAP_MID)*document.jsge.SPRITE_SIZE );
};