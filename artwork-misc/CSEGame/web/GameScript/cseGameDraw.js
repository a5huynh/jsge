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

//=============================================================================
/**
 * Creates a new XMLParser object
 * @class Wraps DOMParser[Firefox] and Microsoft.XMLDOM[Internet Explorer]
 * @author Andrew Huynh
 * @constructor
 */
//=============================================================================
function XMLParser()    {
    // Browser-specific code. Handles the instatiation of the object.
    if (window.ActiveXObject)    {
        this.xmlParser = new ActiveXObject("Microsoft.XMLDOM");
        this.xmlParser.async="false";
    }
    else    this.xmlParser = new DOMParser();    
}

/**
 * Parses a string of XML.
 * @param {String} text String of XML to be parsed.
 */
XMLParser.prototype.load = function(text)   {
    if(window.ActiveXObject)    {
        this.xmlParser.loadXML(text);
        this.xmlDoc = this.xmlParser;
    }
    else    this.xmlDoc = this.xmlParser.parseFromString(text, "text/xml");
}

//=============================================================================
/**
 * Create a new HUD Object.
 * @class Handles the 'rendering' of the heads-up display. The HUD shows vital
 * information for the player, such as status/action messages, health, etc.
 * @author Andrew Huynh
 * @constructor
 */
//=============================================================================
function HUD(){}
HUD.prototype = {
    /** Good status flag @final @type {int} */
    STATUSGOOD:     1,
    /** Bad status flag @final @type {int} */
    STATUSBAD:      2,
    /** Normal status flag @final @type {int} */
    STATUSNORMAL:   3,
    
    /** DIV element that holds status messages @private @type {DOMElement} */
    statusDiv:      null,   // Status div.
    /** Hide timer ID @private @type {long} */
    statusHide:     null   // Interval ID. For hiding statusDiv.
};

/**
 * Grabs necessary div's for HUD.
 */
HUD.prototype.Initialize = function() {
    this.statusDiv = document.getElementById('hudStatus');
};

/**
 * Show status. Color/Bgcolor based
 * @param {String} str String to display
 * @param {int} type Type of message.
 */
HUD.prototype.showStatus = function(str, type) {
    if(!this.statusDiv) this.statusDiv = document.getElementById('hudStatus');
    
    if(this.statusHide) {
        window.clearTimeout(this.statusHide)
        this.statusHide = null;
    }

    // Determine text color & background color
    switch(type) {
        case 1:
            this.statusDiv.style.color = '#FFF';
            this.statusDiv.style.backgroundColor = '#0F0'; break;
        case 2:
            this.statusDiv.style.color = '#FFF';
            this.statusDiv.style.backgroundColor = '#F00'; break;
        default:
            this.statusDiv.style.color = '#000';
            this.statusDiv.style.backgroundColor = '#FFF';
    }

    this.statusDiv.innerHTML = str;
    this.statusDiv.style.visibility = 'visible';
    this.statusHide = window.setTimeout(new Function('document.getElementById(\'hudStatus\').style.visibility = \'hidden\';'), 4000);
};

