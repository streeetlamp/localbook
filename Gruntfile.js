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
          },
          watch: {
            options: {
              cssDir: 'app/css',
              sassDir: 'app/scss',
              imagesDir: 'app/img',
              javascriptsDir: 'app/js',
              environment: 'development',
              relativeAssets: true,
              outputStyle: 'expanded',
              raw: 'preferred_syntax = :scss\n',
              require: ['susy','breakpoint'],
              watch: true
            }
          }
        },

        autoprefixer: {
            dist: {
                files: {
                    'build/css/style.css' : 'app/css/style.css'
                }
            }
        },

        cmq: {
            your_target: { 
                files: {
                    'build/css/style.css' : 'build/css/style.css'
                }
            }
        },

        cssmin: {
            combine: {
                files: {
                    'build/css/style.css': ['build/css/style.css']
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
                'app/js/*.js'
            ],
            options: {
                jshintrc: 'app/js/.jshintrc'
            }
        },

        concat: {   
            scripts: {
                src: [
                    'app/js/scripts/libs/*.js', // All JS in the libs folder
                    'app/js/scripts/scripts.js'  // This specific file
                ],
                dest: 'app/js/main.js',
            }
        },

        uglify: {
            scripts: {
                src: 'app/js/main.js',
                dest: 'build/js/main.js'
            }
        },

        htmlmin: {                                     // Task
          dist: {                                      // Target
            options: {                                 // Target options
              removeComments: true,
              collapseWhitespace: true
            },
            files: [{                                   // Dictionary of files
                expand: true,     // Enable dynamic expansion.
                cwd: 'app/',      // Src matches are relative to this path.
                src: ['**/*.html'], // Actual pattern(s) to match.
                dest: 'build/',   // Destination path prefix.
                ext: '.html',   // Dest filepaths will have this extension.
            }]
          }
        },

        // Build the site using grunt-includes
        includes: {
          build: {
            cwd: 'app/include',
            src: [ '*.html' ],
            dest: 'app/',
            options: {
              flatten: true,
              includePath: 'app/include/parts'
            }
          }
        },

        watch: {
            css: {
                files: ['app/css/**/*.css']
            },
            js: {
                files: ['app/js/**/*'],
                tasks: ['concat']
            },
            html: {
                files: ['app/include/**/*.html'],
                tasks: ['includes']
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
                    cwd: 'app/img/',
                    src: ['**/*.{png,jpg,gif,svg,ico}'],
                    dest: 'build/img/'
                }]
            }
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
            dest: 'app'       // default destination which overwrites environment variable
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
            src: ['app/css/style.css',],             // source files array (supports minimatch)
            dest: 'app/css/style.t4.css',             // destination directory or file
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

    // html
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-includes');

    // Text Replacements
    grunt.loadNpmTasks('grunt-devcode');
    grunt.loadNpmTasks('grunt-text-replace');
   
    // Browser Reload + File Watch
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');


    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.

    // compiles sass once
    grunt.registerTask('default', ['compass:dist', 'autoprefixer', 'cmq', 'cssmin']); 

    // cleans directories, does everything for css, js, and images for deploy
    grunt.registerTask('prod', ['includes','imagemin', 'compass:dist', 'autoprefixer', 'cmq', 'cssmin', 'concat', 'uglify', 'htmlmin']);

    // injects new css into open page on css change
    grunt.registerTask('sync', ['browserSync']); 

    // T4 template tags
    grunt.registerTask('t4', ['grunt-text-replace']);

};
