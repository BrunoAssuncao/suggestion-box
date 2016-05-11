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

        console.log($scope);
        $scope.hasSuggestions = function() {
            return $scope.suggestions.length > 0;
        };
    })

    .controller('SuggestionDetailController', function($scope, $routeParams, $timeout, $http, Suggestion) {
        var suggestion = Suggestion.suggestions.get({id: $routeParams.id}, function() {
            $scope.suggestion = suggestion;
            $scope.username = suggestion.username;
            $scope.score = getSuggestionScore(suggestion);
            $scope.previousVote = suggestion.likes.includes( suggestion.username ) ? 'like' :
                                    (suggestion.dislikes.includes( suggestion.username ) ? 'dislike' : null);
            $scope.vote = $scope.previousVote;
        });

        $scope.proccessVote = function() {
            console.log($scope.vote);
            if($scope.vote !== $scope.previousVote) {
                var options = {
                    id: $scope.suggestion._id,
                    username: $scope.username,
                    vote: $scope.vote,
                    previousVote: $scope.previousVote
                };

                sendVote(options);
            }
        };

        function sendVote(options) {
            $http( {
                method:'POST',
                url: '/vote',
                data: options
            }).success(function(data){
                $scope.suggestion = data[0];
                $scope.score = getSuggestionScore($scope.suggestion);
                $scope.previousVote = $scope.vote;
            });
        }

        function getSuggestionScore(suggestion) {
            return suggestion.likes.length - suggestion.dislikes.length;
        }
    })

    .controller('NewSuggestionController', function(Suggestion) {
        this.suggestion = new Suggestion.suggestions();
        this.submitSuggestion = function() {
            this.suggestion.$save().then(function( suggestion ) {
                window.location = '#/suggestion/' + suggestion.id;
            });
        };
    });