/** Global Tooltip Handler @type {Tooltip} */
var tip  =  null;
/** Global ContextMenu Handler @type {ContextMenu} */
var ctxt =  null;
/** Global HUD Handler @type {HUD} */
var hud  =  null;
/** Global Pack Handler @type {Pack} */
var pack =  null;

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
    /** Array of map sections @private @type {Array} */
    mapSections:    [],
    /** Array of already loaded maps @private @type {Array} */
    mapCache:       [],
    /** Array of already loaded objects @private @type {Array} */ 
    objCache:      [],
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
    var gX = Math.floor(cx/20);
    var gY = Math.floor(cy/20);

    // Determine Map Section
    var mapSectX = cx - gX*20;
    var mapSectY = cy - gY*20;
    var mapSection = (gY*3) - (-gX);

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
    tip = new Tooltip();
    tip.Initialize();

    // Initialize ContextMenu
    ctxt = new ContextMenu();
    ctxt.Initialize();

    // Initialize HUD
    hud = new HUD();
    hud.Initialize();

    // Initialize Pack
    pack = new Pack();
    pack.Initialize();
    pack.addItem(1);
    pack.addItem(1);

    // Retrieve status pane.
    this.status = document.getElementById('status');

    // Prepare map sections and map scroll pane.
    this.mapSections = new Array(9);
    this.mapScroll =  document.getElementById('scroll');
    for(var i = 0; i < 9; i++)
        this.mapSections[i] = document.getElementById('map' + (i+1));
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
GameDraw.prototype.loadMap = function(map) {
    
    // Current map that is being processed;
    var mapFile = map;
    var mapNum = 0;

    do {
        // Animated objects in map section. (Stored to be registerd for
        // animation later)
        var animObjs = [];
        
        // Holds the map tile before rendering.
        var mapArray = [];
        
        // Request map data from server.
        var mapData = eval("(" + req.sendRequest(null, "GET", "GameData/" + mapFile, false) + ")");
        
        // Verify that the map was loaded/parsed correctly
        if(mapData.terrain) {         
            
            // Load terrain.
            for(var y = 0; y < 20; y++) {
                for(var x = 0; x < 20; x++)
                    mapArray.push("<div class='sp" + mapData.terrain.charAt(y*20-(-x)) +"' style='top: "+ y*24 +"px; left: "+ x*24 +"px'></div>");
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
                        for(var j = 0; j < this.objCache.length; j++) {
                            var item = this.objCache[j];
                            if(item.id == mObj.objid) {
                                result = item;
                                break;
                            }
                        }
                        
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
                            interactStr += " onmouseover='tip.showTTip(this)' onmouseout='tip.hideTTip(this)'";
                            interactStr += " onmouseup='ctxt.show(this,event)' ";
                            // Cache object
                            this.objCache.push(result);
                        }
                    }
                    
                    // Create unique id. (Not truly unique, since two objects in the same layer, at the same place
                    //  will have the same id).
                    var idStr = mapNum + "x" + mObj.x + "x" + mObj.y + "x" + curLayer;
                    
                    // Correct any offsets.
                    var xPos = mObj.x*24;
                    var yPos = mObj.y*24 - (mObj.height - 24);
                    
                    // Animated objects requires special attention.
                    if(mObj.frames) {
                        mapArray.push("<div id='"+ idStr + "' frameNum='0' frames='"+ mObj.frames+"' frameSize='"+ mObj.width +"' style='overflow: hidden; z-index: "+ curLayer + "; position: absolute; width: "+ mObj.width + "px;");
                        mapArray.push(" height: "+ mObj.height + "px; top: "+ yPos + "px; left: "+ xPos + "px;'><div class='sp"+ mObj.id +"'></div></div>");
                        animObjs.push(idStr);
                    }
                    else {
                        mapArray.push("<div id='"+ idStr +"' class='sp"+ mObj.id +"' style='top: "+ yPos +"px; left: "+ xPos +"px;'");
                        mapArray.push(" "+ interactStr + " type='object'></div>");
                    }
                } 
            }
            
            // Place mapdata into place.
            this.mapSections[mapNum].innerHTML = mapArray.join('');
            
            // Cache map.
            this.mapCache.push(mapData);
            
            // Register any animated tiles.
            for(var i = 0; i < animObjs.length; i++)
                game.regAnimation(document.getElementById(animObjs[i]));
            
            // Determine which way to go...
            if( mapNum != 0 && (mapNum%3) == 0)
                mapFile = this.mapCache[mapNum-3].south;
            else
                mapFile = mapData.east;
            
            // Prepare for next map...
            mapNum++;
        }
    } while(mapNum < 9);
};

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
        var npcData = eval("(" + req.sendRequest(null, "GET", "objectQuery?id=" + id + "&type=npc", false) + ")");
              
        var npc =  new NPC(npcData, x, y);
        npc.show();
        
        return npc;
        
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
    if(msg == null) this.status.style.visibility = "hidden";
    // Otherwise, show status and set text to [msg].
    else if(this.status)    {
        this.status.innerHTML = msg;
        this.status.style.visibility = "visible";
    }
};

