/*global module:false*/
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        // Task configuration.
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    lineNumbers: true,
                    noCache: true
                },
                files: {
                    'src/css/main.css': 'src/sass/main.scss'
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            sass: {
                files: ['src/sass/styles.scss', 'src/sass/**/*.scss'],
                tasks: ['sass'],
            }
        }
    });
    //
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //
    grunt.registerTask('default', ['sass']);
};