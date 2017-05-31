const minifyHTML = require('gulp-minify-html')
const gulp = require('gulp')
const del = require('del')

gulp.task('minify-html', function () {
  del.sync(['public/*'])
  var opts = { comments: true, spare: true }

  gulp.src('./views/home/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./public/views/home'))

  gulp.src('./views/images/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./public/views/images'))

  // gulp.src('./content/**')
  //   .pipe(gulp.dest('./public/content/'))
})
