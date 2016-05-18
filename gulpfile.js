const gulp = require('gulp');
const fs = require('fs');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const rimraf = require('rimraf');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const _ = require('lodash');

const config = {
	entryFile: './src/app.js',
	outputDir: './public/lib',
	outputFile: 'app.js'
};

// clean the output directory
gulp.task('clean', function (cb) {
	rimraf(config.outputDir, cb);
});

var bundler;

function getBundler() {
	if (!bundler) {
		bundler = watchify(browserify(config.entryFile, _.extend({ debug: true }, watchify.args)));
	}
	return bundler;
};

function bundle() {
	return getBundler()
		.transform(babelify)
		.bundle()
		.on('error', function (err) { console.log('Error: ' + err.message); })
		.pipe(source(config.outputFile))
        .pipe(buffer())
        .pipe(uglify())
		.pipe(gulp.dest(config.outputDir));
}

gulp.task('build-persistent', ['clean'], function () {
	return bundle();
});

gulp.task('build', ['build-persistent'], function () {
	process.exit(0);
});

gulp.task('watch', ['build-persistent'], function () {
	getBundler().on('update', function () {
		gulp.start('build-persistent')
	});
});
