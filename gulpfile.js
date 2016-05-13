var gulp         = require('gulp');
var browserSync = require('browser-sync');
var jshint       = require('gulp-jshint');
var runSequence  = require('run-sequence');
var uglify       = require('gulp-uglify');


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
  return gulp.src(['src/**/*.js'])
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
    'src/**/*.js'
  ], ['validate']);

  gulp.watch([
    'test/*.html'
  ], ['copy-test']);
});



gulp.task('default', function(callback) {
  runSequence(['lint', 'copy-test'], 'browser-sync', 'watch', callback);
});
// Alias to default
gulp.task('serve', ['default']);
