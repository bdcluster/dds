(function(){
  'use strict';
  var templatePath = 'views/';
  var app = angular.module('DdsControllers', [])
   /* 全局controller，不包括登录页面 */
  .controller('GlobelController', ['$rootScope', '$scope', '$location', 'C', 'DDS', 'AuthService', function($rootScope, $scope, $location, C, DDS, AuthService){
    var storage = C.storage();
    var isLogged = AuthService.isLogged || storage.get('isLogged');
    /*rootscope setting*/
    angular.extend($rootScope, {
      version: 'ver 0.3',
      showPage:isLogged,
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
      recordsPerPage: 2,
      menuTemplate: templatePath + 'menu.html',
      closeAlert: function(index){
        this.alerts.splice(index, 1);
      },
      refresh: function(){
        var path = $location.path();
        window.location.reload();
      },
      signOut: function(){
        DDS.signOut(function(res){
          var data = C.validResponse(res);
          if(typeof data !== 'string' && data.code === 0){
            AuthService.isLogged = false;
            storage.clear();
            $rootScope.menus=[];
            $rootScope.showPage=AuthService.isLogged;
            C.back2Login();
          }
        });
      }
    });
  }])
  /* 登陆页面 */
  .controller('AdminController', ['$rootScope', '$filter', '$scope', '$location','$timeout', 'C', 'DDS', 'AuthService', function($rootScope, $filter, $scope, $location, $timeout, C, DDS, AuthService){
    var storage = C.storage();
    if(storage.get('isLogged')){
      $location.path('/home');
    }
    else{
      storage.clear();
      $rootScope.menus=[];
    }

    $scope.checkLogin = function(){
      /*login success:
          1. sessionStorage: token & userId & loginInfo
          2. authService.isLogin value is true
          3. sessionStorage: menu,role,province
      */
      $scope.user.password = $filter('md5')($scope.user.password);
      $scope.master = angular.copy($scope.user);
      DDS.login($scope.user, function(res){
        var data = C.validResponse(res);
        if(typeof data!=='string'){
          AuthService.isLogged = true;
          storage.set('isLogged', true);
          
          //缓存登录信息
          storage.set('token', data.sessionId);
          storage.set('userId', data.user.userId);
          storage.set('loginInfo', data.user);

          //缓存
          DDS.get({endpoint:'menu', action:'select', type:2, userId:data.user.userId}, function(result){
            storage.set('menus', result.data);
            $scope.hideLogin=true;
            $timeout(function(){
              $location.path('/home');
              $rootScope.showPage=AuthService.isLogged;
            }, 500);
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
  .controller('ChangePasswordController', ['$scope', 'C' ,'DDS', '$filter', 'AuthService', function($scope, C, DDS, $filter, AuthService){
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
        menus: storage.get('menus'),
        userId:storage.get('userId')
      });
    }
    //缓存角色与省市数据
    C.cacheData(DDS, {endpoint:'role', action:'select'});
    C.cacheData(DDS, {endpoint:'provinces', action:'select'});
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
        extraData: {roles:storage.get('role').roles, editMode:params.action==='edit'},
        formData: userInfo || {},
        confirm: function(modalInstance, scope){ // 确认modal callback
          delete scope.formData.role;
          DDS.saveUser(angular.extend(params, scope.formData), function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          }, function(){
            C.alert(scope, {msg:"网络错误", show:true}, true);
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
          var params={pageNum:$scope.pageNum};
          if(role){
            var menuIdArray=function(){
              var obj={};
              for(var i=0; i<role.menuIdArray.length; i++){
                obj[role.menuIdArray[i]] = true;
              }
              return obj;
            };
            roleInfo = angular.extend({}, role, {menuIdArray:menuIdArray()});
            angular.extend(params, {action:'edit', id:roleInfo.id});
          }
          else{
            angular.extend(params, {action:'add'});
          }
          var modalSet = {
            modalTitle: '角色定义', // modal 窗体标题
            formData: roleInfo || {},
            extraData:data,
            confirm: function(modalInstance, scope){ // 确认modal callback
              delete scope.formData.permitList;
              var m = scope.formData.menuIdArray, n=[];
              var menuIdArray = function(){
                for(var x in m){
                  if(m[x]){
                    n.push(x);
                  }
                }
                return n;
              };
              scope.formData.menuIdArray = menuIdArray();
              DDS.saveRole(angular.extend(params, scope.formData), function(res){
                C.responseHandler(scope, $scope, modalInstance, res);
              }, function(){
                C.alert(scope, {msg:"网络错误", show:true}, true);
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
    };
    var areas = C.storage().get('provinces');
    $scope.areas = areas;
    $scope.changePage = function(){
      C.list($scope, DDS, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage(); // default: load pageNum:1

    $scope.saveCust = function(cust){
      var params={pageNum:$scope.pageNum},
          provinceOrder, cityOrder, custInfo;
      if(cust){
        custInfo = angular.extend({},cust);
        angular.extend(params, {action:'edit', id:custInfo.id});
        if(custInfo.provinceName){
          for(var i=0; i<areas.length; i++){
            if(areas[i].name===custInfo.provinceName){
              provinceOrder=i;
              break;
            }
          }
          for(i=0; i<areas[provinceOrder].subname.length; i++){
            if(areas[provinceOrder].subname[i].name===custInfo.cityName){
              cityOrder=i;
              break;
            }
          }
        }
      }
      else{
        angular.extend(params, {action:'add'});
        custInfo = {};
      }
      var modalSet = {
        modalTitle: '客户信息', // modal 窗体标题
        formData: custInfo || {},
        extraData:{areas: areas, cityOrder:cityOrder, provinceOrder:provinceOrder},
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.saveCust(angular.extend(params, scope.formData), function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          }, function(){
            C.alert(scope, {msg:"网络错误", show:true}, true);
          });
        }
        // ,cancel: C.cancelModal
      };
      C.openModal(modalSet, 'cust');
    };

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
      pageNum:$scope.pageNum,
    };
    var areas = C.storage().get('provinces');
    $scope.areas = areas;
    $scope.changePage = function(){
      C.list($scope, DDS, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage(); // default: load pageNum:1

    $scope.saveDriver = function(driv){
      var params={pageNum:$scope.pageNum}, drivInfo, provinceOrder, cityOrder;
      if(driv){
        drivInfo = angular.extend({}, driv);
        angular.extend(params, {action:'edit', id:drivInfo.id});
        if(drivInfo.provinceName){
          for(var i=0; i<areas.length; i++){
            if(areas[i].name===drivInfo.provinceName){
              provinceOrder=i;
              break;
            }
          }
          for(i=0; i<areas[provinceOrder].subname.length; i++){
            if(areas[provinceOrder].subname[i].name===drivInfo.cityName){
              cityOrder=i;
              break;
            }
          }
        }
        
      }
      else{
        angular.extend(params, {action:'add'});
        drivInfo = {};
      }
      var modalSet = {
        modalTitle: '司机信息', // modal 窗体标题
        formData: drivInfo || {},
        extraData:{areas: areas, cityOrder:cityOrder, provinceOrder:provinceOrder},
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.saveDriv(angular.extend(params, scope.formData), function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          }, function(){
            C.alert(scope, {msg:"网络错误", show:true}, true);
          });
        }
        // ,cancel: C.cancelModal
      };
      C.openModal(modalSet, 'driv');
    };

    $scope.remove = function(id){
      var modalSet = {
        removeText: '确定要删除这个司机的信息？', // modal 删除提示语
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.delDriv({pageNum:$scope.pageNum, id: id}, function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          });
        }
        // ,cancel: C.cancelModal
      };
      C.openModal(modalSet);
    }; 

    $scope.doSearch = function(o){
      if(o){
        C.list($scope, DDS, angular.extend(paramsInit, o, {pageNum: 1}));
      }
    };
  }])
  /* 订单管理 */
  .controller('OrderController', ['$scope', 'DDS', 'C', '$timeout', '$routeParams', function($scope, DDS, C, $timeout, $routeParams){
    var paramsInit = {
      endpoint:'order', action:'select',
      pageNum:$scope.pageNum
    };
    $scope.areas = C.storage().get('provinces');
    angular.extend(paramsInit, $routeParams);

    angular.extend($scope, {
      hideBack:angular.equals($routeParams,{}),
      search:{},
      orderStatus:[
        {'s':'1','n':'已预约','c':'warning'},
        {'s':'2','n':'已取消','c':'default'},
        {'s':'3','n':'准备中','c':'info'},
        {'s':'4','n':'代驾中','c':'primary'},
        {'s':'5','n':'已完成','c':'success'},
        {'s':'6','n':'已超时','c':'danger'}
      ],
      billStatus:[
        {'n':'代驾中', 's':'0', 'c':'warning'},
        {'n':'未结算', 's':'1', 'c':'default'},
        {'n':'已结算', 's':'2', 'c':'success'}
      ],
      syncStatus:[
        {'n':'未同步', 's':'0', 'c':'default'},
        {'n':'已同步', 's':'1', 'c':'success'}    
      ],
      syncButton: '同步订单',
      sync:{
        primary:true,
        success:false,
        danger:false
      },
      changePage: function(){
        C.list($scope, DDS, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
      },
      goBack:function(){
        history.back();
      },
      doSearch: function(o){
        if(o){
          C.list($scope, DDS, angular.extend(paramsInit, o, {pageNum: 1}));
        }
      },
      // 订单同步
      syncOrder: function(orderId){
        var self = this, syncParams;
        if(!self.sync.success){
          self.syncButton = '正在同步';
          syncParams = angular.extend({
            endpoint:'order', action:'synchOrder', 
            orderId: orderId, chaos: Math.random()
          });
          DDS.get(syncParams, function(res){
            var data = C.validResponse(res);
            $timeout(function(){
              if(typeof data!=='string'){
                self.sync = {
                  primary:false,
                  success:true,
                  danger:false
                };
                self.syncButton = data.message;
              }
              else{
                self.syncButton = '同步失败';
                self.sync = {
                  primary:false,
                  success:false,
                  danger:true
                };
              }
            }, 2000);
          });
          
        }
      },
      orderExport: function(){
        C.exportFile($scope, DDS, angular.extend({endpoint:'order', action:'exportOrder'}, $scope.search));
      },
      ordDetail: function(ord){
        var modalSet = {
          modalTitle: '订单详情', // modal 窗体标题
          formData:ord,
          extraData:{
            orderStatus:$scope.orderStatus, 
            billStatus:$scope.billStatus, 
            syncStatus:$scope.syncStatus
          }
        };
        C.openModal(modalSet, 'order');
      }
    });
    $scope.changePage();
  }])
  /* 时间段统计 */
  .controller('OrderFilterController', ['$scope', 'DDS', 'C', function($scope, DDS, C){
    var curYear = new Date().getFullYear(), curMonth = new Date().getMonth() +1;
    $scope.years = C.range(2010, curYear);
    $scope.search = {
      year: curYear,
      month: curMonth,
      quarter: Math.ceil((new Date().getMonth()+1)/3),
      dp1: curYear + '-' + C.twiNum(curMonth) + '-01',
      dp2: curYear + '-' + C.twiNum(curMonth) + '-' + C.mLength()[curMonth]
    };
    $scope.areas = C.storage().get('provinces');

    var paramsInit = angular.extend({endpoint:'order', action:'statis'}, C.getPeriod($scope.search));
    
    $scope.staticsExport = function(){
      C.exportFile($scope, DDS, angular.extend(
        {endpoint:'order', action:'exportStatis'}, 
        C.getPeriod($scope.search),
        $scope.search
      ));
    };

    $scope.changePage = function(){
      C.list($scope, DDS, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage();

    $scope.doSearch = function(o){
      var s = angular.extend(paramsInit, o, C.getPeriod(o), {pageNum:1});
      delete s.dp1; 
      delete s.dp2;
      $scope.search.startTime=s.startTime;
      $scope.search.endTime=s.endTime;
      C.list($scope, DDS, s);
    };

    $scope.orderByCust = function(cName){
      C.goOrderList({
        customerName: cName,
        startTime: $scope.search.startTime || $scope.search.dp1,
        endTime: $scope.search.endTime || $scope.search.dp2
      });
    };
  }])
  /* 计费规则模板 */
  .controller('RuleTemplateController', ['$scope', 'DDS', 'C', function($scope, DDS, C){
    var paramsInit = {
      endpoint:'template', action:'select',
      pageNum:$scope.pageNum
    };
    $scope.search = {};
    $scope.changePage = function(){
      C.list($scope, DDS, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage();

    $scope.doSearch = function(o){
      if(o){
        C.list($scope, DDS, angular.extend(paramsInit, o, {pageNum: 1}));
      }
    };

    $scope.saveRuleTemp = function(ruleTemp){
      var params={pageNum:$scope.pageNum}, tempInfo={}, extraData={};
      if(ruleTemp){
        tempInfo = angular.extend({}, ruleTemp);
        angular.extend(params, {action:'edit', id:tempInfo.id});

        tempInfo.arrayStr = C.ruleStr2Json(ruleTemp.arrayStr);
        extraData.rules = C.range(0, ruleTemp.arrayStr.split(';').length-1);
        tempInfo.openTime = C.formatDate(tempInfo.openTime);
        tempInfo.closeTime = C.formatDate(tempInfo.closeTime);
      }
      else{
        angular.extend(params, {action:'add'});
        tempInfo.arrayStr = {'0':{}};
        tempInfo.status = 0;
        extraData.rules = [0];
        extraData.minDate = C.today();
      }
      var modalSet = {
        modalTitle: '计费模板定义', // modal 窗体标题
        formData: tempInfo || {},
        extraData:extraData,
        confirm: function(modalInstance, scope){ // 确认modal callback
          var str = C.json2RuleStr(scope.formData.arrayStr);
          DDS.saveRuleTemp(angular.extend(params, scope.formData, {arrayStr:str}), function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          }, function(){
            C.alert(scope, {msg:"网络错误", show:true}, true);
          });
        }
      };
      C.openModal(modalSet, 'temp');
    };

    $scope.remove = function(id){
      var modalSet = {
        removeText: '确定要删除这个计费模板？', // modal 删除提示语
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.delRuleTemp({pageNum:$scope.pageNum, id: id}, function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          });
        }
      };
      C.openModal(modalSet);
    };

  }])
  /* 计费模板明细 */
  .controller('RuleTemplateDetailController', ['$scope', '$routeParams', 'DDS', 'C', function($scope, $routeParams, DDS, C){
    C.list($scope, DDS, {
      endpoint:'template', action:'detail',
      id:$routeParams.id
    });
    $scope.goBack = function(){
      history.back();
    };
  }])
  /* 计费规则 */
  .controller('RuleController', ['$scope', 'DDS', 'C', function($scope, DDS, C){
    var paramsInit = {
      endpoint:'rule', action:'select',
      pageNum:$scope.pageNum
    };
    $scope.search = {};
    var storage = C.storage(), extraData = {areas: storage.get('provinces')};
    $scope.changePage = function(){
      C.list($scope, DDS, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage();

    $scope.doSearch = function(o){
      if(o){
        if(!o.provinceId && o.cityId){
          delete o.cityId;
        }
        C.list($scope, DDS, angular.extend(paramsInit, o, {pageNum: 1}));
      }
    };

    $scope.areas = C.storage().get('provinces');

    $scope.addRule = function(){
      var tmpls = DDS.get({endpoint: 'template', action: 'select', status: '0'});
      tmpls.$promise.then(function(result){
        var data = C.validResponse(result);
        if(typeof data !== 'string'){
          var templates=data.templates;
          var params={pageNum:$scope.pageNum, action:'add'};
          //把模板中的arrayStr json化备用
          for(var i=0; i<templates.length; i++){
            templates[i].rules = C.range(0, templates[i].arrayStr.split(';').length-1);
            angular.extend(templates[i], {arrayStr:C.ruleStr2Json(templates[i].arrayStr)});
          }
          var modalSet = {
            modalTitle: '计费规则添加', // modal 窗体标题
            formData: {status: 0},
            extraData: angular.extend(extraData,{templates: templates}),
            confirm: function(modalInstance, scope){ // 确认modal callback
              var str = C.json2RuleStr(scope.formData.arrayStr);
              var cityStr = C.getKeyStr(scope.formData.cityStr);
              if(cityStr === ''){
                C.alert(scope, {msg: '至少选择一个城市', show:true}, true);
              }
              else{
                DDS.saveRule(angular.extend(params, scope.formData, {arrayStr:str, cityStr:cityStr}), function(res){
                  C.responseHandler(scope, $scope, modalInstance, res);
                }, function(){
                  C.alert(scope, {msg:"网络错误", show:true}, true);
                });
              }
            }
          };
          C.openModal(modalSet, 'rule.add');
        }
      });
    };
    $scope.saveRule = function(rule){
      var params={pageNum:$scope.pageNum}, ruleInfo;
      if(rule){
        ruleInfo = angular.extend({}, rule, {
          openTime:  C.formatDate(rule.openTime),
          closeTime: C.formatDate(rule.closeTime),
          arrayStr:  C.ruleStr2Json(rule.arrayStr),
          rules:     C.range(0, rule.arrayStr.split(";").length, true)
        });
        angular.extend(params, {action:'edit', id:ruleInfo.ruleId});

        var modalSet = {
          modalTitle: '计费规则编辑', // modal 窗体标题
          formData: ruleInfo,
          confirm: function(modalInstance, scope){ // 确认modal callback
            var str = C.json2RuleStr(scope.formData.arrayStr);
            DDS.saveRule(angular.extend(params, scope.formData, {arrayStr:str}), function(res){
              C.responseHandler(scope, $scope, modalInstance, res);
            }, function(){
              C.alert(scope, {msg:"网络错误", show:true}, true);
            });
          }
        };
        C.openModal(modalSet, 'rule.edit');
      }
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
  /* 规则明细 */
  .controller('RuleDetailController', ['$scope', '$routeParams', 'DDS', 'C',function($scope, $routeParams, DDS, C){
    C.list($scope, DDS, {
      endpoint:'rule', action:'detail',
      id:$routeParams.id
    });
    $scope.goBack = function(){
      history.back();
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