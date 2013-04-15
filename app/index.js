'use strict';
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');

var AppGenerator = module.exports = function Appgenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';

  // for hooks to resolve on mocha by default
  if (!options['test-framework']) {
    options['test-framework'] = 'mocha';
  }

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', { as: 'app' });
  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.mainJsFile = '';
  this.mainCoffeeFile = 'console.log "\'Allo from CoffeeScript!"';

  // From yeoman/generator-webapp/blob/master/app/index.js, but doesn't work..
  //
  // this.on('end', function () {
  //   this.installDependencies({ skipInstall: options['skip-install'] });
  // });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AppGenerator, yeoman.generators.NamedBase);

AppGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

AppGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

AppGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

AppGenerator.prototype.bower = function() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_component.json', 'component.json');
};

AppGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

AppGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

AppGenerator.prototype.mainStylesheet = function mainStylesheet() {
  this.write('app/styles/main.scss', 'body {\n    background: #FAFAFA;\n}');
};

AppGenerator.prototype.jstTemplates = function jstTemplates() {
  this.copy('templates.js', 'app/scripts/templates.js');
};

AppGenerator.prototype.writeIndex = function writeIndex() {

  // prepare default content text
  var defaults = ['jQuery', 'Backbone.js', 'Lo-Dash', 'RequireJS'];
  var contentText = [
    '        <div>',
    '          <h1>\'Allo, \'Allo!</h1>',
    '          <p>You now have</p>',
    '          <ul>'
  ];

  // this.indexFile = this.appendFiles({
  //   html: this.indexFile,
  //   fileType: 'js',
  //   optimizedPath: 'scripts/coffee.js',
  //   sourceFileList: ['scripts/hello.js'],
  //   searchPath: '.tmp'
  // });

  this.indexFile = this.appendScripts(this.indexFile, 'scripts/main.js', [
    'components/requirejs/require.js'
  ], {'data-main': 'scripts/main'});

  defaults.forEach(function (el) {
    contentText.push('            <li>' + el +'</li>');
  });

  contentText = contentText.concat([
    '          </ul>',
    '          <p>installed.</p>',
    '          <h3>Enjoy coding! - Yeoman</h3>',
    '        </div>',
    ''
  ]);

  this.indexFile = this.indexFile.replace('<body>', '<body>\n'+ contentText.join('\n'));
};

AppGenerator.prototype.mainJs = function mainJs() {
  var mainJsFile = [
    '/*global require*/',
    '\'use strict\';',
    '',
    'require.config({',
    '  paths: {',
    '    jquery: \'../components/jquery/jquery\',',
    '    backbone: \'../components/backbone/backbone\',',
    '    lodash: \'../components/lodash/lodash\'',
    '  },',
    '  map: {',
    '    // Ensure Lo-Dash is used instead of underscore.',
    '    "*": { "underscore": "lodash" }',
    '  },',
    '  shim: {',
    '    backbone: {',
    '      deps: [',
    '          \'underscore\',',
    '          \'jquery\'',
    '      ],',
    '      exports: \'Backbone\'',
    '    },',
    '  }',
    '});',
    '',
    'require([',
    '    \'backbone\'',
    '], function (Backbone) {',
    '    Backbone.history.start();',
    '});'
  ];

  this.write('app/scripts/main.js', mainJsFile.join('\n'));
};

AppGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/scripts');
  this.mkdir('app/scripts/models');
  this.mkdir('app/scripts/views');
  this.mkdir('app/scripts/collections');
  this.mkdir('app/scripts/templates');
  this.mkdir('app/styles');
  this.mkdir('app/images');
  this.write('app/index.html', this.indexFile);
  this.write('app/scripts/hello.coffee', this.mainCoffeeFile);
};
