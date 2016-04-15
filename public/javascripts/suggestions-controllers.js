angular.module('suggestionbox')
    .controller('SuggestionsListController', function($scope, Suggestion) {
        $scope.suggestions = Suggestion.query();

        $scope.hasSuggestions = function() {
            return $scope.suggestions.length > 0;
        }
    })
    .controller('SuggestionDetailController', function($scope, $routeParams, Suggestion) {
        $scope.suggestion = Suggestion.get({id: $routeParams.id});
    });
