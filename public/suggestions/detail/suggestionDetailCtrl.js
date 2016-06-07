angular.module('suggestionbox')
    .controller('SuggestionDetailController', function($scope, $routeParams, $location, $timeout, $http, Suggestion) {
        $scope.deleteWarning = false;
        $scope.isUpdating = false;
        var suggestion = new Suggestion.suggestions.get({id: $routeParams.id}, function() {
            $scope.suggestion = suggestion;
            $scope.data = {};
            $scope.hasUpdates = $scope.suggestion.updates.length > 0;


            Suggestion.states().success( function(data) {
                $scope.states = data;
            })
            .then(Suggestion.getUsername().success( function(data) {
                $scope.username = data.slack.username;
                $scope.getVote($scope.suggestion);
                $scope.isAdmin = data.isAdmin;
            }));
        });

        $scope.proccessVote = function() {
            if($scope.suggestion.vote !== $scope.suggestion.previousVote) {
                $scope.saveSuggestion("vote");
            }
        };

        $scope.changeState = function() {
            $scope.saveSuggestion("state");
        };

        $scope.updateSuggestion = function() {
            $scope.suggestion.update.user = $scope.username;
            $scope.suggestion.update.date = new Date();
            $scope.isUpdating = false;
            $scope.saveSuggestion("update");

            $scope.hasUpdates = true;
        };

        $scope.saveSuggestion = function(action){
            $scope.suggestion.action = action;
            $scope.suggestion.$save({}, function(data, headers) {
                $scope.suggestion = data;
                $scope.getVote($scope.suggestion);
            }, function(data, headers) {
                console.log(data);
            });
        };

        $scope.deleteSuggestion = function() {
            $scope.suggestion.$delete();
            $scope.deleteWarning = false;
            $location.path('/');
        };

        $scope.getVote = function(suggestion) {
            $scope.suggestion.score = getSuggestionScore(suggestion);
            $scope.suggestion.previousVote = suggestion.likes.includes( $scope.username ) ? 'like' :
                                    (suggestion.dislikes.includes( $scope.username ) ? 'dislike' : null);

            $scope.suggestion.vote = $scope.suggestion.previousVote;

        };

        $scope.showDelete = function(show) {
            $scope.deleteWarning = show;
        };

        $scope.showUpdate = function(show) {
            $scope.isUpdating = show;
        };

        function getSuggestionScore(suggestion) {
            return suggestion.likes.length - suggestion.dislikes.length;
        }
    });
