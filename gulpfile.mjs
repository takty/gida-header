/**
 * Gulpfile
 *
 * @author Takuto Yanagida
 * @version 2022-12-09
 */

import gulp from 'gulp';

import { makeJsTask } from './gulp/task-js.mjs';
import { makeSassTask } from './gulp/task-sass.mjs';
import { makeCopyTask } from './gulp/task-copy.mjs';
import { makeTimestampTask } from './gulp/task-timestamp.mjs';

const js = gulp.parallel(
	makeJsTask('./src/fixed.js',  './dist/js'),
	makeJsTask('./src/scroll.js', './dist/js'),
	makeJsTask('./src/slide.js', './dist/js'),
);

export const build = gulp.parallel(js);

const watch = done => {
	gulp.watch('src/**/*.js', gulp.series(js));
	done();
};

export default gulp.series(build, watch);


// -----------------------------------------------------------------------------


const doc_js = gulp.series(js, makeCopyTask(['dist/js/*'], './docs/js'));

const doc_sass = makeSassTask('docs/style.scss', './docs/css');

const doc_timestamp = makeTimestampTask('docs/**/*.html', './docs');

const doc_watch = done => {
	gulp.watch('src/**/*.js', gulp.series(doc_js, doc_timestamp));
	gulp.watch('src/**/*.scss', gulp.series(doc_timestamp));
	gulp.watch('docs/style.scss', gulp.series(doc_sass, doc_timestamp));
	done();
};

const doc_build = gulp.parallel(doc_js, doc_sass, doc_timestamp);

export const doc = gulp.series(doc_build, doc_watch);
