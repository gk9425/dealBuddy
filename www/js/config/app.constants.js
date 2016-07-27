// File use backand tokens for interaction with the database.
(function () {
  angular.module('dealBuddy.config.constants', [])
    .constant('CONSTS', {
      anonymousToken: 'bfd0c714-d02d-4dc8-beee-6d46f312eec8',
      signUpToken: '55ed87f3-c886-4ef5-a9dc-48775b7c9781',
      appName: 'dealbuddy'
    })
    .constant('$ionicLoadingConfig', {
      template: '<ion-spinner></ion-spinner>'
    })
})();