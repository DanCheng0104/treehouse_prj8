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
      livereload = require('gulp-livereload'), 
      useref = require('gulp-useref'); 


const options = {
  jsFiles: 'js/**/*.js',
  jsDest: 'dist/scripts',
  styleDest: 'dist/styles',
  contentDest: 'dist/content',
  sassFiles: ['sass/**/**/*','sass/*']
};


//delete all of the files and folders in the dist folder.
gulp.task('clean', ()=>del(['dist/**/*']));

//concatenate, minify, and copy all of the project’s JavaScript files into an all.min.js file that is then copied to the dist/scripts folder
gulp.task('scripts', () => {
    return gulp.src(options.jsFiles)
    				.pipe(maps.init())
       			.pipe(concat('global.js'))
       			.pipe(uglify())
       			.pipe(rename('all.min.js'))
       			.pipe(maps.write('./'))
       			.pipe(gulp.dest(options.jsDest));
});


//compile the project’s SCSS files into CSS, then concatenate and minify into an all.min.css file 
//that is then copied to the dist/styles folder.

gulp.task('styles', () => {
  return gulp.src("sass/global.scss")
      .pipe(maps.init())
      .pipe(sass())
      .pipe(csso())
      .pipe(rename('all.min.css'))
      .pipe(maps.write('./'))
      .pipe(gulp.dest(options.styleDest))
      .pipe(livereload());
});

//optimize the size of the project’s JPEG and PNG files, and then copy those optimized images to the dist/content folder.

gulp.task('images', () =>
    gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(options.contentDest))
);

//start the web server

gulp.task('connectDist', ()=> {
  connect.server({
    name: 'Dist App',
    root: 'dist',
    port: 3000,
    livereload: true
  });
});

//watch for changes to any .scss file in my project. When there is a change to 
//one of the .scss files, the gulp styles command is run and the files are compiled,
// concatenated, and minified to the dist folder. My project should then reload in the 
//browser, displaying the changes.

gulp.task('watch',()=> {
  livereload.listen();
    gulp.watch(options.sassFiles,['styles']);
});

//copy everything to dist folder 
gulp.task("build", ['clean','scripts','styles','images'],()=> {
  return gulp.src(['index.html',
                   "icons/**"], { base: './'})
   .pipe(replace('images/', 'content/'))
            .pipe(gulp.dest('dist'));
});

gulp.task("default",['build','connectDist','watch'])

