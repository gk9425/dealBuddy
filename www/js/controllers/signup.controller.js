(function () {
  'use strict';
  
  angular
  .module('dealBuddy')
  .controller('SignUpController', SignUpController);
  
  SignUpController.$inject = ['Backand', '$state', '$rootScope', 'LoginService', 'UserModel'];
  
  function SignUpController(Backand, $state, $rootScope, LoginService, UserModel) {
    var vm = this;

    //variables
    vm.email = '';
    vm.firstName = '';
    vm.lastName = '';
    vm.password = '';
    vm.again = '';
    vm.error = '';
    
    // methods
    vm.signup = signup;
    vm.cancelSignUp = cancelSignUp;
    
    ////////////////
    
    function signup() {
      
      LoginService.signup(vm.firstName, vm.lastName, vm.email, vm.password, vm.again)
      .then(function (response) {
        
        // add user to local user table on success
        UserModel.addNewUser("'"+ vm.firstName + "'", "'"+ vm.email + "'")
        .then(function(response){    
          onLogin();          
          }, function(reason){
          onError(reason);
        });        
        }, function (reason) {
        onError(reason);
      });
    }
    
    function addUser(uname, email){
      return UserModel.addUser(uname, email);
    }
    
    function onLogin() {
      $rootScope.$broadcast('authorized');
      LoginService.setExpireStatus().then(function(response){
         $state.go('tab.home');
       });     
    }
    
    function onError(reason){
      vm.error = ''
      console.log('error', reason);
      if (reason.data.error_description !== undefined) {
        vm.error = reason.data.error_description;
      }
      else {
        vm.error = reason.data;
      }
    }
    
    function cancelSignUp(){
      vm.email = ''; 
      vm.password  = ''; 
      vm.firstName  = ''; 
      vm.lastName  = ''; 
      vm.password  = ''; 
      vm.again  = ''; 
      vm.error = '';
      $state.go('login');
    }
    
  }
})();