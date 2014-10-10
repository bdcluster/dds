(function(){
  'use strict';
  // var templatePath = window.DEBUG ? 'views/' : 'dist/views/';
  var templatePath = 'views/';
  var app = angular.module('DdsControllers', [])
   /* 全局controller，不包括登录页面 */
  .controller('GlobelController', ['$scope', '$location', '$cookieStore', 'DDS', function($scope, $location, $cookieStore, DDS){
    angular.extend($scope, {
      alerts: [],
      navDrop:{
        isopen:false
      },
      closeAlert: function(index){
        this.alerts.splice(index, 1);
      },
      menuTemplate: templatePath + 'menu.html'
    });
    // 从DDS service获取菜单
    /*DDS.get({service: 'menus'}, function(res){
      angular.extend($scope, {
        menus: res.data.menudata,
        isActivedMenu: function(viewLocation){
          return viewLocation === $location.path();
        },
        markOpen: function(no){
          $cookieStore.put('opendAccordion', no);
        },
        keepOpenAccordion: function(){
          var index = $cookieStore.get('opendAccordion');
          if(index !== undefined){
            this.menus[index].open = true;
          }
        }
      });
      $scope.keepOpenAccordion();
    });*/
  }])
  /* 登 录 */
  .controller('LoginController', ['$scope', '$window', '$cookieStore', '$filter', 'C', 'DDS', function($scope, $window, $cookieStore, $filter, Common, DDS){
    Common.storage();
    angular.extend($scope, {
      user:{},
      loginForm: templatePath + 'form.login.html',
      checkLogin: function(){
        //  md5 for password
        $scope.user.password = $filter('md5')($scope.user.password);
        $scope.master = angular.copy($scope.user);
        DDS.login($scope.user, function(res){
          var data = Common.validResponse(res);
          $cookieStore.remove('opendAccordion');
          if(data){
            console.log($scope.user);
          }
          else{
            Common.alert($scope, {type:'danger', msg:'something error!'});
          }
        });
      },
      isUnchanged: function(user){
        return angular.equals(user, $scope.master);
      }
    });
  }])
  /* demo */
  .controller('HomeController', ['$scope', '$modal', 'C', function($scope, $modal, Common){
    angular.extend($scope, {
      maxSize : 10,
      totleRecords : 200,
      currentPage : 2,
      recordsPerPage: 20,
      changePage: function(){
      },
      modify: function(){
        Common.openModal({
          templateUrl: templatePath + 'modal.general.modify.html',
          resolve: {
            modalSet: function(){
              return {
                title: '名称', // modal 窗体标题
                confirm: function(modalInstance, scope){ // 确认modal callback
                  console.log(scope.formData); // collect form data
                  modalInstance.close(function(){ // close modal
                    Common.alert($scope, {type:'success', msg:'编辑成功！'});
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
        Common.openModal({
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