(function(){
  'use strict';
  angular.module('RuleTmplModule', []).controller('RuleTemplateController', [
    '$scope','C','DDS', function(
     $scope,  C,  DDS){

    var paramsInit = {
      endpoint:'template', action:'select',
      pageNum:$scope.pageNum
    };
    $scope.paramsInit = angular.copy(paramsInit);
    $scope.search = {};

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

    $scope.saveRuleTemp = function(ruleTemp){
      var params={pageNum:$scope.pageNum}, tempInfo={}, extraData={};
      if(ruleTemp){
        paramsInit = angular.extend({}, $scope.paramsInit);
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
        extraData.minDate = C.formatDate();
      }
      var modalSet = {
        modalTitle: '计费模板定义', // modal 窗体标题
        formData: tempInfo || {},
        extraData:extraData,
        confirm: function(modalInstance, scope){ // 确认modal callback
          var str = C.json2RuleStr(scope.formData.arrayStr);
          var saveData = DDS.saveRuleTemp(angular.extend(params, scope.formData, {arrayStr:str}));
          saveData.$promise.then(function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          }, function(){
            C.badResponse();
          });
        }
      };
      C.openModal(modalSet, 'rule.tmpl');
    };

    $scope.remove = function(id){
      var modalSet = {
        removeText: '确定要删除这个计费模板？', // modal 删除提示语
        confirm: function(modalInstance, scope){ // 确认modal callback
          DDS.delRuleTemp({pageNum:$scope.pageNum, id: id}, function(res){
            C.responseHandler(scope, $scope, modalInstance, res);
          }, function(){
            C.badResponse();
          });
        }
      };
      C.openModal(modalSet);
    };
  
  }]);
})();