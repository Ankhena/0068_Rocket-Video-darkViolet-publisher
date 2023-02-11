"use strict";
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import scss from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import {stacksvg} from 'gulp-stacksvg';
import {deleteAsync} from 'del';
import browser from 'browser-sync';
import fileinclude from 'gulp-file-include';

import groupmedia from 'gulp-group-css-media-queries';

import zip from 'gulp-zip';
import colors from 'colors';

//import twig = from 'gulp-twig';

//const sourcemap = require("gulp-sourcemaps");
//const imagemin = require("gulp-imagemin");
//const webp = require("gulp-webp");
//const svgstore = require("gulp-svgstore");
//const svgSprite = require('gulp-svg-sprite');


// Styles
export const styles = () => {
  console.log('⬤  Run ' + colors.yellow('Sass') +
    ' + ' +
    colors.green('Autoprefixer') +
    ' + ' +
    colors.cyan('csso') + ' ⬤ '
  );

  return gulp.src('source/scss/style.scss', {sourcemaps: true})
    .pipe(plumber())
    .pipe(scss().on('error', scss.logError))
    .pipe(groupmedia())
    .pipe(postcss([
      autoprefixer(),
      // csso({
      //   restructure: false
      // })
    ]))
    .pipe(gulp.dest("build/css", { sourcemaps: '.' }))
    // .pipe(csso({
    //   restructure: false
    // }))
    // .pipe(rename("style.min.css"))
    // .pipe(gulp.dest("build/css", { sourcemaps: '.' }))
    .pipe(browser.stream());
}


// HTML
export const html = () => {
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
    .pipe(browser.stream());
};


// HTML (Twig)
export const twigHTML = () => {
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
    .pipe(gulp.dest('build'))
    .pipe(browser.stream())
}

export const js = () => {
  return gulp.src("source/js/script.js", {base: "source", dot: true})
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: "&&"
    }))
    .pipe(gulp.dest("build"))
    .pipe(terser())
    .pipe(browser.stream());
};


export const jsCopy = () => {
  return gulp.src("source/js/*.js", {base: "source", dot: true, ignore: 'source/js/script.js'})
    //сюда можно добавить минификацию
    .pipe(gulp.dest("build"))
}

// настройки оптимизации скуша?
export const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('source/img'));
}


// Webp
export const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('source/img'));
}

//svg
export const svgOptimization  = () => {
  return gulp.src('source/img/svg/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('build/img/svg'))
}

// SVG sprite
//svg-stack
export const sprite = () => {
  return gulp.src('source/img/svg/sprite/*.svg')
    .pipe(svgo())
    .pipe(stacksvg())
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('source/img'))
    .pipe(gulp.dest('build/img'));
}

// Copy
export const copy = () => {
  console.log(colors.magenta('⬤  Copy files to it... ⬤ '));
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest('build'));
};

// Copy vendor
export const copyVendor = () => {
  console.log(colors.magenta('⬤  Copy vendor files to it... ⬤ '));
  return gulp.src([
    'source/vendor/**/*.{woff,woff2}',
    'source/vendor/**/img/**/*.*',
    'source/vendor/**/js/*.js',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'));
};


// Clean
export const clean = () => {
  //console.log('⬤  Deleted files and folders:\n', paths.join('\n'));
  return deleteAsync ('build')
    .then(paths => {
      console.log('⬤  Deleted files and folders:\n', paths.join('\n'));
    });
};


//ZIP
//zipBuild
export const zipBuild = () => {
  console.log(colors.blue('⬤  Make ZIP build folder... ⬤ '));
  return gulp.src('build/**/*')
    .pipe(zip('build.zip'))
    .pipe(gulp.dest('./'))
};


//zipSource
export const zipSource = () => {
  console.log(colors.blue('⬤  Make ZIP source folder + service files... ⬤ '));
  return gulp.src(['source/**/*', '.editorconfig', 'gulpfile.js', 'package.json', 'package-lock.json'], {base: '.'})
    .pipe(zip('source.zip'))
    .pipe(gulp.dest('./'))
};

//zipAll
export const zipAll = () => {
  console.log(colors.blue('⬤  Make ZIP all files... ⬤ '));
  return gulp.src(['build/**/*', 'source/**/*', '.editorconfig', 'gulpfile.js', 'package.json', 'package-lock.json'], {base: '.'})
    .pipe(zip('all.zip'))
    .pipe(gulp.dest('./'))
};


// Server
const server = (done) => {
  browser.init({
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
    //browser: 'chrome'
    browser: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  });

  // gulp.watch('source/**.*.html').on('change', gulp.series(html, browser.reload));
  // //gulp.watch('source/**/*.twig').on('change', gulp.series(twigHTML, browser.reload));
  // //gulp.watch('source/**/*.twig').on('change', gulp.series(html, browser.reload));
  // //добавили twigHTML в отслеживание css, чтобы менялась версия css
  // //gulp.watch('source/scss/**/*.scss').on('change', gulp.series(styles, twigHTML, browser.reload) );
  // gulp.watch('source/scss/**/*.scss').on('change', gulp.series(styles, html, browser.reload));
  // gulp.watch('source/js/**/*.js').on('change', gulp.series(js, browser.reload));
  // gulp.watch('source/js/*.js').on('change', gulp.series(jsCopy, browser.reload));
  // gulp.watch('source/**/*.php').on('change', gulp.series(copy, browser.reload));

  done();
}

//reload
const reload = (done) => {
  browser.reload();
  done();
}

// Watcher
const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(html));
  gulp.watch('source/partials/**/*.html', gulp.series(html, reload));

  //gulp.watch('source/**/*.twig', gulp.series(twigHTML));
  gulp.watch('source/js/**/*.js', gulp.series(js));
  gulp.watch('source/js/*.js', gulp.series(jsCopy));
  gulp.watch('source/**/*.php', gulp.series(copy));
};

export const build = (done) => gulp.series(
  clean,
  copy,
  styles,
  sprite,
  html,
  //twigHTML,
  js,
  jsCopy
)(done);

export default  gulp.series(
  build, server, watcher
);
