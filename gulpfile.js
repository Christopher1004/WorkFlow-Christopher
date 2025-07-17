const gulp = require('gulp');
const livereload = require('gulp-livereload');

// Tarefa para otimizar imagens
async function optimizeImages() {
  const imagemin = (await import('gulp-imagemin')).default;
  return gulp.src('public/assets/image/**/*', { encoding: false })
    .pipe(imagemin())
    .pipe(gulp.dest('public/assets/image'));
}

// Tarefa para LiveReload
function watchFiles() {
  livereload.listen();
  gulp.watch(['public/**/*', 'views/**/*']).on('change', function(file) {
    livereload.changed(file);
  });
}

exports.images = optimizeImages;
exports.livereload = watchFiles;
exports.default = gulp.parallel(optimizeImages, watchFiles); 