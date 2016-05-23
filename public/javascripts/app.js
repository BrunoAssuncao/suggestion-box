angular.module('suggestionbox', ['ngRoute', 'ngResource', 'textAngular'])
    .controller('mainController', ['$scope', function($scope) {
        $scope.manageDashboard = function() {
            $scope.showDashboard = !$scope.showDashboard;
        };

        $scope.showDashboard = false;
    }]);


/* UTILS BELOW */

if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1]) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {k = 0;}
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                return true;
            }
            k++;
        }
        return false;
    };
}
