var gulp        = require('gulp');
var browserSync = require('browser-sync');
var cssmin      = require('gulp-cssmin');
var jshint      = require('gulp-jshint');
var plumber     = require('gulp-plumber');
var runSequence = require('run-sequence');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');

// Browser sync
gulp.task('browser-sync', function() {
  browserSync({
    notify: false,
    port: 7658,
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('browser-reload', function() {
  browserSync.reload();
});



// CSS
gulp.task('sass', function(callback) {
  return gulp.src('src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(
      sass({
        includePaths: [
          'src/scss',
          'node_modules/bourbon/app/assets/stylesheets'
        ]
      })
      .on('error', sass.logError)
    )
    .pipe(gulp.dest('_site/css'))
    .pipe(browserSync.reload({ stream: true }))
    .on('close', callback);
});



// Copier
gulp.task('copy-test', function(callback) {
  return gulp.src([
      'test/**/*',
    ])
    .pipe(gulp.dest('_site'))
    .on('close', callback);
});



// Linter
gulp.task('lint', function(callback) {
  return gulp.src(['src/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('_site/js'))
    .on('close', callback);
});



// Validater
gulp.task('validate', function(callback) {
  runSequence('lint', 'browser-reload', callback);
});



// Watcher
gulp.task('watch', function(callback) {
  gulp.watch([
    'src/scss/**/*.scss'
  ], ['sass']);

  gulp.watch([
    'src/js/**/*.js'
  ], ['validate']);

  gulp.watch([
    'test/*.html'
  ], ['copy-test']);
});



gulp.task('default', function(callback) {
  runSequence(['sass', 'lint', 'copy-test'], 'browser-sync', 'watch', callback);
});
// Alias to default
gulp.task('serve', ['default']);
