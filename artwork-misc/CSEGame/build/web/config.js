/**
 * @fileoverview Holds functions/classes that are configured on start up to 
 * ensure cross browser functionality.
 *
 * @author Andrew Huynh
 */

/** Days of the week @final @type {String[]}*/
var DayNames = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
            'Friday', 'Saturday');

/** Names of months @final @type {String[]} */
var MonthNames = new Array('January','February','March','April','May','June',
            'July', 'August', 'September', 'October', 'November', 'December');

//===============================================
// Ensure that decode/encodeURIComponent is available to use.
if(!encodeURIComponent) {
    encodeURIComponent = function(str){ return escape(str); };
    decodeURIComponent = function(str){ return unescape(str); };
};

/**
 * Adds a format method to the Date option.
 * @addon
 */
Date.prototype.format = function(f) {
    if (!this.valueOf()) return '&nbsp;';
    
    var d = this;

    return f.replace(/(yyyy|mmmm|mmm|mm|dddd|ddd|dd|hh|nn|ss|a\/p)/gi,
        function($1)
        {
            switch ($1.toLowerCase())
            {
                case 'yyyy': return d.getFullYear();
                case 'mmmm': return MonthNames[d.getMonth()];
                case 'mmm':  return MonthNames[d.getMonth()].substr(0, 3);
                case 'mm':   return (d.getMonth() + 1).zf(2);
                case 'dddd': return DayNames[d.getDay()];
                case 'ddd':  return DayNames[d.getDay()].substr(0, 3);
                case 'dd':   return d.getDate().zf(2);
                case 'hh':   return ((h = d.getHours() % 12) ? h : 12).zf(2);
                case 'nn':   return d.getMinutes().zf(2);
                case 'ss':   return d.getSeconds().zf(2);
                case 'a/p':  return d.getHours() < 12 ? 'a' : 'p';
            }
        }
    );
}

/**
 * Adds a trim function to the String object. Trims white space at the
 * beginning & end of the string
 * @addon
 */
String.prototype.trim = function() {
    a = this.replace(/^\s+/, '');
    return a.replace(/\s+$/, '');
};

/**
 * Easy-to-use random number generator
 * @param {int} start Lower bound of random number generator
 * @param {int} end Upper bound of random number generator
 */
function randInt(start, end) {
    return Math.floor(Math.random()*(end-start)) + start;
}
