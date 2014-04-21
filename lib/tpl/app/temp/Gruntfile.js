module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: 'dist/'
            }
        },
        requirejs: {
            build: {
                options: {
                    baseUrl: 'js',
                    mainConfigFile: 'js/main.js',
                    name: 'main',
                    out: 'dist/$name.min.js'
                }
            }
        },
        compass: {
            build: {
                options: {
                    sassDir: 'assets/main',
                    cssDir: 'dist/assets/',
                    outputStyle: 'compressed'
                }
            },
            dev: {
                options: {
                    sassDir: 'assets/main',
                    cssDir: 'dist/assets/',
                    outputStyle: 'expanded'
                }
            }
        },

        copy: {
            build: {
                expand: true,
                src: ['assets/images/*', 'index.html'],
                dest: 'dist/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');

    /**
     * Default to compress js and css files
     */
    grunt.registerTask('default', ['clean:build', 'requirejs', 'compass:build', 'copy:build']);
    grunt.registerTask('dev', ['clean:build', 'compass:dev']);
};