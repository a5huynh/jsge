/** 
 * @fileoverview Contains the EventHandler class and
 * HttpXMLRequest class
 * @author Andrew Huynh
 */

// Global Vars //================================
/** Array of registered mouse down handlers @private @type {Array} */
var mouseDownEvents = [];
/** Array of registered mouse move handlers @private @type {Array} */
var mouseMoveEvents = [];
/** Array of registered mouse up handlers @private @type {Array} */
var mouseUpEvents   = [];
/** Array of registered keyboard event handlers @private @type {Array} */
var keyEvents       = [];

// Prototype //==================================
/**
 * Creates a new EventHandler class.
 * @class The EventHandler class wraps around browser
 *  specific code to provide an easy-to-use event handler
 *  for the game engine.
 * @constructor
 * @author Andrew Huynh
 */
function EventHandler(){}
EventHandler.prototype = {
    // Constants //==============================
    /** Mouse left button code @final @type {int} */
    MOUSELEFT:              1,
    /** Mouse middle button code @final @type {int} */
    MOUSEMIDDLE:            2,    
    /** Mouse right button code @final @type {int} */
    MOUSERIGHT:             3
};

/**
 * Registers a fucntion that will be called whenever the event happens
 * @param {Function} func Function to call.
 * @param {int} type Type of event to listen for.
 */
EventHandler.prototype.addEventHandler = function(func, type) {
    // Place function call into respective array.
    if(type == "MOUSE")
        mouseDownEvents.push(func);
    else if(type == "MOUSEUP")
        mouseUpEvents.push(func);
    else if(type == "MOUSEMOVE")
        mouseMoveEvents.push(func);
    else if(type == "KEY")
        keyEvents.push(func);
};
    
/**
 * Prepares the EventHandler class to accept events from the browser.
 * <b>MUST</b> be called before using EventHandler.
 */
EventHandler.prototype.Initialize = function() {
    // Disable right-click menu.
    document.oncontextmenu = function(){ return false; };

    // Browser specific code to registering events. (Netscape)
    if(document.layers)
        document.captureEvents(Event.KEYDOWN | Event.KEYUP | Event.MOUSEDOWN | Event.MOUSEUP | Event.MOUSEMOVE);
        
    // Assign callbacks to respective functions.
    document.onmousedown = this.mouseDownEventHandler;
    document.onmouseup   = this.mouseUpEventHandler;
    document.onmousemove = this.mouseMoveEventHandler;            
    document.onkeydown   = this.keyDnEventHandler;
    document.onkeyup     = this.keyUpEventHandler;
};
    
/**
 * Handles MOUSEDOWN events from browser
 * @private
 * @param {Event} event Event Object.
 * @return true
 */
EventHandler.prototype.mouseDownEventHandler = function(event) {
    // Browser specific code. [IE]
    if(!event)  event = window.event;

    // Get Mouse Button Code
    if(mouseDownEvents.length > 0) {
        // Retrieve mouse button pressed.
        var kc = event.which ? event.which : event.button+1;

        // Get Target Object.
        var obj = (event.srcElement ? event.srcElement : event.target);

        // Get Mouse Coordinates.
        var pos = events.getMouseCoords(event);

        // MouseCode, Target Object, Mouse PosX, Mouse PoxY, event Object.
        for(var i = 0; i < mouseDownEvents.length; i++)
            mouseDownEvents[i](kc, obj, pos.x, pos.y, event);
    }

    return true;
};

/**
 * Handles MOUSEMOVE events from browser.
 * @private
 * @param {Event} event Event Object.
 */
EventHandler.prototype.mouseMoveEventHandler = function(event) {
    // Retrieve event (for IE)
    if(!event) event = window.event;

    // No point if no events are registered.
    if(mouseMoveEvents.length > 0) {
        // Retrieve object mouse is moving on/over, and mouse position.
        var obj = (event.srcElement ? event.srcElement : event.target);
        var pos = events.getMouseCoords(event);
        
        // Call functions added to EventHandler
        for(var i = 0; i < mouseMoveEvents.length; i++)
            mouseMoveEvents[i](obj, pos.x, pos.y, event);
    }
};

/**
 * Handles MOUSEUP events from browser.
 * @private
 * @param {Event} event Event Object
 */
