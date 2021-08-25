/**************************************************
 * Grunt build script.
 * @description Automate several processes and compilations on `watch`. Export installable projects and zip on dist directory on `build`.
 * @version 1.0.1
 * @author emranio, malik-xs
 * @organization Wpmet
**************************************************/

const gruntScriptVersion = '1.0.1';

const path = require( 'path' );
const sass = require( 'node-sass' );

/**
 * Grunt Configuration start Here
 * # Configuration initialization : initConfig
 * # Loading grunt modules
 * # Registering tasks
 */
module.exports = function( grunt ) {
	'use strict';

	const projectConfig = {
		name: 'modal', 				// should be the text domain of the project (todo: spilt it)
		srcDir: './', 						// the source directory of the plugin
		distDir: './dist/',		// where to save the built files
		ignoreLint:	true, 						// ignore the linting (coding standard checking) during 'build' task (true/ false)
	};

	const projectFiles = {
		// SCSS & JScript Compile lists
		scss: [
			{
				cwd: 'assets/scss/',
				src: [ '*.scss' ],
				dest: 'assets/css/',
			},
		],
		js: [
			{
				cwd: 'assets/src/',
				src: [ 'modal.js' ],
				dest: 'assets/js/',
			},
		],
	};

	// Webpack Config
	const webpackConfig = {
		module: {
			rules: [ {
				test: /\.m?(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
			},
			{
				test: /\.css$/i,
				use: [ 'style-loader', 'css-loader' ],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]',
				},
			} ],
		},
		performance: { hints: false },
		resolve: {
			fallback: { fs: false },
		},
		externals: {
			'react': 'React',
			'react-dom': 'ReactDOM',
		},
	};

	// Grunt task begins
	grunt.initConfig( {

		// Watch for file changes and compile onChange
		watch: {
			css: {
				files: [ projectConfig.srcDir + '**/*.scss', '!' + projectConfig.srcDir + 'node_modules' ],
				tasks: [ 'css', ( projectConfig.ignoreLint ? 'log:nolintwarning' : 'stylelint' ) ],
			},
			js: {
				files: [ projectConfig.srcDir + '**/src/**/*.js', '!' + projectConfig.srcDir + 'node_modules' ],
				tasks: [ 'js', ( projectConfig.ignoreLint ? 'log:nolintwarning' : 'eslint' ) ],
			},
		},

		// Compile all .scss files from src to dest
		sass: {
			compile: {
				options: {
					implementation: sass,
					sourceMap: 'none',
					indentType: 'tab',
					omitSourceMapUrl: true,
					indentWidth: 1,
					outputStyle: 'expanded',
					force: true,
				},
				files: projectFiles.scss.map( value => ( {
					expand: true,
					extDot: 'last',
					ext: '.css',
					cwd: value.cwd,
					src: value.src,
					dest: value.dest,
				} ) ),
			},
		},

		// Autoprefixer.
		postcss: {
			options: {
				processors: [
					require( 'autoprefixer' ),
				],
			},
			dist: {
				files: projectFiles.scss.map( value => ( {
					src: [
						projectConfig.srcDir + value.dest + '*.css',
						'!' + projectConfig.srcDir + value.dest + '*.min.css',
					],
				} ) ),
			},
		},

		// Compile app.js files from src to dest
		webpack: {
			configs: projectFiles.js.map( value =>
				value.src.map( val => ( {
					mode: 'production',
					entry: path.join( __dirname, projectConfig.srcDir, value.cwd, val ),
					output: {
						path: path.resolve( __dirname, projectConfig.srcDir, value.dest ), // string (default)
						filename: val.replace( /^.*[\\\/]/, '' ),
					},
					optimization: {
						minimize: false,
					},
					...webpackConfig, // Additional webpack configuration
				} ),
				) ).flat( 1 ),
		},

		// i18n
		addtextdomain: {
			options: {
				// textdomain: 'foobar',
				updateDomains: true, // List of text domains to replace.
			},
			target: {
				src: [
					projectConfig.srcDir + '*.php',
					projectConfig.srcDir + '**/*.php',
					'!' + projectConfig.srcDir + 'node_modules/**',
					'!' + projectConfig.srcDir + 'dev-*/**',
				],
			},
		},

		checktextdomain: {
			standard: {
				options: {
					text_domain: projectConfig.name, //Specify allowed domain(s)
					// correct_domain: true, // don't use it, it has bugs
					keywords: [ //List keyword specifications
						'__:1,2d',
						'_e:1,2d',
						'_x:1,2c,3d',
						'esc_html__:1,2d',
						'esc_html_e:1,2d',
						'esc_html_x:1,2c,3d',
						'esc_attr__:1,2d',
						'esc_attr_e:1,2d',
						'esc_attr_x:1,2c,3d',
						'_ex:1,2c,3d',
						'_n:1,2,4d',
						'_nx:1,2,4c,5d',
						'_n_noop:1,2,3d',
						'_nx_noop:1,2,3c,4d',
					],
				},
				files: [ {
					src: [
						projectConfig.srcDir + '**/*.php',
						'!' + projectConfig.srcDir + 'node_modules/**',
					], //all php
					expand: true,
				} ],
			},
		},

		makepot: {
			target: {
				options: {
					cwd: projectConfig.srcDir, // Directory of files to internationalize.
					mainFile: '', // Main project file.
					type: 'wp-plugin', // Type of project (wp-plugin or wp-theme).
					updateTimestamp: false, // Whether the POT-Creation-Date should be updated without other changes.
					updatePoFiles: false, // Whether to update PO files in the same directory as the POT file.
				},
			},
		},

		// Deleting previous build files & .zip
		clean: {
			options: { force: true },
			dist: [
				projectConfig.distDir + '/**',
				projectConfig.distDir.replace( /\/$/, '' ) + '.zip',
			],
		},

		// Copying project files to ../dist/ directory
		copy: {
			dist: {
				files: [ {
					expand: true,
					src: [
						'' + projectConfig.srcDir + '**',
						'!' + projectConfig.srcDir + 'Gruntfile.js',
						'!' + projectConfig.srcDir + 'package.json',
						'!' + projectConfig.srcDir + 'package-lock.json',
						'!' + projectConfig.srcDir + 'node_modules/**',
						'!' + projectConfig.srcDir + '**/dev-*/**',
						'!' + projectConfig.srcDir + '**/*-test/**',
						'!' + projectConfig.srcDir + '**/*-beta/**',
						'!' + projectConfig.srcDir + '**/scss/**',
						'!' + projectConfig.srcDir + '**/sass/**',
						'!' + projectConfig.srcDir + '**/src/**',
						'!' + projectConfig.srcDir + '**/.*',
						'!' + projectConfig.srcDir + '**/*.config',
						'!' + projectConfig.srcDir + 'build-package/**',
						'!' + projectConfig.srcDir + 'none',
						'!' + projectConfig.srcDir + 'Built',
						'!' + projectConfig.srcDir + 'Installable',
					],
					dest: projectConfig.distDir,
				} ],
			},
		},

		// Compress Build Files into ${project}.zip
		compress: {
			dist: {
				options: {
					force: true,
					mode: 'zip',
					archive: projectConfig.distDir.replace( projectConfig.name, '' ) + projectConfig.name + '.zip',
				},
				expand: true,
				cwd: projectConfig.distDir,
				src: [ '**' ],
				dest: '../' + projectConfig.name,
			},
		},

		// Minify all .js files.
		terser: {
			options: {
				ie8: true,
				parse: {
					strict: false,
				},
			},
			js: {
				files: [ {
					expand: true,
					src: [ projectConfig.distDir + '**/*.js' ],
					dest: '',
				} ],
			},
		},

		// Minify all .css files.
		cssmin: {
			options: {
				force: true,
				compress: true,
				sourcemaps: false,
			},
			minify: {
				files: [ {
					expand: true,
					src: [ projectConfig.distDir + '**/*.css' ],
					dest: '',
				} ],
			},
		},

		// PHP Code Sniffer.
		phpcs: {
			options: {
				bin: projectConfig.srcDir + 'vendor/phpcs/bin/phpcs',
			},
			dist: {
				src: [
					'**/*.php', // Include all php files.
					'!includes/api/legacy/**',
					'!includes/libraries/**',
					'!node_modules/**',
					'!tests/cli/**',
					'!tmp/**',
					'!vendor/**',
				],
			},
		},

		// JavaScript linting with ESLint.
		eslint: {
			options: {
				fix: true,
			},
			default: [
				'' + projectConfig.srcDir + '/**/*.js',
				'!' + projectConfig.srcDir + '/**/*.min.js',
				'!' + projectConfig.srcDir + 'node_modules/**',
			],
		},

		// Sass linting with Stylelint.
		stylelint: {
			options: {
				fix: true,
				configFile: '.stylelintrc',
			},
			default: [ projectConfig.srcDir + '**/*.scss' ],
		},

		// All logging configuration
		log: {
			// before build starts log
			begin: `
───────────────────────────────────────────────────────────────────
# Project: ${projectConfig.name}
# Dist: ${projectConfig.distDir}
# Script Version: ${gruntScriptVersion}
───────────────────────────────────────────────────────────────────
			`.cyan,

			// before build starts log
			nolintwarning: '\n>>'.red + ' Linting is not enabled for this project.',

			// before textdomain tasks starts log
			textdomainchecking: '\n>>'.green + ` Checking textdomain [${projectConfig.name}].`,

			// before textdomain tasks starts log
			minifying: '\n>>'.green + ' Minifying js & css files.',

			// After finishing all tasks
			finish: `
╭─────────────────────────────────────────────────────────────────╮
│                                                                 │
│                      All tasks completed.                       │
│   Built files & Installable zip copied to the dist directory.   │
│                        ~ XpeedStudio ~                          │
│                                                                 │
╰─────────────────────────────────────────────────────────────────╯
			`.green,
		},
	} );

	// Stopping Grunt header logs before every task
	grunt.log.header = function() { };

	// Load all Grunt library tasks
	require( 'jit-grunt' )( grunt, {
		postcss: 'grunt-postcss',
	} );

	// Loading modules that are not autoloaded by jit-grant
	grunt.loadNpmTasks( 'grunt-wp-i18n' ); // Load wp-i18n lib

	/* ---------------------------------------- *
	 *  Registering TASKS
	 * ---------------------------------------- */
	// Default tasks
	grunt.registerTask( 'default', [
		'log:begin',
		'js',
		'css',
		( projectConfig.ignoreLint ? 'log:nolintwarning' : 'lint' ),
		'watch',
	] );

	grunt.registerTask( 'js', [
		'webpack',
	] );

	grunt.registerTask( 'css', [
		'sass',
		'postcss',
	] );

	grunt.registerTask( 'minify', [
		'log:minifying',
		'terser:js',
		'cssmin',
	] );

	grunt.registerTask( 'boot', [
		'clean',
		'copy',
	] );

	grunt.registerTask( 'build', [
		'log:begin',
		( projectConfig.ignoreLint ? 'log:nolintwarning' : 'lint' ),
		'fixtextdomain',
		'makepot',
		'boot',
		'minify',
		// 'compress',
		'log:finish',
	] );

	grunt.registerTask( 'lint', [
		'eslint',
		'stylelint',
	] );

	grunt.registerTask( 'fixtextdomain', [
		'log:textdomainchecking',
		'addtextdomain',
		'checktextdomain',
	] );

	// Only an alias to 'default' task.
	grunt.registerTask( 'dev', [
		'default',
	] );

	// Logging multi task
	grunt.registerMultiTask( 'log', function() {
		grunt.log.writeln( this.data );
	} );
};
