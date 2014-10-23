(function(){
  'use strict';
  var templatePath = 'views/';
  var app = angular.module('DdsControllers', [])
   /* 全局controller，不包括登录页面 */
  .controller('GlobelController', ['$rootScope', '$scope', '$location', 'C', 'DDS', 'AuthService', function($rootScope, $scope, $location, C, DDS, AuthService){
    var storage = C.storage();
    /*rootscope setting*/
    angular.extend($rootScope, {
      showNav:$location.path()!=='/login' ? true : false,
      menus:storage.get('menus'),
      userId:storage.get('userId'),
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
    $rootScope.keepOpenAccordion();

    angular.extend($scope, {
      alerts: [],
      pageNum:1,
      maxPageSize : 8,
      recordsPerPage: 10,
      menuTemplate: templatePath + 'menu.html',
      closeAlert: function(index){
        this.alerts.splice(index, 1);
      },
      signOut: function(){
        DDS.signOut(function(res){
          var data = C.validResponse(res);
          if(typeof data !== 'string' && data.code === 0){
            storage.clear();
            $rootScope.menus=[];
            $rootScope.showNav=[];
            AuthService.isLogged = false;
            C.back2Login();
          }
        });
      }
    });
  }])
  .controller('AdminController', ['$rootScope', '$scope', '$location', 'C', 'DDS', 'AuthService', function($rootScope, $scope, $location, C, DDS, AuthService){
    var storage = C.storage();
    storage.clear();

    $scope.checkLogin = function(){
        /*login success:
            1. sessionStorage: token & userId & loginInfo
            2. authService.isLogin value is true
            3. sessionStorage: menu,role,province
        */
        $scope.master = angular.copy($scope.user);
        DDS.login($scope.user, function(res){
          var data = C.validResponse(res);
          if(typeof data!=='string'){
            AuthService.isLogged = true;
            //缓存登录信息
            storage.set('token', data.sessionId);
            storage.set('userId', data.user.userId);
            storage.set('loginInfo', data.user);

            //缓存
            DDS.get({endpoint:'menu', action:'select', type:2}, function(result){
              storage.set('menus', result.data);
              $location.path('/home');
            });
          }
          else{
            C.alert($scope, {type:'danger', msg:data});
          }
        }, function(){
          C.alert($scope, {type:'danger', msg:'network error!'});
        });
      };

      $scope.isUnchanged = function(user){
        return angular.equals(user, $scope.master);
      };
  }])
  /* 修改密码 */
  .controller('ChangePasswordController', ['$scope', 'C' ,'DDS', '$filter', function($scope, C, DDS, $filter){
    var storage = C.storage().get('loginInfo');
    $scope.pwd = {};
    $scope.pwdSubmit = function(){
      var postData = {    
        userId: storage.userId,
        sessionId : storage.sessionId,
        id: storage.id,
        oldPassword: $filter('md5')($scope.pwd.oldPwd),
        newPassword: $filter('md5')($scope.pwd.newPwd)
      };
      $scope.master = angular.copy($scope.pwd);
      DDS.savePwd(postData, function(res){
        var data = C.validResponse(res);
        if(typeof data!=='string'){
          C.alert($scope, {type:"success", msg:"密码修改成功!"});
          C.back2Home(true);
        }
        else{
          C.alert($scope, {type:"danger", msg:data});
        }
      });
    };
    $scope.isUnchanged = function(pwd){
      return (angular.equals(pwd, $scope.master) || pwd.newPwd !== pwd.rpNewPwd);
    };
  }])
  /* 欢 迎 页 */
  .controller('HomeController', ['$rootScope', '$scope', 'C' ,'DDS', '$location', 'AuthService', function($rootScope, $scope, C, DDS, $location, AuthService){
    var storage = C.storage();
    // 从localstorage获取菜单数据
    if(storage.get("loginInfo")){
      angular.extend($rootScope, {
        showNav: true,
        menus: storage.get('menus'),
        userId: storage.get('userId')
        
      });
      //缓存角色与省市数据
      C.cacheData(DDS, {endpoint:'role', action:'select'});
      C.cacheData(DDS, {endpoint:'provinces', action:'select'});
    }
  }])
  /* 用户管理 */
  .controller('UserController', ['$scope','DDS', 'C', function($scope, DDS, C){
    var storage = C.storage(), userInfo;
    var paramsInit = {
      endpoint:'user', action:'select',
      pageNum:$scope.pageNum
    };
    $scope.changePage = function(){
      C.list(this, DDS, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage(); // default: load pageNum:1
    /* 搜索 */
    $scope.doSearch = function(o){
      if(o){
        C.list($scope, DDS, angular.extend(paramsInit, o, {pageNum:1}));
      }
    };

    $scope.saveUser = function(user){
      var params={pageNum:$scope.pageNum};
      if(user){
        userInfo = angular.extend({},user);
        angular.extend(params, {action:'edit', id:userInfo.id});
      }
      else{
        angular.extend(params, {action:'add'});
        userInfo = {};
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
      };
      C.openModal(modalSet, 'user');
    };
    $scope.remove = function(id){
      var modalSet = {
        removeText: '确定要删除这条用户记录？', // modal 删除提示语
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.delUser({pageNum:$scope.pageNum, id: id}, function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          });
        }
        // ,cancel: C.cancelModal
      };
      C.openModal(modalSet);
    };
  }])
  /* 角色管理 */
  .controller('RoleController', ['$scope', 'DDS', 'C', function($scope, DDS, C){
    var paramsInit = {
      endpoint:'role', action:'select',
      pageNum:$scope.pageNum
    };
    $scope.changePage = function(){
      C.list($scope, DDS, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage(); // default: load pageNum:1

    $scope.doSearch = function(o){
      if(o){
        C.list($scope, DDS, angular.extend(paramsInit, o, {pageNum: 1}));
      }
    };

    $scope.saveRole = function(role){
      DDS.get({endpoint:'menu', action:'select', type:'1'}, function(res){
        var data = C.validResponse(res), roleInfo;
        if(typeof data!=='string'){
          var flatMenu=[];
          for(var m in data){
            flatMenu.push({
              id:data[m].id,
              name:'' + data[m].name
            });
            for(var sm in data[m].subname){
              flatMenu.push({
                id: data[m].subname[sm].id,
                name:'　---' + data[m].subname[sm].name
              });
            }
          }
          var params={pageNum:$scope.pageNum};
          if(role){
            roleInfo = angular.extend({}, role);
            angular.extend(params, {action:'edit', id:roleInfo.id});
          }
          else{
            angular.extend(params, {action:'add'});
          }
          var modalSet = {
            modalTitle: '角色定义', // modal 窗体标题
            formData: roleInfo || {},
            extraData:flatMenu,
            confirm: function(modalInstance, scope){ // 确认modal callback
              DDS.saveRole(angular.extend(params, scope.formData), function(res){
                C.responseHandler(scope, $scope, modalInstance, res);
              });
            }
            // ,cancel: C.cancelModal
          };
          C.openModal(modalSet, 'role');
        }
      });
    };

    $scope.remove = function(id){
      var modalSet = {
        removeText: '确定要删除这个角色？', // modal 删除提示语
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.delRole({pageNum:$scope.pageNum, id: id}, function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          });
        }
        // ,cancel: C.cancelModal
      };
      C.openModal(modalSet);
    };  
  }])
  /* 客户管理 */
  .controller('CustomerController', ['$scope', 'DDS', 'C', function($scope, DDS, C){
    var paramsInit = {
      endpoint:'customer', action:'select',
      pageNum:$scope.pageNum
    }
    $scope.changePage = function(){
      C.list($scope, DDS, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage(); // default: load pageNum:1

    $scope.doSearch = function(o){
      if(o){
        C.list($scope, DDS, angular.extend(paramsInit, o, {pageNum: 1}));
      }
    };
  }])
  /* 司机管理 */
  .controller('DriverController', ['$scope', 'DDS', 'C', function($scope, DDS, C){
    var paramsInit = {
      endpoint:'driver', action:'select',
      pageNum:$scope.pageNum
    }
    $scope.changePage = function(){
      C.list($scope, DDS, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage(); // default: load pageNum:1

    $scope.doSearch = function(o){
      if(o){
        C.list($scope, DDS, angular.extend(paramsInit, o, {pageNum: 1}));
      }
    };
  }])
  /* 订单管理 */
  .controller('OrderController', ['$scope', 'DDS', 'C', '$timeout', '$routeParams', function($scope, DDS, C, $timeout, $routeParams){
    var paramsInit = {
      endpoint:'bill', action:'select',
      pageNum:$scope.pageNum
    };
    angular.extend(paramsInit, $routeParams);
    angular.extend($scope, {
      syncStatus: '同步订单',
      rotate:false,
      changePage: function(){
        C.list($scope, DDS, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
      },
      doSearch: function(o){
        if(o){
          C.list($scope, DDS, angular.extend(paramsInit, o, {pageNum: 1}));
        }
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
  /* 时间段统计 */
  .controller('OrderFilterController', ['$scope', 'DDS', 'C', function($scope, DDS, C){
    var paramsInit = angular.extend({endpoint:'bill', action:'timeStatus'}, C.getPeriod());
    $scope.years = C.range(2010, new Date().getFullYear());
    // $scope.quarter = Math.ceil((new Date().getMonth()+1)/3);
    $scope.search = {};
    $scope.search.quarter = Math.ceil((new Date().getMonth()+1)/3);

    /* datepicker setting*/
    $scope.toggleDP1 = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.sOpen = !$scope.sOpen;
    };
    $scope.toggleDP2 = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.eOpen = !$scope.eOpen;
    };
    $scope.dateOptions = {
      showWeeks:false
    };


    $scope.changePage = function(){
      C.list($scope, DDS, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage();

    $scope.doSearch = function(o){
      var s = angular.extend(paramsInit, o, C.getPeriod(o), {pageNum:1})
      delete s.dp1; 
      delete s.dp2;
      C.list($scope, DDS, s);
    };

    $scope.orderByCust = function(cName){
      C.goOrderList(cName);
    }
  }])
  /* 计费规则 */
  .controller('RuleController', ['$scope', 'DDS', 'C', function($scope, DDS, C){
    var paramsInit = {
      endpoint:'rule', action:'select',
      pageNum:$scope.pageNum
    }
    var storage = C.storage(), extraData = {areas: storage.get('provinces')};
    $scope.changePage = function(){
      C.list($scope, DDS, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage();

    $scope.doSearch = function(o){
      if(o){
        C.list($scope, DDS, angular.extend(paramsInit, o, {pageNum: 1}));
      }
    };

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
        };
      }
      return t2;
    };

    $scope.saveRule = function(rule){
      var params={pageNum:$scope.pageNum}, ruleInfo;
      if(rule){
        ruleInfo = angular.extend({}, rule);
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
      };
      C.openModal(modalSet, 'rule');
    };

    $scope.remove = function(id){
      var modalSet = {
        removeText: '确定要删除这条计费规则？', // modal 删除提示语
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.delRule({pageNum:$scope.pageNum, id: id}, function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          });
        }
      };
      C.openModal(modalSet);
    };
  }])
  /* demo */
  .controller('DemoController', ['$scope', '$modal', 'C', function($scope, $modal, C){
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
        };
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