angular.module('suggestionbox')
    .factory('SuggestionStates', function SuggestionStateFactory($http) {
    })
    .factory('Suggestion', function SuggestionFactory($resource, $http) {
        return {
            suggestions: $resource( '/suggestions/:id', {}, {} ),
            states: function() {
                return $http.get('/suggestions/states');
            }
        };
    });
