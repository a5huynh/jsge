/**
 * @fileoverview Contains the ContextMenu class. Handles the context menu UI element.
 * @author Andrew Huynh
 */

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
    document.jsge._tip.setEnabled(true);
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
        if(document.jsge._tip) document.jsge._tip.setEnabled(false);
        
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