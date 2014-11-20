(function(){
  'use strict';
  angular.module('RuleModule', []).controller('RuleController', [
    '$scope','C','DDS', function(
     $scope,  C,  DDS) {

    var paramsInit = {
      endpoint:'rule', action:'select',
      pageNum:$scope.pageNum
    };
    $scope.paramsInit = angular.copy(paramsInit);
    var storage = C.storage(), extraData = {areas: storage.get('provinces')};
    $scope.changePage = function(){
      C.list(this, angular.extend(paramsInit, {pageNum:$scope.pageNum}));
    };
    $scope.changePage();

    $scope.doSearch = function(){
      if(C.searchFlag(this.search)){
        C.list(this, angular.extend(paramsInit, this.search, {pageNum: 1}));
      }
    };

    $scope.refresh = function(){
      C.list(this, angular.extend(this.paramsInit, {pageNum: 1}));
      angular.extend(this, angular.copy(C.empty));
      angular.copy(this.paramsInit, paramsInit);
    };

    $scope.areas = C.storage().get('provinces');

    $scope.addRule = function(){
      // 查询所有(type='all')有效(status=0)模板
      var tmpls = DDS.get({endpoint: 'template', action: 'select', status: 0, type: 'all'});
      tmpls.$promise.then(function(result){
        var data = C.validResponse(result);
        if(angular.isObject(data)){
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
              var saveData;
              if(cityStr === ''){
                C.alert({msg: '至少选择一个城市'}, true, scope);
              }
              else{
                saveData = DDS.saveRule(angular.extend(params, scope.formData, {arrayStr:str, cityStr:cityStr}));
                saveData.$promise.then(function(res){
                  C.responseHandler(scope, $scope, modalInstance, res);
                }, function(res){
                  C.badResponse(res);
                  modalInstance.dismiss();
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
        paramsInit = angular.extend({}, $scope.paramsInit);
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
            var saveData =  DDS.saveRule(angular.extend(params, scope.formData, {arrayStr:str}));
            saveData.$promise.then(function(res){
              C.responseHandler(scope, $scope, modalInstance, res);
            }, function(res){
              C.badResponse(res);
              modalInstance.dismiss();
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
          }, function(res){
            C.badResponse(res);
            modalInstance.dismiss();
          });
        }
      };
      C.openModal(modalSet);
    };
  
  }]);
})();