//===============================================
// scrollMap
/**
 * Centers map on [cx, cy]. Remember that [cx] and [cy] are
 * <b><u>Global</u></b> coordinates(0-60), not local ones(0-20).
 * @param {int} cx Map X Coordinate.
 * @param {int{ cy Map Y Coordinate.
 */
GameDraw.prototype.scrollMap = function(cx, cy) {  
    if( (cy-9) >= 0 && (cy+9) < 60)
        this.mapScroll.scrollTop = (cy-9)*24;

    if( (cx-9) >= 0 && (cx+9) < 60)
        this.mapScroll.scrollLeft = (cx-9)*24;
};

//=============================================================================
// ContextMenu Class
/**
 * Create new ContextMenu object.
 * @author Andrew Huynh
 * @class Handles the display of the context menu. Determines type of 
 *  menu to display depending on the object clicked.
 * @constructor
 */
function ContextMenu(){}
ContextMenu.prototype =     {
    // Various Vars //===========================
    /** Holds the context menu @private @type {DOMElement} */
    ctxtMenu:       null,
    /** Holds entire context menu @private @type {DOMElement} */
    ctxtObj:        null,
    /** Holds menu options @private @type {DOMElement} */
    ctxtOptions:    null,
    /** Whether the context menu is visible @private @type {bool} */
    isVisible:      false,
    /** Storage area for scripts @private @type {DOMElement} */
    scriptStorage:  null
};

//===============================================
// exec
/**
 * Calls on the script engine to execute some script.
 * @param {int} objNum Menu item selected(which contains the script to execute).
 */
ContextMenu.prototype.exec = function(objNum)   {
    game.sEngine.execScript(this.scriptStorage.innerHTML, this.ctxtObj, objNum);  
};

//===============================================
// hide
/**
 * Hide the context menu and re-enable tooltips.
 */
ContextMenu.prototype.hide = function() {
    this.ctxtObj = null;
    this.ctxtMenu.style.visibility = "hidden";
    tip.setEnabled(true);
};

//===============================================
// Initialize
/**
 * Initialize the context menu. Grabs the divs necessary to make it work.
 */
ContextMenu.prototype.Initialize = function()   {
    this.ctxtMenu = document.getElementById('ctxtMenu');
    this.ctxtOptions = document.getElementById('ctxtOptions');
    this.scriptStorage = document.getElementById('scriptStorage');
};

//===============================================
// show
/**
 * Shows the context menu. Items in the context menu
 * are determined by what object is clicked.
 */
