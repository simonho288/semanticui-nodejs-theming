const gulp = require('gulp')
const pug = require('gulp-pug')
const less = require('gulp-less')
const minifyCSS = require('gulp-csso')
const runSequence = require('run-sequence')
const chug = require('gulp-chug')
const merge = require('merge-stream')

const OUTPUT_DIR = 'public'

gulp.task('html', () => {
  return gulp.src('views/*.pug')
    .pipe(pug())
    .pipe(gulp.dest(OUTPUT_DIR))
})

gulp.task('css', () => {
  return gulp.src('views/stylesheets/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest(OUTPUT_DIR + '/css'))
})

gulp.task('images', () => {
  return gulp.src('views/images/**/*')
    .pipe(gulp.dest(OUTPUT_DIR + '/images'))
})

gulp.task('js', () => {
  return gulp.src('views/javascripts/*.js')
    .pipe(gulp.dest(OUTPUT_DIR + '/js'))
})

// Run another Gulp build to build Semantic UI
gulp.task('build-semantic', () => {
	return gulp.src('./semantic/gulpfile.js')
		.pipe(chug({ tasks: ['build'] })) // Run 'gulp build' in /semantic
})

// Copy built Semantic UI files to /public
gulp.task('copy-semantic', () => {
	let css = gulp.src('semantic/dist/semantic.min.css')
		.pipe(gulp.dest(OUTPUT_DIR + '/css'))
	let js = gulp.src('semantic/dist/semantic.min.js')
		.pipe(gulp.dest(OUTPUT_DIR + '/js'))
	let fonts = gulp.src('semantic/src/themes/default/assets/fonts/**/*')
		.pipe(gulp.dest(OUTPUT_DIR + '/css/themes/default/assets/fonts'))
	let images = gulp.src('semantic/src/themes/default/assets/images/**/*')
		.pipe(gulp.dest(OUTPUT_DIR + '/css/themes/default/assets/images'))
	return merge(css, js, fonts, images)
})

// Semantic UI requires jQuery
gulp.task('copy-jquery', () => {
	gulp.src('node_modules/jquery/dist/jquery.min.js')
		.pipe(gulp.dest(OUTPUT_DIR + '/js'))
})

// Gulp default task.
gulp.task('default', () => {
	runSequence(
		['html', 'css', 'js', 'images', 'copy-jquery'],
		'build-semantic',
		'copy-semantic'
	)
})
