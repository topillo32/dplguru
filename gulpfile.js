var gulp   = require('gulp'),
    elixir = require('laravel-elixir');

elixir.extend('beautify', function() {
    var beautify    = require('gulp-jsbeautifier'),
        beautifyCfg = require('./beautify.json');

    new elixir.Task('beautify', function() {
        this.recordStep('Beautifying Files');
        return gulp.src(['./templates/**/*.html', './index.html', './libs/css/styles.css', './libs/js/**/*.js', '!./libs/js/*.js'], {base: './'}).pipe(beautify(beautifyCfg)).pipe(gulp.dest('./'));
    });
});

elixir.config.sourcemaps = false;
elixir(function(mix) {

    mix.beautify();

    mix.styles([
        './node_modules/angular-material/angular-material.css',
        './node_modules/angular-material-data-table/dist/md-data-table.css',
        './libs/css/styles.css'
    ], './libs/css/all.css');

    mix.scripts([
        './node_modules/angular/angular.js'
    ], './libs/js/angular.js');

    mix.scripts([
        './node_modules/lodash/lodash.js',
        './node_modules/angular-aria/angular-aria.js',
        './node_modules/angular-animate/angular-animate.js',
        './node_modules/angular-material/angular-material.js',

        './node_modules/angular-sanitize/angular-sanitize.js',
        './node_modules/angular-messages/angular-messages.js',
        './node_modules/angular-resource/angular-resource.js',
        './node_modules/angular-route/angular-route.js',

        './node_modules/angular-jwt/dist/angular-jwt.js',
        './node_modules/angular-storage/dist/angular-storage.js',

        './node_modules/angular-material-data-table/dist/md-data-table.js',

        './node_modules/moment/moment.js',
    ], './libs/js/scripts.js');

    mix.scripts([
        './libs/js/modules/*.js',
        './libs/js/directives/*.js',
        './libs/js/filters/*.js',
        './libs/js/services/*.js',
        './libs/js/factorys/*.js',
        './libs/js/controllers/*.js'
    ], './libs/js/software.js');

});