ContextMenu.prototype.show = function(obj, event)   {
    if(!event) event = window.event;

    // Retrieve mouse button used. (IE uses event.button, offsetted by 1)
    var button = event.which ? event.which : event.button + 1;

    this.ctxtObj = obj;

    // Right-click?
    if(button == 3) {
        // Get mouse coordinates.
        pos = events.getMouseCoords(event);
        
        // Construct ContextMenu
        var x = Math.floor( (pos.x - 10) / 40);
        var y = Math.floor( (pos.y - 10) / 40);
        
        var type = obj.getAttribute('type');

        // Get data for ContextMenu
        var objName = (type != 'npc') ? obj.getAttribute('objName') : obj.getAttribute('npcName');
        var options = obj.getAttribute('options').split(':');
        var script  = obj.getAttribute('script');

        // Create Option List
        var optionStr = new Array();
        for(var i = 0; i < options.length; i++) {
            optionStr.push('<div id="ctxtOption" class="ctxtOption" onmouseup="ctxt.exec(\''+i+'\'); ctxt.hide();"');
            optionStr.push(' onmouseover="this.style.backgroundColor = \'#FFF\'"');
            optionStr.push(' onmouseout ="this.style.backgroundColor = \'#DDF\'">');
            optionStr.push('<font id="ctxtBold" style="font-weight: bold">'+ options[i] +'</font>');
            optionStr.push(' '+ objName +'</div>');
        }

        // PackItems has a 'Drop' option
        if(type == 'packItem') {
            optionStr.push('<div id="ctxtOption" class="ctxtOption" onmouseup="pack.dropItem(\''+obj.parentNode.id+'\'); ctxt.hide();"')
            optionStr.push(' onmouseover="this.style.backgroundColor = \'#FFF\'" onmouseout="this.style.backgroundColor = \'#DDF\'">');
            optionStr.push('<font id="ctxtBold" style="font-weight: bold">Drop</font>');
            optionStr.push(' '+ objName +'</div>');
        }

        // Always include cancel option.
        optionStr.push('<div id="ctxtOption" class="ctxtOption" onmouseover="this.style.backgroundColor = \'#FFF\'"');
        optionStr.push(' onmouseout="this.style.backgroundColor = \'#DDF\'" onclick=\"ctxt.hide()\"');
        optionStr.push(' style=\"font-weight: bold\">Cancel</div>');

        // Store script for execution.
        this.scriptStorage.innerHTML = script;

        // Store options to be shown.
        this.ctxtOptions.innerHTML = optionStr.join('');

        // Disables tooltips during contextMenus
        if(tip) tip.setEnabled(false);
        
        // Get Mouse Position.
        var pos = events.getMouseCoords(event);

        // Set ContextMenu into correct place.
        this.ctxtMenu.style.top = pos.y + "px";
        this.ctxtMenu.style.left = pos.x + "px";		
        this.ctxtMenu.style.visibility = "visible";
        this.isVisible = true;
    }
    // Left-click? Simply execute the default option (the first one).
    else if(button = 1) game.sEngine.execScript(obj.getAttribute('script'), this.ctxtObj, 0);
};

//=============================================================================
// Tooltip Class
/**
 * Create new Tooltip object.
 * @author Andrew Huynh
 * @class Handles the display of tooltips. Determines what kind of tooltip to 
 * display on the object the cursor is currently hovering over.
 * @constructor
 */
function Tooltip(){}
Tooltip.prototype = {
    // Various Vars //=======
    /** Tooltip enabled? @private @type {bool} */
    enabled:        true,
    /** Holds tooltip header @private @type {DOMElement} */
    ttHeader:       null,
    /** Holds tooltip information @private @type {DOMElement} */
    ttInfo:         null,
    /** Holds the tooltip @private @type {DOMElement} */
    ttip:           null,
    /** Object tooltip is describing @private @type {Object} */
    ttObj:          null,
    /** Tooltip visible? @private @type {bool} */
    visible:        false
};

//===============================================
// hideTTip
/**
 * Hide the tool tip.
 */
Tooltip.prototype.hideTTip = function() {
    if(this.ttObj)  {
        this.ttObj.onmousemove = null;
        this.ttObj = null;
    }

    this.ttip.style.visibility = "hidden";
    this.visible = false;
};

//===============================================
// Initialize
/**
 * Grab div's necessary to make the tool tip work.
 */
Tooltip.prototype.Initialize = function()   {
    this.ttip = document.getElementById('ttip');
    this.ttHeader = document.getElementById('ttHeader');
    this.ttInfo = document.getElementById('ttInfo');
};

//===============================================
// moveTTip
/**
 * Move tooltip to current mouse position.
 * @param {Event} event Event object.
 */
Tooltip.prototype.moveTTip = function(event)    {
    // Get mouse position.
    var pos = events.getMouseCoords(event);

    // Move tooltip to mouse position.
    if(!this.ttip) this.ttip = document.getElementById('ttip');
    this.ttip.style.top = pos.y + 12 + "px";
    this.ttip.style.left = pos.x + 12 + "px";
};

//===============================================
// setEnabled
/**
 * Enable/Disable tooltip.
 * @param {bool} bool true to enable, false to disable.
 */
Tooltip.prototype.setEnabled = function(bool)   {
    // Set member var to bool.
    this.enabled = bool;		
    
    // Hide tooltip is disabled.
    if(!bool)   this.hideTTip();
};

