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
      showPagination:false,
      pageNo:1,
      maxPageSize : 8,
      recordsPerPage: 10,
      menuTemplate: templatePath + 'menu.html',
      closeAlert: function(index){
        this.alerts.splice(index, 1);
      },
      signOut: function(){
        DDS.signOut({a:1,b:2}, function(res){
          var data = C.validResponse(res);
          if(data){
            storage.remove('loginInfo');
            C.back2Login();
          }
        });
      },
    });
    // 从DDS service获取菜单
    if(storage.get("loginInfo")){
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
            if(index !== null){
              this.menus[index].open = true;
            }
          }
        });
        $scope.keepOpenAccordion();
      });
    }
  }])
  /* 登 录 */
  .controller('LoginController', ['$scope', '$window', '$filter', 'C', 'DDS', function($scope, $window, $filter, C, DDS){
    var storage = C.storage();
    angular.extend($scope, {
      user:{},
      loginForm: templatePath + 'form.login.html',
      checkLogin: function(){
        //  md5 for password
          console.log($scope.user)
        $scope.user.password = $filter('md5')($scope.user.password);
        $scope.master = angular.copy($scope.user);
        DDS.login($scope.user, function(res){
          var data = C.validResponse(res);
          storage.remove('opendAccordion');
          if(data){
            storage.set('loginInfo', angular.extend(data.user, {sessionId: data.sessionId}));
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
  /* 修改密码 */
  .controller('ChangePasswordController', ['$scope','C','DDS' , function($scope, C, DDS){
    var storage = C.storage().get('loginInfo');
    $scope.pwd = {};
    $scope.pwdSubmit = function(){
      var postData = {    
        userId: storage.userId,
        sessionId : storage.sessionId,
        user: { 
          id: storage.id,
          oldPassword: $scope.pwd.oldPwd,
          newPassword: $scope.pwd.newPwd
        } 
      };
      $scope.master = angular.copy($scope.pwd);
      DDS.savePwd(postData, function(res){
        var data = C.validResponse(res);
        if(data && data.exit === true){
          C.alert($scope, {type:"success", msg:"password change success!"});
          C.back2Home(true);
        }
        else{
          C.alert($scope, {type:"danger", msg:"password change error!"});
        }
      })
    };
    $scope.isUnchanged = function(pwd){
      return (angular.equals(pwd, $scope.master) || pwd.newPwd !== pwd.rpNewPwd);
    }
  }])
  /* 用户管理 */
  .controller('UserController', ['$scope','DDS', 'C', function($scope, DDS, C){
    var userParams = {endpoint:'user', action:'select'};
    $scope.changePage = function(){
      var options = angular.extend(userParams, {pageNo:$scope.pageNo})
      C.list($scope, DDS, options);
    }
    $scope.changePage(); // default: load pageNo:1

    $scope.saveUser = function(user){
      var params={pageNo:$scope.pageNo}, userInfo = angular.extend({},user);
      if(user){
        angular.extend(params, {action:'edit', id:userInfo.id});
      }
      else{
        angular.extend(params, {action:'add'});
      }
      DDS.get({endpoint:"role", action:'select'}).$promise.then(function(res){
        var roles = res.data.roles;
        var modalOptions = {
          title: '用户信息', // modal 窗体标题
          extraData: roles,
          formData: userInfo || {},
          confirm: function(modalInstance, scope){ // 确认modal callback
            delete scope.formData.role;
            DDS.saveUser(angular.extend(params, scope.formData), function(res){
              var data = C.validResponse(res);
              if(data){
                modalInstance.close(function(){ // close modal
                  angular.extend($scope, data);
                  C.alert($scope, {type:'success', msg:data.message});
                });
              }
            });
          },
          cancel: function(modalInstance){ // 取消modal 默认没有callback
            modalInstance.dismiss();
          }
        }

        C.openModal({
          templateUrl: templatePath + 'modal.user.html',
          resolve:{ 
            modalSet: function(){ return modalOptions } 
          }
        });
      })
    }
    $scope.remove = function(id){
      var modalOptions = {
        removeText: '确定要删除这条记录？', // modal 删除提示语
        confirm: function(modalInstance){ // 确认modal callback
          DDS.delUser({pageNo:$scope.pageNo, id: id}, function(res){
            var data = C.validResponse(res);
            if(data){
              modalInstance.close(function(){
                angular.extend($scope, data);
                C.alert($scope, {type:'danger', msg:data.message});
              });
            }
          });
        },
        cancel: function(modalInstance){ // 取消modal 默认没有callback
          modalInstance.dismiss('dismiss');
        }
      };
      C.openModal({
        templateUrl: templatePath + 'modal.general.remove.html',
        size: 'sm',
        resolve:{
          modalSet: function(){ return modalOptions }
        }
      });
    }
  }])
  /* 角色管理 */
  .controller('RoleController', ['$scope', '$modal', 'C', function($scope, $modal, C){

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
                    C.alert($scope, {type:'danger', msg:'OK!'});
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
      formData:modalSet.formData || {},
      extraData: modalSet.extraData || {},
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