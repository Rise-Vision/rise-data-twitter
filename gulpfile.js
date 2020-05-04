const concat = require("gulp-concat");
const gulp = require("gulp");

const bundle = "dist/rise-data-twitter.js";
const dependencies = [
  "node_modules/jsencrypt/bin/jsencrypt.min.js"
];

gulp.task( "default", () => {
  return gulp.src( dependencies.concat(bundle) )
    .pipe( concat( bundle ) )
    .pipe( gulp.dest( "." ) );
});
