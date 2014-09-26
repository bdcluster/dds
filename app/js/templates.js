(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/form.login.html',
    '<form class="form-horizontal" role="form" name="loginForm" data-ng-submit="log.checkLogin()" novalidate=""><div class="form-group has-feedback" data-ng-class="{\'has-success\':loginForm.username.$valid, \'has-error\':loginForm.username.$invalid &amp;&amp; loginForm.username.$dirty}"><div class="input-group col-xs-10 col-xs-offset-1"><div class="input-group-addon"><span class="iconfont icon-yonghu"></span></div><input type="text" class="form-control" name="username" data-ng-model="user.username" placeholder="用户名" required=""></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':loginForm.password.$valid, \'has-error\':loginForm.password.$invalid &amp;&amp; loginForm.password.$dirty}"><div class="input-group col-xs-10 col-xs-offset-1"><div class="input-group-addon"><span class="iconfont icon-mima"></span></div><input type="password" class="form-control" name="password" data-ng-model="user.password" placeholder="密码" required=""></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':loginForm.yanzheng.$valid, \'has-error\':loginForm.yanzheng.$invalid &amp;&amp; loginForm.yanzheng.$dirty}"><div class="input-group col-xs-5 col-xs-offset-1 pull-left"><div class="input-group-addon"><span class="iconfont icon-yanzheng"></span></div><input type="text" class="form-control" name="yanzheng" data-ng-model="user.yanzheng" placeholder="验证码" data-ng-minlength="4" required=""></div><div class="col-xs-4"><img src="http://www.csusu.cn/checkcode.aspx" alt="验证码" class="yanzheng"></div></div><div class="form-group"><div class="col-xs-offset-1 col-xs-5"><button type="submit" class="btn btn-primary btn-block btn-login" ng-disabled="loginForm.$invalid"><span class="iconfont icon-login"></span> 登 录</button></div></div></form>');
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
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only">名称</label><input type="text" class="form-control" name="demo1" data-ng-model="glob.search.name" placeholder="名称"></div><div class="form-group"><label class="sr-only">账号</label><input type="text" class="form-control" name="demo2" data-ng-model="glob.search.account" placeholder="账号"></div><div class="form-group"><button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span> 搜素</button></div></form><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>姓名</td><td>账号</td><td>角色</td><td class="action">操作</td></tr></thead><tbody><tr><td>Tom Cruise</td><td>tomcat</td><td>admin</td><td><button class="btn btn-primary btn-xs" data-ng-click="home.modify()"><span class="glyphicon glyphicon-edit"></span> 编辑</button><button class="btn btn-danger btn-xs" data-ng-click="home.remove()"><span class="glyphicon glyphicon-remove-circle"></span> 删除</button></td></tr><tr><td>Jerry</td><td></td><td></td><td></td></tr><tr><td>Andy</td><td></td><td></td><td></td></tr></tbody></table><div class="row"><div class="col-xs-10"><div data-pagination="" data-total-items="home.totleRecords" data-ng-model="home.currentPage" data-items-per-page="home.recordsPerPage" data-max-size="home.maxSize" class="pagination-sm" data-boundary-links="true" data-num-pages="home.numPages" data-ng-change="home.changePage()" data-previous-text="Prev"></div></div><div class="col-xs-2 text-right pagination-tip">Page: {{home.currentPage}} / {{home.numPages}}</div></div>');
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
    '<div data-accordion="" close-others="true"><div data-accordion-group="" data-ng-repeat="m in glob.menus" data-is-open="m.open" data-ng-click="glob.markOpen($index)" data-ng-class="{active:m.open}"><div data-accordion-heading=""><span class="iconfont" data-ng-class="{\'icon-{{m.alias}}\': true}"></span> {{m.name}}</div><ul class="nav nav-pills nav-stacked"><li data-ng-repeat="m2 in m.subname" data-ng-class="{active: glob.isActivedMenu(\'/\'+m2.path)}"><a href="#/{{m2.path}}"><span class="iconfont icon-arrow-right"></span> <span data-ng-bind="m2.name"></span></a></li></ul></div></div>');
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
    '<div class="modal-header"><h3 class="modal-title" data-ng-bind="modalTitle"></h3></div><div class="modal-body">Modal Body</div><div class="modal-footer"><button class="btn btn-primary" ng-click="confirm()"><span class="glyphicon glyphicon-ok"></span> 确认</button><button class="btn" ng-click="cancel()"><span class="glyphicon glyphicon-ban-circle"></span> 取消</button></div>');
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
