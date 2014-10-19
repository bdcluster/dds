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
      pageNo:1,
      maxPageSize : 8,
      recordsPerPage: 10,
      menuTemplate: templatePath + 'menu.html',
      closeAlert: function(index){
        this.alerts.splice(index, 1);
      },
      signOut: function(){
        DDS.signOut(function(res){
          var data = C.validResponse(res);
          if(data){
            storage.clear();
            C.back2Login();
          }
        });
      }
    });
    // 从localstorage获取菜单数据
    if(storage.get("loginInfo")){
      angular.extend($scope, {
        menus: storage.get('menus'),
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
      //缓存角色与省市数据
      C.cacheData(DDS, {endpoint:'role', action:'select'});
      C.cacheData(DDS, {endpoint:'place', action:'select'});
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
        $scope.user.password = $filter('md5')($scope.user.password);
        $scope.master = angular.copy($scope.user);
        DDS.login($scope.user, function(res){
          var data = C.validResponse(res);
          storage.clear();
          if(typeof data!=='string'){
            //缓存登录信息
            storage.set('loginInfo', angular.extend(data.user, {sessionId: data.sessionId}));
            //缓存
            DDS.get({endpoint:'user', action:'menus'}, function(result){
              storage.set('menus', result.data);
              $window.location='d.html';
            });
           
          }
          else{
            C.alert($scope, {type:'danger', msg:data});
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
    var storage = C.storage();
    $scope.changePage = function(){
      C.list($scope, DDS, {
        endpoint:'user', action:'select',
        pageNo:$scope.pageNo
      });
    }
    $scope.changePage(); // default: load pageNo:1

    $scope.saveUser = function(user){
      var params={pageNo:$scope.pageNo};
      if(user){
        var userInfo = angular.extend({},user);
        angular.extend(params, {action:'edit', id:userInfo.id});
      }
      else{
        angular.extend(params, {action:'add'});
      }
      var modalSet = {
        modalTitle: '用户信息', // modal 窗体标题
        extraData: storage.get('role').roles,
        formData: userInfo || {},
        confirm: function(modalInstance, scope){ // 确认modal callback
          delete scope.formData.role;
          DDS.saveUser(angular.extend(params, scope.formData), function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          });
        }
        // ,cancel: C.cancelModal
      }
      C.openModal(modalSet, 'user');
    }
    $scope.remove = function(id){
      var modalSet = {
        removeText: '确定要删除这条用户记录？', // modal 删除提示语
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.delUser({pageNo:$scope.pageNo, id: id}, function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          });
        }
        // ,cancel: C.cancelModal
      };
      C.openModal(modalSet);
    }
  }])
  /* 角色管理 */
  .controller('RoleController', ['$scope', 'DDS', 'C', function($scope, DDS, C){
    $scope.changePage = function(){
      C.list($scope, DDS, {
        endpoint:'role', action:'select',
        pageNo:$scope.pageNo
      });
    }
    $scope.changePage(); // default: load pageNo:1

    $scope.saveRole = function(role){
      var params={pageNo:$scope.pageNo};
      if(role){
        var roleInfo = angular.extend({},role);
        angular.extend(params, {action:'edit', id:roleInfo.id});
      }
      else{
        angular.extend(params, {action:'add'});
      }
      var modalSet = {
        modalTitle: '角色定义', // modal 窗体标题
        formData: roleInfo || {},
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.saveRole(angular.extend(params, scope.formData), function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          });
        }
        // ,cancel: C.cancelModal
      }
      C.openModal(modalSet, 'role');
    }

    $scope.remove = function(id){
      var modalSet = {
        removeText: '确定要删除这个角色？', // modal 删除提示语
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.delRole({pageNo:$scope.pageNo, id: id}, function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          });
        }
        // ,cancel: C.cancelModal
      };
      C.openModal(modalSet);
    }    
  }])
  /* 客户管理 */
  .controller('CustomerController', ['$scope', 'DDS', 'C', function($scope, DDS, C){
    $scope.changePage = function(){
      C.list($scope, DDS, {
        endpoint:'customer', action:'select',
        pageNo:$scope.pageNo
      });
    }
    $scope.changePage(); // default: load pageNo:1

  }])
  /* 司机管理 */
  .controller('DriverController', ['$scope', 'DDS', 'C', function($scope, DDS, C){
    $scope.changePage = function(){
      C.list($scope, DDS, {
        endpoint:'driver', action:'select',
        pageNo:$scope.pageNo
      });
    }
    $scope.changePage(); // default: load pageNo:1

  }])
  /* 订单管理 */
  .controller('OrderController', ['$scope', 'DDS', 'C', '$timeout', function($scope, DDS, C, $timeout){
    angular.extend($scope, {
      syncStatus: '同步订单',
      rotate:false,
      changePage: function(){
        C.list($scope, DDS, {
          endpoint:'bill', action:'select',
          pageNo:$scope.pageNo
        });
      },
      syncOrder: function(){
        var self = this;
        self.syncStatus = '正在同步';
        self.rotate = true;
        DDS.get({endpoint:'bill', action:'synchOrder', chaos: Math.random()}, function(res){
          var data = C.validResponse(res);
          $timeout(function(){
            if(typeof data!=='string'){
              if(data.returnValue){
                self.syncStatus = '同步成功';
              }
              else{
                self.syncStatus = '同步失败';
              }
            }
            else{
              self.syncStatus = '同步失败';
            }
            self.rotate = false;
          }, 2000);
        });
      }
    });
    $scope.changePage();
  }])
  /* 计费规则 */
  .controller('RuleController', ['$scope', 'DDS', 'C', function($scope, DDS, C){
    var storage = C.storage(), extraData = {areas: storage.get('place').areas};
    $scope.changePage = function(){
      C.list($scope, DDS, {
        endpoint:'rule', action:'select',
        pageNo:$scope.pageNo
      });
    }
    $scope.changePage();

    var scale = function(){
      var t1 = C.range(0,23), t2=[], s2;
      for(var x in t1){
        s2 = C.range(C.succ(t1[x]), 24);
        for(var y in s2){
          s2[y] = s2[y]<10 ? '0' + s2[y] + ':00' : s2[y] +':00';
        }
        t2[x] = {
          scale1: t1[x]<10 ? '0' + t1[x] + ':00' : t1[x] +':00',
          scale2: s2
        }
      }
      return t2;
    }

    $scope.saveRule = function(rule){
      var params={pageNo:$scope.pageNo};
      if(rule){
        var ruleInfo = angular.extend({},rule);
        angular.extend(params, {action:'edit', id:ruleInfo.ruleId});
        angular.extend(extraData, {showEdit:true, showAreaSel:false, showPeriodSel:false});
      }
      else{
        angular.extend(params, {action:'add'});
        angular.extend(extraData, {showEdit:false, showAreaSel:true, showPeriodSel:true});
      }
      var modalSet = {
        modalTitle: '计费规则定义', // modal 窗体标题
        formData: ruleInfo || {},
        extraData: angular.extend(extraData,{scale: scale()}),
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.saveRule(angular.extend(params, scope.formData), function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          });
        }
      }
      C.openModal(modalSet, 'rule');
    }

    $scope.remove = function(id){
      var modalSet = {
        removeText: '确定要删除这条计费规则？', // modal 删除提示语
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.delRule({pageNo:$scope.pageNo, id: id}, function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          });
        }
      };
      C.openModal(modalSet);
    }  
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
        var modalSet = {
          modalTitle: '名称', // modal 窗体标题
          confirm: function(modalInstance, scope){ // 确认modal callback
            console.log(scope.formData); // collect form data
            modalInstance.close(function(){ // close modal
              C.alert($scope, {type:'success', msg:'编辑成功！'});
            });
          },
          cancel: C.cancelModal
        }
        C.openModal(modalSet, 'general.modify');
      },
      remove: function(){
        var modalSet = {
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
        C.openModal(modalSet);
      }
    });
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