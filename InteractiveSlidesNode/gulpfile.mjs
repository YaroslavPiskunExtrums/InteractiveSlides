import gulp from 'gulp'
import sass from 'gulp-sass'
import babel from 'gulp-babel'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import postcssPresetEnv from 'postcss-preset-env'
import nodeSass from 'node-sass'
import watch from 'gulp-watch'
import debug from 'gulp-debug'


gulp.task('images', function(done) {
  gulp.src(['./add-in/src/**/*.png'])
    .pipe(debug({ title: 'unicorn:' }))
    .pipe(gulp.dest('./public'))
  done()
})

gulp.task('css', function() {
  return gulp.src('./add-in/src/**/*.css')
    .pipe(postcss([
      autoprefixer,
      postcssPresetEnv({
        browsers: ['ie 11'],
      }),
    ]))
    .pipe(gulp.dest('./public'))
})

gulp.task('html', function() {
  return gulp.src('./add-in/src/**/*.html')
    .pipe(gulp.dest('./public'))
})

// gulp.task('scss', function() {
//   return gulp.src('./add-in/src/**/*.scss')
//     .pipe(sass({
//       implementation: nodeSass,
//     }).on('error', function(err) {
//       console.error(err)
//       this.emit('end')
//     }))
//     .pipe(postcss([
//       autoprefixer({
//         overrideBrowserslist: ['ie 11'],
//       }),
//     ]))
//     .pipe(gulp.dest('./public'))
// })
gulp.task('js', function() {
  return gulp.src('./add-in/src/**/*.js')
    .pipe(babel({
      presets: ['@babel/preset-env'],
    }))
    .pipe(gulp.dest('./public'))
})


gulp.task('watch', function() {

  gulp.watch('./add-in/src/**/*.css', gulp.series('css'))
  gulp.watch('./add-in/src/**/*.html', gulp.series('html'))
  gulp.watch('./add-in/src/**/*.js', gulp.series('js'))
})


gulp.task('default', gulp.series('images', 'css', 'html', 'js'))
