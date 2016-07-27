(function () {
  'use strict';
  
  angular
  .module('dealBuddy.services')
  .service('UserModel', UserModel);
  
  
  UserModel.$inject = ['$http', 'Backand', 'BackandDataService', 'LoginService'];
  
  
  function UserModel($http, Backand, BackandDataService, LoginService){

    function UserDetail(id, userName, userEmail){
      this.id =  id || 0,
      this.uname = userName,
      this.email = userEmail
    };
    
    var service = this;
    service.getLoggedInUserDetails =  getUserDetails; 
    service.addNewUser = addUser;
    
    function getUserDetails(){
      var objectName = 'user',
      userEmail = LoginService.getUserName(),
      sort,
      filter = [{"fieldName": "email",    "operator": "equals",    "value": userEmail}],
      exclude = 'metadata',
      pageNumber = 1,
      pageSize = 10;
      
      return BackandDataService.getList(objectName, sort, filter, exclude, pageNumber, pageSize)
      .then(function(response){        
        if(response.data.data.length > 0 && response.data.data[0]){
          var ele = response.data.data[0];
          if(ele.id){                     
            return new UserDetail(ele.id, ele.uname, ele.email);                                                  
          }
        }              
      });
    }
    
    
    function addUser(uname, email){
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/addUser',
        params: {
          parameters: {
            uname: uname,
            email: email
          }
        }
      });
    }
  
  }  
  
})();