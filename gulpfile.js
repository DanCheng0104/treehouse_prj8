"use strict";

const gulp = require('gulp'),
	rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
   maps = require('gulp-sourcemaps'),
   csso = require('gulp-csso'),
  del = require('del'),
  connect = require('gulp-connect'),
  imagemin = require('gulp-imagemin'),
  replace = require('gulp-replace'),
  useref = require('gulp-useref');

//As a developer, I should be able to run the gulp scripts command at the command line to concatenate, minify, and copy 
//all of the project’s JavaScript files into an all.min.js file that is then copied to the dist/scripts folder

//gulp.task('script')

const options = {
  jsFiles: 'js/**/*.js',
  jsDest: 'dist/scripts',
  styleDest: 'dist/styles',
  contentDest: 'dist/content'
};
//As a developer, I should be able to run the gulp clean command at the command line to 
//delete all of the files and folders in the dist folder.
gulp.task('clean', ()=>del(['dist/**/*']));


gulp.task('scripts', () => {
    return gulp.src(options.jsFiles)
    				.pipe(maps.init())
       			.pipe(concat('global.js'))
       			.pipe(uglify())
       			.pipe(rename('all.min.js'))
       			.pipe(maps.write('./'))
       			.pipe(gulp.dest(options.jsDest));
});

//As a developer, I should be able to run the gulp styles command at the command line to 
//compile the project’s SCSS files into CSS, then concatenate and minify into an all.min.css file 
//that is then copied to the dist/styles folder.

gulp.task('styles', () => {
  return gulp.src("sass/global.scss")
      .pipe(maps.init())
      .pipe(sass())
      .pipe(csso())
      .pipe(rename('all.min.css'))
      .pipe(maps.write('./'))
      .pipe(gulp.dest(options.styleDest));
});

//As a developer, I should be able to run the gulp images command at the command line to optimize 
//the size of the project’s JPEG and PNG files, and then copy those optimized images to the dist/content folder.

gulp.task('images', () =>
    gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(options.contentDest))
);

//As a developer, I should be able to run the gulp build command at the command 
//line to run the clean, scripts, styles, and images tasks with confidence that 
//the clean task completes before the other commands.
// gulp.task('connect', connect.server({
//     root: 'dist',
//     port: 3000,
//     livereload: true
//     // open: {
//     //     file: 'index.html'
//     // }
// }));

gulp.task('connectDist', function () {
  connect.server({
    name: 'Dist App',
    root: 'dist',
    port: 3000,
    livereload: true
  });
});

gulp.task("build", ['clean','scripts','styles','images','connectDist'], function() {
  return gulp.src(['index.html',
                   "icons/**"], { base: './'})
   .pipe(replace('images/', 'content/'))
            .pipe(gulp.dest('dist'));
   //gulp.start('connect');
});
