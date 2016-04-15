angular.module('suggestionbox')
    .config(function($routeProvider){

        $routeProvider.when('/', {
            templateUrl: 'templates/main.html',
            controller: 'SuggestionsListController',
            controllerAs: 'suggestionsListCtrl'
        })
        .when('/suggestion/:id', {
            templateUrl: 'templates/detail.html',
            controller: 'SuggestionDetailController',
            controllerAs: 'suggestionsDetailCtrl'
        })
        .when('/new', {
            templateUrl: 'templates/new.html'
        })
        .otherwise( { redirectTo: '/' } );

    });