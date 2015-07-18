/*globals angular*/
/**
 * Created by rgladson on 7/8/2015.
 * Just because the language is javascript, there is no excuse to write bad code!™
 */

(function (angular, namespace, undefined) {
  "use strict";
  function buildRegistry() {
    var callBackRegistry = [];
    return {
      register: registerCallback,
      exec: executeCallback,
      execSilent: executeSilentCallback,
      get length() {
        return callBackRegistry.length;
      }
    };

    function registerCallback(callbackFn) {
      callbackFn.push(callbackFn);
      return function deRegisterCallback() {
        var idx;
        if (~(idx = callBackRegistry.indexOf(callbackFn))) {
          callBackRegistry.splice(idx, 1);
        }
      };
    }

    function executeCallback(argument) {
      return callBackRegistry.map(
        function runCallback(cbf) {
          return cbf(argument);
        }
      );
    }

    function executeSilentCallback(argument) {
      callBackRegistry.forEach(
        function runCallback(cbf) {
          return cbf(argument);
        }
      );
    }

  }

  function pubSub (registrar) {
    var directory = Object.create(null);
    return {
      subscribe: subscribe,
      publish: publish
    };

    function subscribe(channel, callback) {
      if (!directory[channel]) {
        directory[channel] = registrar();
      }
      // Return the unsubscriber to the registration
      return directory[channel].register(callback);
    }

    function publish(channel, message) {
      if (directory[channel]) {
        directory[channel].execSilent(message);
      }
    }
  }

  namespace.buildRegistry = buildRegistry;
  namespace.pubSub = function () {
    return pubSub(buildRegistry);
  };

  if (angular) {
    angular.module('crazyLikeAFox').factory('registrar', [function () {
      return buildRegistry;
    }]).factory('publishSubscribe', ['registrar', pubSub]);
  }
})(window.angular, crazyLikeAFox);