(function() {
  'use strict';
  
  angular
  .module('dealBuddy')
  .controller('DealController', DealController);
  
  DealController.$inject = ['$ionicModal', '$ionicPopup', '$scope', 'DealService', 'dealList', 'LoginService', 'UserModel'];
  
  function DealController ($ionicModal, $ionicPopup, $scope, DealService, dealList, LoginService, UserModel ){
    var dc = this;
    dc.selectedDealId;
    dc.dealReq;    
    dc.createView = true;
    dc.followView = false;
    
    
    dc.classCreated = "ion-ios-compose";
    dc.classFollowing = "ion-ios-people-outline";
    dc.classActive = "ion-android-star";
    dc.classFinalized = "ion-ios-checkmark-outline";
    dc.classDeleted = "ion-ios-trash-outline";
    dc.classExpired = "ion-ios-time-outline";
    
    dc.dealsList = dealList;      
    dc.responseList;
    dc.error = '';
    
    dc.hasDeals = (dealList.length)?true:false;
    dc.hasCreatedDeals = (dealList.length)?true:false;
    dc.hasFollowedDeals = true;
    
    dc.minDate = getDate();
    
    
    //Home Tab methods
    dc.getDeals = getDeals;
    dc.showRequestPopUp =  showReq;
    dc.cancelRequestPopUp = hideReq;
    dc.saveBuddyRequest   = saveRequest;
    
    //Deals Tab methods
    
    // Created Deals
    dc.getUserCreatedDeals = getCreatedDeals;
    dc.confirmDealDelete   = confirmDealDelete;
    dc.showUpdateResponseStausPopUp =  showReviewResponseModal;
    dc.cancelUpdateResponseStausPopUp =  cancelReviewResponseModal;
    dc.confirmResponseStatusUpdate = confirmResponseStatusUpdate;
    dc.confirmDealFinalize  = confirmDealFinalize;
    
    // Follow Deals
    dc.getUserFollowedDeals = getFollowedDeals;
    dc.showViewResponsePopUp  = showViewResponseModal;
    dc.cancelViewResponsePopUp = cancelViewResponseModal;
    
    //create Deal
    dc.showCreateModal =   showBuddyCreateDealModal;
    dc.cancelCreateModal = closeBuddyCreateDealModal;
    dc.createDeal = createDeal;
    
    
    // Common
    dc.signOut = signOut;
    activate(); 
    
    
    // Model logic
    function activate() {
      $ionicModal.fromTemplateUrl(
      'templates/modal-buddy-createResponse.html',
      function (modal) {
        dc.buddyRequestModal = modal;
        }, {
        scope: $scope
      });
      
      $ionicModal.fromTemplateUrl(
      'templates/modal-new-deal.html',
      function (modal) {
        dc.buddyCreateDealModal = modal;
        }, {
        scope: $scope
      });
      
      $ionicModal.fromTemplateUrl(
      'templates/modal-buddy-viewResponses.html',
      function (modal) {
        dc.dealViewResponseModal = modal;
        }, {
        scope: $scope
      });
      
      $ionicModal.fromTemplateUrl(
      'templates/modal-buddy-reviewResponses.html',
      function (modal) {
        dc.dealReviewResponseModal = modal;
        }, {
        scope: $scope
      }); 
      
    }
    
    //Home Tab methods
    
    function getDeals(userId, dealStatus) {      
      DealService.getDeals(userId, dealStatus)
      .then(function (response) {                  
        dc.dealsList = response.data;
        dc.hasDeals = ( dc.dealsList.length)?true:false;                  
        }, function (error) {
        dc.error = error.error_description;
      });
    }
    
    
    function showReq(dealId){                
      dc.selectedDealId = dealId;
      dc.buddyRequestModal.show();
    }
    
    function hideReq() {
      dc.selectedDealId = '';
      dc.dealReq = '';
      dc.error = '';
      dc.buddyRequestModal.hide();
    }
    
    function saveRequest(dealId, requestDesc){ 
      
      UserModel.getLoggedInUserDetails()
      .then(function(response){       
        var userID = response.id;
        
        //check if deal has already expired
        DealService.verifyUpdate(dealId)
        .then(function(response){
          var isExpired = response.data[0].expired;
          if(isExpired){
            var alertPopup = $ionicPopup.alert({
              title: 'Error',
              template: 'The deal has expired.'
            });
            alertPopup.then(function(res) {
              LoginService.setExpireStatus()
              .then(function(response){
                getDeals(userID, 1);
                hideReq();      
              });
            });          
          }
          else{
            DealService.saveRequest(userID, dealId, "'"+requestDesc+"'", 2) 
            .then(function(response){
              getDeals(userID, 1);
              hideReq();            
              },function (error) {
              dc.error = error.error_description;
            });  
          }
        });
        
      });
    }
    
    //Deal Tab methods
    
    function getCreatedDeals(dealStatus){
      toggleGlyphicons('create', dealStatus);
      UserModel.getLoggedInUserDetails()
      .then(function(response){           
        var userID = response.id;
        DealService.getUserCreatedDeals(userID, "'" + dealStatus +"'")
        .then(function (response) {
          dc.dealsList = response.data;                  
          dc.hasCreatedDeals = (dc.dealsList.length)?true:false;
          }, function (error) {
          dc.error = error.error_description;
        });
      });
    } 
    
    
    function deleteDeal(dealId){
      DealService.deleteDeal(dealId)
      .then(function(response){
        getCreatedDeals('Active');
        },function (error) {
        dc.error = error.error_description;
      });
    }
    
    function confirmDealDelete(dealId){
      
      DealService.verifyUpdate(dealId)
      .then(function(response){
        var isExpired = response.data[0].expired;
        if(isExpired){
          var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: 'The deal has expired.'
          });
          alertPopup.then(function(res) {
            LoginService.setExpireStatus()
            .then(function(response){
              getCreatedDeals('Active');
            });
          });
        }
        else{
          var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Deal',
            template: 'Are you sure you want to delete this deal?'
          });
          
          confirmPopup.then(function(res) {
            if(res) {
              deleteDeal(dealId);
            } 
          });        
        }
        
      });
      
    }
    
    function showReviewResponseModal(dealId, dealCount){
      if(dealCount > 0){
        getDealResponses4Review(dealId);
        dc.dealReviewResponseModal.show();
      }    
    }
    
    function getDealResponses4Review(dealId){
      dc.responseList = '';   
      UserModel.getLoggedInUserDetails()
      .then(function(response){
        var userID = response.id;
        DealService.getDealResponses4Review(dealId, userID)
        .then(function(response){          
          dc.responseList = response.data;
          },function (error) {
          dc.error = error.error_description;
        });
      });
      
    }
    
    function cancelReviewResponseModal(){
      dc.responseList = '';
      dc.dealReviewResponseModal.hide();      
    }
    
    function confirmResponseStatusUpdate(dealId, responseId, responseStatusId){
      
      DealService.verifyUpdate(dealId)
      .then(function(response){
        var isExpired = response.data[0].expired;
        if(isExpired){
          var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: 'The deal has expired.'
          });
          alertPopup.then(function(res) {
            LoginService.setExpireStatus()
            .then(function(response){
              getCreatedDeals('Active');
              cancelReviewResponseModal();
            });
          });
        }
        else{
          var title = (responseStatusId === 1)? 'Accept Deal'
          : 'Reject Deal',
          template = (responseStatusId === 1)? 'Are you sure you want to accept this deal?'
          : 'Are you sure you want to reject this deal?';
          
          var confirmPopup = $ionicPopup.confirm({
            title: title,
            template: template
          });
          
          confirmPopup.then(function(res) {
            if(res) {
              updateResponseStatus(dealId, responseId, responseStatusId);         
            } 
          });
          
        }
      });
      
    }
    
    function updateResponseStatus(dealId, responseId, responseStatusId){
      //console.log(actionStatus);
      DealService.updateResponseStatus(responseId, responseStatusId)
      .then(function(response){        
        getDealResponses4Review(dealId);  
        cancelReviewResponseModal();             
        }, function (error) {
        dc.error = error.error_description;
      });
      
    }
    
    
    function getFollowedDeals(){
      toggleGlyphicons('follow');
      UserModel.getLoggedInUserDetails()
      .then(function(response){
        var userID = response.id;
        DealService.getUserFollowedDeals(userID)
        .then(function (response) {
          dc.dealsList = response.data;
          dc.hasFollowedDeals = (dc.dealsList.length)?true:false;
          },function (error) {
          dc.error = error.error_description;
        });
      });
    }
    
    function showViewResponseModal(dealId){
      getDealResponses(dealId);
      dc.dealViewResponseModal.show();
    }
    
    
    function cancelViewResponseModal(){
      dc.responseList = [];
      dc.dealViewResponseModal.hide();
    }
    
    function getDealResponses(dealId){
      //getDealResponses
      
      UserModel.getLoggedInUserDetails()
      .then(function(response){
        var userId = response.id;
        DealService.getDealResponses(dealId, userId)
        .then(function(response){
          dc.responseList = response.data;
          //console.log(dc.responseList);
          }, function (error) {
          dc.error = error.error_description;
        });
      });
      
    }
    
    function showBuddyCreateDealModal(){
      
      DealService.getShopList()
      .then(function(response){
        dc.shopList = response.data;        
        },function (error) {
        dc.error = error.error_description;
      });
      
      DealService.getDealTypes()
      .then(function(response){
        dc.dealTypes = response.data;        
        },function (error) {
        dc.error = error.error_description;
      });
      
      
      dc.buddyCreateDealModal.show();          
    }
    
    function closeBuddyCreateDealModal() {
      dc.error = '';
      dc.selectdCity = ''; 
      dc.selectType = ''; 
      dc.dealReq = '';
      dc.expireDate = '';
      
      dc.buddyCreateDealModal.hide();
    }
    
    function createDeal(shopId, dealtypeId, description, expiredate){
      
      //console.log(shopId +"  "+ dealtypeId +"  "+ description +"  "+ expiredate.toISOString());
      UserModel.getLoggedInUserDetails()
      .then(function(response){
        
        var userID = response.id;
        DealService.createDeal(shopId, dealtypeId, "'"+description+"'", userID, "'"+expiredate.toISOString()+"'")
        .then(function(response){
          DealService.getUserCreatedDeals(userID, "'Active'")
          .then(function (response) {
            dc.dealsList = response.data;
            closeBuddyCreateDealModal();
            }, function (error) {
            dc.error = error.error_description;
          });
          
        });                 
      });
    }
    
    
    function toggleGlyphicons(action, dealStatus){
      if(action === 'create'){
        dc.classCreated = "ion-ios-compose";
        dc.classFollowing = "ion-ios-people-outline";        
        dc.createView = true;
        dc.followView = false;
        
        dc.classActive = "ion-android-star-outline";
        dc.classFinalized = "ion-ios-checkmark-outline";
        dc.classDeleted = "ion-ios-trash-outline";
        dc.classExpired = "ion-ios-time-outline"; 
        
        switch(dealStatus){
          
          case 'Active':
          dc.classActive = "ion-android-star";          
          
          break;
          case 'Expired':             
          dc.classExpired = "ion-ios-time";          
          
          break;
          case 'Finalized':            
          dc.classFinalized = "ion-ios-checkmark";            
          
          break;
          case 'Deleted':            
          dc.classDeleted = "ion-ios-trash";           
          
          break;
          default:
          break;
        }
        
      }
      if(action === 'follow'){
        dc.classCreated = "ion-ios-compose-outline";
        dc.classFollowing = "ion-ios-people";        
        dc.createView = false;
        dc.followView = true;        
      }
      dc.dealsList = [];
    }
    
    function getDate(){
      var date = new Date();
      return date.toISOString();
    }
    
    function confirmDealFinalize(dealId){
      
      DealService.verifyUpdate(dealId)
      .then(function(response){
        var isExpired = response.data[0].expired;
        if(isExpired){
          var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: 'The deal has expired.'
          });
          alertPopup.then(function(res) {
            LoginService.setExpireStatus()
            .then(function(response){
              getCreatedDeals('Active');
            });
          });
        }
        else{
          DealService.verifyFinalize(dealId)
          .then(function(response){
            var hasAcceptedResponse =  (response.data.length>0) ? true : false;
            if(hasAcceptedResponse){
              var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm deal finalize',
                template: 'Are you sure you want to finalize the deal?'
              });
              
              confirmPopup.then(function(res) {
                if(res) {
                  DealService.finalizeDeal(dealId)
                  .then(function(response){
                    getCreatedDeals('Active');
                  });
                } 
              });
              
            }
            else{
              
              var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'At least one accepted response required to finalize a deal.'
              });         
            }
            }, function (error) {
            dc.error = error.error_description;
          });
          
        }
      });
    }
    
    function signOut(){
      dc.dealsList = [];
      dc.responseList = '';  
      LoginService.signout();
    }
    
    $scope.$on('$destroy', function () {
      dc.buddyRequestModal.remove();
      dc.buddyCreateDealModal.remove();
      dc.dealViewResponseModal.remove();
      dc.dealReviewResponseModal.remove();
    });    
  } 
})();