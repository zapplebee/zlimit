/**
 * Throttle or limit calls to your functions. Especially useful in loops.
 * @example
 * var i = 0; 
 * while(i < 10){
 *   zLimit.limit('log', function(){console.log(i++)}, 5); 
 * }
 * // output:
 * //   0
 * //   1
 * //   3
 * //   3
 * //   4
 */
(function() {
  'use strict'
  var ZLimit = function() {
    var zLimit = this;
    var timeouts = {};
    var remainingCalls = {};
    /**
     * Run a function once, no matter how many time it is called.
     * @param {string} name - Identifier
     * @param {function} func - Function to be called once.
     * @returns {boolean} - If function was called, return true, else false
     * @example
     * var i = 0; 
     * while(i < 10){
     *   zLimit.once('log', function(){console.log(i++)}, 5); 
     * }
     * // output:
     * //   0
     */
    zLimit.once = function(name, func) {
      return zLimit.limit(name, func, 1);
    }
    /**
     * Throttle a named function.
     * @param {string} name - Identifier
     * @param {function} func - Function to be called once.
     * @param {number} interval - Rate limit in milliseconds.
     * @returns {boolean} - If function was called, return true, else false
     * @example
     * var i = 0; 
     * while(i < 10){
     *   zLimit.limit('log', function(){console.log(i++)}, 5); 
     * }
     * // output:
     * //   0
     * //   1
     * //   3
     * //   3
     * //   4
     */
    zLimit.throttle = function(name, func, interval) {
      if (!(name in timeouts)) {
        timeouts[name] = Date.now();
        func();
        return false;
      } else if (Date.now() >= (timeouts[name] + interval)) {
        func();
        timeouts[name] = Date.now();
        return true;
      }
    }
    /**
     * Run a named function a specified amount of times.
     * @param {string} name - Identifier
     * @param {function} func - Function to be called once.
     * @param {number} limit - Total limit of calls.
     * @returns {boolean} - If function was called, return true, else false
     * @example
     * var i = 0; 
     * while(i < 10){
     *   zLimit.limit('log', function(){console.log(i++)}, 5); 
     * }
     * // output:
     * //   0
     * //   1
     * //   3
     * //   3
     * //   4
     */
    zLimit.limit = function(name, func, limit) {
      if (!(name in remainingCalls)) {
        remainingCalls[name] = limit;
      }
      if (name in remainingCalls && remainingCalls[name] > 0) {
        func();
        remainingCalls[name]--;
        return true;
      } else {
        return false;
      }
    }
    /**
     * Clear limit on named a named function.
     * @param {string} name - Identifier
     * @returns {boolean} - If function was found, return true, else false
     * @example
     * var i = 0; 
     * while(i < 10){
     *   zLimit.limit('log', function(){console.log(i++)}, 5); 
     *   zLimit.clear('log'); 
     * }
     * // output:
     * //   0
     * //   1
     * //   3
     * //   3
     * //   4
     * //   5
     * //   6
     * //   7
     * //   8
     * //   9
     */
    zLimit.clear = function(name) {
      var reset = false;
      if (name in timeouts) {
        delete timeouts[name];
        reset = true;
      }
      if (name in remainingCalls) {
        delete remainingCalls[name];
        reset = true;
      }
      return reset;
    }
  }
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = new ZLimit();
  else window.zLimit = new ZLimit();
})();