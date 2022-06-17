const { src, dest, series, watch } = require('gulp')
const concat = require('gulp-concat')
const htmlMin = require('gulp-htmlmin')
const autoprefixer = require('gulp-autoprefixer')
const image = require('gulp-image')
const babel = require('gulp-babel') /* перевод кода в любой формат под старые браузеры - транспилятор */
const uglify = require('gulp-uglify-es').default /* обфускация и уменьшение веса*/
const notify = require('gulp-notify') /* выводит ошибки при сборке Gulp в виде системных сообщений */
const sourcemaps = require('gulp-sourcemaps') /* показывает исходники так, как они были */
const del = require('del') /* очищает папку с готовым проектом */
const browserSync = require('browser-sync').create()

const cleanDev = () => {
    return del(['dev'])
}

const resources = () => {
    return src('src/resources/**')
    .pipe(dest('dev'))
}

const stylesDev = () => {
    return src('src/css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('dev'))
    .pipe(browserSync.stream())
}

const html = () => {
    return src('src/**/*.html')
    .pipe(htmlMin({
        collapseWhitespace: true,
    }))
    .pipe(dest('dev'))
    .pipe(browserSync.stream())
}

const scriptsDev = () => {
    return src([
        'src/js/**/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(sourcemaps.write())
    .pipe(uglify().on('error', notify.onError()))
    .pipe(dest('dev'))
    .pipe(browserSync.stream())
}

const images = () => {
    return src([
        'src/img/**/*.png',
        'src/img/**/*.jpg',
        'src/img/**/*.jpeg',
        'src/img/*.svg',
        'src/img/*.webp',
    ])
    .pipe(image())
    .pipe(dest('dev/img'))
}

const watchDev = () => {
    browserSync.init({
        server: {
            baseDir: 'dev'
        }
    })
}

watch('src/**/*.html', html)
watch('src/css/**/*.css', stylesDev)
watch('src/js/**/*.js', scriptsDev)
watch('src/resources/**', resources)

exports.cleandev = cleanDev
exports.stylesdev = stylesDev
exports.scriptsdev = scriptsDev
exports.dev = series(cleanDev, resources, html, scriptsDev, stylesDev, images, watchDev)