/** 
 * @fileoverview Contains code pertaining to the NPC object
 * @author Andrew Huynh
 */

/**
 * Create a new NPC object
 * @class The NPC object represents a NPC on the map, handling
 * movement and interaction.
 * @constructor
 * @author Andrew Huynh
 * @param {JSONNPC} npcData JSON NPC object returned from server
 * @param {int} x X coordinate of spawn point
 * @param {int} y Y coordinate of spawn point
 */
function NPC(npcData, x, y) {
    this.name    = npcData.name;
    this.options = npcData.options;
    this.script  = npcData.script;
    this.flags   = npcData.flags;
    this.id      = npcData.id.trim();
    this.spawnX  = x;
    this.spawnY  = y;
}

NPC.prototype = {
    flags:      null,
    id:         null,
    options:    null,
    script:     null,
    spawnX:     0,
    spawnY:     0
};

NPC.prototype.show = function() {
        var npcStr = [];
        npcStr.push("<div id='"+this.id+"x" + this.spawnX + "x" + this.spawnY+ "' frames='2' frameNum='0' style='z-index: 4; position: absolute; overflow: hidden; width: 24px; height: 26px; top: ");
        
        var trueY = (this.spawnY*24) - 2;
        
        npcStr.push(trueY +"px; left: "+ (this.spawnX*24) +"px'>");
        npcStr.push("<div id='npc' class='npc"+ this.id +"' onmouseup='ctxt.show(this,event)' onmouseover='document.jsge._tip.showTTip(this, event)' onmouseout='document.jsge._tip.hideTTip()' type='npc' ");
        npcStr.push("npcName='"+ this.name +"' options='"+ this.options + "' script='" + this.script + "'></div></div>");
        
        $('#players').append( npcStr.join('') );
}