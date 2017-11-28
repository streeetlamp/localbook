module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Grunt-sass 
        sass: {
            app: {
              files: [{
                expand: true,
                cwd: 'app/scss',
                src: ['*.scss'],
                dest: 'app/css',
                ext: '.css'
              }]
            },
            options: {
              sourceMap: false, 
              outputStyle: 'nested', 
            }
          },

        watch: {
            scss: {
              files: ['app/scss/**/*.scss'],
              tasks: ['sass']
            },
            css: {
                files: ['app/css/**/*.css']
            },
            js: {
                files: ['app/js/**/*.js','!app/js/main.js'],
                tasks: ['concat']
            },
            html: {
                files: ['app/include/**/*.html'],
                tasks: ['includes:dev']
            },
            livereload: {
                files: ['app/**/*.html', 'app/**/*.php', 'app/**/*.js', 'app/**/*.css'],
                options: { livereload: true }
            }
        },


        browserSync: {
            bsFiles: {
                src : 'app/css/style.css'
            },
            options: {
                watchTask: true, // < VERY important
                server: {
                    baseDir: "./app/"
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
                cwd: 'build/',      // Src matches are relative to this path.
                src: ['**/*.html'], // Actual pattern(s) to match.
                dest: 'build/',   // Destination path prefix.
                ext: '.html',   // Dest filepaths will have this extension.
            }]
          }
        },

        // Build the site using grunt-includes
        includes: {
          dev: {
            cwd: 'app/include',
            src: [ '*.html' ],
            dest: 'app/',
            options: {
              flatten: true,
              includePath: 'app/include/parts'
            }
          },
          build: {
            cwd: 'app/include',
            src: [ '*.html' ],
            dest: 'build/',
            options: {
              flatten: true,
              includePath: 'app/include/parts'
            }
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
            dest: 'dist'       // default destination which overwrites environment variable
          },
          dist : {             // settings for task used with 'devcode:dist'
            options: {
                source: 'build/',
                dest: 'build/',
                env: 'production'
            }
          }
        },

        concurrent: {
            watch: {
                tasks: ['watch', 'sass', 'browserSync'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },


    });

    // 3. Where we tell Grunt we plan to use this plug-in.

    // Sass
    grunt.loadNpmTasks('grunt-sass');
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
    grunt.registerTask('default', ['browserSync','watch']); 

    // cleans directories, does everything for css, js, and images for deploy
    grunt.registerTask('prod', ['includes','imagemin', 'compass:dist', 'autoprefixer', 'cmq', 'cssmin', 'concat', 'uglify','includes:build','devcode:dist','htmlmin']);
};
