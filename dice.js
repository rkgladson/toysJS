/*globals angular*/
/**
 * Created by rgladson on 4/13/2015.
 * Just because the language is javascript, there is no excuse to write bad code!™
 */

(function (angular, crypto, namespace) {
    'use strict';

    var diceSet =
        (crypto && typeof crypto.getRandomValues === 'function') ?
        function modernRand(sides, dieNumber) {
            var maxRoll = Math.abs(dieNumber) || 1;
            var container = new Uint32Array(maxRoll * 4);
            var selection;
            // Produce an even distribution range for our own range
            var maxSize = Math.floor(4294967296 / sides) * sides;
            function throwOut(value) {
                return value < maxSize;
            }
            do {
                crypto.getRandomValues(container);
                // Adapt our container to ES5
                selection = Array.prototype.slice.call(container).filter(throwOut).slice(0, maxRoll);
                // Keep rolling if we keep getting bad sets;
            } while (selection.length < maxRoll);

            return selection.map(function applyDice(prng) {
                return Math.abs(prng % sides) + 1;
            });
        } :
        function dumbBrowser/*!*/(sides, dieNumber) {
            var set = [], curRoll = 0, maxRoll = Math.abs(dieNumber) || 1;
            for (; curRoll < maxRoll; curRoll += 1) {
                set.push(Math.floor(Math.random() * (sides - 1)) + 1);
            }
            return set;
        };

    function sum(prev, cur) {
        return prev + cur;
    }

    namespace.diceSet = diceSet;
    function roll(sides, rolls) {
        return diceSet(sides, rolls).map(sum);
    }
    namespace.roll = roll;

    if (angular) {
        angular.module('crazyLikeAFox').value('roll', roll).value('diceSet', diceSet);
    }

})(window.angular, window.crypto || window.msCrypto, crazyLikeAFox);

