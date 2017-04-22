var gulp = require('gulp');
var concat = require('gulp-concat');
var purify = require('gulp-purifycss');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');

gulp.task('build', ['minify-css'], function() {
    console.log('DONE !');
});

gulp.task('minify-css', [], function() {
  return gulp.src('./_site/assets/css/all.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('production.min.css'))
    .pipe(gulp.dest('./assets/css'));
});