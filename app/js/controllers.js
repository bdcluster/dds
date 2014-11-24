(function(){
  'use strict';
  angular.module('DdsControllers', [
    'LoginModule', 'HomeModule', 'PasswordModule',
    'UserModule', 'RoleModule',  
    'RuleTmplModule', 'RuleModule', 'RuleDetailModule',
    'CustomerModule',
    'DriverModule',
    'OrderModule', 'OrderPeriodModule'
  ])
  .controller('GlobelController', [
    '$rootScope','$window','$location','AuthService','DDS','C',function(
     $rootScope,  $window,  $location,  AuthService,  DDS,  C){

    var storage = C.storage();
    angular.extend($rootScope, {
      version: 'ver 0.4',
      title: "代驾平台",
      isLogged: AuthService.isLogged || storage.get('isLogged'),
      loading: false,
      pagination: '/views/common/pagination.html',
      alerts: [],
      menus: storage.get('menus') || [],
      userId:storage.get('userId') || '',
      pageNum:1,
      maxPageSize : 8,
      recordsPerPage: 10,
      dateOptions: {
        showWeeks:false,
        startingDay:1
      },
      toggleCal: function(event){
        if(arguments[1]!==true){
          event.preventDefault();
          event.stopPropagation();
        }
      },
      isActivedMenu: function(viewLocation){
        return viewLocation === $location.path();
      },
      markOpen: function(no){
        storage.set('opendAccordion', no);
      },
      keepOpenAccordion: function(){
        var index = storage.get('opendAccordion');
        if(index !== null){
          this.menus[index].open = true;
        }
      },
      resetTitle: function(t){
        $rootScope.title = t + ' - 代驾平台';
      },
      signOut: function(){
        var self = this;
        var logout = DDS.signOut();

        logout.$promise.then(function(res){
          var data = C.validResponse(res);
          C.delayJump('/login');
        });
      }
    });
    $rootScope.keepOpenAccordion();
  }])
  /* modal controller */
  .controller('ModalController', [
    '$scope','$modalInstance','modalSet', function(
     $scope,  $modalInstance,  modalSet){
    angular.extend($scope, {
      alert:{show:false},
      modalTitle: modalSet.modalTitle,
      formData:modalSet.formData || {},
      extraData: modalSet.extraData || {},
      removeText: modalSet.removeText,
      confirm: function(){
        modalSet.confirm($modalInstance, this);
      },
      cancel: function(){
        $modalInstance.dismiss('cancel');
      }
    });
  }]);
})();