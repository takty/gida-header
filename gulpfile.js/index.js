/**
 * Gulpfile
 *
 * @author Takuto Yanagida
 * @version 2022-03-23
 */


'use strict';

const gulp = require('gulp');

const { makeJsTask }        = require('./task-js');
const { makeSassTask }      = require('./task-sass');
const { makeCopyTask }      = require('./task-copy');
const { makeTimestampTask } = require('./task-timestamp');


// -----------------------------------------------------------------------------


const js = gulp.parallel(
	makeJsTask('./src/fixed.js',  './dist/js'),
	makeJsTask('./src/scroll.js', './dist/js'),
);

exports.build = gulp.parallel(js);

const watch = (done) => {
	gulp.watch('src/**/*.js', gulp.series(js));
	done();
};

exports.default = gulp.series(exports.build, watch);


// -----------------------------------------------------------------------------


const doc_js = gulp.series(js, makeCopyTask(['dist/js/*'], './docs/js'));

const doc_sass = makeSassTask('docs/style.scss', './docs/css');

const doc_timestamp = makeTimestampTask('docs/**/*.html', './docs');

const doc_watch = (done) => {
	gulp.watch('src/**/*.js', gulp.series(doc_js, doc_timestamp));
	gulp.watch('src/**/*.scss', gulp.series(doc_timestamp));
	gulp.watch('docs/style.scss', gulp.series(doc_sass, doc_timestamp));
	done();
};

const doc_build = gulp.parallel(doc_js, doc_sass, doc_timestamp);

exports.doc = gulp.series(doc_build, doc_watch);
