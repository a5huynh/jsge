/**
 * @fileoverview Holds functions/classes that are configured on start up to 
 * ensure cross browser functionality.
 *
 * @author Andrew Huynh
 */
document.jsge = new Object();
/* Various JSGE constants */
document.jsge.SPRITE_SIZE   = 24;
document.jsge.MAP_SIZE      = 25;
document.jsge.NUM_MAP_PANELS = 9;
document.jsge.MAP_MID       = Math.floor(document.jsge.MAP_SIZE/2);

/* Global variables */

/** Array of already loaded objects @private @type {Array} */
document.jsge.obj_cache     = [];
/** Array of map sections @private @type {Array} */
document.jsge.map_sections  = [];
/** Array of already loaded maps @private @type {Array} */
document.jsge.map_cache     = [];

/** Global Tooltip Handler @type {Tooltip} */
document.jsge._tip  = null;
/** Global ContextMenu Handler @type {ContextMenu} */
document.jsge._ctxt =  null;
/** Global HUD Handler @type {HUD} */
document.jsge._hud  =  null;
/** Global Pack Handler @type {Pack} */
document.jsge._pack =  null;