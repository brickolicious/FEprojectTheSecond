/**
 * Created by Roderik on 9/12/2014.
 */
var gulp = require('gulp'),
    browserSync = require('browser-sync');

gulp.task('browser-sync', function () {
    var files = [
        '../*.html',
        '../css/*.css',
        '../css/*.scss',
        '../partialviews/*.html'
    ];

    browserSync.init(files, {
        server: {
            baseDir: '../'
        }
    });
});