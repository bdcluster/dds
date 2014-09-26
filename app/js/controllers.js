(function(){
  'use strict';
  // var templatePath = window.DEBUG ? 'views/' : 'dist/views/';
  var templatePath = 'views/';
  var app = angular.module('DdsControllers', [])
   /* 全局controller，不包括登录页面 */
  .controller('GlobelController', ['DDS', '$location', '$cookieStore', function(DDS, $location, $cookieStore){
    var self = this;
    angular.extend(self, {
      menuTemplate: templatePath + 'menu.html'
    });
    // 从DDS service获取菜单
    DDS.get({service: 'menus'}, function(res){
      angular.extend(self, {
        menus: res.data.menudata,
        isActivedMenu: function(viewLocation){
          return viewLocation === $location.path();
        },
        // curAccordion: $cookieStore.get('opendAccordion'),
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
      self.keepOpenAccordion();
    });
    return self;
  }])
  /* 登 录 */
  .controller('LoginController', ['Common', '$window', function(Common, $window){
    var self = this;

    return angular.extend(self, {
      template: templatePath + 'form.login.html',
      checkLogin: function(){
        console.log($window.location='d.html');
      }
    });
  }])
  /* demo */
  .controller('HomeController', ['$modal', '$log', 'Common', function($modal, $log, Common){
    var self = this;

    return angular.extend(self, {
      maxSize : 10,
      totleRecords : 200,
      currentPage : 2,
      recordsPerPage: 20,
      changePage: function(){
        console.log(this.currentPage);
      },
      modify: function(){
        Common.openModal({
          templateUrl: templatePath + 'modal.general.modify.html',
          resolve: {
            modalSet: function(){
              return {
                title: '名称', // modal 窗体标题
                confirm: function(modalInstance){ // 确认modal callback
                  modalInstance.close(function(){
                    $log.info('close');
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
        modalSet.confirm($modalInstance);
      },
      cancel: function(){
        modalSet.cancel($modalInstance);
      }
    });
  }]);
})();