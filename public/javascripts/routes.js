angular.module('suggestionbox')
    .config(function($routeProvider){

        $routeProvider.when('/', {
            templateUrl: 'suggestions/list/main.html',
            controller: 'SuggestionsListController',
            controllerAs: 'suggestionsListCtrl'
        })
        .when('/suggestion/:id', {
            templateUrl: 'suggestions/detail/detail.html',
            controller: 'SuggestionDetailController',
            controllerAs: 'suggestionsDetailCtrl'
        })
        .when('/new', {
            templateUrl: 'suggestions/new/new.html',
            controller: 'NewSuggestionController',
            controllerAs: 'newCtrl'
        })
        .otherwise( { redirectTo: '/' } );
    });
