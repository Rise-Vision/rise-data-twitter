
const gulp = require("gulp");
const fs = require("fs");
const header = require("gulp-header");

const bundles = "dist/rise-data-twitter*.js";
const dependency = "node_modules/jsencrypt/bin/jsencrypt.min.js";

gulp.task( "default", () => {
  return gulp.src( bundles )
    .pipe( header( fs.readFileSync(dependency) ) )
    .pipe( gulp.dest( "dist/" ) );
});
