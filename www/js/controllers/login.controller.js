(function () {
	'use strict';
	
	angular
	.module('dealBuddy')
	.controller('LoginController', LoginController);
	
	LoginController.$inject = ['Backand', '$state', '$rootScope', 'LoginService'];
	function LoginController(Backand, $state, $rootScope, LoginService) {

		var login = this;
		login.error = '';
		login.signin = signin;
		login.signout = signout;
		login.anonymousLogin = anonymousLogin;
		login.socialSignup = socialSignUp;
		login.socialSignin = socialSignIn;
		login.navigateToRegister = navigateToRegister;
				
		////////////////
		
		function anonymousLogin() {
			LoginService.anonymousLogin();
			onLogin();			
		}
		
		function signin() {      
			LoginService.signin(login.email, login.password)
			.then(onValidLogin, onError)
		}
		
		function socialSignIn(provider) {
			LoginService.socialSignIn(provider)
			.then(onValidLogin, onError);			
		}
		
		function socialSignUp(provider) {
			LoginService.socialSignUp(provider)
			.then(onValidLogin, onError);
			
		}
		
        function onValidLogin(response) {
			//onLogin();
			//console.log(response);
			$rootScope.$broadcast('authorized');
			LoginService.setExpireStatus()
			.then(function(response){
				$state.go('tab.home');
			})					
		}	
		
		function onError(rejection) {
			login.error = rejection.error_description;
			$rootScope.$broadcast('logout');
		}
		
		function signout() {
			LoginService.signout()
			.then(function (response) {
				$rootScope.$broadcast('logout');		
				$state.go('login');
			});			
		}
		
		function navigateToRegister(){
			$state.go('signup');
		}	
	}
})();