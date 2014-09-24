(function(module) {
try {
  module = angular.module('DdsTemplate');
} catch (e) {
  module = angular.module('DdsTemplate', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('views/form.login.html',
    '<form class="form-horizontal" role="form" name="loginForm" data-ng-submit="log.checkLogin()" novalidate=""><div class="form-group has-feedback" data-ng-class="{\'has-success\':loginForm.username.$valid, \'has-error\':loginForm.username.$invalid &amp;&amp; loginForm.username.$dirty}"><div class="input-group col-xs-11 col-xs-offset-1"><div class="input-group-addon"><span class="iconfont icon-yonghu"></span></div><input type="text" class="form-control" name="username" data-ng-model="user.username" placeholder="用户名" required=""></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':loginForm.password.$valid, \'has-error\':loginForm.password.$invalid &amp;&amp; loginForm.password.$dirty}"><div class="input-group col-xs-11 col-xs-offset-1"><div class="input-group-addon"><span class="iconfont icon-mima"></span></div><input type="password" class="form-control" name="password" data-ng-model="user.password" placeholder="密码" required=""></div></div><div class="form-group has-feedback" data-ng-class="{\'has-success\':loginForm.yanzheng.$valid, \'has-error\':loginForm.yanzheng.$invalid &amp;&amp; loginForm.yanzheng.$dirty}"><div class="input-group col-xs-7 col-xs-offset-1"><div class="input-group-addon"><span class="iconfont icon-yanzheng"></span></div><input type="text" class="form-control" name="yanzheng" data-ng-model="user.yanzheng" placeholder="验证码" data-ng-minlength="4" required=""></div><div class="col-xs-4"><img src="http://www.csusu.cn/checkcode.aspx" alt="验证码" class="yanzheng"></div></div><div class="form-group"><div class="col-xs-offset-1 col-xs-5"><button type="submit" class="btn btn-primary btn-block" ng-disabled="loginForm.$invalid"><span class="iconfont icon-login"></span> 登 录</button></div></div></form>');
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
    '<div class="well"><form class="form-inline pull-right" role="form"><div class="form-group"><label class="sr-only" for="demo1">Email address</label><input type="email" class="form-control" id="demo1" placeholder="名称"></div><div class="form-group"><label class="sr-only" for="demo2">Email address</label><input type="email" class="form-control" id="demo2" placeholder="账号"></div><div class="form-group"><button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span> 搜素</button></div></form><div class="clearfix"></div></div><table class="table table-bordered table-striped table-dds"><thead><tr><td>姓名</td><td>账号</td><td>角色</td><td>操作</td></tr></thead><tbody><tr><td>Tom</td><td></td><td></td><td></td></tr><tr><td>Jerry</td><td></td><td></td><td></td></tr><tr><td>Andy</td><td></td><td></td><td></td></tr></tbody></table><div class="row"><div class="col-xs-10"><pagination total-items="home.totleRecords" ng-model="home.currentPage" items-per-page="home.recordsPerPage" max-size="home.maxSize" class="pagination-sm" boundary-links="true" rotate="false" num-pages="home.numPages" ng-change="home.changePage()"></pagination></div><div class="col-xs-2 text-right pagination-tip">Page: {{home.currentPage}} / {{home.numPages}}</div></div>');
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
    '<accordion close-others="true" ng-init="glob.keepOpenAccordion()"><accordion-group data-ng-repeat="m in glob.menus" is-open="m.open" ng-click="glob.markOpen($index)"><accordion-heading><span class="glyphicon glyphicon-check"></span> {{m.name}}</accordion-heading><ul class="nav nav-pills nav-stacked"><li data-ng-repeat="m2 in m.sub" data-ng-class="{active: glob.isActivedMenu(\'/\'+m2.d)}"><a href="#/{{m2.d}}"><span class="iconfont icon-arrow-right"></span> <span data-ng-bind="m2.name2"></span></a></li></ul></accordion-group></accordion>');
}]);
})();
