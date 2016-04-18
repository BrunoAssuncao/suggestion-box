angular.module('suggestionbox')

    .controller('SuggestionsListController', function($scope, Suggestion) {
        $scope.suggestions = Suggestion.query();

        $scope.hasSuggestions = function() {
            return $scope.suggestions.length > 0;
        }
    })

    .controller('SuggestionDetailController', function($scope, $routeParams, $timeout, Suggestion) {
        $scope.suggestion = Suggestion.get({id: $routeParams.id});

        $scope.votedUp = function() {
            return $scope.suggestion.$resolved && $scope.suggestion.likes.includes( $scope.suggestion.username );
        };
        $scope.votedDown = function() {
            return $scope.suggestion.$resolved && $scope.suggestion.dislikes.includes( $scope.suggestion.username );
        };
        $scope.unvoted = function() {
            return $scope.suggestion.$resolved && !$scope.votedUp() && !$scope.votedDown();
        }
    });
