/*globals angular*/
/**
 * Created by rgladson on 6/19/2015.
 * Just because the language is javascript, there is no excuse to write bad code!™
 */
(function (angular, namespace, undefined){
    'use strict';

    function __class__ (prototype, extend) {
        'use strict';
        var _prototype, prototypeDescriptor;
        if (typeof extend === "function") {
            prototypeDescriptor = {};
            Object.getOwnPropertyNames(prototype).forEach(function (key) {
                try {
                    prototypeDescriptor[key] = Object.getOwnPropertyDescriptor(prototype, key);
                } catch (e) {
                    if (e instanceof TypeError) {
                        prototypeDescriptor[key] = {
                            value: prototype[key],
                            configurable: true,
                            enumerable: true,
                            writable: true
                        };
                    } else {
                        throw e;
                    }
                }
            });
            // Define a way to invoke the ES6 Style 'super' code smell
            prototypeDescriptor['[[super]]'] = { value: extend };
            _prototype = Object.create(extend.prototype, prototypeDescriptor);
        } else {
            _prototype = prototype;
        }
        _prototype.constructor.prototype = _prototype;
        return _prototype.constructor;
    }

    namespace.__class__ = __class__;

    if (angular) {
        angular.module('crazyLikeAFox').value('__class__', __class__);
    }

})(window.angular, crazyLikeAFox);
