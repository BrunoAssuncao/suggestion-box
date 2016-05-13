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
    })

    .controller('SuggestionDetailController', function($scope, $routeParams, $location, $timeout, $http, Suggestion) {
        $scope.deleteWarning = false;
        $scope.isUpdating = false;
        var suggestion = new Suggestion.suggestions.get({id: $routeParams.id}, function() {
            $scope.suggestion = suggestion;
            $scope.data = {};
            $scope.username = suggestion.username;
            $scope.getVote($scope.suggestion);
            $scope.hasUpdates = $scope.suggestion.updates.length > 0;

            Suggestion.states().success( function(data) {
                $scope.states = data;
            })
            .then(Suggestion.getAdmins().success( function(data) {
                $scope.isAdmin = data.indexOf($scope.username) > -1;
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
            $scope.suggestion.update.user = $scope.suggestion.username;
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

        $scope.test = function() {
            alert($scope.deleteWarning);
        };

        $scope.deleteSuggestion = function() {
            $scope.suggestion.$delete();
                $scope.deleteWarning = false;
                $location.path('/');
        };

        $scope.getVote = function(suggestion) {
            $scope.score = getSuggestionScore(suggestion);
            $scope.suggestion.previousVote = suggestion.likes.includes( suggestion.username ) ? 'like' :
                                    (suggestion.dislikes.includes( suggestion.username ) ? 'dislike' : null);
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


    })

    .controller('NewSuggestionController', function(Suggestion) {
        this.suggestion = new Suggestion.suggestions();
        this.submitSuggestion = function() {
            this.suggestion.$save().then(function( suggestion ) {
                window.location = '#/suggestion/' + suggestion.id;
            });
        };
    });
