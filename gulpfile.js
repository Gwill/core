var gulp = require('gulp');
var gulpfilter = require('gulp-filter');

var clean = require('gulp-clean');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var qunit = require('gulp-qunit');

var paths = {
    src: [
        'src/__intro.js',
        'src/core.js',
        'src/utils.js',
        'src/serialize.js',
        'src/object.js',
        'src/asset.js',
        'src/rect.js',
        'src/texture.js',
        'src/spriteTexture.js',
        'src/atlas.js',
        'src/__outro.js',
    ],
    dev: 'bin/core.dev.js',
    min: 'bin/core.min.js',
};

// clean
gulp.task('clean', function() {
    return gulp.src('bin/**/*', {read: false})
    .pipe(clean())
    ;
});

// dev
gulp.task('dev', function() {
    var filter = gulpfilter( ['!__intro.js','!__outro.js'] );

    return gulp.src(paths.src)
    .pipe(filter)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    // .pipe(jshint.reporter('fail')) // disabled
    .pipe(filter.restore())
    .pipe(concat('core.dev.js'))
    .pipe(gulp.dest('bin'))
    ;
});

// min
gulp.task('min', ['dev'], function() {
    return gulp.src('bin/core.dev.js')
    .pipe(rename('core.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('bin'))
    ;
});

// test
gulp.task('test', ['dev'], function() {
    return gulp.src('test/unit/**/*.html')
    .pipe(qunit())
    .on('error', function(err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
    })
    ;
});

// watch
gulp.task('watch', function() {
    gulp.watch(paths.src, ['min']);
});

//
gulp.task('default', ['min'] );
gulp.task('all', ['min','test'] );