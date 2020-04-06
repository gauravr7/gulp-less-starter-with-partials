'use strict';
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    fileinclude = require('gulp-file-include'),
    paths = {
        cssfolder: 'src/css/',
        concatedcssfile: 'main.css',
        less: ['src/less/main.less']
    };

//open dev server
gulp.task('open', function () {
    gulp.src('src')
        .pipe(open({
            uri: 'http://localhost:4000/html/home.html'
        }));
});

// Convert Less to CSS
gulp.task('convertless', function () {
    return gulp.src(paths.less)
        .pipe(less().on('error', function (err) {
            gutil.log(err);
            this.emit('end');
        }))
        .pipe(concat(paths.concatedcssfile))
        .pipe(gulp.dest(paths.cssfolder))
        .pipe(connect.reload());
});

// Connect server
gulp.task('connect', ['fileinclude', 'convertless'], function () {
    connect.server({
        root: 'src',
        port: 4000,
        livereload: true
    })
});


// HTML Page Watcher
gulp.task('html', function () {
    gulp.src('src/src-html/*.html')
        .pipe(connect.reload());
});


//Watcher Task
gulp.task('watch', function () {
    gulp.watch(['src/src-html/*.html'], ['fileinclude','html']);
    gulp.watch(['src/less/**'], ['convertless']);
});


//replace partials with actual files
gulp.task('fileinclude', function () {
    gulp.src('./src/src-html/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./src/html'));
});


gulp.task('default', ['fileinclude', 'convertless', 'connect', 'open', 'watch']);