angular.module('suggestionbox')
    .factory('Suggestion', function SuggestionFactory($resource) {
        return $resource( '/suggestions/:id', {}, {} );
    });
