module.exports = function( grunt ) {
    grunt.initConfig( {
        express: {
          options: {

          },
          dev: {
            options: {
              script: 'bin/www'
            }
          }
        },
        watch: {
            server: {
                files: ['app.js', 'config.js', 'Gruntfile.js', 'routes/*.js', 'utils/*.js', 'public/**/*', 'views/*'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            }
        }
    } );
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.registerTask('default', ['express:dev', 'watch']);
};