//===============================================
// showTTip
/**
 * Show tooltip based on [obj]. Similar {@link ContextMenu},
 * Tooltip creates a tooltip based on what object the mouse 
 * is currently hovering over.
 * @param {Object} obj Object mouse is hovering over.
 */
Tooltip.prototype.showTTip = function(obj)  {
    // Can't already be visible, and has to be enabled.
    if(!this.visible && this.enabled)   {   
        
        this.ttObj = obj;
        var type = obj.getAttribute('type');

        // Special tooltips for user and other players.
        if(type == 'player')    {
            if(obj.id == 'user')    {
                this.ttHeader.innerHTML = "This is you!";
                this.ttInfo.innerHTML = "";
            }
        }
        // For npcs
        else if(type == 'npc') {
            // Get options
            var option = obj.getAttribute('options').split(":");
            var moreOpt = ((option.length == 1) ? "No More Options" : (option.length-1) + " More Options");
            
            // Fill in tooltip info.             
            this.ttHeader.innerHTML = obj.getAttribute('npcName');
            this.ttInfo.innerHTML = "<font style='font-weight: bold'>"+ option[0] +"</font> | " + moreOpt;            
        }
        // For objects & inventory items
        else if(type == 'object' || type =='packItem')  {
            // Parse options
            var option = obj.getAttribute('options').split(":");
            var moreOpt = ((option.length == 1) ? "No More Options" : (option.length-1) + " More Options");

            // Fill in tooltip info.             
            this.ttHeader.innerHTML = obj.getAttribute('objName');
            this.ttInfo.innerHTML = "<font style='font-weight: bold'>"+ option[0] +"</font> | " + moreOpt;
        }

        // Move tooltip to correct position
        var pos = getPosition(obj);
        this.ttip.style.top = pos.y + 12 + "px";
        this.ttip.style.left = pos.x + 12 + "px";
        
        // Display tooltip.
        this.ttip.style.visibility = "visible";
        this.visible = true;
        this.ttObj.onmousemove = this.moveTTip;
    }
};

/** Object being dragged @member Pack @private @type {DOMElement} */
var dragObj = null;
/** Currently dragging something? @member Pack @private @type {bool} */
var isDrag  = null;
/** Holds object being dragged @member Pack @private @type {DOMElement} */
var packDND = null;

//=============================================================================
// Pack Class
/**
 * Create new Pack object
 *
 * @author Andrew Huynh
 * @class Handles the display of the player's inventory. Currently has Drag and
 *  Drop.
 * @constructor
 */
function Pack(){}
Pack.prototype = {};

//===============================================
// Initialize
/**
 * Initialize pack.
 */
Pack.prototype.Initialize = function() {};

//===============================================
// addItem
/**
 * Adds an item into user's inventory. Retrieves item data
 *  from database, and then adds to inventory.
 * @param {int} itemID unique ID of item being added.
 */
Pack.prototype.addItem = function(itemID) {
    
    var packNum = 0, packSpot = null;
    
    // Find open spot for item.
    for(packNum = 0; packNum < 30; packNum++) {
        packSpot = document.getElementById('packSpot'+packNum);
        if(packSpot.innerHTML == '') break;
    }

    // Retreive info from database...
    var objData = eval("(" + req.sendRequest(null, "GET", "objectQuery?id="+itemID + "&type=items", false) + ")");

    // Create new item.
    var newItem = document.createElement("div");
    newItem.setAttribute('itemID', itemID);
    newItem.setAttribute('objName', objData.name);
    newItem.setAttribute('options', objData.options);
    newItem.setAttribute('script', objData.script);
    newItem.setAttribute('onmouseover', 'tip.showTTip(this)');
    newItem.setAttribute('onmouseout', 'tip.hideTTip()');
    newItem.setAttribute('type', 'packItem');
    newItem.className = 'item0';        
    newItem.id = packNum + 'x' + itemID;

    // Place item into spot.
    packSpot.appendChild(newItem);
};

