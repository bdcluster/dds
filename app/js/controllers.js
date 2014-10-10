(function(){
  'use strict';
  // var templatePath = window.DEBUG ? 'views/' : 'dist/views/';
  var templatePath = 'views/';
  var app = angular.module('DdsControllers', [])
   /* 全局controller，不包括登录页面 */
  .controller('GlobelController', ['$scope', '$location', 'C', 'DDS', function($scope, $location, C, DDS){
    var storage = C.storage();
    if(!storage.get("loginInfo") && $location.path()){
      console.log($location.path())
      C.back2Login();
    }
    angular.extend($scope, {
      alerts: [],
      loginInfo: storage.get('loginInfo'),
      navDrop:{
        isopen:false
      },
      menuTemplate: templatePath + 'menu.html',
      closeAlert: function(index){
        this.alerts.splice(index, 1);
      },
      signOut: function(){
        storage.remove('loginInfo');
        C.back2Login();
      }
    });
    // 从DDS service获取菜单
    DDS.get({endpoint:'user', action:'menus'}, function(res){
      var data = C.validResponse(res);
      angular.extend($scope, {
        menus: data,
        isActivedMenu: function(viewLocation){
          return viewLocation === $location.path();
        },
        markOpen: function(no){
          storage.set('opendAccordion', no);
        },
        keepOpenAccordion: function(){
          var index = storage.get('opendAccordion');
          if(index){
            this.menus[index].open = true;
          }
        }
      });
      $scope.keepOpenAccordion();
    });
  }])
  /* 登 录 */
  .controller('LoginController', ['$scope', '$window', '$filter', 'C', 'DDS', function($scope, $window, $filter, C, DDS){
    var storage = C.storage();
    angular.extend($scope, {
      user:{},
      loginForm: templatePath + 'form.login.html',
      checkLogin: function(){
        //  md5 for password
        $scope.user.password = $filter('md5')($scope.user.password);
        $scope.master = angular.copy($scope.user);
        DDS.login($scope.user, function(res){
          var data = C.validResponse(res);
          storage.remove('opendAccordion');
          if(data){
            storage.set('loginInfo', data.user);
            $window.location="d.html";
          }
          else{
            C.alert($scope, {type:'danger', msg:'something error!'});
          }
        });
      },
      isUnchanged: function(user){
        return angular.equals(user, $scope.master);
      }
    });
  }])
  /* change password */
  .controller('ChangePasswordController', ['$scope', function($scope){
    angular.extend($scope, {

    });
  }])
  /* demo */
  .controller('HomeController', ['$scope', '$modal', 'C', function($scope, $modal, C){
    angular.extend($scope, {
      maxSize : 10,
      totleRecords : 200,
      currentPage : 2,
      recordsPerPage: 20,
      changePage: function(){
      },
      modify: function(){
        C.openModal({
          templateUrl: templatePath + 'modal.general.modify.html',
          resolve: {
            modalSet: function(){
              return {
                title: '名称', // modal 窗体标题
                confirm: function(modalInstance, scope){ // 确认modal callback
                  console.log(scope.formData); // collect form data
                  modalInstance.close(function(){ // close modal
                    C.alert($scope, {type:'success', msg:'编辑成功！'});
                  });
                },
                cancel: function(modalInstance){ // 取消modal 默认没有callback
                  modalInstance.dismiss('dismiss');
                }
              };
            }
          }
        });
      },
      remove: function(){
        C.openModal({
          templateUrl: templatePath + 'modal.general.remove.html',
          size: 'sm',
          resolve:{
            modalSet: function(){
              return {
                removeText: '确定要删除这条记录？', // modal 删除提示语
                confirm: function(modalInstance){ // 确认modal callback
                  modalInstance.close(function(){
                    // $log.info('remove');
                  });
                },
                cancel: function(modalInstance){ // 取消modal 默认没有callback
                  modalInstance.dismiss('dismiss');
                }
              };
            }
          }
        });
      }
    });
  }])
  /* normal modal */
  .controller('ModalController', ['$scope', '$modalInstance', 'modalSet', function($scope, $modalInstance, modalSet){
    angular.extend($scope, {
      modalTitle: modalSet.title,
      formData:{},
      removeText: modalSet.removeText,
      confirm: function(){
        modalSet.confirm($modalInstance, this);
      },
      cancel: function(){
        modalSet.cancel($modalInstance);
      }
    });
  }]);
})();