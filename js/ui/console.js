/**
 * @fileoverview Contains the Console class.
 * @author Andrew Huynh
 */

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
    this.cObj = $('#console');
    this.input = document.getElementById('consoleInput');
    this.log("Welcome to [Insert Awesome Game Name Here]");
    this.inputDiv = $('#cInputDiv');   
    
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
        var oldStuff = this.cObj.html();

        // Msg Types
        if(type == this.MSG_SYSTEM)   msg = "<font class='cSystem'>"+ msg +"</font>";
        else if(type == this.MSG_RED) msg = "<font class='cRed'>"+ msg +"</font>";

        if(oldStuff.length < 2000) 
            this.cObj.html( oldStuff + "&nbsp;" + msg + "<br>" );
        else 
            this.cObj.html( "&nbsp;" + msg + "<br>" );

        this.cObj.scrollTop( this.cObj.scrollTop() + 20);
    }
};

//===============================================
// showInput
/**
 * Shows an input field for user.
 */
Console.prototype.showInput = function() {
    this.inputDiv.css('visibility', 'visible');
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
    this.inputDiv.css('visibility', 'hidden');

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
        this.cObj.html('');
    else if(inputStr.indexOf('/joel') == 0)
        this.logClr('ITS THE JOEL MONSTER, AHHHHHH!!!', this.MSG_RED);
    else if(inputStr.indexOf('/andrew') == 0)
        this.logClr('The guy who made this. I think he deserves some pizza', this.MSG_SYSTEM); 
    else if(inputStr.indexOf('script:') == 0 )
        game.sEngine.execScript(inputStr.substring(inputStr.indexOf(':')+1));
    else {
        //this.chatHandler.postMsg('all', encodeURIComponent(inputStr));
    }
};