//===============================================
// _drag
/**
 * Handles 'dragging' an object around the inventory.
 * @private
 * @param {Object} targetObj Object to be dragged
 * @param {int} posX X coordinate of mouse
 * @param {int} posY Y coordinate of mouse
 * @param {Event} event Event object
 */
Pack.prototype._drag = function(targetObj, posX, posY, event) {
    if(dragObj) {
        // Contstraints //=============
        if(posX < 490)  posX = 490;
        else if(posX > 690) posX = 690;

        if(posY < 226)  posY = 226;
        else if(posY > 456) posY = 456;
        //============================

        isDrag = true;
        if(packDND) {
            packDND.style.top = posY - 20 + 'px';
            packDND.style.left = posX - 20+ 'px';
        }
    }
};

//===============================================
// dropItem
/**
 * <TODO> Supposed to do 'things' when the user selects the
 * drop option.
 * @param {int} spotID Spot to drop item from.
 */
Pack.prototype.dropItem = function(spotID) {};

//===============================================
// _mouseDown
/**
 * Handles mouse down events on the user inventory.
 * @private
 * @param {int} kc Mouse button pressed
 * @param {Object} targetObj Object clicked
 * @param {int} posX Mouse x coordinate
 * @param {int} posY Mouse y coordinate
 * @event {Event} Event Object
 */
Pack.prototype._mouseDown = function(kc, targetObj, posX, posY, event) {
    // Is the target a packItem?
    if(targetObj && targetObj.getAttribute('type') == 'packItem') {
        // Left Button
        if(kc == 1) {
            dragObj = targetObj;

            // Get position of item.
            var pos = getPosition(dragObj);

            // Prepare to for drag.
            packDND = document.getElementById('packDND');
            packDND.innerHTML = dragObj.parentNode.innerHTML;
            packDND.style.left = pos.x + 'px';
            packDND.style.top = pos.y + 'px';
            packDND.style.visibility = "visible";
            dragObj.style.visibility = 'hidden';
            tip.setEnabled(false);
        }
        // Right Button.
        else if(kc == 3)    ctxt.show(targetObj, event);
    }
};

//===============================================
// _mouseUp
/**
 * Handles mouse up events on the user inventory. Part of Drag and Drop
 * functionality.
 * @private
 * @param {int} kc Mouse button pressed
 * @param {Object} targetObj Object clicked
 * @param {int} posX Mouse x coordinate
 * @param {int} posY Mouse y coordinate
 * @event {Event} Event Object
 */
Pack.prototype._mouseUp = function(kc, targetObj, posX, posY, event) {
    // If for some reason dragObj is still null, set it to targetObj
    if(!dragObj)
        dragObj = targetObj;
                    
    // Only left mouse button.
    if(kc == 1) {
        // If user hasn't dragged mouse yet, do default action.
        if(targetObj && targetObj.getAttribute('type') == 'packItem' && !isDrag) {                
            game.sEngine.execScript(dragObj.getAttribute('script'), dragObj, 0);
            dragObj.style.visibility = 'visible';
        }
        else if(isDrag && dragObj && packDND) {
            // Contstraints //=========
            if(posX < 490)  posX = 490;
            else if(posX > 690) posX = 690;

            if(posY < 226)  posY = 226;
            else if(posY > 456) posY = 456;
            //=========================

            var packNum = (Math.floor( (posY - 226)/40 ))*5 - (-(Math.floor( (posX - 490)/40 )));            
            var packSpot = document.getElementById('packSpot'+packNum);

            // If packSpot actually exists and is empty, move item there.
            if(packSpot && packSpot.innerHTML == '') {
                packSpot.innerHTML = packDND.innerHTML;
                dragObj.parentNode.innerHTML = '';
            }
            // Else don't do anything.
            else dragObj.style.visibility = 'visible';
        }

        // Reset stuff.
        if(packDND) {
            packDND.innerHTML = '';
            packDND.style.visibility = 'hidden';    
        }

        dragObj = null;
        isDrag = false;
        tip.setEnabled(true);
    }
};
