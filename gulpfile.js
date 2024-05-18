const gulp = require('gulp');
const del = require('del');
const scss = require('gulp-sass')(require('sass'));
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');
const newer = require('gulp-newer');
const gulpPug = require('gulp-pug');
const typescript = require('gulp-typescript');
const browserSync = require('browser-sync').create();

const paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: [
      'src/scripts/**/*.js', 'src/scripts/**/*.ts'],
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/**',
    dest: 'dist/img/'
  },
  html:{
    src: 'src/*.html',
    dest: 'dist/'
  },
  pug:{
    src: 'src/*.pug',
    dest: 'dist/'
  }
}

function clean() {
  return del(['dist/*', '!dist/img']);
}

function styles() {
  return gulp.src(paths.styles.src)
  .pipe(sourcemaps.init())
  .pipe(scss())
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(cleanCss({
    level: 2
  }))
  .pipe(rename({
    basename: 'main',
    suffix: '.min'
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(size({showFiles: true}))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(paths.scripts.src)
  .pipe(sourcemaps.init())
  .pipe(ts({
    noImplicitAny: true,
    outFile: 'output.js'
  }))
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(size({showFiles: true}))
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browserSync.stream());
}

function img(){
  return gulp.src(paths.images.src, {encoding: false })
  .pipe(newer(paths.images.dest))
  .pipe(imagemin({
    progressive: true
  }))
  .pipe(size({showFiles: true}))
  .pipe(gulp.dest(paths.images.dest))
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream())
}

function pug() {
  return gulp.src(paths.pug.src)
    .pipe(gulpPug())
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browserSync.stream())
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch(paths.html.dest).on('change', browserSync.reload);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, img);
}

const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch);

exports.html = html;
exports.pug = pug;
exports.clean=clean;
exports.img=img;
exports.styles=styles;
exports.scripts=scripts;
exports.watch =watch;
exports.build = build;
exports.default = build;