EventHandler.prototype.mouseUpEventHandler = function(event) {
    // Retrieve event (for IE)
    if(!event) event = window.event;

    // No point if no events are registered
    if(mouseUpEvents.length > 0) {
        // Retrieve mouse button pressed, object clicked, and mouse position.
        var kc = event.which ? event.which : event.button+1;
        var obj = (event.srcElement ? event.srcElement : event.target);
        var pos = events.getMouseCoords(event);

        // Call functions added to EventHandler.
        for(var i = 0; i < mouseUpEvents.length; i++)
            mouseUpEvents[i](kc, obj, pos.x, pos.y, event);            
    }
};

/**
 * Handle KEYDOWN events from browser.
 * @private
 * @param {Event} event Event Object.
 */
EventHandler.prototype.keyDnEventHandler = function(event) {
    // Retrieve event (for IE)
    if(!event) event = window.event;

    // No point if no events are registered.
    if(keyEvents.length > 0) {
        // Retrieve key pressed.
        var keyCode = event.which ? event.which : event.keyCode;
        
        // Call functions added to EventHandler
        for(var i = 0; i < keyEvents.length; i++)
            keyEvents[i](false, keyCode, event);
    }
    
    // Allow key press to be handled by browser.
    return true;
};

/**
 * Handles KEYUP events from browser
 * @private
 * @param {Event} event Event Object.
 */
EventHandler.prototype.keyUpEventHandler = function(event) {
    // Retrieve event (for IE)
    if(!event) event = window.event;

    // No point if no events are registered
    if(keyEvents.length > 0) {
        // Retrieve key released
        var keyCode = event.which ? event.which : event.keyCode;
        
        // Call functions added to EventHandler
        for(var i = 0; i < keyEvents.length; i++)
            keyEvents[i](true, keyCode, event);
    }

    // Allow key release to be handled by browser
    return true;
};

/**
 * Wrapper around browser specific code
 * @param {Event} event Event Object.
 */
EventHandler.prototype.getMouseCoords = function(event) {
    // Retrieve event (for IE);
    if(!event) event = window.event;
    
    // Initialize variables to store position.
    var posx = 0, posy = 0;
    
    // Internet Explorer Code
    if (event.clientX || event.clientY) {
        posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    // Mozilla, Firefox, etc. Code
    else if (event.pageX || event.pageY) {
        posx = event.pageX;
        posy = event.pageY;
    }    
    return {x: posx, y: posy};
};

/**
 *
 * Creates a new HttpRequestWrapper Object
 * @class A class that wraps around the browser specific code for the 
 *  XMLHttpRequest object.
 * @author Andrew Huynh
 * @constructor
 */
function HttpRequestWrapper() {
    /** Access to lower level XMLHttpRequest object */
    this.httpReq = null;
    
    // Internet Explorer Code.
    if(window.ActiveXObject) {
        try{    this.httpReq = new ActiveXObject("Msxml2.XMLHTTP"); }
        catch(e){   this.httpReq = new ActiveXObject("Microsoft.XMLHTTP");  }
    }
    // Firefox, Mozilla, etc. Code.
    else if(window.XMLHttpRequest) this.httpReq = new XMLHttpRequest(); 
};

/**
 * One easy-to-use method that can send a request either sync or async. If sync, returns
 *  the result of the request, other wise uses the callback to handle the request.
 *  Doesn't return anything if asynchronous.
 *
 * @param {Function} callBack Function to be called in async requests.
 * @param {String} method Either "GET" or "POST"
 * @param {String} url URL of the request.
 * @param {bool} async true for asynchronous, false for synchronous.
 * @return {String} Data from <b>synchronous</b> request.
 */
HttpRequestWrapper.prototype.sendRequest = function(callBack, method, url, async) {
    
    if(callBack && method && url && async) {
        this.httpReq.onreadystatechange = callBack;        
        this.httpReq.open(method, url, async);
        this.httpReq.send(0);
    }
    else if(async == false) {
        this.httpReq.onreadystatechange = function(){};
        this.httpReq.open(method, url, async);
        this.httpReq.send(0);
        
        return this.httpReq.responseText;
    }
};

var req = new HttpRequestWrapper();