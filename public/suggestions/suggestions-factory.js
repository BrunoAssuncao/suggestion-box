angular.module('suggestionbox')
    .factory('Suggestion', function SuggestionFactory($resource, $http) {
        return {
            suggestions: $resource( '/suggestions/:id', {id: '@_id'}, {} ),
            states: function() {
                return $http.get('/suggestions/states');
            },
            getUsername: function() {
                return $http.get('/users/currentUser');
            },
            getAdmins: function() {
                return $http.get('/admins');
            }
        };
    });
