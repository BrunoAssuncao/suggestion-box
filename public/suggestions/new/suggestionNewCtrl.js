angular.module('suggestionbox')
    .controller('NewSuggestionController', function(Suggestion) {
        this.suggestion = new Suggestion.suggestions();
        this.submitSuggestion = function() {
            this.suggestion.$save().then(function( suggestion ) {
                window.location = '#/suggestion/' + suggestion._id;
            });
        };
    });
