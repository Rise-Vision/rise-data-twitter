const concat = require("gulp-concat");
const gulp = require("gulp");

const bundle = "dist/rise-data-twitter.js";
const dependencies = [
  "node_modules/object-hash/dist/object_hash.js"
];

gulp.task( "default", () => {
  return gulp.src( dependencies.concat(bundle) )
    .pipe( concat( bundle ) )
    .pipe( gulp.dest( "." ) );
});
