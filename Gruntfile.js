'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %>' +
        ' - <%= pkg.homepage %>' +
        ' - (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
        ' - licensed <%= pkg.license %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        options: {
          jshintrc: 'lib/.jshintrc'
        },
        src: ['lib/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/*.js']
      }
    },
    instrument: {
      files: 'lib/*.js',
      options: {
        lazy: true,
        basePath: 'coverage/instrument/'
      }
    },
    reloadTasks : {
      rootPath : 'coverage/instrument/lib'
    },
    mocha: {
      test: {
        src: ['test/tests.html']
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['test/*.js']
    },
    storeCoverage: {
      options: {
        dir: 'coverage/reports'
      }
    },
    makeReport: {
      src: 'coverage/reports/**/*.json',
      options: {
        type: 'lcov',
        dir: 'coverage/reports',
        print: 'detail'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-istanbul');

  // Build a distributable release
  grunt.registerTask('dist', ['test', 'concat', 'uglify']);

  // Check everything is good
  grunt.registerTask('test', ['jshint', 'instrument', 'reloadTasks', 'mochaTest', 'storeCoverage', 'makeReport']);

  // Default task.
  grunt.registerTask('default', 'test');
  grunt.registerTask('ci', ['test', 'coveralls']);

};
