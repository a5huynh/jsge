/**
 * @fileoverview Contains the Tooltip class. Handles the Tooltip ui element.
 * @author Andrew Huynh
 */

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

    $(this.ttip).hide();
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
        $(this.ttip).show();
        this.visible = true;
        this.ttObj.onmousemove = this.moveTTip;
    }
};