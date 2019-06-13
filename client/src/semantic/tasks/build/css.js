/*******************************
          Build Task
*******************************/

var
  gulp = require('gulp');

// node dependencies

var console = require('better-console');

var fs = require('fs');

// gulp dependencies

var autoprefixer = require('gulp-autoprefixer');

var chmod = require('gulp-chmod');

var clone = require('gulp-clone');

var flatten = require('gulp-flatten');

var gulpif = require('gulp-if');

var less = require('gulp-less');

var minifyCSS = require('gulp-clean-css');

var plumber = require('gulp-plumber');

var print = require('gulp-print').default;

var rename = require('gulp-rename');

var replace = require('gulp-replace');

var runSequence = require('run-sequence');

// config

var config = require('../config/user');

var tasks = require('../config/tasks');

var install = require('../config/project/install');

// shorthand

var globs = config.globs;

var assets = config.paths.assets;

var output = config.paths.output;

var source = config.paths.source;

var banner = tasks.banner;

var comments = tasks.regExp.comments;

var log = tasks.log;

var settings = tasks.settings
;

// add internal tasks (concat release)
require('../collections/internal')(gulp);

module.exports = function (callback) {
  var
    tasksCompleted = 0;

  var maybeCallback = function () {
    tasksCompleted++;
    if (tasksCompleted === 2) {
      callback();
    }
  };

  var stream;

  var compressedStream;

  var uncompressedStream
  ;

  console.info('Building CSS');

  if (!install.isSetup()) {
    console.error('Cannot build files. Run "gulp install" to set-up Semantic');
    return;
  }

  // unified css stream
  stream = gulp.src(source.definitions + '/**/' + globs.components + '.less')
    .pipe(plumber(settings.plumber.less))
    .pipe(less(settings.less))
    .pipe(autoprefixer(settings.prefix))
    .pipe(replace(comments.variables.in, comments.variables.out))
    .pipe(replace(comments.license.in, comments.license.out))
    .pipe(replace(comments.large.in, comments.large.out))
    .pipe(replace(comments.small.in, comments.small.out))
    .pipe(replace(comments.tiny.in, comments.tiny.out))
    .pipe(flatten())
  ;

  // two concurrent streams from same source to concat release
  uncompressedStream = stream.pipe(clone());
  compressedStream = stream.pipe(clone());

  // uncompressed component css
  uncompressedStream
    .pipe(plumber())
    .pipe(replace(assets.source, assets.uncompressed))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(gulp.dest(output.uncompressed))
    .pipe(print(log.created))
    .on('end', function () {
      runSequence('package uncompressed css', maybeCallback);
    })
  ;

<<<<<<< HEAD
  // compressed component css
  compressedStream
    .pipe(plumber())
    .pipe(clone())
    .pipe(replace(assets.source, assets.compressed))
    .pipe(minifyCSS(settings.minify))
    .pipe(rename(settings.rename.minCSS))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(gulp.dest(output.compressed))
    .pipe(print(log.created))
    .on('end', function () {
      runSequence('package compressed css', maybeCallback);
    })
  ;
=======
  if (callback === undefined) {
    callback = opts;
    opts     = config;
    config   = type;
    type     = src;
    src      = config.paths.source.definitions + '/**/' + config.globs.components + '.less';
  }

  const buildUncompressed       = () => build(src, type, false, config, opts);
  buildUncompressed.displayName = 'Building uncompressed CSS';

  const buildCompressed       = () => build(src, type, true, config, opts);
  buildCompressed.displayName = 'Building compressed CSS';

  const packUncompressed       = () => pack(type, false);
  packUncompressed.displayName = 'Packing uncompressed CSS';

  const packCompressed       = () => pack(type, true);
  packCompressed.displayName = 'Packing compressed CSS';

  gulp.parallel(
    gulp.series(buildUncompressed, packUncompressed),
    gulp.series(buildCompressed, packCompressed)
  )(callback);
}

function rtlAndNormal(src, callback) {
  if (callback === undefined) {
    callback = src;
    src      = config.paths.source.definitions + '/**/' + config.globs.components + '.less';
  }

  const rtl       = (callback) => buildCSS(src, 'rtl', config, {}, callback);
  rtl.displayName = "CSS Right-To-Left";
  const css       = (callback) => buildCSS(src, 'default', config, {}, callback);
  css.displayName = "CSS";

  if (config.rtl === true || config.rtl === 'Yes') {
    rtl(callback);
  } else if (config.rtl === 'both') {
    gulp.series(rtl, css)(callback);
  } else {
    css(callback);
  }
}

function docs(src, callback) {
  if (callback === undefined) {
    callback = src;
    src      = config.paths.source.definitions + '/**/' + config.globs.components + '.less';
  }

  const func       = (callback) => buildCSS(src, 'docs', config, {}, callback);
  func.displayName = "CSS Docs";

  func(callback);
}

// Default tasks
module.exports = rtlAndNormal;

// We keep the changed files in an array to call build with all of them at the same time
let timeout, files = [];

/**
 * Watch changes in CSS files and call the correct build pipe
 * @param type
 * @param config
 */
module.exports.watch = function (type, config) {
  const method = type === 'docs' ? docs : rtlAndNormal;

  // Watch theme.config file
  gulp.watch([
    normalize(config.paths.source.config),
    normalize(config.paths.source.site + '/**/site.variables')
  ])
    .on('all', function () {
      // Clear timeout and reset files
      timeout && clearTimeout(timeout);
      files = [];
      return gulp.series(method)();
    });

  // Watch any less / overrides / variables files
  gulp.watch([
    normalize(config.paths.source.definitions + '/**/*.less'),
    normalize(config.paths.source.site + '/**/*.{overrides,variables}'),
    normalize(config.paths.source.themes + '/**/*.{overrides,variables}')
  ])
    .on('all', function (event, path) {
      // We don't handle deleted files yet
      if (event === 'unlink' || event === 'unlinkDir') {
        return;
      }

      // Clear timeout
      timeout && clearTimeout(timeout);

      // Determine which LESS file has to be recompiled
      let lessPath;
      if(path.indexOf('site.variables') !== -1)  {
        return;
      } else if (path.indexOf(config.paths.source.themes) !== -1) {
        console.log('Change detected in packaged theme');
        lessPath = replaceExt(path, '.less');
        lessPath = lessPath.replace(tasks.regExp.theme, config.paths.source.definitions);
      } else if (path.indexOf(config.paths.source.site) !== -1) {
        console.log('Change detected in site theme');
        lessPath = replaceExt(path, '.less');
        lessPath = lessPath.replace(config.paths.source.site, config.paths.source.definitions);
      } else {
        console.log('Change detected in definition');
        lessPath = path;
      }

      // Add file to internal changed files array
      if (!files.includes(lessPath)) {
        files.push(lessPath);
      }

      // Update timeout
      timeout = setTimeout(() => {
        // Copy files to build in another array
        const buildFiles = [...files];
        // Call method
        gulp.series((callback) => method(buildFiles, callback))();
        // Reset internal changed files array
        files = [];
      }, 1000);
    });
>>>>>>> master
};
