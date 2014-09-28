(function(){
  'use strict';
  // var templatePath = window.DEBUG ? 'views/' : 'dist/views/';
  var templatePath = 'views/';
  var app = angular.module('DdsControllers', [])
   /* 全局controller，不包括登录页面 */
  .controller('GlobelController', ['$scope', '$location', '$cookieStore', 'DDS', function($scope, $location, $cookieStore, DDS){
    angular.extend($scope, {
      alerts: [],
      closeAlert: function(index){
        this.alerts.splice(index, 1);
      },
      showAlert: function(index){
        this.alerts[index].show=true;
      },
      menuTemplate: templatePath + 'menu.html'
    });
    // 从DDS service获取菜单
    DDS.get({service: 'menus'}, function(res){
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
    });
  }])
  /* 登 录 */
  .controller('LoginController', ['$scope', '$window', '$cookieStore', 'Common', 'md5', function($scope, $window, $cookieStore, Common, md5){
    angular.extend($scope, {
      loginForm: templatePath + 'form.login.html',
      checkLogin: function(){
        $cookieStore.remove('opendAccordion');
        console.log($window.location='d.html');
      }
    });
    Common.alert($scope, {type:'danger', msg:'error!', show:true});
  }])
  /* demo */
  .controller('HomeController', ['$scope', '$modal', 'Common', function($scope, $modal, Common){
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
                    $log.info('remove');
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