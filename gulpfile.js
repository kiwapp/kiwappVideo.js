var gulp          = require('gulp'),
    browserify    = require('gulp-browserify'),
    rename        = require('gulp-rename'),
    jshint        = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    footer        = require('gulp-footer'),
    fs            = require('fs');

gulp.task('browserifyKiwappVideo', function(){
    fs.readFile('dev/kiwappVideo/version.js', 'utf8', function (err,data) {
        var version = data.split('\'')[1].replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
      gulp.src('./dev/kiwappVideo/kiwappVideo.js')
        .pipe(browserify())
        .pipe(rename('kiwappVideo.js'))
        .pipe(footer(';'))
        .pipe(gulp.dest('.'));
    });

});

gulp.task('checkKiwappVideo', function () {
  return gulp.src(['./dev/kiwappVideo/**/*.js', './dev/utils/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(jshintStylish));
});

gulp.task('default', function(){
    gulp.run('checkKiwappVideo');
    gulp.run('browserifyKiwappVideo');
});


gulp.task('watch', function(){
    gulp.watch( './dev/**/*.js',function(evt){
        console.log(evt.path, 'changed');
        gulp.run('default');
    });
});