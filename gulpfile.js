var gulp = require('gulp');
var mocha = require('gulp-mocha');
var util = require('gulp-util');

gulp.task('test',function(){
    return gulp.src(['test/**/*.js'],{read:false})
        .pipe(mocha({reporter: 'spec'}))
        .on('error',util.log);
});

gulp.task('test-once',function(){
    return gulp.src(['test/**/*.js'],{read:false})
        .pipe(mocha({reporter: 'spec'}))
        .on('error',util.log)
        .once('end',function(){
            process.exit();
        })
});

gulp.task('watch-test',function(){
    gulp.watch(['controllers/**','models/**','routes/**','views/**','test/**','server.js'],['test']);
});
