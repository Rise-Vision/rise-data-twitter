const concat = require("gulp-concat");

const gulp = require("gulp");

const bundles = [ 
	"dist/rise-data-twitter.js", 
	"dist/rise-data-twitter-bundle.min.js"
];
const dependencies = [
  "node_modules/jsencrypt/bin/jsencrypt.min.js"
];

gulp.task( "default", (done) => {
  bundles.map(function(file) {
    return gulp.src( dependencies.concat( file ) )
      .pipe( concat( file ) )
      .pipe( gulp.dest( "." ) );
  });
  done();
});
