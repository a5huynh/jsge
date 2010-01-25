/**
 * @fileoverview Contains the Pack class. Handles the Pack UI element.
 * @author Andrew Huynh
 */

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
    $.getJSON('objectQuery', {id: itemID, type: 'items'}, function(objData) {
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
    });
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
