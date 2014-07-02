module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        compass: {
          dist: {
            options: {
              cssDir: 'app/dev/css/build',
              sassDir: 'app/dev/css/scss',
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

        // copy: {
        //   main: {
        //     expand: true,
        //     src: 'app/dev/img/*',
        //     dest: 'app/assets/img/',
        //     flatten: true,
        //     filter: 'isFile',
        //   },
        // },


        clean: {
            test: [
                'app/assets/img/*' //uncomment to clean img dir too
            ]
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

    // Copy
    // this is a patch while imagemin remains busted 
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Clean
    grunt.loadNpmTasks('grunt-contrib-clean');
   
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

    // deletes all files in build directories (be careful with this one)
    grunt.registerTask('delete', ['clean']); 

    // compiles sass once
    grunt.registerTask('default', ['compass', 'autoprefixer', 'cmq', 'cssmin']); 

};
