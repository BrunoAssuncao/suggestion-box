angular.module('suggestionbox')

    .controller('SuggestionsListController', function($scope, Suggestion) {
        $scope.suggestions = Suggestion.query();

        $scope.hasSuggestions = function() {
            return $scope.suggestions.length > 0;
        };
    })

    .controller('SuggestionDetailController', function($scope, $routeParams, $timeout, $http, Suggestion) {
        var suggestion = Suggestion.get({id: $routeParams.id}, function() {
            $scope.suggestion = suggestion;
            $scope.username = suggestion.username;
            $scope.score = getSuggestionScore(suggestion);
            $scope.previousVote = suggestion.likes.includes( suggestion.username ) ? 'like' :
                                    (suggestion.dislikes.includes( suggestion.username ) ? 'dislike' : null);
            $scope.vote = $scope.previousVote;
        });

        $scope.sendVote = function() {
            var options = {
                id: $scope.suggestion._id,
                username: $scope.username,
                vote: $scope.vote,
                previousVote: $scope.previousVote
            };

            proccessVote(options);
        };

        function proccessVote(options) {
            $http( {
                method:'POST',
                url: '/vote',
                data: options
            }).success(function(data){
                $scope.suggestion = data[0];
                $scope.score = getSuggestionScore($scope.suggestion);
            });
        }

        function getSuggestionScore(suggestion) {
            return suggestion.likes.length - suggestion.dislikes.length;
        }
    })

    .controller('NewSuggestionController', function(Suggestion) {
        this.suggestion = new Suggestion();
        this.submitSuggestion = function() {
            this.suggestion.$save().then(function( suggestion ) {
                window.location = '#/suggestion/' + suggestion.id;
            });
        };
    });
