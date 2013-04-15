/*global require*/
'use strict';

require.config({
  deps: ["main"],

  paths: {
    jquery: '../components/jquery/jquery',
    backbone: '../components/backbone/backbone',
    lodash: '../components/lodash/lodash',
    'backbone.layoutmanager': '../components/layoutmanager/backbone.layoutmanager'
  },

  map: {
    // Ensure Lo-Dash is used instead of underscore.
    "*": { "underscore": "lodash" }
  },

  shim: {
    backbone: {
      deps: [
          'underscore',
          'jquery'
      ],
      exports: 'Backbone'
    },
    "backbone.layoutmanager": {
      deps: [
        'jquery',
        'backbone',
        'underscore'
      ],
      exports: "Backbone.Layout"
    }
  }
});
