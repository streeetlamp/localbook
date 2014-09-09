module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        compass: {
          dist: {
            options: {
              cssDir: 'app/css',
              sassDir: 'app/scss',
              imagesDir: 'app/img',
              javascriptsDir: 'app/js',
              environment: 'development',
              relativeAssets: true,
              outputStyle: 'expanded',
              raw: 'preferred_syntax = :scss\n',
              require: ['susy','breakpoint']
            }
          }
        },

        autoprefixer: {
            dist: {
                files: {
                    'app/dev/css/build/style-autoprefixed.css' : 'app/dev/css/build/style-sass.css'
                }
            }
        },

        cmq: {
            your_target: { 
                files: {
                    'app/dev/css/build/cmq' : 'app/dev/css/build/style-autoprefixed.css'
                }
            }
        },

        cssmin: {
            combine: {
                files: {
                    'app/assets/css/style.css': ['app/dev/css/build/cmq/style-autoprefixed.css']
                }
            }
        },

        browserSync: {
            files: {
                src : 'app/assets/css/style.css'
            }
        },

        jshint: {
            all: [
                'app/dev/js/footer/*.js',
                'app/dev/js/header/*.js',
            ],
            options: {
                jshintrc: 'app/dev/js/.jshintrc'
            }
        },

        concat: {   
            footer: {
                src: [
                    'app/dev/js/footer/libs/*.js', // All JS in the libs folder
                    'app/dev/js/footer/footer.js'  // This specific file
                ],
                dest: 'app/dev/js/build/footer.js',
            },
            header: {
                src: [
                    'app/dev/js/header/libs/*.js', // All JS in the libs folder
                    'app/dev/js/header/header.js'  // This specific file
                ],
                dest: 'app/dev/js/build/header.js',
            }
        },

        uglify: {
            footer: {
                src: 'app/dev/js/build/footer.js',
                dest: 'app/assets/js/footer.min.js'
            },
            header: {
                src: 'app/dev/js/build/header.js',
                dest: 'app/assets/js/header.min.js'
            }
        },

        watch: {
            scss: {
                files: ['app/dev/css/scss/**/*.scss'],
                tasks: ['default']
            },
            css: {
                files: ['app/assets/css/**/*.css']
            },
            js: {
                files: ['app/dev/js/**/*'],
                tasks: ['concat', 'uglify']
            },
            livereload: {
                files: ['app/**/*.html', 'app/**/*.php', 'app/**/*.js', 'app/**/*.css'], // add files to watch to trigger a reload
                options: { livereload: true }
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'app/dev/img/',
                    src: ['**/*.{png,jpg,gif,svg,ico}'],
                    dest: 'app/assets/img/'
                }]
            }
        },

        clean: {
            test: [
                'app/assets/img/*' //uncomment to clean img dir too
            ]
        },

        devcode : {
          options :
          {
            html: true,        // html files parsing?
            js: true,          // javascript files parsing?
            css: true,         // css files parsing?
            clean: true,       // removes devcode comments even if code was not removed
            block: {
              open: 'devcode', // with this string we open a block of code
              close: 'endcode' // with this string we close a block of code
            },
            dest: 'app'       // default destination which overwrittes environment variable
          },
          dist : {             // settings for task used with 'devcode:dist'
            options: {
                source: 'app/',
                dest: 'app/',
                env: 'production'
            }
          }
        },

        replace: {
          example: {
            src: ['app/assets/css/style.css',],             // source files array (supports minimatch)
            dest: 'app/assets/css/style.t4.css',             // destination directory or file
            replacements: [{
              from: '../img/logo-b-l.png',                   // string replacement
              to: '<t4 type="media" id="90325" formatter="image/*"/>'
            },{
              from: '../img/logo-b-s.png',                   // string replacement
              to: '<t4 type="media" id="90320" formatter="image/*"/>'
            }]
          }
        },


    });

    // 3. Where we tell Grunt we plan to use this plug-in.

    // Sass
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-combine-media-queries');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // JS
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Images
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // Text Replacements
    grunt.loadNpmTasks('grunt-devcode');
    grunt.loadNpmTasks('grunt-text-replace');
   
    // Browser Reload + File Watch
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');


    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.

    // cleans directories, does everything for css, js, and images for deploy
    grunt.registerTask('prod', ['clean', 'img', 'compass', 'autoprefixer', 'cmq', 'cssmin', 'concat', 'uglify']);

    // runs Sass, autoprefixer, media query combine, and minify
    grunt.registerTask('css', ['watch:sass']); 

    // combines and minifies js on js changes
    grunt.registerTask('js', ['watch:js']); 

    // reloads on any html or php changes
    // you can add more files to watch in the settings
    grunt.registerTask('reload', ['watch:livereload']); 

    // injects new css into open page on css change
    grunt.registerTask('sync', ['browserSync']); 

    // opimizes images in dev and moves them to prod
    grunt.registerTask('img', ['imagemin']); 

    // compiles sass once
    grunt.registerTask('default', ['compass', 'autoprefixer', 'cmq', 'cssmin']); 

    // T4 template tags
    grunt.registerTask('t4', ['grunt-text-replace']);

};
