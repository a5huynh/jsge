/** 
 * @fileoverview Contains classes that handle the chat feature of the
 * console window.
 *
 * @author Andrew Huynh
 */

// Global Vars //================================
/** Used to request chat messages from server @see ChatHandler @private @type {HttpRequestWrapper} */
var chat_msgRequester = null;
/** Used to send chat messages to server @see ChatHandler @private @type {HttpRequestWrapper} */
var chat_msgSender = null;
/** Time of last chat update @see ChatHandler @private @type {long} */
var chat_lastUpdate = null;

// Prototype //==================================
/**
 * Creates a new ChatHandler class.
 * @class The ChatHandler handles updating the chat
 *  window and sending chat messages.
 * @constructor
 * @author Andrew Huynh
 */
function ChatHandler(){}
ChatHandler.prototype = {
    /** Console object @type {Console} */
    console:            null,
    /** Update Thread ID @private @type {int} */
    updateID:           null,
    /** Chat window update interval @type {int}  */
    UPDATE_INTERVAL:    2000
};

//===============================================
// formatMessage
/**
 * Formats a message to be disaplayed
 * @param {String} uname Name of user sending the msg.
 * @param {String} dest private or public?
 * @param {long} time Time message was sent.
 * @param {String} msg The msg.
 */
ChatHandler.prototype.formatMessage = function(uname, dest, time, msg) {
    var retStr = "(12 : 12)" + uname + " : " + msg;
};

//===============================================
// Initialize
/**
 * Prepares ChatHandler for handling receiving messages.
 * @param {Object} console DIV where messages are placed.
 */
ChatHandler.prototype.Initialize = function(console) {
    this.console = console;
    chat_msgRequester = new HttpRequestWrapper();
    chat_msgSender = new HttpRequestWrapper();
    chat_lastUpdate = (new Date()).getTime();
};

//===============================================
// postMsg
/**
 * Posts a message to the server.
 * @param {String} dest Can be 'all', which allows every one to see it, or a 
 *                 user name for private messaging.
 * @param {String} msg  Message to post.
 */
ChatHandler.prototype.postMsg = function(dest, msg) {
    chat_msgSender.sendRequest(new Function(" "), "POST", "chat?user=" + game.player.name + "&dest=" + dest + "&msg=" + msg, true);
    this.console.innerHTML += "&nbsp;" + game.player.name + ": " + decodeURIComponent(msg) + "<br>";
    this.console.scrollTop += 20;
};

//===============================================
// showUpdates
/**
 * Shows updates as it receives them.
 * @private
 */
ChatHandler.prototype.showUpdates = function() {
    if(chat_msgRequester.httpReq.readyState == 4) {
        var data = chat_msgRequester.httpReq.responseText;
        var dataArray = data.split('\n');
        chat_lastUpdate = dataArray[0];           

        var msgArray = new Array();
        for(var i = 1; i < dataArray.length-1; i += 4) {
            var name = dataArray[i];
            var dest = dataArray[i+1]; 
            var time = dataArray[i+2];
            var msg = dataArray[i+3];
            msgArray.push("&nbsp;" + name + ": " + msg + "<br>");
        }
        
        document.getElementById('console').innerHTML += msgArray.join('');    
        
        // Prepare another request for an update
        this.updateID = window.setTimeout(console.chatHandler.update, this.UPDATE_INTERVAL);
    }
};

//===============================================
// startUpdate
/**
 * Start requesting for updates
 * @private
 */
ChatHandler.prototype.startUpdate = function() {
    this.updateID = window.setTimeout(this.update, this.UPDATE_INTERVAL);
};

//===============================================
// update
/**
 * Requests updates from server.
 * @private 
 */
ChatHandler.prototype.update = function() {  
    if(game && game.player)
        chat_msgRequester.sendRequest(console.chatHandler.showUpdates, "GET", "chat?time=" + chat_lastUpdate + "&user=" + game.player.name, true);
};


