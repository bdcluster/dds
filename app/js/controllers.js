(function(){
  'use strict';
  angular.module('DdsControllers', [
    'LoginModule', 'HomeModule', 'UserModule'
  ])
  .controller('GlobelController', [
    '$rootScope','$window','$location','AuthService','DDS','C',function(
     $rootScope,  $window,  $location,  AuthService,  DDS,  C){

    var storage = C.storage();
    angular.extend($rootScope, {
      version: 'ver 0.3',
      isLogged: AuthService.isLogged || storage.get('isLogged'),
      alerts: [],
      menus: storage.get('menus') || [],
      userId:storage.get('userId') || [],
      pageNum:1,
      maxPageSize : 8,
      recordsPerPage: 2,
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
      signOut: function(){
        var self = this;
        var logout = DDS.get({endpoint:'logout'});

        logout.$promise.then(function(res){
          var data = C.validResponse(res);
          if(angular.isObject(data)){
            AuthService.isLogged = false;
            storage.clear();
            $rootScope.menus = [];
            $rootScope.isLogged = false;
            $location.path('/login');
          }
        }, C.badResponse);
      }
    });
    $rootScope.keepOpenAccordion();
  }])
  /* normal modal */
  .controller('ModalController', ['$scope', '$modalInstance', 'modalSet', function($scope, $modalInstance, modalSet){
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
        // modalSet.cancel($modalInstance);
        $modalInstance.dismiss('cancel');
      },
      selCity:function(){
        modalSet.selCity(this);
      }
    });
  }]);
})();