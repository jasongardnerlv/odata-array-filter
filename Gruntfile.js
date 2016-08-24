'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %>' +
        ' - <%= pkg.homepage %>' +
        ' - (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
        ' - licensed <%= pkg.license %> */\n',
    clean: {
      all: {
        src: ['dist','coverage']
      }
    },
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
        src: ['lib/odata-array-filter.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/*.js']
      }
    },
    instrument: {
      files: 'lib/odata-array-filter.js',
      options: {
        lazy: true,
        basePath: 'coverage/instrument/'
      }
    },
    reloadTasks : {
      rootPath : 'coverage/instrument/lib'
    },
    mochaTest: {
      options: {
        reporter: 'spec',
        require: ['lib/odata-parser','coverage/instrument/lib/odata-array-filter']
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-istanbul');

  // Build a distributable release
  grunt.registerTask('dist', ['test', 'concat', 'uglify']);

  // Check everything is good
  grunt.registerTask('test', ['clean:all', 'jshint', 'instrument', 'reloadTasks', 'mochaTest', 'storeCoverage', 'makeReport']);

  // Default task.
  grunt.registerTask('default', 'test');
  grunt.registerTask('ci', ['test']);

};
