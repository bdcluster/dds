(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/chgpwd.html',
    '<div class="col-xs-8 col-xs-offset-2"><h2>修改密码：</h2><form class="form-horizontal" role="form" name="chgpwdForm" data-ng-submit="pwdSubmit()" novalidate=""><div class="form-group has-feedback" data-ng-class="{\'has-success\':chgpwdForm.oldPwd.$valid, \'has-error\':chgpwdForm.oldPwd.$invalid &amp;&amp; chgpwdForm.oldPwd.$dirty}"><div class="input-group col-xs-10 col-xs-offset-1"><div class="input-group-addon"><i class="iconfont icon-oldpwd"></i></div><input type="password" class="form-control input-lg" name="oldPwd" data-ng-model="pwd.oldPwd" placeholder="原密码" required=""></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':chgpwdForm.newPwd.$valid, \'has-error\':chgpwdForm.newPwd.$invalid &amp;&amp; chgpwdForm.newPwd.$dirty}"><div class="input-group col-xs-10 col-xs-offset-1"><div class="input-group-addon"><i class="iconfont icon-newpwd"></i></div><input type="password" class="form-control input-lg" name="newPwd" data-ng-model="pwd.newPwd" placeholder="新密码" required=""></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':chgpwdForm.rpNewPwd.$valid, \'has-error\':(pwd.rpNewPwd != pwd.newPwd) &amp;&amp; chgpwdForm.rpNewPwd.$dirty}"><div class="input-group col-xs-10 col-xs-offset-1"><div class="input-group-addon"><i class="iconfont icon-newpwd2"></i></div><input type="password" class="form-control input-lg" name="rpNewPwd" data-ng-model="pwd.rpNewPwd" placeholder="重复密码" required=""></div></div><div class="form-group"><div class="col-xs-offset-1 col-xs-5"><button type="submit" class="btn btn-primary btn-block btn-lg" ng-disabled="chgpwdForm.$invalid || isUnchanged(pwd)"><span class="iconfont icon-mima"></span> 确 定 修 改</button></div></div></form></div>');
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
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only">名称</label><input type="text" class="form-control" name="demo1" data-ng-model="search.name" placeholder="名称"></div><div class="form-group"><label class="sr-only">账号</label><input type="text" class="form-control" name="demo2" data-ng-model="search.account" placeholder="账号"></div><div class="form-group"><button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span> 搜素</button></div></form><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>姓名</td><td>账号</td><td>角色</td><td class="action">操作</td></tr></thead><tbody><tr><td>Tom Cruise</td><td>tomcat</td><td>admin</td><td><button class="btn btn-primary btn-xs" data-ng-click="modify()"><span class="glyphicon glyphicon-edit"></span> 编辑</button><button class="btn btn-danger btn-xs" data-ng-click="remove()"><span class="glyphicon glyphicon-remove-circle"></span> 删除</button></td></tr><tr><td>Jerry</td><td></td><td></td><td></td></tr><tr><td>Andy</td><td></td><td></td><td></td></tr></tbody></table><div class="row"><div class="col-xs-10"><div data-pagination="" data-total-items="totleRecords" data-ng-model="currentPage" data-items-per-page="recordsPerPage" data-max-size="maxSize" class="pagination-sm" data-boundary-links="true" data-num-pages="numPages" data-ng-change="changePage()" data-previous-text="Prev"></div></div><div class="col-xs-2 text-right pagination-tip">Page: {{currentPage}} / {{numPages}}</div></div>');
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
    '<div class="modal-header"><h3 class="modal-title" data-ng-bind="modalTitle"></h3></div><div class="modal-body"><form class="form-horizontal" role="form" name="normalForm"><div class="form-group"><label for="username" class="col-xs-2 control-label">用户名</label><div class="col-xs-9"><p class="form-control-static">用户名</p></div></div><div class="form-group"><label for="userfullname" class="col-xs-2 control-label">用户姓名</label><div class="col-xs-9"><input type="password" class="form-control" id="userfullname" name="userfullname" data-ng-model="formData.userfullname"></div></div><div class="form-group"><label for="usermobile" class="col-xs-2 control-label">手机</label><div class="col-xs-9"><input type="password" class="form-control" id="usermobile" name="usermobile" data-ng-model="formData.usermobile"></div></div><div class="form-group"><label class="col-xs-2 control-label">角色</label><div class="col-xs-9"><label class="checkbox-inline"><input type="checkbox" data-ng-true-value="1" data-ng-model="formData.chk1" name="role">管理员</label><label class="checkbox-inline"><input type="checkbox" data-ng-true-value="2" data-ng-model="formData.chk2" name="role">用户</label></div></div><div class="form-group"><label class="col-xs-2 control-label">单选</label><div class="col-xs-9"><label class="radio-inline"><input type="radio" name="r" value="1" data-ng-model="formData.radio">管理员</label><label class="radio-inline"><input type="radio" name="r" value="2" data-ng-model="formData.radio">用户</label></div></div><div class="form-group"><label class="col-xs-2 control-label" for="usersel">选择</label><div class="col-xs-9"><select class="form-control" id="usersel" name="usersel" data-ng-model="formData.usersel"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div></div><div class="form-group"><label class="col-xs-2 control-label" for="userdesc">用户备注</label><div class="col-xs-9"><textarea class="form-control" id="userdesc" name="userdesc" rows="3" data-ng-model="formData.userdesc"></textarea></div></div></form></div><div class="modal-footer"><button class="btn btn-primary" ng-click="confirm()"><span class="glyphicon glyphicon-ok"></span> 确认</button><button class="btn" ng-click="cancel()"><span class="glyphicon glyphicon-ban-circle"></span> 取消</button></div>');
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
    '<div class="modal-body"><span class="glyphicon glyphicon-exclamation-sign text-danger"></span> <strong class="text-danger" data-ng-bind="removeText"></strong></div><div class="modal-footer"><button class="btn btn-danger btn-xs" ng-click="confirm()"><span class="glyphicon glyphicon-remove-circle"></span> 删除</button><button class="btn btn-xs" ng-click="cancel()"><span class="glyphicon glyphicon-ban-circle"></span> 取消</button></div>');
}]);
})();
;(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/modal.general.user.html',
    '<div class="modal-header"><h3 class="modal-title" data-ng-bind="modalTitle"></h3></div><div class="modal-body"><form class="form-horizontal form-modal" role="form" name="userForm"><div class="form-group has-feedback" data-ng-class="{\'has-success\':userForm.userId.$valid, \'has-error\':userForm.userId.$invalid &amp;&amp; userForm.userId.$dirty}"><label for="username" class="col-xs-2 control-label">用户名</label><div class="col-xs-9"><input type="text" class="form-control" name="userId" data-ng-model="user.userId" required=""><i class="glyphicon form-control-feedback" data-ng-show="userForm.userId.$dirty" data-ng-class="{\'glyphicon-ok\':userForm.userId.$valid, \'glyphicon-remove\':userForm.userId.$invalid}"></i></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':userForm.userName.$valid, \'has-error\':userForm.userName.$invalid &amp;&amp; userForm.userName.$dirty}"><label for="userfullname" class="col-xs-2 control-label">用户姓名</label><div class="col-xs-9"><input type="text" class="form-control" name="userName" data-ng-model="user.userName" required=""><i class="glyphicon form-control-feedback" data-ng-show="userForm.userName.$dirty" data-ng-class="{\'glyphicon-ok\':userForm.userName.$valid, \'glyphicon-remove\':userForm.userName.$invalid}"></i></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':userForm.mobile.$valid, \'has-error\':userForm.mobile.$invalid &amp;&amp; userForm.mobile.$dirty}"><label for="usermobile" class="col-xs-2 control-label">手机</label><div class="col-xs-9"><input type="tex" class="form-control" name="mobile" data-ng-model="user.mobile" required=""><i class="glyphicon form-control-feedback" data-ng-show="userForm.mobile.$dirty" data-ng-class="{\'glyphicon-ok\':userForm.mobile.$valid, \'glyphicon-remove\':userForm.mobile.$invalid}"></i></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':userForm.email.$valid, \'has-error\':userForm.email.$invalid &amp;&amp; userForm.email.$dirty}"><label for="usermobile" class="col-xs-2 control-label">邮箱</label><div class="col-xs-9"><input type="email" class="form-control" name="email" data-ng-model="user.email" required=""><i class="glyphicon form-control-feedback" data-ng-show="userForm.email.$dirty" data-ng-class="{\'glyphicon-ok\':userForm.email.$valid, \'glyphicon-remove\':userForm.email.$invalid}"></i></div></div><div class="form-group has-feedback"><label class="col-xs-2 control-label">角色</label><div class="col-xs-9"><label class="radio-inline"><input type="radio" name="role" value="1" data-ng-model="user.role">管理员</label><label class="radio-inline"><input type="radio" name="role" value="2" data-ng-model="user.role">用户</label></div></div><div class="form-group has-feedback"><label class="col-xs-2 control-label" for="userdesc">用户描述</label><div class="col-xs-9"><textarea class="form-control" name="description" rows="3" data-ng-model="user.description"></textarea></div></div></form></div><div class="modal-footer"><button class="btn btn-primary" ng-click="confirm()" ng-disabled="userForm.$invalid"><span class="glyphicon glyphicon-ok"></span> 确认</button><button class="btn" ng-click="cancel()"><span class="glyphicon glyphicon-ban-circle"></span> 取消</button></div>');
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
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only">名称</label><input type="text" class="form-control" name="demo1" data-ng-model="search.name" placeholder="名称"></div><div class="form-group"><label class="sr-only">账号</label><input type="text" class="form-control" name="demo2" data-ng-model="search.account" placeholder="账号"></div><div class="form-group"><button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span> 搜素</button></div></form><button class="btn btn-primary" data-ng-click="addUser()"><i class="glyphicon glyphicon-plus"></i> 添加</button><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>用户名</td><td>姓名</td><td>角色</td><td>备注</td><td>添加时间</td><td class="action">操作</td></tr></thead><tbody><tr data-ng-repeat="user in users"><td data-ng-bind="user.userId"></td><td data-ng-bind="user.userName"></td><td data-ng-bind="user.roles"></td><td data-ng-bind="user.description"></td><td data-ng-bind="user.createTime"></td><td><button class="btn btn-primary btn-xs" data-ng-click="modify(user.id)"><span class="glyphicon glyphicon-edit"></span> 编辑</button><button class="btn btn-danger btn-xs" data-ng-click="remove(user.id)"><span class="glyphicon glyphicon-remove-circle"></span> 删除</button></td></tr></tbody></table><div class="row" data-ng-show="showPagination"><div class="col-xs-10"><div data-pagination="" data-total-items="totalRecords" data-ng-model="currentPage" data-max-size="maxPageSize" class="pagination-sm" data-num-pages="numPages" data-ng-change="changePage()" data-rotate="false" data-boundary-links="true" data-previous-text="Prev"></div></div><div class="col-xs-2 text-right pagination-tip">Page: {{currentPage}} / {{numPages}}</div></div>');
}]);
})();
