'use strict';

const gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  concat = require('gulp-concat'),
  htmlmin = require('gulp-htmlmin'),
  imagemin = require('gulp-imagemin'),
  connect = require('gulp-connect'),
  runSequence = require('run-sequence'),
  clean = require('gulp-clean');

const srcDir = './src';
const srcPath = {
  'scss': srcDir + '/scss/**/*.scss',
  'scssMain': srcDir + '/scss/main.scss',
  'html': srcDir + '/view/**/*.html',
  'img': srcDir + '/img/**/*.*',
  'font': srcDir + '/font/**/*.*'
};

const distDit = './dist';
const distPath = {
  'css': distDit + '/css',
  'html': distDit,
  'img': distDit + '/img',
  'font': distDit + '/font'
};

gulp.task('scss', () => {
  return gulp.src(srcPath.scssMain)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
    }))
    .pipe(concat('styles.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(distPath.css));
});

gulp.task('html', () => {
  return gulp.src(srcPath.html)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(distPath.html));
});

gulp.task('img', () => {
  return gulp.src(srcPath.img)
    .pipe(imagemin())
    .pipe(gulp.dest(distPath.img));
});

gulp.task('font', () => {
  return gulp.src(srcPath.font)
    .pipe(gulp.dest(distPath.font));
});

gulp.task('clean:public', () => {
  return gulp.src(distDit)
    .pipe(clean({
      force: true
    }));
});

gulp.task('server', () => {
  connect.server({
    root: distDit,
    livereload: true,
    port: 8001
  });
});

gulp.task('build', () => {
  runSequence('clean:public', ['scss', 'html', 'img', 'font']);
});

gulp.task('watch', () => {
  gulp.watch(srcPath.scss, ['scss']);
  gulp.watch(srcPath.html, ['html']);
  gulp.watch(srcPath.img, ['img']);
  gulp.watch(srcPath.font, ['font']);
});

gulp.task('default', () => {
  runSequence('build', 'watch', 'server');
});