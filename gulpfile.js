var gulp = require('gulp');
var sass = require('gulp-sass');
var sync = require('browser-sync');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var del = require('del');
var log = require('fancy-log');



gulp.task('sass',function(){
    return gulp.src('app/styles/**/*.scss')
    .pipe(sass({})
    .on('error', sass.logError))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('dist/styles/'))    
});

gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js',uglify()))
        .pipe(gulp.dest('dist/'))    
});

gulp.task('image',function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
});

gulp.task('sync',function(){
    sync.init({
        server:{
            baseDir : 'dist'
        },
    })
});

gulp.task('bundlejs',function(done){
  bundleApp(false);
  done();
});

function bundleApp(isProduction) {
	var appBundler = browserify({
    	entries: ['./app/scripts/app.js'],
        insertGlobals: true,
        cache: {},
        packageCache: {},
    	debug: true
  	});
  return appBundler
  		// transform ES6 and JSX to ES5 with babelify
	  	.transform("babelify")
	    .bundle()
	    .on('error', function(error) { log(error); })
	    .pipe(source('./app.js'))
	    .pipe(gulp.dest('./dist/scripts/'));
}

var bundler = {
    w: null,
    init: function() {
        this.w = watchify(browserify({
            entries: ['./app/scripts/app.js'],
            insertGlobals: true,
            cache: {},
            packageCache: {}
        }));
    },
    bundle: function() {
        return this.w && this.w.bundle()
            .on('error', function(error) { log(error); })
            .pipe(source('app.js'))
            .pipe(gulp.dest('dist/scripts'));
    },
    watch: function() {
        this.w && this.w.on('update', this.bundle.bind(this));
    },
    stop: function() {
        this.w && this.w.close();
    }
};

gulp.task('scripts', function() {
    bundler.init();
    return bundler.bundle();
});

gulp.task('clean:dist', function(done) {
  del.sync('dist');
  done();
});


gulp.task('build', gulp.series('clean:dist', 'bundlejs','sass','image', 'html', 'sync'));
  //gulp.watch('app/scripts/**/*.js', gulp.series('bundlejs'));
//});

gulp.task('watch',gulp.series('sync','sass','image','html','bundlejs', function(){
    gulp.watch('app/scripts/**/*.js', gulp.series('bundlejs'));
    gulp.watch('app/styles/**/*.scss', gulp.series('sass'));
    gulp.watch('app/*.html', gulp.series('html'));
}));


//*******************   Typeahead demo  ************************/
gulp.task('type',function(){
  browserify('./app/scripts/typeahead-demo.js')
	  	.transform("babelify")
	    .bundle()
	    .on('error', function (error) { log(error); })
        .pipe(source('./app/scripts/typeahead-demo.js'))
	    .pipe(gulp.dest('./dist/scripts/'));	    
});