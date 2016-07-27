(function () {
  'use strict';
  
  angular
  .module('dealBuddy.services')
  .factory('DealService', DealService);
  
  
  DealService.$inject = ['$http', 'Backand'];
  
  function DealService($http ,Backand){
    var service = {
      
      createDeal : createDeal,
      deleteDeal : deleteDeal,
      saveRequest : saveReq,
      updateResponseStatus : updateResponseStatus,
      
      getShopList : getShops,
      getDealTypes : getDealType,      
      getDeals : getDeals,             
      getUserCreatedDeals : getCreatedDeals,
      getUserFollowedDeals : getFollowedDeals,           
      getDealResponses : getDealResponses,
      getDealResponses4Review : getDealResponses4Review,
      verifyFinalize : verifyDeal4Finalize,
      finalizeDeal : setDealFinalized,
      verifyUpdate : verifyDeal4Update     
    };
    
    return service;
    
    ////////////////////
    function getDeals(userId, dealStatus){
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getDeals',
        params: {
          parameters: {
            userId: userId,
            dealStatus: dealStatus
          }
        }
      });
    }
    
    function getCreatedDeals(userId, dealStatus){
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getCreatedDeals',
        params: {
          parameters: {
            userId: userId,
            dealStatus: dealStatus
          }
        }
      });
    }
    
    function getFollowedDeals(userId){      
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getFollowingDeals',
        params: {
          parameters: {
            userId: userId
          }
        }
      });        
    }
    
    function saveReq(userId, dealId, comment, responseStatusId){
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/saveBuddyRequest',
        params: {
          parameters: {
            userId: userId,
            dealId: dealId,
            comment: comment,
            responseStatusId: responseStatusId
          }
        }
      });
    }
    
    function getShops(){
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getShops',
        params: {
          parameters: {}
        }
      });     
    }
    
    function getDealType(){
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getDealtypes',
        params: {
          parameters: {}
        }
      });     
    }
    
    function createDeal(shopId, dealtypeId, description, userId, expiredate){
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/createDeal',
        params: {
          parameters: {
            shopId: shopId,
            dealtypeId: dealtypeId,
            description: description,
            userId: userId,
            expiredate: expiredate
          }
        }
      });      
    }
    
    function getDealResponses(dealId, userId){
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getDealResponses',
        params: {
          parameters: {
            dealId: dealId,
            userId: userId
          }
        }
      });
    }
    
    function getDealResponses4Review(dealId, userId){      
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getDealResponses4Review',
        params: {
          parameters: {
            dealId: dealId,
            userId: userId
          }
        }
      });
    }
    
    function updateResponseStatus(responseId, responseStatusId){      
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/updateDealResponseStatus',
        params: {
          parameters: {
            responseId: responseId,
            responseStatusId: responseStatusId
          }
        }
      });
    }
    
    function deleteDeal(dealID){
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/deleteDeal',
        params: {
          parameters: {
            dealId: dealID
          }
        }
      });      
    }
    
    function verifyDeal4Finalize(dealId){
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/preFinalizeValidate',
        params: {
          parameters: {
            dealId: dealId
          }
        }
      });
    }  
    
    function setDealFinalized(dealId){
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/finalizeDeal',
        params: {
          parameters: {
            dealId: dealId
          }
        }
      });
    }
    
    function verifyDeal4Update(dealId){
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/preDealUpdateCheck',
        params: {
          parameters: {
            dealId: dealId
          }
        }
      });
    }  
  }
  
})();
