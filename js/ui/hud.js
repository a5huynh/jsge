/**
 * @fileoverview Contains the HUD Class. handles the HUD ui element.
 * @author Andrew Huynh
 */

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
