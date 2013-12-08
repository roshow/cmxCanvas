
jade = (function(exports){
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }
}

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    ac = ac.filter(nulls);
    bc = bc.filter(nulls);
    a['class'] = ac.concat(bc).join(' ');
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function nulls(val) {
  return val != null;
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
    , terse = obj.terse;

  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;

  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'");
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else if (escaped && escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"');
      } else {
        buf.push(key + '="' + val + '"');
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

  return exports;

})({});

jade.templates = {};
jade.render = function(node, template, data) {
  var tmp = jade.templates[template](data);
  node.innerHTML = tmp;
};

jade.templates["cmxreader"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="readcomic bggrad"><div id="readcomic" class="container"><canvas id="stagingCanvas" width="800px" height="450px"> </canvas><div id="canvas_container"><div id="leftbutton"><span class="ui-arrow glyphicon glyphicon-play pull-left"></span></div><div class="canvaswrapper"><canvas id="cmx" height="450px" width="800px"></canvas></div><div id="rightbutton"><span class="ui-arrow glyphicon glyphicon-play pull-right"></span></div></div></div></div><div class="nav-wrapper foot"><nav id="footer" role="navigation" class="navbar navbar-default"><div class="navbar-header"><a class="navbar-brand moreinfoBtn">more info<span class="caret"></span></a></div><div id="moreinfo" class="anim"><div class="row"><div class="col-xs-3"><ul class="issueDetails"><li>');
var __val__ = "Series: " + series.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</li>');
if ( (issue))
{
buf.push('<li>');
var __val__ = "Issue: " + issue
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</li>');
}
buf.push('<li>');
var __val__ = "Title: " + title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</li></ul></div><div class="col-xs-3"><ul class="issueDetails"><li>Creators:</li>');
// iterate creators
;(function(){
  if ('number' == typeof creators.length) {
    for (var $index = 0, $$l = creators.length; $index < $$l; $index++) {
      var creator = creators[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':(creator.url), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>');
var __val__ = creator.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a><span>');
var __val__ = " (" + creator.credit + ")"
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></li>');
    }
  } else {
    for (var $index in creators) {
      var creator = creators[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':(creator.url), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>');
var __val__ = creator.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a><span>');
var __val__ = " (" + creator.credit + ")"
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></li>');
   }
  }
}).call(this);

buf.push('</ul></div><div class="col-xs-6"><ul id="toc" class="nav navbar-nav">');
 var i = 0
// iterate cmxJSON
;(function(){
  if ('number' == typeof cmxJSON.length) {
    for (var $index = 0, $$l = cmxJSON.length; $index < $$l; $index++) {
      var p = cmxJSON[$index];

buf.push('<li');
buf.push(attrs({ 'id':("toc" + i), 'panelNum':(i) }, {"id":true,"panelNum":true}));
buf.push('><a>');
var __val__ = (i + 1)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
 i++
    }
  } else {
    for (var $index in cmxJSON) {
      var p = cmxJSON[$index];

buf.push('<li');
buf.push(attrs({ 'id':("toc" + i), 'panelNum':(i) }, {"id":true,"panelNum":true}));
buf.push('><a>');
var __val__ = (i + 1)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
 i++
   }
  }
}).call(this);

buf.push('</ul></div></div></div></nav></div>');
}
return buf.join("");
}
jade.templates["index"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="nav-wrapper"><nav id="topnav" role="navigation" class="navbar navbar-default"><div class="navbar-header"><button type="button" data-toggle="collapse" data-target=".navbar-ex1-collapse" class="navbar-toggle"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a href="#" class="navbar-brand">CMXCANVAS<span class="subBrand"> Beta</span></a></div><div class="collapse navbar-collapse navbar-ex1-collapse"><ul class="nav navbar-nav"><li class="libNav"><a>library</a></li><li><a data-toggle="dropdown" href="#" class="dropdown-toggle">contact  <span class="caret"></span></a><ul class="dropdown-menu contactmenu"><li><a href="http://twitter.com/roshow" target="_blank">twitter @roshow</a></li><li><a href="mailto:rolando@roshow.net">email rolando@roshow.net</a></li></ul></li></ul></div></nav></div>');
}
return buf.join("");
}
jade.templates["library"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="library" class="container"> <div class="row">');
// iterate issues  
;(function(){
  if ('number' == typeof issues  .length) {
    for (var $index = 0, $$l = issues  .length; $index < $$l; $index++) {
      var issue = issues  [$index];

buf.push('<div class="col-sm-4 issueEntry"><a');
buf.push(attrs({ 'issueId':(issue._id), 'href':("/#/comic/"+issue._id) }, {"issueId":true,"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(issue.thumb), "class": ('img-responsive') }, {"src":true}));
buf.push('/><p>');
var __val__ = issue.series.name.toUpperCase() +':'
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<br/>');
var __val__ = issue.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></a></div>');
    }
  } else {
    for (var $index in issues  ) {
      var issue = issues  [$index];

buf.push('<div class="col-sm-4 issueEntry"><a');
buf.push(attrs({ 'issueId':(issue._id), 'href':("/#/comic/"+issue._id) }, {"issueId":true,"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':(issue.thumb), "class": ('img-responsive') }, {"src":true}));
buf.push('/><p>');
var __val__ = issue.series.name.toUpperCase() +':'
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('<br/>');
var __val__ = issue.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</p></a></div>');
   }
  }
}).call(this);

buf.push('</div></div>');
}
return buf.join("");
}
jade.templates["toc"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="nav-wrapper foot"><div class="navbar-header"><a class="navbar-brand moreinfoBtn">more infoxxzzz <span class="caret"></span></a></div><div id="moreinfo" class="anim"><div class="row"><div class="col-xs-3"><ul class="issueDetails"><li>');
var __val__ = "Series: " + series.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</li>');
if ( (issue))
{
buf.push('<li>');
var __val__ = "Issue: " + issue
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</li>');
}
buf.push('<li>');
var __val__ = "Title: " + title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</li></ul></div><div class="col-xs-3"><ul class="issueDetails"><li>Creators:</li>');
// iterate creators
;(function(){
  if ('number' == typeof creators.length) {
    for (var $index = 0, $$l = creators.length; $index < $$l; $index++) {
      var creator = creators[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':(creator.url), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>');
var __val__ = creator.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a><span>');
var __val__ = " (" + creator.credit + ")"
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></li>');
    }
  } else {
    for (var $index in creators) {
      var creator = creators[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':(creator.url), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>');
var __val__ = creator.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a><span>');
var __val__ = " (" + creator.credit + ")"
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span></li>');
   }
  }
}).call(this);

buf.push('</ul></div><div class="col-xs-6"><ul id="toc" class="nav navbar-nav">');
 var i = 0
// iterate comic
;(function(){
  if ('number' == typeof comic.length) {
    for (var $index = 0, $$l = comic.length; $index < $$l; $index++) {
      var p = comic[$index];

buf.push('<li');
buf.push(attrs({ 'id':("toc" + i), 'panelNum':(i) }, {"id":true,"panelNum":true}));
buf.push('><a>');
var __val__ = (i + 1)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
 i++
    }
  } else {
    for (var $index in comic) {
      var p = comic[$index];

buf.push('<li');
buf.push(attrs({ 'id':("toc" + i), 'panelNum':(i) }, {"id":true,"panelNum":true}));
buf.push('><a>');
var __val__ = (i + 1)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
 i++
   }
  }
}).call(this);

buf.push('</ul></div></div></div><!--collapse.navbar-collapse.navbar-ex1-collapse<ul id="toc" class="nav navbar-nav">');
 var i = 0
// iterate comic
;(function(){
  if ('number' == typeof comic.length) {
    for (var $index = 0, $$l = comic.length; $index < $$l; $index++) {
      var p = comic[$index];

buf.push('<li');
buf.push(attrs({ 'id':("toc" + i), 'panelNum':(i) }, {"id":true,"panelNum":true}));
buf.push('><a>');
var __val__ = (i + 1)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
 i++
    }
  } else {
    for (var $index in comic) {
      var p = comic[$index];

buf.push('<li');
buf.push(attrs({ 'id':("toc" + i), 'panelNum':(i) }, {"id":true,"panelNum":true}));
buf.push('><a>');
var __val__ = (i + 1)
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
 i++
   }
  }
}).call(this);

buf.push('</ul>--></div>');
}
return buf.join("");
}