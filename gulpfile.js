"use strict";

const gulp = require("gulp");
const scss = require('gulp-sass')(require('sass'));
const plumber = require("gulp-plumber");
const groupmedia = require('gulp-group-css-media-queries');
const sourcemap = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
//const svgstore = require("gulp-svgstore");
const svgSprite = require('gulp-svg-sprite');

const del = require("del");
//const twig = require('gulp-twig');
const fileinclude = require("gulp-file-include");
//const htmlmin = require('gulp-htmlmin');
const uglifyjs = require('gulp-uglify-es').default;
const sync = require("browser-sync").create();
const zip = require('gulp-zip');

var sassInlineSvg = require('gulp-sass-inline-svg');
var svgmin = require('gulp-svgmin');

var colors = require('colors/safe');


/*gulp.task('sass:svg', function () {
  return gulp.src('source/img/svg-to-bg/!**!/!*.svg')
    .pipe(svgmin()) // Recommend using svg min to optimize svg files first
    .pipe(sassInlineSvg({
      destDir: './icons'
    }));
});*/


/*
с минимизацией:
const sasssvg = () => {
  return gulp.src("source/img/svg-to-bg/!*.svg")
    .pipe(svgmin({
      removeUselessStrokeAndFill: false
    })) // Recommend using svg min to optimize svg files first
    .pipe(sassInlineSvg({
      destDir: 'source/scss/icons' //сюда упадут scss с инлайн svg скомпилированные  из файлов svg
    }));
}*/

const sasssvg = () => {
  return gulp.src("source/img/svg-to-bg/*.svg")
    .pipe(sassInlineSvg({
      destDir: 'source/scss/icons' //сюда упадут scss с инлайн svg скомпилированные  из файлов svg
    }));
}
exports.sasssvg = sasssvg;

// Styles
const styles = () => {
  console.log('⬤  Run ' + colors.yellow('Sass') +
    ' + ' +
    colors.green('Autoprefixer') +
    ' + ' +
    colors.cyan('csso') + ' ⬤ '
  );

  return gulp.src("source/scss/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(scss())
    //.pipe(groupmedia())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso({
      restructure: false
    }))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}
exports.styles = styles;

// HTML
const html = () => {
  let versionNumber = Number(new Date().toISOString().replace(/\D+/g, ""));

  return gulp.src("source/*.html")
    .pipe(fileinclude({
      prefix: '@@',
      context: {
        versionNumber: versionNumber
      }
    }))
    //.pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"))
    .pipe(sync.stream());
};
exports.html = html;

// HTML (Twig)

const twigHTML = () => {
  let versionNumber = Number(new Date().toISOString().replace(/\D+/g, ""));
  return gulp.src('source/*.twig')
    .pipe(plumber())
    .pipe(twig({
      /* data: {
         title: 'Gulp and Twig123',
         benefits: [
           'Fast',
           'Flexible',
           'Secure'
         ]
       }*/
      data: {
        version: versionNumber,
      }
    }))
    .pipe(gulp.dest('build'));
}
exports.twigHTML = twigHTML;


// js
/*const js = () => {
  return gulp.src("source/js/!**!/!*.js", {base: "source"})
    .pipe(uglifyjs())
    .pipe(gulp.dest("build"));
};*/

/*const js = () => {
  //исключим уже минимизированные файлы из обработки
  return gulp.src("source/js/!**!/!*.js", {base: "source", dot: true, ignore: 'source/js/!*.min.js'})
    .pipe(plumber())
    .pipe(gulp.dest("build"))
    .pipe(uglifyjs().on('error', function (e) {
      console.log(e);
    }))
    .pipe(rename(function (path) {
      path.extname = ".min.js";
    }))
    .pipe(gulp.dest("build"));
};*/

/*const js = () => {
  return gulp.src("source/js/!**!/!*.js", {base: "source", dot: true})
    .pipe(plumber())
    .pipe(gulp.dest("build"))
    .pipe(uglifyjs().on('error', function (e) {
      console.log(e);
    }))
    // .pipe(rename(function (path) {
    //   path.extname = ".min.js";
    // }))
    .pipe(gulp.dest("build"));
};
exports.js = js;*/

const js = () => {
  return gulp.src("source/js/script.js", {base: "source", dot: true})
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: "--"
    }))
    //.pipe(gulp.dest("build"))
    .pipe(gulp.dest("build"))
    // .pipe(uglifyjs().on('error', function (e) {
    //   console.log(e);
    // }))
    // .pipe(rename(function (path) {
    //   path.extname = ".min.js";
    // }))
    // .pipe(gulp.dest("build"))
    .pipe(sync.stream());
};
exports.js = js;

const jsDest = () => {
  return gulp.src("source/js/*.js", {base: "source", dot: true, ignore: 'source/js/script.js'})
    //сюда можно добавить минификацию
    .pipe(gulp.dest("build"))
}
exports.jsDest = jsDest;

