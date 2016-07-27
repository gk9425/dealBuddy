angular
.module('dealBuddy')
.config(config);


config.$inject = ['BackandProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', 'CONSTS'];

function config(BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider, CONSTS) {
  
  // Setup Backand Provider
  BackandProvider.setAnonymousToken(CONSTS.anonymousToken);
  BackandProvider.setSignUpToken(CONSTS.signUpToken);
  BackandProvider.setAppName(CONSTS.appName);
  
  // Setup interceptors for $http calls to provide global functions for request/response
  $httpProvider.interceptors.push('APIInterceptor');
  
  // Using otherwise this way, is need for auth redirects if not logged in
  $urlRouterProvider.otherwise(function ($injector) {
    var $state = $injector.get("$state");
    $state.go("login");
  });
  
  // Setup Routing.  
  
  $stateProvider
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  
  .state('tab.home', {
    url : '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller : 'DealController as dc',
        resolve: {
          /* @ngInject */
          dealList : function (DealService, UserModel) {            
            return UserModel.getLoggedInUserDetails().then(function(response){
              return DealService.getDeals(response.id, '1')
              .then(function(response){
                return response.data;
              });
            });               
          }
          
        }
      }
    }
  })
  
  .state('tab.deals', {
    url : '/deals',
    views: {
      'tab-deals': {
        templateUrl: 'templates/tab-deals.html',
        controller: 'DealController as dc',
        resolve: {
          /* @ngInject */
          dealList : function (DealService, UserModel) {             
            return UserModel.getLoggedInUserDetails().then(function(response){
              return DealService.getUserCreatedDeals(response.id, "'Active'").then(function(response){
                return response.data;
              });
            });               
          }
        }
      }
    }
  })
  
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginController as login'
  })
  
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignUpController as signup'
  })
  
  .state('tab.about', {
    url : '/about',
    views: {
      'tab-about': {
        templateUrl: 'templates/tab-about.html',
        controller: 'LoginController as login'
      }
    }
  });
  
}