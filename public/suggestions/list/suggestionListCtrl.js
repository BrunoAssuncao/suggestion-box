angular.module('suggestionbox')
    .controller('SuggestionsListController', function($scope, Suggestion) {
        var admins = [];
        $scope.suggestions = Suggestion.suggestions.query();
        $scope.states = [];
        $scope.username = "";

        Suggestion.states().success( function(data) {
            $scope.states = data;
        })
        .then(Suggestion.getUsername().success(function(data) {
            $scope.username = data;
        }) )
        .then(Suggestion.getAdmins().success( function(data) {
            $scope.isAdmin = data.indexOf($scope.username) > -1;
        }));

        $scope.hasSuggestions = function() {
            return $scope.suggestions.length > 0;
        };
    });
