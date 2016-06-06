angular.module('suggestionbox', ['ngRoute', 'ngResource', 'textAngular'])
    .controller('mainController', ['$scope', function($scope) {
        $scope.manageDashboard = function() {
            $scope.showDashboard = !$scope.showDashboard;
        };

        $scope.showDashboard = false;
    }]);