// Images optimization
const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
}
exports.images = images;

// Webp
const createWebp = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"));
}
exports.webp = createWebp;

// SVG sprite
const configSVG = {
  transform: [{
    svgo: {
      plugins: [
        {cleanupListOfValues: {floatPrecision: 0}},
        {inlineStyles: {onlyMatchedOnce: false}},
        //{removeAttrs: {attrs: ['stroke', 'data-name']}},
        {removeAttrs: {attrs: ['data-name']}},
        //{removeAttributesBySelector: {selector: ':not([fill="none"])', attributes: ['fill']}}
        {removeAttributesBySelector: {selector: ':not([fill="none"])'}}
      ]
    }
  }],
  mode: {
    // css: true, // Create a «css» sprite
    // view: true, // Create a «view» sprite
    // defs: true, // Create a «defs» sprite
    // symbol: true, // Create a «symbol» sprite
    stack: true // Create a «stack» sprite
  }
};

const sprite = () => {
  return gulp.src(["source/img/svg-src/*.svg"])
    .pipe(svgSprite(
      configSVG
    ))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img"))
    .pipe(gulp.dest("build/img"));
}
exports.sprite = sprite;

// Copy
const copy = () => {
  console.log(colors.magenta('⬤  Copy files to it... ⬤ '));
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
};
exports.copy = copy;

// Copy
const copyVendor = () => {
  console.log(colors.magenta('⬤  Copy vendor files to it... ⬤ '));
  return gulp.src([
    "source/vendor/**/*.{woff,woff2}",
    "source/vendor/**/img/**/*.*",
    "source/vendor/**/js/*.js",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
};
exports.copyVendor = copyVendor;

// Clean
const clean = () => {
  //console.log('⬤  Deleted files and folders:\n', paths.join('\n'));
  return del("build")
    .then(paths => {
      console.log('⬤  Deleted files and folders:\n', paths.join('\n'));
    });
};
exports.clean = clean;

//ZIP
//zipBuild
const zipBuild = () => {
  console.log(colors.blue('⬤  Make ZIP build folder... ⬤ '));
  return gulp.src("build/**/*")
    .pipe(zip("build.zip"))
    .pipe(gulp.dest("./"))
};
exports.zipBuild = zipBuild;

//zipSource
const zipSource = () => {
  console.log(colors.blue('⬤  Make ZIP source folder + service files... ⬤ '));
  return gulp.src(["source/**/*", ".editorconfig", "gulpfile.js", "package.json", "package-lock.json"], {base: '.'})
    .pipe(zip("source.zip"))
    .pipe(gulp.dest("./"))
};
exports.zipSource = zipSource;

//zipAll
const zipAll = () => {
  console.log(colors.blue('⬤  Make ZIP all files... ⬤ '));
  return gulp.src(["build/**/*", "source/**/*", ".editorconfig", "gulpfile.js", "package.json", "package-lock.json"], {base: '.'})
    .pipe(zip("all.zip"))
    .pipe(gulp.dest("./"))
};
exports.zipAll = zipAll;

// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    //proxy: "https://ххх.ru",
    //https: true,
    //baseDir: 'build/',
    //index: 'index-p.html',
    cors: true,
    notify: false,
    open: true,
    ui: false,
    //browser: "chrome"
    browser: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  });

  gulp.watch("source/**.*.html").on("change", gulp.series(html, sync.reload));
  //gulp.watch("source/**/*.twig").on("change", gulp.series(twigHTML, sync.reload));
  //gulp.watch("source/**/*.twig").on("change", gulp.series(html, sync.reload));
  //добавили twigHTML в отслеживание css, чтобы менялась версия css
  //gulp.watch("source/scss/**/*.scss").on("change", gulp.series(styles, twigHTML, sync.reload) );
  gulp.watch("source/scss/**/*.scss").on("change", gulp.series(styles, html, sync.reload));
  gulp.watch("source/js/**/*.js").on("change", gulp.series(js, sync.reload));
  gulp.watch("source/js/*.js").on("change", gulp.series(jsDest, sync.reload));
  gulp.watch("source/**/*.php").on("change", gulp.series(copy, sync.reload));

  done();
}
exports.server = server;

// Watcher
const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html", gulp.series(html));
  gulp.watch("source/partials/**/*.html", gulp.series(html));

  //gulp.watch("source/**/*.twig", gulp.series(twigHTML));
  gulp.watch("source/js/**/*.js", gulp.series(js));
  gulp.watch("source/js/*.js", gulp.series(jsDest));
  gulp.watch("source/**/*.php", gulp.series(copy));
};

const build = (done) => gulp.series(
  clean,
  copy,
  copyVendor,
  sasssvg,
  styles,
  sprite,
  html,
  //twigHTML,
  js,
  jsDest
)(done);
exports.build = build;

exports.default = gulp.series(
  build, server, watcher
);
