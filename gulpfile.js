(function (gulp, gulpLoadPlugins) {
  'use strict';

  var $ = gulpLoadPlugins({ pattern: '*', lazy: true }),
      _ = { 
        app: 'app', 
        dist:'app/dist',
        img: 'app/img',
        sass:'app/sass',
        css: 'app/css',
        js:  'app/js',
        views:'app/views'
      };

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ jsonlint
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('jsonlint', function() {
    return gulp.src([
      'package.json',
      'bower.json',
      '.bowerrc',
      '.jshintrc',
      '.jscs.json'
    ])
    .pipe($.plumber())
    .pipe($.jsonlint())
    .pipe($.jsonlint.reporter());
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ jshint
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('jshint', function() {
    return gulp.src([
      'gulpfile.js',
      _.js + '/**/*.js'
    ])
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('default'));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ sass2css
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('sass', function(){
    return gulp.src(_.sass + '/**/*.{scss, sass}').pipe($.rubySass({
      loadPath: [
        'app/bower_components/bootstrap-sass/lib/',
        'app/bower_components/animate-scss/src/'
      ],
      style: 'expanded',
      compass: true,
      noCache: false,
      lineNumber:true
    }).on('error', $.util.log))
    .pipe($.plumber())
    .pipe(gulp.dest(_.css))
    .pipe($.size());
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ minify svg files
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('svg', function() {
    return gulp.src([
      _.img + '/**/*.svg',
      _.css + '/**/*.svg'
    ])
    .pipe($.plumber())
    .pipe($.svgmin([{ removeDoctype: false }, { removeComments: false }]))
    .pipe(gulp.dest(_.dist + '/img'))
    .pipe($.size());
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ minify images
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('images', function() {
    return gulp.src([ _.img + '/**/*.{png,jpg,jpeg,gif,ico}'])
    .pipe($.plumber())
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(_.dist + '/img'))
    .pipe($.size());
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ join & minify css & js
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('html', ['sass'], function() {
    return gulp.src('app/*.html')
    .pipe($.plumber())
    .pipe($.useref.assets())
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({keepSpecialComments:0})))
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe(gulp.dest(_.dist))
    .pipe($.size());
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ minify json files
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('json', function(){
    return gulp.src(_.app + '/json/*.json')
    .pipe($.jsonminify())
    .pipe(gulp.dest(_.dist + '/json/'));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ minify template files
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('tmpl', function(){
    return gulp.src(_.views + '/*.html')
    .pipe($.minifyHtml())
    .pipe(gulp.dest(_.dist + '/views/'));
  });


  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ connect
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('connect', $.connect.server({
    root: [_.app],
    livereload: true,
    port: 9000
  }));

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ server
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
 gulp.task('server', ['connect', 'sass'], function() {
   gulp.start('localhost');
 });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ watch
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('watch', ['server'], function() {
    $.watch({ glob: [
      _.app + '/*.{html,txt}',
      _.views + '/*.html',
      _.app + '/json/*.json',
      _.css + '/**/*.css',
      _.js + '/**/*.js',
      _.img + '/**/*.{png,jpg,jpeg,gif,ico}'
    ]}, function(files) {
      return files.pipe($.plumber()).pipe($.connect.reload());
    });

    // Watch style files
    $.watch({ glob: [_.sass + '/**/*.{sass,scss}'] }, function() {
      gulp.start('sass');
    });

    // Watch image files
    $.watch({ glob: [_.img + '/**/*.{png,jpg,jpeg,gif,ico}'] }, function() {
      gulp.start('images');
    });
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ clean dist folder
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('clean', function() {
    var stream = gulp.src([
      _.dist + '*'
    ], { read: false });
    return stream.pipe($.rimraf());
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ environ
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('localhost', function() {
    $.shelljs.exec('open http://localhost:9000/d.html');
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ alias
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('test', ['jsonlint', 'jshint']);
  gulp.task('build', ['test', 'clean', 'html', 'json', 'tmpl', 'images', 'svg']);

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ default
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('default', ['clean'], function() {
    gulp.start('build');
  });

}(require('gulp'), require('gulp-load-plugins')));