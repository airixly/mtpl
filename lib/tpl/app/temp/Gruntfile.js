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
                    sassDir: 'assets/app',
                    cssDir: 'dist/assets/',
                    outputStyle: 'compressed'
                }
            },
            dev: {
                options: {
                    sassDir: 'assets/app',
                    cssDir: 'assets/',
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

    grunt.registerTask('dev', ['clean:build', 'requirejs', 'compass:build', 'copy:build']);
    grunt.registerTask('default', ['clean:build', 'compass:dev']);
};