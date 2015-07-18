/*globals angular*/
/**
 * Created by rgladson on 7/7/2015.
 * Just because the language is javascript, there is no excuse to write bad code!™
 */
(function (angular, undefined) {
  "use strict";
  angular.module('CrazyLikeAFox')
    .directive('clickOff', ['$document', '$parse', 'registrar',
    function ($document, $parse, registrar) {
      var onOffClick = registrar();

      $document.on('click', function consumeClose(event) {
        if (onOffClick.length) {
          onOffClick.execSilent(event);
        }
      });

    return {
      link: function (scope, elm, attr) {
        var clickOutside = $parse(attr.clickOff);
        var precondition = $parse(attr.clickOffWhen);
        var deconstructor;
        function onDocumentClick(event) {
          if (precondition(scope, {$event: event})) {
            scope.apply(function (scope) { clickOutside(scope, {$event: event}); });
          }
          event.stopPropagation();
        }

        function onElmClick(event) {
          event.stopPropagation();
        }

        elm.on('click', onElmClick);

        deconstructor = [
          onOffClick.register(onDocumentClick),
          scope.$on('$destroy', function () {
            deconstructor.forEach(function (fn) {fn(); });
            elm.off('click', onElmClick);
          })
        ];
      }
    };
  }]);
})(angular);