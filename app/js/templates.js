(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/chgpwd.html',
    '<div class="col-xs-8 col-xs-offset-2"><form class="form-horizontal" role="form" name="chgpwdForm" data-ng-submit="pwdSubmit()" novalidate=""><div class="form-group"><h2>修改密码：</h2></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':chgpwdForm.oldPwd.$valid, \'has-error\':chgpwdForm.oldPwd.$invalid &amp;&amp; chgpwdForm.oldPwd.$dirty}"><label class="sr-only control-label">旧密码</label><div class="input-group col-xs-10"><div class="input-group-addon"><i class="iconfont icon-oldpwd"></i></div><input type="password" class="form-control input-lg" name="oldPwd" data-ng-model="pwd.oldPwd" placeholder="原密码" required=""></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':chgpwdForm.newPwd.$valid, \'has-error\':chgpwdForm.newPwd.$invalid &amp;&amp; chgpwdForm.newPwd.$dirty}"><label class="sr-only control-label">新密码</label><div class="input-group col-xs-10"><div class="input-group-addon"><i class="iconfont icon-newpwd"></i></div><input type="password" class="form-control input-lg" name="newPwd" data-ng-model="pwd.newPwd" placeholder="新密码" required=""></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':chgpwdForm.rpNewPwd.$valid, \'has-error\':(pwd.rpNewPwd != pwd.newPwd) &amp;&amp; chgpwdForm.rpNewPwd.$dirty}"><label class="sr-only control-label">重复密码</label><div class="input-group col-xs-10"><div class="input-group-addon"><i class="iconfont icon-newpwd2"></i></div><input type="password" class="form-control input-lg" name="rpNewPwd" data-ng-model="pwd.rpNewPwd" placeholder="重复密码" required=""></div></div><div class="form-group"><div class="col-xs-offset-2 col-xs-6"><button type="submit" class="btn btn-primary btn-block btn-lg" ng-disabled="chgpwdForm.$invalid || isUnchanged(pwd)"><span class="iconfont icon-mima"></span> 确 定 修 改</button></div></div></form></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/cust.html',
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only">姓名</label> <input type="text" class="form-control" name="name" data-ng-model="search.name" placeholder="姓名"></div><div class="form-group"><label class="sr-only">手机号</label> <input type="text" class="form-control" name="emergencyPhone" data-ng-model="search.emergencyPhone" placeholder="手机号"></div><div class="form-group"><button type="submit" class="btn btn-primary" data-ng-click="doSearch(search)"><span class="glyphicon glyphicon-search"></span> 搜素</button></div></form><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>客户编号</td><td>姓名</td><td>手机号</td><td>VIP</td><td>常用目的地</td><td>注册时间</td></tr></thead><tbody><tr data-ng-repeat="cust in customers"><td data-ng-bind="cust.customerNo"></td><td data-ng-bind="cust.name"></td><td data-ng-bind="cust.emergencyPhone"></td><td data-ng-bind="cust.vip | isVIP"></td><td data-ng-bind="cust.commonDestination"></td><td data-ng-bind="cust.createTime | myDate"></td></tr></tbody></table><div class="row" data-ng-show="showPagination"><div class="col-xs-10"><div data-pagination="" data-total-items="total" data-ng-model="pageNum" data-max-size="maxPageSize" class="pagination-sm" data-num-pages="numPages" data-ng-change="changePage()" data-rotate="false" data-boundary-links="true" data-previous-text="Prev"></div></div><div class="col-xs-2 text-right pagination-tip">Page: {{pageNum}} / {{numPages}}</div></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/demo.html',
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only">名称</label> <input type="text" class="form-control" name="demo1" data-ng-model="search.name" placeholder="名称"></div><div class="form-group"><label class="sr-only">账号</label> <input type="text" class="form-control" name="demo2" data-ng-model="search.account" placeholder="账号"></div><div class="form-group"><button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span> 搜素</button></div></form><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>姓名</td><td>账号</td><td>角色</td><td class="action">操作</td></tr></thead><tbody><tr><td>Tom Cruise</td><td>tomcat</td><td>admin</td><td><button class="btn btn-primary btn-xs" data-ng-click="modify()"><span class="glyphicon glyphicon-edit"></span> 编辑</button> <button class="btn btn-danger btn-xs" data-ng-click="remove()"><span class="glyphicon glyphicon-remove-circle"></span> 删除</button></td></tr><tr><td>Jerry</td><td></td><td></td><td></td></tr><tr><td>Andy</td><td></td><td></td><td></td></tr></tbody></table><div class="row"><div class="col-xs-10"><div data-pagination="" data-total-items="totleRecords" data-ng-model="currentPage" data-items-per-page="recordsPerPage" data-max-size="maxSize" class="pagination-sm" data-boundary-links="true" data-num-pages="numPages" data-ng-change="changePage()" data-previous-text="Prev"></div></div><div class="col-xs-2 text-right pagination-tip">Page: {{currentPage}} / {{numPages}}</div></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/driv.html',
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only">姓名</label> <input type="text" class="form-control" name="demo1" data-ng-model="search.name" placeholder="姓名"></div><div class="form-group"><label class="sr-only">司机工号</label> <input type="text" class="form-control" name="demo2" data-ng-model="search.driverNo" placeholder="司机工号"></div><div class="form-group"><label class="sr-only">状态</label><select name="status" class="form-control" data-ng-model="search.status"><option value="">---司机状态---</option><option value="0">空闲</option><option value="1">忙碌</option><option value="2">代驾中</option></select></div><div class="form-group"><button type="submit" class="btn btn-primary" data-ng-click="doSearch(search)"><span class="glyphicon glyphicon-search"></span> 搜素</button></div></form><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>司机工号</td><td>姓名</td><td>手机号</td><td>驾驶证</td><td>状态</td><td>驾龄</td><td>籍贯</td><td>代驾次数</td><td>服务评级</td></tr></thead><tbody><tr data-ng-repeat="driver in drivers"><td data-ng-bind="driver.driverNo"></td><td data-ng-bind="driver.name"></td><td data-ng-bind="driver.dMobile"></td><td data-ng-bind="driver.dLicence"></td><td data-ng-bind="driver.status | driveStatus"></td><td data-ng-bind="driver.dYears"></td><td data-ng-bind="driver.nativePlace"></td><td data-ng-bind="driver.counts"></td><td data-ng-bind="\'✭✭✭✭✭\' | limitTo: driver.core"></td></tr></tbody></table><div class="row" data-ng-show="showPagination"><div class="col-xs-10"><div data-pagination="" data-total-items="total" data-ng-model="pageNum" data-max-size="maxPageSize" class="pagination-sm" data-num-pages="numPages" data-ng-change="changePage()" data-rotate="false" data-boundary-links="true" data-previous-text="Prev"></div></div><div class="col-xs-2 text-right pagination-tip">Page: {{pageNo}} / {{numPages}}</div></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/form.login.html',
    '<form class="form-horizontal" role="form" name="loginForm" data-ng-submit="checkLogin()" novalidate=""><div class="form-group has-feedback" data-ng-class="{\'has-success\':loginForm.userId.$valid, \'has-error\':loginForm.userId.$invalid &amp;&amp; loginForm.userId.$dirty}"><div class="input-group col-xs-10 col-xs-offset-1"><div class="input-group-addon"><i class="iconfont icon-yonghu"></i></div><input type="text" class="form-control" name="userId" data-ng-model="user.userId" placeholder="用户名" required=""></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':loginForm.password.$valid, \'has-error\':loginForm.password.$invalid &amp;&amp; loginForm.password.$dirty}"><div class="input-group col-xs-10 col-xs-offset-1"><div class="input-group-addon"><i class="iconfont icon-mima"></i></div><input type="password" class="form-control" name="password" data-ng-model="user.password" placeholder="密码" required=""></div></div><div class="form-group"><div class="col-xs-offset-1 col-xs-5"><button type="submit" class="btn btn-primary btn-block btn-login" ng-disabled="loginForm.$invalid || isUnchanged(user)"><span class="iconfont icon-login"></span> 登 录</button></div></div></form>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/home.html',
    '<div class="well"><h1 class="home"><i class="iconfont icon-car"></i>欢迎进入代驾管理系统 <small>ver 1.0</small></h1></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/login.html',
    '<div class="login-panel panel panel-default col-xs-10"><div class="panel-body"><div class="row"><div class="login-cover col-xs-6"><img src="img/designall.jpeg" class="img-responsive"></div><div class="login-form col-xs-6" ng-include="\'views/form.login.html\'"></div></div></div></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/menu.html',
    '<div data-accordion="" close-others="true"><div data-accordion-group="" data-ng-repeat="m in menus" data-is-open="m.open" data-ng-click="markOpen($index)" data-ng-class="{active:m.open}"><div data-accordion-heading=""><i class="iconfont" data-ng-class="{\'icon-{{m.alias}}\': true}"></i> {{m.name}}</div><ul class="nav nav-pills nav-stacked"><li data-ng-repeat="m2 in m.subname" data-ng-class="{active: isActivedMenu(\'/\'+m2.path)}"><a href="#/{{m2.path}}"><i class="iconfont icon-arrow-right"></i> <span data-ng-bind="m2.name"></span></a></li></ul></div></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/modal.general.modify.html',
    '<div class="modal-header"><h3 class="modal-title" data-ng-bind="modalTitle"></h3></div><div class="modal-body"><form class="form-horizontal" role="form" name="normalForm"><div class="form-group"><label for="username" class="col-xs-2 control-label">用户名</label><div class="col-xs-9"><p class="form-control-static">用户名</p></div></div><div class="form-group"><label for="userfullname" class="col-xs-2 control-label">用户姓名</label><div class="col-xs-9"><input type="password" class="form-control" id="userfullname" name="userfullname" data-ng-model="formData.userfullname"></div></div><div class="form-group"><label for="usermobile" class="col-xs-2 control-label">手机</label><div class="col-xs-9"><input type="password" class="form-control" id="usermobile" name="usermobile" data-ng-model="formData.usermobile"></div></div><div class="form-group"><label class="col-xs-2 control-label">角色</label><div class="col-xs-9"><label class="checkbox-inline"><input type="checkbox" data-ng-true-value="1" data-ng-model="formData.chk1" name="role"> 管理员</label> <label class="checkbox-inline"><input type="checkbox" data-ng-true-value="2" data-ng-model="formData.chk2" name="role"> 用户</label></div></div><div class="form-group"><label class="col-xs-2 control-label">单选</label><div class="col-xs-9"><label class="radio-inline"><input type="radio" name="r" value="1" data-ng-model="formData.radio"> 管理员</label> <label class="radio-inline"><input type="radio" name="r" value="2" data-ng-model="formData.radio"> 用户</label></div></div><div class="form-group"><label class="col-xs-2 control-label" for="usersel">选择</label><div class="col-xs-9"><select class="form-control" id="usersel" name="usersel" data-ng-model="formData.usersel"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div></div><div class="form-group"><label class="col-xs-2 control-label" for="userdesc">用户备注</label><div class="col-xs-9"><textarea class="form-control" id="userdesc" name="userdesc" rows="3" data-ng-model="formData.userdesc"></textarea></div></div></form></div><div class="modal-footer"><button class="btn btn-primary" ng-click="confirm()"><span class="glyphicon glyphicon-ok"></span> 确认</button> <button class="btn" ng-click="cancel()"><span class="glyphicon glyphicon-ban-circle"></span> 取消</button></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/modal.general.remove.html',
    '<div class="modal-body"><div data-alert="" data-type="danger" data-ng-show="alert.show" class="animated fade-in"><i class="iconfont icon-danger"></i> <span data-ng-bind="alert.msg"></span></div><span class="glyphicon glyphicon-exclamation-sign text-danger"></span> <strong class="text-danger" data-ng-bind="removeText"></strong></div><div class="modal-footer"><button class="btn btn-danger btn-xs" ng-click="confirm()"><span class="glyphicon glyphicon-remove-circle"></span> 删除</button> <button class="btn btn-xs" ng-click="cancel()"><span class="glyphicon glyphicon-ban-circle"></span> 取消</button></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/modal.role.html',
    '<form class="form-horizontal form-modal" role="form" name="roleForm" novalidate=""><div class="modal-header"><button type="button" class="close" data-ng-click="cancel()"><span aria-hidden="true">&times;</span> <span class="sr-only">Close</span></button><h4 class="modal-title" data-ng-bind="modalTitle"></h4></div><div class="modal-body"><div data-alert="" data-type="danger" data-ng-show="alert.show" class="animated fade-in"><i class="iconfont icon-danger"></i> <span data-ng-bind="alert.msg"></span></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':roleForm.roleName.$valid, \'has-error\':roleForm.roleName.$invalid &amp;&amp; roleForm.roleName.$dirty}"><label for="roleName" class="col-xs-2 control-label">角色名称</label><div class="col-xs-9"><input type="text" class="form-control" name="roleName" data-ng-model="formData.roleName" required=""> <i class="glyphicon form-control-feedback" data-ng-show="roleForm.roleName.$dirty" data-ng-class="{\'glyphicon-ok\':roleForm.roleName.$valid, \'glyphicon-remove\':roleForm.roleName.$invalid}"></i></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':roleForm.description.$valid, \'has-error\':roleForm.description.$invalid &amp;&amp; roleForm.description.$dirty}"><label for="description" class="col-xs-2 control-label">角色描述</label><div class="col-xs-9"><input type="text" class="form-control" name="description" data-ng-model="formData.description" required=""> <i class="glyphicon form-control-feedback" data-ng-show="roleForm.description.$dirty" data-ng-class="{\'glyphicon-ok\':roleForm.description.$valid, \'glyphicon-remove\':roleForm.description.$invalid}"></i></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':roleForm.menuIds.$valid, \'has-error\':roleForm.menuIds.$invalid &amp;&amp; roleForm.menuIds.$dirty}"><label for="menuIds" class="col-xs-2 control-label">菜单设定</label><div class="col-xs-9"><select name="menuIds" multiple="true" size="10" class="form-control" data-ng-model="formData.menuIds" data-ng-options="menu.id as menu.name for menu in extraData" required=""></select></div></div></div><div class="modal-footer"><button class="btn btn-primary" data-ng-disabled="roleForm.$invalid" data-ng-click="confirm()"><i class="glyphicon glyphicon-ok"></i> 确认</button> <button class="btn" data-ng-click="cancel()"><i class="glyphicon glyphicon-ban-circle"></i> 取消</button></div></form>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/modal.rule.html',
    '<form class="form-horizontal form-modal" role="form" name="ruleForm" novalidate=""><div class="modal-header"><button type="button" class="close" data-ng-click="cancel()"><span aria-hidden="true">&times;</span> <span class="sr-only">Close</span></button><h4 class="modal-title" data-ng-bind="modalTitle"></h4></div>{{formData}}<div class="modal-body"><div data-alert="" data-type="danger" data-ng-show="alert.show" class="animated fade-in"><i class="iconfont icon-danger"></i> <span data-ng-bind="alert.msg"></span></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':ruleForm.city.$valid}"><label for="province" class="col-xs-2 control-label">省市名称</label><div class="col-xs-9"><p class="form-control-static">{{province.name || formData.province }} - {{city.name || formData.city}} <i class="glyphicon glyphicon-edit show-edit" data-ng-show="extraData.showEdit" data-ng-click="extraData.showAreaSel=!extraData.showAreaSel"></i></p></div><div class="col-xs-5 col-xs-offset-2" data-ng-show="extraData.showAreaSel"><select name="province" class="form-control" data-ng-model="province" data-ng-options="prov.name for prov in extraData.areas" data-ng-change="formData.provinceId=province.id; city=\'\'" required=""><option value="">-- 请选择 --</option></select><input name="provinceId" type="hidden" data-ng-model="formData.provinceId"></div><div class="col-xs-4" data-ng-show="extraData.showAreaSel"><select name="city" class="form-control" data-ng-model="city" data-ng-options="city.name for city in province.subname" data-ng-change="formData.cityId=subname.id" required=""><option value="">-- 请选择 --</option></select><input name="cityId" type="hidden" data-ng-model="formData.cityId"></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':ruleForm.time2.$valid}"><label for="time1" class="col-xs-2 control-label">时间段</label><div class="col-xs-9"><p class="form-control-static">{{formData.period || \'-\'}} <i class="glyphicon glyphicon-edit show-edit" data-ng-show="extraData.showEdit" data-ng-click="extraData.showPeriodSel=!extraData.showPeriodSel"></i></p></div><div class="col-xs-5 col-xs-offset-2" data-ng-show="extraData.showPeriodSel"><select name="time1" class="form-control" data-ng-model="startTime" data-ng-options=" (t.scale1) for t in extraData.scale" data-ng-change="endTime=\'\'" required=""><option value="">-- 请选择 --</option></select></div><div class="col-xs-4" data-ng-show="extraData.showPeriodSel"><select name="time2" class="form-control" data-ng-model="endTime" data-ng-options="t for t in startTime.scale2" required="" data-ng-change="formData.period=startTime.scale1 + \'-\' + endTime"><option value="">-- 请选择 --</option></select><input name="period" type="hidden" data-ng-model="formData.period"></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':ruleForm.startPrice.$valid, \'has-error\':ruleForm.startPrice.$invalid &amp;&amp; ruleForm.startPrice.$dirty}"><label for="startPrice" class="col-xs-2 control-label">起步价格</label><div class="col-xs-9"><div class="input-group"><span class="input-group-addon">￥</span> <input type="number" class="form-control" name="startPrice" data-ng-model="formData.startPrice" required="" placeholder="一小时内"></div><i class="glyphicon form-control-feedback" data-ng-show="ruleForm.startPrice.$dirty" data-ng-class="{\'glyphicon-ok\':ruleForm.startPrice.$valid, \'glyphicon-remove\':ruleForm.startPrice.$invalid}"></i></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':ruleForm.extraPrice.$valid, \'has-error\':ruleForm.extraPrice.$invalid &amp;&amp; ruleForm.extraPrice.$dirty}"><label for="extraPrice" class="col-xs-2 control-label">加收金额</label><div class="col-xs-9"><div class="input-group"><span class="input-group-addon">￥</span> <input type="number" class="form-control" name="extraPrice" data-ng-model="formData.extraPrice" required="" placeholder="超过1小时每小时加收金额"></div><i class="glyphicon form-control-feedback" data-ng-show="ruleForm.extraPrice.$dirty" data-ng-class="{\'glyphicon-ok\':ruleForm.extraPrice.$valid, \'glyphicon-remove\':ruleForm.extraPrice.$invalid}"></i></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':ruleForm.description.$dirty, \'has-error\':ruleForm.description.$invalid &amp;&amp; ruleForm.description.$dirty}"><label for="description" class="col-xs-2 control-label">规则描述</label><div class="col-xs-9"><textarea class="form-control" name="description" rows="3" data-ng-model="formData.description"></textarea></div></div></div><div class="modal-footer"><button class="btn btn-primary" data-ng-disabled="ruleForm.$invalid && !extraData.showEdit" data-ng-click="confirm()"><i class="glyphicon glyphicon-ok"></i> 确认</button> <button class="btn" data-ng-click="cancel()"><i class="glyphicon glyphicon-ban-circle"></i> 取消</button></div></form>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/modal.user.html',
    '<form class="form-horizontal form-modal" role="form" name="userForm" novalidate=""><div class="modal-header"><button type="button" class="close" data-ng-click="cancel()"><span aria-hidden="true">&times;</span> <span class="sr-only">Close</span></button><h4 class="modal-title" data-ng-bind="modalTitle"></h4></div><div class="modal-body"><div data-alert="" data-type="danger" data-ng-show="alert.show" class="animated fade-in"><i class="iconfont icon-danger"></i> <span data-ng-bind="alert.msg"></span></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':userForm.userId.$valid, \'has-error\':userForm.userId.$invalid &amp;&amp; userForm.userId.$dirty}"><label for="username" class="col-xs-2 control-label">用户名</label><div class="col-xs-9"><input type="text" class="form-control" name="userId" data-ng-model="formData.userId" required=""> <i class="glyphicon form-control-feedback" data-ng-show="userForm.userId.$dirty" data-ng-class="{\'glyphicon-ok\':userForm.userId.$valid, \'glyphicon-remove\':userForm.userId.$invalid}"></i></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':userForm.userName.$valid, \'has-error\':userForm.userName.$invalid &amp;&amp; userForm.userName.$dirty}"><label for="userfullname" class="col-xs-2 control-label">用户姓名</label><div class="col-xs-9"><input type="text" class="form-control" name="userName" data-ng-model="formData.userName" required=""> <i class="glyphicon form-control-feedback" data-ng-show="userForm.userName.$dirty" data-ng-class="{\'glyphicon-ok\':userForm.userName.$valid, \'glyphicon-remove\':userForm.userName.$invalid}"></i></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':userForm.mobilePhone.$valid, \'has-error\':userForm.mobilePhone.$invalid &amp;&amp; userForm.mobilePhone.$dirty}"><label for="usermobile" class="col-xs-2 control-label">手机</label><div class="col-xs-9"><input type="tex" class="form-control" name="mobilePhone" data-ng-model="formData.mobilePhone" required=""> <i class="glyphicon form-control-feedback" data-ng-show="userForm.mobilePhone.$dirty" data-ng-class="{\'glyphicon-ok\':userForm.mobilePhone.$valid, \'glyphicon-remove\':userForm.mobilePhone.$invalid}"></i></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':userForm.email.$valid, \'has-error\':userForm.email.$invalid &amp;&amp; userForm.email.$dirty}"><label for="usermobile" class="col-xs-2 control-label">邮箱</label><div class="col-xs-9"><input type="email" class="form-control" name="email" data-ng-model="formData.email" required=""> <i class="glyphicon form-control-feedback" data-ng-show="userForm.email.$dirty" data-ng-class="{\'glyphicon-ok\':userForm.email.$valid, \'glyphicon-remove\':userForm.email.$invalid}"></i></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':userForm.role.$valid, \'has-error\':userForm.role.$invalid &amp;&amp; userForm.role.$dirty}"><label class="col-xs-2 control-label">角色</label><div class="col-xs-9"><label class="radio-inline" data-ng-repeat="role in extraData"><input type="radio" name="role" data-ng-value="role.id" data-ng-model="formData.roleId" required=""> {{role.roleName}}</label></div></div><div class="form-group has-feedback"><label class="col-xs-2 control-label" for="userdesc">用户描述</label><div class="col-xs-9"><textarea class="form-control" name="description" rows="3" data-ng-model="formData.description"></textarea></div></div></div><div class="modal-footer"><button class="btn btn-primary" data-ng-disabled="userForm.$invalid" data-ng-click="confirm()"><i class="glyphicon glyphicon-ok"></i> 确认</button> <button class="btn" data-ng-click="cancel()"><i class="glyphicon glyphicon-ban-circle"></i> 取消</button></div></form>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/month-ord.html',
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only">客户名称</label> <input class="form-control" type="text" name="cName" data-ng-model="search.cName" placeholder="客户名称"></div><div class="form-group"><label class="sr-only">年份</label><select class="form-control" data-ng-model="search.year" data-ng-options="y for y in years"><option value="">-- 选择年份 --</option></select></div><div class="form-group"><label class="sr-only">月份</label><select class="form-control" data-ng-model="search.month" data-ng-options="m for m in [1,2,3,4,5,6,7,8,9,10,11,12]"><option value="">-- 选择月份 --</option></select></div><div class="form-group"><button type="submit" class="btn btn-primary" data-ng-click="doSearch(search)"><span class="glyphicon glyphicon-search"></span> 搜素</button></div></form><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>省份</td><td>城市</td><td>客户名称</td><td>客户手机</td><td>总次数</td><td>平均费用</td><td>总费用</td><td>总服务时间(小时)</td><td class="action">操作</td></tr></thead><tbody><tr data-ng-repeat="ord in status"><td data-ng-bind="ord.province"></td><td data-ng-bind="ord.city"></td><td data-ng-bind="ord.cName"></td><td data-ng-bind="ord.cMobile"></td><td data-ng-bind="ord.totalCounts"></td><td data-ng-bind="ord.averageAmount | currency: \'￥\'"></td><td data-ng-bind="ord.totalAmount | currency: \'￥\'"></td><td data-ng-bind="ord.totalHours"></td><td><button class="btn btn-primary btn-xs" data-ng-click="orderByCust(ord.cName)">查看明细 <span class="glyphicon glyphicon-arrow-right"></span></button></td></tr></tbody></table><div class="row" data-ng-show="showPagination"><div class="col-xs-10"><div data-pagination="" data-total-items="total" data-ng-model="pageNum" data-max-size="maxPageSize" class="pagination-sm" data-num-pages="numPages" data-ng-change="changePage()" data-rotate="false" data-boundary-links="true" data-previous-text="Prev"></div></div><div class="col-xs-2 text-right pagination-tip">Page: {{pageNo}} / {{numPages}}</div></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/order.html',
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only">客户名称</label> <input type="text" class="form-control" name="cName" data-ng-model="search.cName" placeholder="客户名称"></div><div class="form-group"><label class="sr-only">账号</label> <input type="text" class="form-control" name="dName" data-ng-model="search.dName" placeholder="司机名称"></div><div class="form-group"><label class="sr-only">订单号</label> <input type="text" class="form-control" name="billNo" data-ng-model="search.billNo" placeholder="订单号"></div><div class="form-group"><label class="sr-only">状态</label><select name="status" class="form-control" data-ng-model="search.status"><option value="">---订单状态---</option><option value="0">确认订单</option><option value="1">取消订单</option></select></div><div class="form-group"><button type="submit" class="btn btn-primary" data-ng-click="doSearch(search)"><span class="glyphicon glyphicon-search"></span> 搜素</button></div></form><button class="btn btn-primary" data-ng-click="syncOrder()" data-ng-class="{\'sync-ing\':rotate}"><i class="glyphicon glyphicon-refresh"></i> <span data-ng-bind="syncStatus"></span></button><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>订单号</td><td>客户信息</td><td>司机信息</td><td>里程</td><td>费用</td><td>目的地</td><td>创建时间</td><td>起始时间</td><td>服务时段</td><td>状态</td></tr></thead><tbody><tr data-ng-repeat="b in bill"><td data-ng-bind="b.billNo"></td><td><span data-ng-bind="b.cName"></span><br><span data-ng-bind="b.cMobile"></span></td><td><span data-ng-bind="b.dName"></span><br><span data-ng-bind="b.dMobile"></span></td><td><span data-ng-bind="b.distance"></span> km</td><td data-ng-bind="b.charge | currency: \'￥\'"></td><td data-ng-bind="b.destination"></td><td data-ng-bind="b.createTime | myDate"></td><td><span data-ng-bind="b.startTime"></span><br><span data-ng-bind="b.endTime"></span></td><td><span data-ng-bind="b.hours"></span> 小时</td><td><i class="glyphicon" data-ng-class="{\'glyphicon-ok-sign text-success\':b.status==0, \'glyphicon-remove-sign text-danger\':b.status==1, \'glyphicon-question-sign\':b.status>1}"></i></td></tr></tbody></table><div class="row" data-ng-show="showPagination"><div class="col-xs-10"><div data-pagination="" data-total-items="total" data-ng-model="pageNum" data-max-size="maxPageSize" class="pagination-sm" data-num-pages="numPages" data-ng-change="changePage()" data-rotate="false" data-boundary-links="true" data-previous-text="Prev"></div></div><div class="col-xs-2 text-right pagination-tip">Page: {{pageNum}} / {{numPages}}</div></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/quarter-ord.html',
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only">客户名称</label> <input class="form-control" type="text" name="cName" data-ng-model="search.cName" placeholder="客户名称"></div><div class="form-group"><label class="sr-only">年份</label><select class="form-control" data-ng-model="search.year" data-ng-options="y for y in years"><option value="">-- 选择年份 --</option></select></div><div class="form-group"><label class="sr-only">季度</label><div class="btn-group"><label class="btn btn-default" ng-model="search.quarter" btn-radio="1">Q1</label> <label class="btn btn-default" ng-model="search.quarter" btn-radio="2">Q2</label> <label class="btn btn-default" ng-model="search.quarter" btn-radio="3">Q3</label> <label class="btn btn-default" ng-model="search.quarter" btn-radio="4">Q4</label></div></div><div class="form-group"><button type="submit" class="btn btn-primary" data-ng-click="doSearch(search)"><span class="glyphicon glyphicon-search"></span> 搜素</button></div></form><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>省份</td><td>城市</td><td>客户名称</td><td>客户手机</td><td>总次数</td><td>平均费用</td><td>总费用</td><td>总服务时间(小时)</td><td class="action">操作</td></tr></thead><tbody><tr data-ng-repeat="ord in status"><td data-ng-bind="ord.province"></td><td data-ng-bind="ord.city"></td><td data-ng-bind="ord.cName"></td><td data-ng-bind="ord.cMobile"></td><td data-ng-bind="ord.totalCounts"></td><td data-ng-bind="ord.averageAmount | currency: \'￥\'"></td><td data-ng-bind="ord.totalAmount | currency: \'￥\'"></td><td data-ng-bind="ord.totalHours"></td><td><button class="btn btn-primary btn-xs" data-ng-click="orderByCust(ord.cName)">查看明细 <span class="glyphicon glyphicon-arrow-right"></span></button></td></tr></tbody></table><div class="row" data-ng-show="showPagination"><div class="col-xs-10"><div data-pagination="" data-total-items="total" data-ng-model="pageNum" data-max-size="maxPageSize" class="pagination-sm" data-num-pages="numPages" data-ng-change="changePage()" data-rotate="false" data-boundary-links="true" data-previous-text="Prev"></div></div><div class="col-xs-2 text-right pagination-tip">Page: {{pageNum}} / {{numPages}}</div></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/role.html',
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only">角色名称</label> <input type="text" class="form-control" name="roleName" data-ng-model="search.roleName" placeholder="角色名称"></div><div class="form-group"><button type="submit" class="btn btn-primary" data-ng-click="doSearch(search)"><span class="glyphicon glyphicon-search"></span> 搜素</button></div></form><button class="btn btn-primary" data-ng-click="saveRole()"><i class="glyphicon glyphicon-plus"></i> 添加</button><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>角色名称</td><td>创建时间</td><td class="action">操作</td></tr></thead><tbody><tr data-ng-repeat="role in roles"><td data-ng-bind="role.roleName"></td><td data-ng-bind="role.createTime | myDate"></td><td><button class="btn btn-primary btn-xs" data-ng-click="saveRole(role)"><span class="glyphicon glyphicon-edit"></span> 编辑</button> <button class="btn btn-danger btn-xs" data-ng-click="remove(role.id)"><span class="glyphicon glyphicon-remove-circle"></span> 删除</button></td></tr></tbody></table><div class="row" data-ng-show="showPagination"><div class="col-xs-10"><div data-pagination="" data-total-items="total" data-ng-model="pageNum" data-max-size="maxPageSize" class="pagination-sm" data-num-pages="numPages" data-ng-change="changePage()" data-rotate="false" data-boundary-links="true" data-previous-text="Prev"></div></div><div class="col-xs-2 text-right pagination-tip">Page: {{pageNum}} / {{numPages}}</div></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/rule.html',
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only">名称</label> <input type="text" class="form-control" name="demo1" data-ng-model="search.name" placeholder="名称"></div><div class="form-group"><label class="sr-only">账号</label> <input type="text" class="form-control" name="demo2" data-ng-model="search.account" placeholder="账号"></div><div class="form-group"><button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span> 搜素</button></div></form><button class="btn btn-primary" data-ng-click="saveRule()"><i class="glyphicon glyphicon-plus"></i> 添加</button><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>编号</td><td>省份</td><td>城市</td><td>时间段</td><td>起步价</td><td>加收金额</td><td>规则描述</td><td class="action">操作</td></tr></thead><tbody><tr data-ng-repeat="rule in rules"><td data-ng-bind="rule.ruleId"></td><td data-ng-bind="rule.province"></td><td data-ng-bind="rule.city"></td><td data-ng-bind="rule.period"></td><td data-ng-bind="rule.startPrice"></td><td data-ng-bind="rule.extraPrice"></td><td data-ng-bind="rule.description"></td><td><button class="btn btn-primary btn-xs" data-ng-click="saveRule(rule)"><span class="glyphicon glyphicon-edit"></span> 编辑</button> <button class="btn btn-danger btn-xs" data-ng-click="remove(rule.ruleId)"><span class="glyphicon glyphicon-remove-circle"></span> 删除</button></td></tr></tbody></table><div class="row" data-ng-show="showPagination"><div class="col-xs-10"><div data-pagination="" data-total-items="total" data-ng-model="pageNum" data-max-size="maxPageSize" class="pagination-sm" data-num-pages="numPages" data-ng-change="changePage()" data-rotate="false" data-boundary-links="true" data-previous-text="Prev"></div></div><div class="col-xs-2 text-right pagination-tip">Page: {{pageNum}} / {{numPages}}</div></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/time-ord.html',
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only">客户名称</label> <input class="form-control" type="text" name="cName" data-ng-model="search.cName" placeholder="客户名称"></div><div class="form-group"><label class="sr-only">开始时间</label><div class="input-group dds-dp"><input type="text" class="form-control" datepicker-popup="" ng-model="search.dp1" is-open="sOpen" datepicker-options="dateOptions" show-button-bar="false"> <span class="input-group-btn"><button type="button" class="btn btn-default" style="height:34px;" ng-click="toggleDP1($event)"><i class="glyphicon glyphicon-calendar"></i></button></span></div></div><div class="form-group"><label class="sr-only">结束时间</label><div class="input-group dds-dp"><input type="text" class="form-control" datepicker-popup="" ng-model="search.dp2" is-open="eOpen" datepicker-options="dateOptions" show-button-bar="false" min-date="search.dp1"> <span class="input-group-btn"><button type="button" class="btn btn-default" style="height:34px;" ng-click="toggleDP2($event)"><i class="glyphicon glyphicon-calendar"></i></button></span></div></div><div class="form-group"><button type="submit" class="btn btn-primary" data-ng-click="doSearch(search)"><i class="glyphicon glyphicon-search"></i> 搜素</button></div></form><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>省份</td><td>城市</td><td>客户名称</td><td>客户手机</td><td>总次数</td><td>平均费用</td><td>总费用</td><td>总服务时间(小时)</td><td class="action">操作</td></tr></thead><tbody><tr data-ng-repeat="ord in status"><td data-ng-bind="ord.province"></td><td data-ng-bind="ord.city"></td><td data-ng-bind="ord.cName"></td><td data-ng-bind="ord.cMobile"></td><td data-ng-bind="ord.totalCounts"></td><td data-ng-bind="ord.averageAmount | currency: \'￥\'"></td><td data-ng-bind="ord.totalAmount | currency: \'￥\'"></td><td data-ng-bind="ord.totalHours"></td><td><button class="btn btn-primary btn-xs" data-ng-click="orderByCust(ord.cName)">查看明细 <span class="glyphicon glyphicon-arrow-right"></span></button></td></tr></tbody></table><div class="row" data-ng-show="showPagination"><div class="col-xs-10"><div data-pagination="" data-total-items="total" data-ng-model="pageNum" data-max-size="maxPageSize" class="pagination-sm" data-num-pages="numPages" data-ng-change="changePage()" data-rotate="false" data-boundary-links="true" data-previous-text="Prev"></div></div><div class="col-xs-2 text-right pagination-tip">Page: {{pageNo}} / {{numPages}}</div></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/user.html',
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only">姓名</label> <input type="text" class="form-control" name="userId" data-ng-model="search.userName" placeholder="姓名"></div><div class="form-group"><button type="submit" class="btn btn-primary" data-ng-click="doSearch(search)"><span class="glyphicon glyphicon-search"></span> 搜素</button></div></form><button class="btn btn-primary" data-ng-click="saveUser()"><i class="glyphicon glyphicon-plus"></i> 添加</button><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>用户名</td><td>姓名</td><td>角色</td><td>备注</td><td>添加时间</td><td class="action">操作</td></tr></thead><tbody><tr data-ng-repeat="user in users"><td data-ng-bind="user.userId"></td><td data-ng-bind="user.userName"></td><td data-ng-bind="user.role.roleName"></td><td data-ng-bind="user.description"></td><td data-ng-bind="user.createTime | myDate"></td><td><button class="btn btn-primary btn-xs" data-ng-click="saveUser(user)"><span class="glyphicon glyphicon-edit"></span> 编辑</button> <button class="btn btn-danger btn-xs" data-ng-click="remove(user.id)"><span class="glyphicon glyphicon-remove-circle"></span> 删除</button></td></tr></tbody></table><div class="row" data-ng-show="showPagination"><div class="col-xs-10"><div data-pagination="" data-total-items="total" data-ng-model="pageNum" data-max-size="maxPageSize" class="pagination-sm" data-num-pages="numPages" data-ng-change="changePage()" data-rotate="false" data-boundary-links="true" data-previous-text="Prev"></div></div><div class="col-xs-2 text-right pagination-tip">Page: {{pageNum}} / {{numPages}}</div></div>');
}]);
})();
