module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // sass: {
        //     dist: {
        //         options: {
        //             style: 'expanded',
        //             require: 'susy'
        //         },
        //         files: {
        //             'app/dev/css/build/style-sass.css': 'app/dev/css/scss/style.scss'
        //         }
        //     } 
        // },

        compass: {
          dist: {
            options: {
              cssDir: 'app/dev/css/build/css',
              sassDir: 'app/dev/scss',
              imagesDir: 'app/dev/css/img',
              javascriptsDir: 'app/dev/js',
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
                    'app/dev/css/build/style-autoprefixed.css' : 'app/dev/css/build/style.css'
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
            sass: {
                files: ['app/dev/css/scss/**/*'],
                tasks: ['sass', 'autoprefixer', 'cmq', 'cssmin']
            },
            js: {
                files: ['app/dev/js/**/*'],
                tasks: ['concat', 'uglify']
            },
            livereload: {
                files: ['app/**/*.html', 'app/**/*.php', 'app/**/*.js'], // add files to watch to trigger a reload
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
                'app/assets/js/*',
                'app/dev/js/build/*',
                'app/assets/css/*',
                'app/dev/css/build/*',
                // 'app/assets/img/*' //uncomment to clean img dir too
            ]
        },

    });

    // 3. Where we tell Grunt we plan to use this plug-in.

    // Sass
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-combine-media-queries');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // JS
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Images
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // Clean
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    // Broswer Reload + File Watch
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');


    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.

    // cleans directories, does everything for css, js, and images for deploy
    grunt.registerTask('prod', ['clean', 'sass', 'autoprefixer', 'cmq', 'cssmin', 'concat', 'uglify', 'imagemin']);

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

    // deletes all files in build directories (be careful with this one)
    grunt.registerTask('delete', ['clean']); 

    // compiles sass once
    grunt.registerTask('default', ['sass', 'autoprefixer', 'cmq', 'cssmin']); 

};
