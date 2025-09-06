/*******************************************************************************
 * Polyfills Module
 * 
 * Provides JavaScript polyfills for functions that may not be available in
 * the InDesign ExtendScript environment.
 * 
 * Includes:
 * - String.prototype.padStart
 * - String.prototype.repeat
 * - Array.prototype.includes
 * - Date.prototype extensions
 *******************************************************************************/

// Add polyfill for String.prototype.padStart if it doesn't exist
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; // truncate if number, or convert non-number to 0
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (this.length >= targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(Math.ceil(targetLength / padString.length));
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

// Add polyfill for String.prototype.repeat if it doesn't exist
if (!String.prototype.repeat) {
    String.prototype.repeat = function(count) {
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to object');
        }
        var str = '' + this;
        count = +count;
        if (count != count) {
            count = 0;
        }
        if (count < 0) {
            throw new RangeError('repeat count must be non-negative');
        }
        if (count == Infinity) {
            throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) {
            return '';
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the
        // main part. But anyway, most current (August 2014) browsers can't handle
        // strings 1 << 28 chars or longer, so:
        if (str.length * count >= 1 << 28) {
            throw new RangeError('repeat count must not overflow maximum string size');
        }
        var result = '';
        for (;;) {
            if ((count & 1) == 1) {
                result += str;
            }
            count >>>= 1;
            if (count == 0) {
                break;
            }
            str += str;
        }
        return result;
    };
}

// Add polyfill for Array.prototype.includes if it doesn't exist
if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement, fromIndex) {
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }
        
        // 1. Let O be ? ToObject(this value).
        var o = Object(this);
        
        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;
        
        // 3. If len is 0, return false.
        if (len === 0) {
            return false;
        }
        
        // 4. Let n be ? ToInteger(fromIndex).
        var n = fromIndex | 0;
        
        // 5. If n ≥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.
        var k = Math.max(n >= 0 ? n : len + n, 0);
        
        function sameValueZero(x, y) {
            return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }
        
        // 7. Repeat, while k < len
        while (k < len) {
            // a. Let elementK be the result of ? Get(O, ! ToString(k)).
            // b. If SameValueZero(searchElement, elementK) is true, return true.
            if (sameValueZero(o[k], searchElement)) {
                return true;
            }
            // c. Increase k by 1.
            k++;
        }
        
        // 8. Return false
        return false;
    };
}

// Add helper for date formatting if not available
if (!Date.prototype.toLocaleDateString) {
    Date.prototype.toLocaleDateString = function() {
        return (this.getMonth() + 1) + "/" + this.getDate() + "/" + this.getFullYear();
    };
}

// Add helper for date component extraction if not available
if (!Date.prototype.getWeekOfYear) {
    Date.prototype.getWeekOfYear = function() {
        var d = new Date(this);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    };
}

// Helper to check if a date is on a weekend
if (!Date.prototype.isWeekend) {
    Date.prototype.isWeekend = function() {
        var day = this.getDay();
        return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
    };
}