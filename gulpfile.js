var gulp = require('gulp'); // npm install gulp --save-dev
var sass = require('gulp-sass'); // npm install gulp-sass --save-dev
var browserSync = require('browser-sync').create(); // npm install browser-sync --save-dev
var useref = require('gulp-useref'); // npm install gulp-useref --save-dev
// var concat = require('gulp-concat'); // npm install gulp-concat gulp-rename gulp-uglify --save-dev
var uglify = require('gulp-uglify'); // npm install gulp-uglify --save-dev
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano') // npm install gulp-cssnano --save-dev
var imagemin = require('gulp-imagemin') // npm install gulp-imagemin --save-dev
var cache = require('gulp-cache'); // npm install gulp-cache --save-dev
var del = require('del'); // npm install del --save-dev
var runSequence = require('run-sequence'); // npm install run-sequence --save-dev

// runt "gulp hello"
gulp.task('hello', function () {
    console.log('Hello Rico');
});

// browserSync live reload server
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './src'
        },
    })
})

// run "gulp sass"
// compile css to src/css folder
gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        // .pipe(browserSync.reload({
        //     stream: true
        // }))
});

gulp.task('css', function () {
    return gulp.src('src/css/**/*.css')
        .pipe(browserSync.reload({
            stream: true
        }))
});

// // gulp.task('js', function () {
// //     return gulp.src('src/js/**/*.js')
// //         .pipe(concat('main.js'))
// //         .pipe(gulp.dest('dist/js'))
// // });

gulp.task('useref', function () {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

gulp.task('images', function () {
    return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function () {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function () {
    return del.sync('dist');
})

// ///////////////////// WATCH ///////////////////////

// // Gulp watch syntax
// // run "gulp"
//gulp.watch('src/scss/**/*.scss', ['sass']);

// // Multiple gulp watch
// // run "gulp watch"
gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/css/**/*.css', ['css']);

    // Reloads the browser whenever HTML or JS files change
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
})

gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
})

// run "gulp"
gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
})

