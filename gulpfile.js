var gulp = require('gulp'),
    dest = require('gulp-dest'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin');
    browserSync = require('browser-sync').create();

var paths = {
    styles: {
        src: 'app/sass/styles.scss',
        dest: 'build/',
        src2: 'app/css/**/*.css',
        dest2: 'build/css',
        src3: 'app/sass/**/*.scss'
    },
    html: {
        src: 'app/**/*.html',
        dest: 'build/'
    },
    img: {
        src: 'app/img/**/*.*',
        dest: 'build/img',
        src2: 'app/uploads/**/*.*',
        dest2: 'build/uploads'
    },
    fonts: {
        src: 'app/fonts/**/*.*',
        dest: 'build/fonts'
    },
    scripts: {
        src: 'app/js/**/*.*',
        dest: 'build/js'
    },
    libs: {
        src: 'app/libs/**/*.*',
        dest: 'build/libs'
    }
};

function style() {
    return (
        gulp
            .src(paths.styles.src)
            .pipe(sourcemaps.init())
            .pipe(sass())
            .on("error", sass.logError)
            .pipe(postcss([
                autoprefixer(
                {
                    cascade: false
                }), cssnano()]))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(paths.styles.dest))
            .pipe(browserSync.stream())
    );
}

function css() {
    return (
        gulp
            .src(paths.styles.src2)
            .pipe(sourcemaps.init())
            .pipe(postcss([
                autoprefixer(
                {
                    browsers: [
                        '> 1%',
                        'last 2 versions',
                        'firefox >= 4',
                        'safari 7',
                        'safari 8',
                        'IE 8',
                        'IE 9',
                        'IE 10',
                        'IE 11'
                    ],
                    cascade: false
                }), cssnano()]))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(paths.styles.dest2))
            .pipe(browserSync.stream())
    );
}

function importSCSS() {
    return (
        gulp       
            .src(paths.styles.src3)
            .pipe(gulp.dest(paths.styles.dest2))
            .pipe(browserSync.stream())
    );
}

function html() {
    return (
        gulp
            .src(paths.html.src)
            .pipe(gulp.dest(paths.html.dest))
            .pipe(browserSync.stream())
    );
}

function script() {
    return (
        gulp
            .src(paths.scripts.src)
            .pipe(gulp.dest(paths.scripts.dest))
            .pipe(browserSync.stream())
    );
}

function libs() {
    return (
        gulp
            .src(paths.libs.src)
            .pipe(gulp.dest(paths.libs.dest))
            .pipe(browserSync.stream())
    );
}

function img() {
    return (
        gulp.src(paths.img.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.img.dest))
        .pipe(browserSync.stream())
    );
}

function photo() {
    return (
        gulp.src(paths.img.src2)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.img.dest2))
        .pipe(browserSync.stream())
    );
}

function fonts() {
    return (
        gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
    );
}

function serve() {
    browserSync.init({
        server: {
            baseDir: 'build'
        }
    });
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.styles.src, style);
    gulp.watch(paths.styles.src3, style);
    gulp.watch(paths.styles.src2, css);
    gulp.watch(paths.scripts.src, script);
    gulp.watch(paths.libs.src, libs);
    gulp.watch(paths.img.src, img);
    gulp.watch(paths.img.src2, photo);
    gulp.watch(paths.fonts.src, fonts);
}

exports.serve = serve;
exports.chimg = img;
exports.chcss = css;
exports.chphoto = photo;
exports.chfonts = fonts;
exports.chlibs = libs;
exports.importSCSS = importSCSS;