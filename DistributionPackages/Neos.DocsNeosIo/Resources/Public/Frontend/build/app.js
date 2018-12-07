(function () {
  'use strict';

  (function ($) {
    $(function () {
      // Plugin initialization
      $('.carousel').carousel();
      $('.carousel.carousel-slider').carousel({
        fullWidth: true,
        indicators: true,
        onCycleTo: function onCycleTo(item, dragged) {}
      });
      $('.collapsible').collapsible();
      $('.collapsible.expandable').collapsible({
        accordion: false
      });
      $('.dropdown-trigger').dropdown();
      $('.slider').slider();
      $('.parallax').parallax();
      $('.materialboxed').materialbox();
      $('.modal').modal();
      $('.scrollspy').scrollSpy();
      $('.datepicker').datepicker();
      $('.tabs').tabs();
      $('.timepicker').timepicker();
      $('.tooltipped').tooltip();
      $('select').not('.disabled').formSelect();
      $('.sidenav').sidenav();
      $('.tap-target').tapTarget();
      $('input.autocomplete').autocomplete({
        data: {
          Apple: null,
          Microsoft: null,
          Google: 'http://placehold.it/250x250'
        }
      });
      $('input[data-length], textarea[data-length]').characterCounter(); // Fab

      $('.fixed-action-btn').floatingActionButton();
      $('.fixed-action-btn.horizontal').floatingActionButton({
        direction: 'left'
      });
      $('.fixed-action-btn.click-to-toggle').floatingActionButton({
        direction: 'left',
        hoverEnabled: false
      });
      $('.fixed-action-btn.toolbar').floatingActionButton({
        toolbarEnabled: true
      });
    }); // end of document ready
  })(jQuery); // end of jQuery name space

  /* **********************************************
       Begin prism-core.js
  ********************************************** */

  var _self = (typeof window !== 'undefined')
  	? window   // if in browser
  	: (
  		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
  		? self // if in worker
  		: {}   // if in node js
  	);

  /**
   * Prism: Lightweight, robust, elegant syntax highlighting
   * MIT license http://www.opensource.org/licenses/mit-license.php/
   * @author Lea Verou http://lea.verou.me
   */

  var Prism$1 = (function(){

  // Private helper vars
  var lang = /\blang(?:uage)?-([\w-]+)\b/i;
  var uniqueId = 0;

  var _ = _self.Prism = {
  	manual: _self.Prism && _self.Prism.manual,
  	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
  	util: {
  		encode: function (tokens) {
  			if (tokens instanceof Token) {
  				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
  			} else if (_.util.type(tokens) === 'Array') {
  				return tokens.map(_.util.encode);
  			} else {
  				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
  			}
  		},

  		type: function (o) {
  			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
  		},

  		objId: function (obj) {
  			if (!obj['__id']) {
  				Object.defineProperty(obj, '__id', { value: ++uniqueId });
  			}
  			return obj['__id'];
  		},

  		// Deep clone a language definition (e.g. to extend it)
  		clone: function (o, visited) {
  			var type = _.util.type(o);
  			visited = visited || {};

  			switch (type) {
  				case 'Object':
  					if (visited[_.util.objId(o)]) {
  						return visited[_.util.objId(o)];
  					}
  					var clone = {};
  					visited[_.util.objId(o)] = clone;

  					for (var key in o) {
  						if (o.hasOwnProperty(key)) {
  							clone[key] = _.util.clone(o[key], visited);
  						}
  					}

  					return clone;

  				case 'Array':
  					if (visited[_.util.objId(o)]) {
  						return visited[_.util.objId(o)];
  					}
  					var clone = [];
  					visited[_.util.objId(o)] = clone;

  					o.forEach(function (v, i) {
  						clone[i] = _.util.clone(v, visited);
  					});

  					return clone;
  			}

  			return o;
  		}
  	},

  	languages: {
  		extend: function (id, redef) {
  			var lang = _.util.clone(_.languages[id]);

  			for (var key in redef) {
  				lang[key] = redef[key];
  			}

  			return lang;
  		},

  		/**
  		 * Insert a token before another token in a language literal
  		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
  		 * we cannot just provide an object, we need anobject and a key.
  		 * @param inside The key (or language id) of the parent
  		 * @param before The key to insert before. If not provided, the function appends instead.
  		 * @param insert Object with the key/value pairs to insert
  		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
  		 */
  		insertBefore: function (inside, before, insert, root) {
  			root = root || _.languages;
  			var grammar = root[inside];

  			if (arguments.length == 2) {
  				insert = arguments[1];

  				for (var newToken in insert) {
  					if (insert.hasOwnProperty(newToken)) {
  						grammar[newToken] = insert[newToken];
  					}
  				}

  				return grammar;
  			}

  			var ret = {};

  			for (var token in grammar) {

  				if (grammar.hasOwnProperty(token)) {

  					if (token == before) {

  						for (var newToken in insert) {

  							if (insert.hasOwnProperty(newToken)) {
  								ret[newToken] = insert[newToken];
  							}
  						}
  					}

  					ret[token] = grammar[token];
  				}
  			}

  			// Update references in other language definitions
  			_.languages.DFS(_.languages, function(key, value) {
  				if (value === root[inside] && key != inside) {
  					this[key] = ret;
  				}
  			});

  			return root[inside] = ret;
  		},

  		// Traverse a language definition with Depth First Search
  		DFS: function(o, callback, type, visited) {
  			visited = visited || {};
  			for (var i in o) {
  				if (o.hasOwnProperty(i)) {
  					callback.call(o, i, o[i], type || i);

  					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
  						visited[_.util.objId(o[i])] = true;
  						_.languages.DFS(o[i], callback, null, visited);
  					}
  					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
  						visited[_.util.objId(o[i])] = true;
  						_.languages.DFS(o[i], callback, i, visited);
  					}
  				}
  			}
  		}
  	},
  	plugins: {},

  	highlightAll: function(async, callback) {
  		_.highlightAllUnder(document, async, callback);
  	},

  	highlightAllUnder: function(container, async, callback) {
  		var env = {
  			callback: callback,
  			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
  		};

  		_.hooks.run("before-highlightall", env);

  		var elements = env.elements || container.querySelectorAll(env.selector);

  		for (var i=0, element; element = elements[i++];) {
  			_.highlightElement(element, async === true, env.callback);
  		}
  	},

  	highlightElement: function(element, async, callback) {
  		// Find language
  		var language, grammar, parent = element;

  		while (parent && !lang.test(parent.className)) {
  			parent = parent.parentNode;
  		}

  		if (parent) {
  			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
  			grammar = _.languages[language];
  		}

  		// Set language on the element, if not present
  		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

  		if (element.parentNode) {
  			// Set language on the parent, for styling
  			parent = element.parentNode;

  			if (/pre/i.test(parent.nodeName)) {
  				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
  			}
  		}

  		var code = element.textContent;

  		var env = {
  			element: element,
  			language: language,
  			grammar: grammar,
  			code: code
  		};

  		_.hooks.run('before-sanity-check', env);

  		if (!env.code || !env.grammar) {
  			if (env.code) {
  				_.hooks.run('before-highlight', env);
  				env.element.textContent = env.code;
  				_.hooks.run('after-highlight', env);
  			}
  			_.hooks.run('complete', env);
  			return;
  		}

  		_.hooks.run('before-highlight', env);

  		if (async && _self.Worker) {
  			var worker = new Worker(_.filename);

  			worker.onmessage = function(evt) {
  				env.highlightedCode = evt.data;

  				_.hooks.run('before-insert', env);

  				env.element.innerHTML = env.highlightedCode;

  				callback && callback.call(env.element);
  				_.hooks.run('after-highlight', env);
  				_.hooks.run('complete', env);
  			};

  			worker.postMessage(JSON.stringify({
  				language: env.language,
  				code: env.code,
  				immediateClose: true
  			}));
  		}
  		else {
  			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

  			_.hooks.run('before-insert', env);

  			env.element.innerHTML = env.highlightedCode;

  			callback && callback.call(element);

  			_.hooks.run('after-highlight', env);
  			_.hooks.run('complete', env);
  		}
  	},

  	highlight: function (text, grammar, language) {
  		var env = {
  			code: text,
  			grammar: grammar,
  			language: language
  		};
  		_.hooks.run('before-tokenize', env);
  		env.tokens = _.tokenize(env.code, env.grammar);
  		_.hooks.run('after-tokenize', env);
  		return Token.stringify(_.util.encode(env.tokens), env.language);
  	},

  	matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
  		var Token = _.Token;

  		for (var token in grammar) {
  			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
  				continue;
  			}

  			if (token == target) {
  				return;
  			}

  			var patterns = grammar[token];
  			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

  			for (var j = 0; j < patterns.length; ++j) {
  				var pattern = patterns[j],
  					inside = pattern.inside,
  					lookbehind = !!pattern.lookbehind,
  					greedy = !!pattern.greedy,
  					lookbehindLength = 0,
  					alias = pattern.alias;

  				if (greedy && !pattern.pattern.global) {
  					// Without the global flag, lastIndex won't work
  					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
  					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
  				}

  				pattern = pattern.pattern || pattern;

  				// Don’t cache length as it changes during the loop
  				for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

  					var str = strarr[i];

  					if (strarr.length > text.length) {
  						// Something went terribly wrong, ABORT, ABORT!
  						return;
  					}

  					if (str instanceof Token) {
  						continue;
  					}

  					if (greedy && i != strarr.length - 1) {
  						pattern.lastIndex = pos;
  						var match = pattern.exec(text);
  						if (!match) {
  							break;
  						}

  						var from = match.index + (lookbehind ? match[1].length : 0),
  						    to = match.index + match[0].length,
  						    k = i,
  						    p = pos;

  						for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
  							p += strarr[k].length;
  							// Move the index i to the element in strarr that is closest to from
  							if (from >= p) {
  								++i;
  								pos = p;
  							}
  						}

  						// If strarr[i] is a Token, then the match starts inside another Token, which is invalid
  						if (strarr[i] instanceof Token) {
  							continue;
  						}

  						// Number of tokens to delete and replace with the new match
  						delNum = k - i;
  						str = text.slice(pos, p);
  						match.index -= pos;
  					} else {
  						pattern.lastIndex = 0;

  						var match = pattern.exec(str),
  							delNum = 1;
  					}

  					if (!match) {
  						if (oneshot) {
  							break;
  						}

  						continue;
  					}

  					if(lookbehind) {
  						lookbehindLength = match[1] ? match[1].length : 0;
  					}

  					var from = match.index + lookbehindLength,
  					    match = match[0].slice(lookbehindLength),
  					    to = from + match.length,
  					    before = str.slice(0, from),
  					    after = str.slice(to);

  					var args = [i, delNum];

  					if (before) {
  						++i;
  						pos += before.length;
  						args.push(before);
  					}

  					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

  					args.push(wrapped);

  					if (after) {
  						args.push(after);
  					}

  					Array.prototype.splice.apply(strarr, args);

  					if (delNum != 1)
  						_.matchGrammar(text, strarr, grammar, i, pos, true, token);

  					if (oneshot)
  						break;
  				}
  			}
  		}
  	},

  	tokenize: function(text, grammar, language) {
  		var strarr = [text];

  		var rest = grammar.rest;

  		if (rest) {
  			for (var token in rest) {
  				grammar[token] = rest[token];
  			}

  			delete grammar.rest;
  		}

  		_.matchGrammar(text, strarr, grammar, 0, 0, false);

  		return strarr;
  	},

  	hooks: {
  		all: {},

  		add: function (name, callback) {
  			var hooks = _.hooks.all;

  			hooks[name] = hooks[name] || [];

  			hooks[name].push(callback);
  		},

  		run: function (name, env) {
  			var callbacks = _.hooks.all[name];

  			if (!callbacks || !callbacks.length) {
  				return;
  			}

  			for (var i=0, callback; callback = callbacks[i++];) {
  				callback(env);
  			}
  		}
  	}
  };

  var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
  	this.type = type;
  	this.content = content;
  	this.alias = alias;
  	// Copy of the full string this token was created from
  	this.length = (matchedStr || "").length|0;
  	this.greedy = !!greedy;
  };

  Token.stringify = function(o, language, parent) {
  	if (typeof o == 'string') {
  		return o;
  	}

  	if (_.util.type(o) === 'Array') {
  		return o.map(function(element) {
  			return Token.stringify(element, language, o);
  		}).join('');
  	}

  	var env = {
  		type: o.type,
  		content: Token.stringify(o.content, language, parent),
  		tag: 'span',
  		classes: ['token', o.type],
  		attributes: {},
  		language: language,
  		parent: parent
  	};

  	if (o.alias) {
  		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
  		Array.prototype.push.apply(env.classes, aliases);
  	}

  	_.hooks.run('wrap', env);

  	var attributes = Object.keys(env.attributes).map(function(name) {
  		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
  	}).join(' ');

  	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

  };

  if (!_self.document) {
  	if (!_self.addEventListener) {
  		// in Node.js
  		return _self.Prism;
  	}

  	if (!_.disableWorkerMessageHandler) {
  		// In worker
  		_self.addEventListener('message', function (evt) {
  			var message = JSON.parse(evt.data),
  				lang = message.language,
  				code = message.code,
  				immediateClose = message.immediateClose;

  			_self.postMessage(_.highlight(code, _.languages[lang], lang));
  			if (immediateClose) {
  				_self.close();
  			}
  		}, false);
  	}

  	return _self.Prism;
  }

  //Get current script and highlight
  var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

  if (script) {
  	_.filename = script.src;

  	if (!_.manual && !script.hasAttribute('data-manual')) {
  		if(document.readyState !== "loading") {
  			if (window.requestAnimationFrame) {
  				window.requestAnimationFrame(_.highlightAll);
  			} else {
  				window.setTimeout(_.highlightAll, 16);
  			}
  		}
  		else {
  			document.addEventListener('DOMContentLoaded', _.highlightAll);
  		}
  	}
  }

  return _self.Prism;

  })();

  if (typeof module !== 'undefined' && module.exports) {
  	module.exports = Prism$1;
  }

  // hack for components to work correctly in node.js
  if (typeof global !== 'undefined') {
  	global.Prism = Prism$1;
  }


  /* **********************************************
       Begin prism-markup.js
  ********************************************** */

  Prism$1.languages.markup = {
  	'comment': /<!--[\s\S]*?-->/,
  	'prolog': /<\?[\s\S]+?\?>/,
  	'doctype': /<!DOCTYPE[\s\S]+?>/i,
  	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
  	'tag': {
  		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
  		greedy: true,
  		inside: {
  			'tag': {
  				pattern: /^<\/?[^\s>\/]+/i,
  				inside: {
  					'punctuation': /^<\/?/,
  					'namespace': /^[^\s>\/:]+:/
  				}
  			},
  			'attr-value': {
  				pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
  				inside: {
  					'punctuation': [
  						/^=/,
  						{
  							pattern: /(^|[^\\])["']/,
  							lookbehind: true
  						}
  					]
  				}
  			},
  			'punctuation': /\/?>/,
  			'attr-name': {
  				pattern: /[^\s>\/]+/,
  				inside: {
  					'namespace': /^[^\s>\/:]+:/
  				}
  			}

  		}
  	},
  	'entity': /&#?[\da-z]{1,8};/i
  };

  Prism$1.languages.markup['tag'].inside['attr-value'].inside['entity'] =
  	Prism$1.languages.markup['entity'];

  // Plugin to make entity title show the real entity, idea by Roman Komarov
  Prism$1.hooks.add('wrap', function(env) {

  	if (env.type === 'entity') {
  		env.attributes['title'] = env.content.replace(/&amp;/, '&');
  	}
  });

  Prism$1.languages.xml = Prism$1.languages.markup;
  Prism$1.languages.html = Prism$1.languages.markup;
  Prism$1.languages.mathml = Prism$1.languages.markup;
  Prism$1.languages.svg = Prism$1.languages.markup;


  /* **********************************************
       Begin prism-css.js
  ********************************************** */

  Prism$1.languages.css = {
  	'comment': /\/\*[\s\S]*?\*\//,
  	'atrule': {
  		pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
  		inside: {
  			'rule': /@[\w-]+/
  			// See rest below
  		}
  	},
  	'url': /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
  	'selector': /[^{}\s][^{};]*?(?=\s*\{)/,
  	'string': {
  		pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
  		greedy: true
  	},
  	'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
  	'important': /\B!important\b/i,
  	'function': /[-a-z0-9]+(?=\()/i,
  	'punctuation': /[(){};:]/
  };

  Prism$1.languages.css['atrule'].inside.rest = Prism$1.languages.css;

  if (Prism$1.languages.markup) {
  	Prism$1.languages.insertBefore('markup', 'tag', {
  		'style': {
  			pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
  			lookbehind: true,
  			inside: Prism$1.languages.css,
  			alias: 'language-css',
  			greedy: true
  		}
  	});

  	Prism$1.languages.insertBefore('inside', 'attr-value', {
  		'style-attr': {
  			pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
  			inside: {
  				'attr-name': {
  					pattern: /^\s*style/i,
  					inside: Prism$1.languages.markup.tag.inside
  				},
  				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
  				'attr-value': {
  					pattern: /.+/i,
  					inside: Prism$1.languages.css
  				}
  			},
  			alias: 'language-css'
  		}
  	}, Prism$1.languages.markup.tag);
  }

  /* **********************************************
       Begin prism-clike.js
  ********************************************** */

  Prism$1.languages.clike = {
  	'comment': [
  		{
  			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
  			lookbehind: true
  		},
  		{
  			pattern: /(^|[^\\:])\/\/.*/,
  			lookbehind: true,
  			greedy: true
  		}
  	],
  	'string': {
  		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
  		greedy: true
  	},
  	'class-name': {
  		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
  		lookbehind: true,
  		inside: {
  			punctuation: /[.\\]/
  		}
  	},
  	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  	'boolean': /\b(?:true|false)\b/,
  	'function': /[a-z0-9_]+(?=\()/i,
  	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
  	'punctuation': /[{}[\];(),.:]/
  };


  /* **********************************************
       Begin prism-javascript.js
  ********************************************** */

  Prism$1.languages.javascript = Prism$1.languages.extend('clike', {
  	'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
  	'number': /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
  	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  	'function': /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
  	'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
  });

  Prism$1.languages.insertBefore('javascript', 'keyword', {
  	'regex': {
  		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
  		lookbehind: true,
  		greedy: true
  	},
  	// This must be declared before keyword because we use "function" inside the look-forward
  	'function-variable': {
  		pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
  		alias: 'function'
  	},
  	'constant': /\b[A-Z][A-Z\d_]*\b/
  });

  Prism$1.languages.insertBefore('javascript', 'string', {
  	'template-string': {
  		pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
  		greedy: true,
  		inside: {
  			'interpolation': {
  				pattern: /\${[^}]+}/,
  				inside: {
  					'interpolation-punctuation': {
  						pattern: /^\${|}$/,
  						alias: 'punctuation'
  					},
  					rest: null // See below
  				}
  			},
  			'string': /[\s\S]+/
  		}
  	}
  });
  Prism$1.languages.javascript['template-string'].inside['interpolation'].inside.rest = Prism$1.languages.javascript;

  if (Prism$1.languages.markup) {
  	Prism$1.languages.insertBefore('markup', 'tag', {
  		'script': {
  			pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
  			lookbehind: true,
  			inside: Prism$1.languages.javascript,
  			alias: 'language-javascript',
  			greedy: true
  		}
  	});
  }

  Prism$1.languages.js = Prism$1.languages.javascript;


  /* **********************************************
       Begin prism-file-highlight.js
  ********************************************** */

  (function () {
  	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
  		return;
  	}

  	self.Prism.fileHighlight = function() {

  		var Extensions = {
  			'js': 'javascript',
  			'py': 'python',
  			'rb': 'ruby',
  			'ps1': 'powershell',
  			'psm1': 'powershell',
  			'sh': 'bash',
  			'bat': 'batch',
  			'h': 'c',
  			'tex': 'latex'
  		};

  		Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
  			var src = pre.getAttribute('data-src');

  			var language, parent = pre;
  			var lang = /\blang(?:uage)?-([\w-]+)\b/i;
  			while (parent && !lang.test(parent.className)) {
  				parent = parent.parentNode;
  			}

  			if (parent) {
  				language = (pre.className.match(lang) || [, ''])[1];
  			}

  			if (!language) {
  				var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
  				language = Extensions[extension] || extension;
  			}

  			var code = document.createElement('code');
  			code.className = 'language-' + language;

  			pre.textContent = '';

  			code.textContent = 'Loading…';

  			pre.appendChild(code);

  			var xhr = new XMLHttpRequest();

  			xhr.open('GET', src, true);

  			xhr.onreadystatechange = function () {
  				if (xhr.readyState == 4) {

  					if (xhr.status < 400 && xhr.responseText) {
  						code.textContent = xhr.responseText;

  						Prism$1.highlightElement(code);
  					}
  					else if (xhr.status >= 400) {
  						code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
  					}
  					else {
  						code.textContent = '✖ Error: File does not exist or is empty';
  					}
  				}
  			};

  			xhr.send(null);
  		});

  		if (Prism$1.plugins.toolbar) {
  			Prism$1.plugins.toolbar.registerButton('download-file', function (env) {
  				var pre = env.element.parentNode;
  				if (!pre || !/pre/i.test(pre.nodeName) || !pre.hasAttribute('data-src') || !pre.hasAttribute('data-download-link')) {
  					return;
  				}
  				var src = pre.getAttribute('data-src');
  				var a = document.createElement('a');
  				a.textContent = pre.getAttribute('data-download-link-label') || 'Download';
  				a.setAttribute('download', '');
  				a.href = src;
  				return a;
  			});
  		}

  	};

  	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

  })();

  Prism.languages.yaml = {
  	'scalar': {
  		pattern: /([\-:]\s*(?:![^\s]+)?[ \t]*[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)[^\r\n]+(?:\2[^\r\n]+)*)/,
  		lookbehind: true,
  		alias: 'string'
  	},
  	'comment': /#.*/,
  	'key': {
  		pattern: /(\s*(?:^|[:\-,[{\r\n?])[ \t]*(?:![^\s]+)?[ \t]*)[^\r\n{[\]},#\s]+?(?=\s*:\s)/,
  		lookbehind: true,
  		alias: 'atrule'
  	},
  	'directive': {
  		pattern: /(^[ \t]*)%.+/m,
  		lookbehind: true,
  		alias: 'important'
  	},
  	'datetime': {
  		pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?)?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?)(?=[ \t]*(?:$|,|]|}))/m,
  		lookbehind: true,
  		alias: 'number'
  	},
  	'boolean': {
  		pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:true|false)[ \t]*(?=$|,|]|})/im,
  		lookbehind: true,
  		alias: 'important'
  	},
  	'null': {
  		pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:null|~)[ \t]*(?=$|,|]|})/im,
  		lookbehind: true,
  		alias: 'important'
  	},
  	'string': {
  		pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)("|')(?:(?!\2)[^\\\r\n]|\\.)*\2(?=[ \t]*(?:$|,|]|}))/m,
  		lookbehind: true,
  		greedy: true
  	},
  	'number': {
  		pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+\.?\d*|\.?\d+)(?:e[+-]?\d+)?|\.inf|\.nan)[ \t]*(?=$|,|]|})/im,
  		lookbehind: true
  	},
  	'tag': /![^\s]+/,
  	'important': /[&*][\w]+/,
  	'punctuation': /---|[:[\]{}\-,|>?]|\.\.\./
  };

  Prism.languages['markup-templating'] = {};

  Object.defineProperties(Prism.languages['markup-templating'], {
  	buildPlaceholders: {
  		// Tokenize all inline templating expressions matching placeholderPattern
  		// If the replaceFilter function is provided, it will be called with every match.
  		// If it returns false, the match will not be replaced.
  		value: function (env, language, placeholderPattern, replaceFilter) {
  			if (env.language !== language) {
  				return;
  			}

  			env.tokenStack = [];

  			env.code = env.code.replace(placeholderPattern, function(match) {
  				if (typeof replaceFilter === 'function' && !replaceFilter(match)) {
  					return match;
  				}
  				var i = env.tokenStack.length;
  				// Check for existing strings
  				while (env.code.indexOf('___' + language.toUpperCase() + i + '___') !== -1)
  					++i;

  				// Create a sparse array
  				env.tokenStack[i] = match;

  				return '___' + language.toUpperCase() + i + '___';
  			});

  			// Switch the grammar to markup
  			env.grammar = Prism.languages.markup;
  		}
  	},
  	tokenizePlaceholders: {
  		// Replace placeholders with proper tokens after tokenizing
  		value: function (env, language) {
  			if (env.language !== language || !env.tokenStack) {
  				return;
  			}

  			// Switch the grammar back
  			env.grammar = Prism.languages[language];

  			var j = 0;
  			var keys = Object.keys(env.tokenStack);
  			var walkTokens = function (tokens) {
  				if (j >= keys.length) {
  					return;
  				}
  				for (var i = 0; i < tokens.length; i++) {
  					var token = tokens[i];
  					if (typeof token === 'string' || (token.content && typeof token.content === 'string')) {
  						var k = keys[j];
  						var t = env.tokenStack[k];
  						var s = typeof token === 'string' ? token : token.content;

  						var index = s.indexOf('___' + language.toUpperCase() + k + '___');
  						if (index > -1) {
  							++j;
  							var before = s.substring(0, index);
  							var middle = new Prism.Token(language, Prism.tokenize(t, env.grammar, language), 'language-' + language, t);
  							var after = s.substring(index + ('___' + language.toUpperCase() + k + '___').length);
  							var replacement;
  							if (before || after) {
  								replacement = [before, middle, after].filter(function (v) { return !!v; });
  								walkTokens(replacement);
  							} else {
  								replacement = middle;
  							}
  							if (typeof token === 'string') {
  								Array.prototype.splice.apply(tokens, [i, 1].concat(replacement));
  							} else {
  								token.content = replacement;
  							}

  							if (j >= keys.length) {
  								break;
  							}
  						}
  					} else if (token.content && typeof token.content !== 'string') {
  						walkTokens(token.content);
  					}
  				}
  			};

  			walkTokens(env.tokens);
  		}
  	}
  });

  /**
   * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
   * Modified by Miles Johnson: http://milesj.me
   *
   * Supports the following:
   * 		- Extends clike syntax
   * 		- Support for PHP 5.3+ (namespaces, traits, generators, etc)
   * 		- Smarter constant and function matching
   *
   * Adds the following new token classes:
   * 		constant, delimiter, variable, function, package
   */
  (function (Prism) {
  	Prism.languages.php = Prism.languages.extend('clike', {
  		'keyword': /\b(?:and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
  		'constant': /\b[A-Z0-9_]{2,}\b/,
  		'comment': {
  			pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
  			lookbehind: true
  		}
  	});

  	Prism.languages.insertBefore('php', 'string', {
  		'shell-comment': {
  			pattern: /(^|[^\\])#.*/,
  			lookbehind: true,
  			alias: 'comment'
  		}
  	});

  	Prism.languages.insertBefore('php', 'keyword', {
  		'delimiter': {
  			pattern: /\?>|<\?(?:php|=)?/i,
  			alias: 'important'
  		},
  		'variable': /\$+(?:\w+\b|(?={))/i,
  		'package': {
  			pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
  			lookbehind: true,
  			inside: {
  				punctuation: /\\/
  			}
  		}
  	});

  	// Must be defined after the function pattern
  	Prism.languages.insertBefore('php', 'operator', {
  		'property': {
  			pattern: /(->)[\w]+/,
  			lookbehind: true
  		}
  	});

  	Prism.languages.insertBefore('php', 'string', {
  		'nowdoc-string': {
  			pattern: /<<<'([^']+)'(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;/,
  			greedy: true,
  			alias: 'string',
  			inside: {
  				'delimiter': {
  					pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
  					alias: 'symbol',
  					inside: {
  						'punctuation': /^<<<'?|[';]$/
  					}
  				}
  			}
  		},
  		'heredoc-string': {
  			pattern: /<<<(?:"([^"]+)"(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;|([a-z_]\w*)(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\2;)/i,
  			greedy: true,
  			alias: 'string',
  			inside: {
  				'delimiter': {
  					pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
  					alias: 'symbol',
  					inside: {
  						'punctuation': /^<<<"?|[";]$/
  					}
  				},
  				'interpolation': null // See below
  			}
  		},
  		'single-quoted-string': {
  			pattern: /'(?:\\[\s\S]|[^\\'])*'/,
  			greedy: true,
  			alias: 'string'
  		},
  		'double-quoted-string': {
  			pattern: /"(?:\\[\s\S]|[^\\"])*"/,
  			greedy: true,
  			alias: 'string',
  			inside: {
  				'interpolation': null // See below
  			}
  		}
  	});
  	// The different types of PHP strings "replace" the C-like standard string
  	delete Prism.languages.php['string'];

  	var string_interpolation = {
  		pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[.+?]|->\w+)*)/,
  		lookbehind: true,
  		inside: {
  			rest: Prism.languages.php
  		}
  	};
  	Prism.languages.php['heredoc-string'].inside['interpolation'] = string_interpolation;
  	Prism.languages.php['double-quoted-string'].inside['interpolation'] = string_interpolation;

  	Prism.hooks.add('before-tokenize', function(env) {
  		if (!/(?:<\?php|<\?)/ig.test(env.code)) {
  			return;
  		}

  		var phpPattern = /(?:<\?php|<\?)[\s\S]*?(?:\?>|$)/ig;
  		Prism.languages['markup-templating'].buildPlaceholders(env, 'php', phpPattern);
  	});

  	Prism.hooks.add('after-tokenize', function(env) {
  		Prism.languages['markup-templating'].tokenizePlaceholders(env, 'php');
  	});

  }(Prism));

  (function(Prism) {
  	var insideString = {
  		variable: [
  			// Arithmetic Environment
  			{
  				pattern: /\$?\(\([\s\S]+?\)\)/,
  				inside: {
  					// If there is a $ sign at the beginning highlight $(( and )) as variable
  					variable: [{
  							pattern: /(^\$\(\([\s\S]+)\)\)/,
  							lookbehind: true
  						},
  						/^\$\(\(/
  					],
  					number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
  					// Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
  					operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
  					// If there is no $ sign at the beginning highlight (( and )) as punctuation
  					punctuation: /\(\(?|\)\)?|,|;/
  				}
  			},
  			// Command Substitution
  			{
  				pattern: /\$\([^)]+\)|`[^`]+`/,
  				greedy: true,
  				inside: {
  					variable: /^\$\(|^`|\)$|`$/
  				}
  			},
  			/\$(?:[\w#?*!@]+|\{[^}]+\})/i
  		]
  	};

  	Prism.languages.bash = {
  		'shebang': {
  			pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,
  			alias: 'important'
  		},
  		'comment': {
  			pattern: /(^|[^"{\\])#.*/,
  			lookbehind: true
  		},
  		'string': [
  			//Support for Here-Documents https://en.wikipedia.org/wiki/Here_document
  			{
  				pattern: /((?:^|[^<])<<\s*)["']?(\w+?)["']?\s*\r?\n(?:[\s\S])*?\r?\n\2/,
  				lookbehind: true,
  				greedy: true,
  				inside: insideString
  			},
  			{
  				pattern: /(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\1)[^\\])*\1/,
  				greedy: true,
  				inside: insideString
  			}
  		],
  		'variable': insideString.variable,
  		// Originally based on http://ss64.com/bash/
  		'function': {
  			pattern: /(^|[\s;|&])(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|[\s;|&])/,
  			lookbehind: true
  		},
  		'keyword': {
  			pattern: /(^|[\s;|&])(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|[\s;|&])/,
  			lookbehind: true
  		},
  		'boolean': {
  			pattern: /(^|[\s;|&])(?:true|false)(?=$|[\s;|&])/,
  			lookbehind: true
  		},
  		'operator': /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
  		'punctuation': /\$?\(\(?|\)\)?|\.\.|[{}[\];]/
  	};

  	var inside = insideString.variable[1].inside;
  	inside.string = Prism.languages.bash.string;
  	inside['function'] = Prism.languages.bash['function'];
  	inside.keyword = Prism.languages.bash.keyword;
  	inside['boolean'] = Prism.languages.bash['boolean'];
  	inside.operator = Prism.languages.bash.operator;
  	inside.punctuation = Prism.languages.bash.punctuation;
  	
  	Prism.languages.shell = Prism.languages.bash;
  })(Prism);

  Prism.languages.scss = Prism.languages.extend('css', {
  	'comment': {
  		pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
  		lookbehind: true
  	},
  	'atrule': {
  		pattern: /@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,
  		inside: {
  			'rule': /@[\w-]+/
  			// See rest below
  		}
  	},
  	// url, compassified
  	'url': /(?:[-a-z]+-)*url(?=\()/i,
  	// CSS selector regex is not appropriate for Sass
  	// since there can be lot more things (var, @ directive, nesting..)
  	// a selector must start at the end of a property or after a brace (end of other rules or nesting)
  	// it can contain some characters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
  	// the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
  	// can "pass" as a selector- e.g: proper#{$erty})
  	// this one was hard to do, so please be careful if you edit this one :)
  	'selector': {
  		// Initial look-ahead is used to prevent matching of blank selectors
  		pattern: /(?=\S)[^@;{}()]?(?:[^@;{}()]|&|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}]+[:{][^}]+))/m,
  		inside: {
  			'parent': {
  				pattern: /&/,
  				alias: 'important'
  			},
  			'placeholder': /%[-\w]+/,
  			'variable': /\$[-\w]+|#\{\$[-\w]+\}/
  		}
  	}
  });

  Prism.languages.insertBefore('scss', 'atrule', {
  	'keyword': [
  		/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,
  		{
  			pattern: /( +)(?:from|through)(?= )/,
  			lookbehind: true
  		}
  	]
  });

  Prism.languages.scss.property = {
  	pattern: /(?:[\w-]|\$[-\w]+|#\{\$[-\w]+\})+(?=\s*:)/i,
  	inside: {
  		'variable': /\$[-\w]+|#\{\$[-\w]+\}/
  	}
  };

  Prism.languages.insertBefore('scss', 'important', {
  	// var and interpolated vars
  	'variable': /\$[-\w]+|#\{\$[-\w]+\}/
  });

  Prism.languages.insertBefore('scss', 'function', {
  	'placeholder': {
  		pattern: /%[-\w]+/,
  		alias: 'selector'
  	},
  	'statement': {
  		pattern: /\B!(?:default|optional)\b/i,
  		alias: 'keyword'
  	},
  	'boolean': /\b(?:true|false)\b/,
  	'null': /\bnull\b/,
  	'operator': {
  		pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,
  		lookbehind: true
  	}
  });

  Prism.languages.scss['atrule'].inside.rest = Prism.languages.scss;

  (function(Prism) {
  	Prism.languages.sass = Prism.languages.extend('css', {
  		// Sass comments don't need to be closed, only indented
  		'comment': {
  			pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t]+.+)*/m,
  			lookbehind: true
  		}
  	});

  	Prism.languages.insertBefore('sass', 'atrule', {
  		// We want to consume the whole line
  		'atrule-line': {
  			// Includes support for = and + shortcuts
  			pattern: /^(?:[ \t]*)[@+=].+/m,
  			inside: {
  				'atrule': /(?:@[\w-]+|[+=])/m
  			}
  		}
  	});
  	delete Prism.languages.sass.atrule;


  	var variable = /\$[-\w]+|#\{\$[-\w]+\}/;
  	var operator = [
  		/[+*\/%]|[=!]=|<=?|>=?|\b(?:and|or|not)\b/,
  		{
  			pattern: /(\s+)-(?=\s)/,
  			lookbehind: true
  		}
  	];

  	Prism.languages.insertBefore('sass', 'property', {
  		// We want to consume the whole line
  		'variable-line': {
  			pattern: /^[ \t]*\$.+/m,
  			inside: {
  				'punctuation': /:/,
  				'variable': variable,
  				'operator': operator
  			}
  		},
  		// We want to consume the whole line
  		'property-line': {
  			pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s]+.*)/m,
  			inside: {
  				'property': [
  					/[^:\s]+(?=\s*:)/,
  					{
  						pattern: /(:)[^:\s]+/,
  						lookbehind: true
  					}
  				],
  				'punctuation': /:/,
  				'variable': variable,
  				'operator': operator,
  				'important': Prism.languages.sass.important
  			}
  		}
  	});
  	delete Prism.languages.sass.property;
  	delete Prism.languages.sass.important;

  	// Now that whole lines for other patterns are consumed,
  	// what's left should be selectors
  	delete Prism.languages.sass.selector;
  	Prism.languages.insertBefore('sass', 'punctuation', {
  		'selector': {
  			pattern: /([ \t]*)\S(?:,?[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,?[^,\r\n]+)*)*/,
  			lookbehind: true
  		}
  	});

  }(Prism));

  Prism.languages.typescript = Prism.languages.extend('javascript', {
  	// From JavaScript Prism keyword list and TypeScript language spec: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#221-reserved-words
  	'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield|module|declare|constructor|namespace|abstract|require|type)\b/,
  	'builtin': /\b(?:string|Function|any|number|boolean|Array|symbol|console)\b/,
  });

  Prism.languages.ts = Prism.languages.typescript;

  Prism.languages.sql= {
  	'comment': {
  		pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
  		lookbehind: true
  	},
  	'string' : {
  		pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\])*\2/,
  		greedy: true,
  		lookbehind: true
  	},
  	'variable': /@[\w.$]+|@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
  	'function': /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i, // Should we highlight user defined functions too?
  	'keyword': /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:_INSERT|COL)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURNS?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
  	'boolean': /\b(?:TRUE|FALSE|NULL)\b/i,
  	'number': /\b0x[\da-f]+\b|\b\d+\.?\d*|\B\.\d+\b/i,
  	'operator': /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|IN|LIKE|NOT|OR|IS|DIV|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
  	'punctuation': /[;[\]()`,.]/
  };

  Prism.languages.markdown = Prism.languages.extend('markup', {});
  Prism.languages.insertBefore('markdown', 'prolog', {
  	'blockquote': {
  		// > ...
  		pattern: /^>(?:[\t ]*>)*/m,
  		alias: 'punctuation'
  	},
  	'code': [
  		{
  			// Prefixed by 4 spaces or 1 tab
  			pattern: /^(?: {4}|\t).+/m,
  			alias: 'keyword'
  		},
  		{
  			// `code`
  			// ``code``
  			pattern: /``.+?``|`[^`\n]+`/,
  			alias: 'keyword'
  		}
  	],
  	'title': [
  		{
  			// title 1
  			// =======

  			// title 2
  			// -------
  			pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
  			alias: 'important',
  			inside: {
  				punctuation: /==+$|--+$/
  			}
  		},
  		{
  			// # title 1
  			// ###### title 6
  			pattern: /(^\s*)#+.+/m,
  			lookbehind: true,
  			alias: 'important',
  			inside: {
  				punctuation: /^#+|#+$/
  			}
  		}
  	],
  	'hr': {
  		// ***
  		// ---
  		// * * *
  		// -----------
  		pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
  		lookbehind: true,
  		alias: 'punctuation'
  	},
  	'list': {
  		// * item
  		// + item
  		// - item
  		// 1. item
  		pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
  		lookbehind: true,
  		alias: 'punctuation'
  	},
  	'url-reference': {
  		// [id]: http://example.com "Optional title"
  		// [id]: http://example.com 'Optional title'
  		// [id]: http://example.com (Optional title)
  		// [id]: <http://example.com> "Optional title"
  		pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
  		inside: {
  			'variable': {
  				pattern: /^(!?\[)[^\]]+/,
  				lookbehind: true
  			},
  			'string': /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
  			'punctuation': /^[\[\]!:]|[<>]/
  		},
  		alias: 'url'
  	},
  	'bold': {
  		// **strong**
  		// __strong__

  		// Allow only one line break
  		pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
  		lookbehind: true,
  		inside: {
  			'punctuation': /^\*\*|^__|\*\*$|__$/
  		}
  	},
  	'italic': {
  		// *em*
  		// _em_

  		// Allow only one line break
  		pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
  		lookbehind: true,
  		inside: {
  			'punctuation': /^[*_]|[*_]$/
  		}
  	},
  	'url': {
  		// [example](http://example.com "Optional title")
  		// [example] [id]
  		pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
  		inside: {
  			'variable': {
  				pattern: /(!?\[)[^\]]+(?=\]$)/,
  				lookbehind: true
  			},
  			'string': {
  				pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
  			}
  		}
  	}
  });

  Prism.languages.markdown['bold'].inside['url'] = Prism.languages.markdown['url'];
  Prism.languages.markdown['italic'].inside['url'] = Prism.languages.markdown['url'];
  Prism.languages.markdown['bold'].inside['italic'] = Prism.languages.markdown['italic'];
  Prism.languages.markdown['italic'].inside['bold'] = Prism.languages.markdown['bold'];

  (function(){

  if (
  	typeof self !== 'undefined' && !self.Prism ||
  	typeof global !== 'undefined' && !global.Prism
  ) {
  	return;
  }

  var url = /\b([a-z]{3,7}:\/\/|tel:)[\w\-+%~/.:=&]+(?:\?[\w\-+%~/.:#=?&!$'()*,;]*)?(?:#[\w\-+%~/.:#=?&!$'()*,;]*)?/,
      email = /\b\S+@[\w.]+[a-z]{2}/,
      linkMd = /\[([^\]]+)]\(([^)]+)\)/,
      
  	// Tokens that may contain URLs and emails
      candidates = ['comment', 'url', 'attr-value', 'string'];

  Prism.plugins.autolinker = {
  	processGrammar: function (grammar) {
  		// Abort if grammar has already been processed
  		if (!grammar || grammar['url-link']) {
  			return;
  		}
  		Prism.languages.DFS(grammar, function (key, def, type) {
  			if (candidates.indexOf(type) > -1 && Prism.util.type(def) !== 'Array') {
  				if (!def.pattern) {
  					def = this[key] = {
  						pattern: def
  					};
  				}

  				def.inside = def.inside || {};

  				if (type == 'comment') {
  					def.inside['md-link'] = linkMd;
  				}
  				if (type == 'attr-value') {
  					Prism.languages.insertBefore('inside', 'punctuation', { 'url-link': url }, def);
  				}
  				else {
  					def.inside['url-link'] = url;
  				}

  				def.inside['email-link'] = email;
  			}
  		});
  		grammar['url-link'] = url;
  		grammar['email-link'] = email;
  	}
  };

  Prism.hooks.add('before-highlight', function(env) {
  	Prism.plugins.autolinker.processGrammar(env.grammar);
  });

  Prism.hooks.add('wrap', function(env) {
  	if (/-link$/.test(env.type)) {
  		env.tag = 'a';
  		
  		var href = env.content;
  		
  		if (env.type == 'email-link' && href.indexOf('mailto:') != 0) {
  			href = 'mailto:' + href;
  		}
  		else if (env.type == 'md-link') {
  			// Markdown
  			var match = env.content.match(linkMd);
  			
  			href = match[2];
  			env.content = match[1];
  		}
  		
  		env.attributes.href = href;
  	}

  	// Silently catch any error thrown by decodeURIComponent (#1186)
  	try {
  		env.content = decodeURIComponent(env.content);
  	} catch(e) {}
  });

  })();

  (function () {

  	if (typeof self === 'undefined' || !self.Prism || !self.document) {
  		return;
  	}

  	/**
  	 * Plugin name which is used as a class name for <pre> which is activating the plugin
  	 * @type {String}
  	 */
  	var PLUGIN_NAME = 'line-numbers';
  	
  	/**
  	 * Regular expression used for determining line breaks
  	 * @type {RegExp}
  	 */
  	var NEW_LINE_EXP = /\n(?!$)/g;

  	/**
  	 * Resizes line numbers spans according to height of line of code
  	 * @param {Element} element <pre> element
  	 */
  	var _resizeElement = function (element) {
  		var codeStyles = getStyles(element);
  		var whiteSpace = codeStyles['white-space'];

  		if (whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line') {
  			var codeElement = element.querySelector('code');
  			var lineNumbersWrapper = element.querySelector('.line-numbers-rows');
  			var lineNumberSizer = element.querySelector('.line-numbers-sizer');
  			var codeLines = codeElement.textContent.split(NEW_LINE_EXP);

  			if (!lineNumberSizer) {
  				lineNumberSizer = document.createElement('span');
  				lineNumberSizer.className = 'line-numbers-sizer';

  				codeElement.appendChild(lineNumberSizer);
  			}

  			lineNumberSizer.style.display = 'block';

  			codeLines.forEach(function (line, lineNumber) {
  				lineNumberSizer.textContent = line || '\n';
  				var lineSize = lineNumberSizer.getBoundingClientRect().height;
  				lineNumbersWrapper.children[lineNumber].style.height = lineSize + 'px';
  			});

  			lineNumberSizer.textContent = '';
  			lineNumberSizer.style.display = 'none';
  		}
  	};

  	/**
  	 * Returns style declarations for the element
  	 * @param {Element} element
  	 */
  	var getStyles = function (element) {
  		if (!element) {
  			return null;
  		}

  		return window.getComputedStyle ? getComputedStyle(element) : (element.currentStyle || null);
  	};

  	window.addEventListener('resize', function () {
  		Array.prototype.forEach.call(document.querySelectorAll('pre.' + PLUGIN_NAME), _resizeElement);
  	});

  	Prism.hooks.add('complete', function (env) {
  		if (!env.code) {
  			return;
  		}

  		// works only for <code> wrapped inside <pre> (not inline)
  		var pre = env.element.parentNode;
  		var clsReg = /\s*\bline-numbers\b\s*/;
  		if (
  			!pre || !/pre/i.test(pre.nodeName) ||
  			// Abort only if nor the <pre> nor the <code> have the class
  			(!clsReg.test(pre.className) && !clsReg.test(env.element.className))
  		) {
  			return;
  		}

  		if (env.element.querySelector('.line-numbers-rows')) {
  			// Abort if line numbers already exists
  			return;
  		}

  		if (clsReg.test(env.element.className)) {
  			// Remove the class 'line-numbers' from the <code>
  			env.element.className = env.element.className.replace(clsReg, ' ');
  		}
  		if (!clsReg.test(pre.className)) {
  			// Add the class 'line-numbers' to the <pre>
  			pre.className += ' line-numbers';
  		}

  		var match = env.code.match(NEW_LINE_EXP);
  		var linesNum = match ? match.length + 1 : 1;
  		var lineNumbersWrapper;

  		var lines = new Array(linesNum + 1);
  		lines = lines.join('<span></span>');

  		lineNumbersWrapper = document.createElement('span');
  		lineNumbersWrapper.setAttribute('aria-hidden', 'true');
  		lineNumbersWrapper.className = 'line-numbers-rows';
  		lineNumbersWrapper.innerHTML = lines;

  		if (pre.hasAttribute('data-start')) {
  			pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
  		}

  		env.element.appendChild(lineNumbersWrapper);

  		_resizeElement(pre);

  		Prism.hooks.run('line-numbers', env);
  	});

  	Prism.hooks.add('line-numbers', function (env) {
  		env.plugins = env.plugins || {};
  		env.plugins.lineNumbers = true;
  	});
  	
  	/**
  	 * Global exports
  	 */
  	Prism.plugins.lineNumbers = {
  		/**
  		 * Get node for provided line number
  		 * @param {Element} element pre element
  		 * @param {Number} number line number
  		 * @return {Element|undefined}
  		 */
  		getLine: function (element, number) {
  			if (element.tagName !== 'PRE' || !element.classList.contains(PLUGIN_NAME)) {
  				return;
  			}

  			var lineNumberRows = element.querySelector('.line-numbers-rows');
  			var lineNumberStart = parseInt(element.getAttribute('data-start'), 10) || 1;
  			var lineNumberEnd = lineNumberStart + (lineNumberRows.children.length - 1);

  			if (number < lineNumberStart) {
  				number = lineNumberStart;
  			}
  			if (number > lineNumberEnd) {
  				number = lineNumberEnd;
  			}

  			var lineIndex = number - lineNumberStart;

  			return lineNumberRows.children[lineIndex];
  		}
  	};

  }());

  /*!
   * Font Awesome Free 5.5.0 by @fontawesome - https://fontawesome.com
   * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
   */
  (function () {

  var noop = function noop() {};

  var _WINDOW = {};
  var _DOCUMENT = {};
  var _MUTATION_OBSERVER$1 = null;
  var _PERFORMANCE = { mark: noop, measure: noop };

  try {
    if (typeof window !== 'undefined') _WINDOW = window;
    if (typeof document !== 'undefined') _DOCUMENT = document;
    if (typeof MutationObserver !== 'undefined') _MUTATION_OBSERVER$1 = MutationObserver;
    if (typeof performance !== 'undefined') _PERFORMANCE = performance;
  } catch (e) {}

  var _ref = _WINDOW.navigator || {};
  var _ref$userAgent = _ref.userAgent;
  var userAgent = _ref$userAgent === undefined ? '' : _ref$userAgent;

  var WINDOW = _WINDOW;
  var DOCUMENT = _DOCUMENT;
  var MUTATION_OBSERVER = _MUTATION_OBSERVER$1;
  var PERFORMANCE = _PERFORMANCE;
  var IS_BROWSER = !!WINDOW.document;
  var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function';
  var IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

  var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
  var UNITS_IN_GRID = 16;
  var DEFAULT_FAMILY_PREFIX = 'fa';
  var DEFAULT_REPLACEMENT_CLASS = 'svg-inline--fa';
  var DATA_FA_I2SVG = 'data-fa-i2svg';
  var DATA_FA_PSEUDO_ELEMENT = 'data-fa-pseudo-element';
  var DATA_PREFIX = 'data-prefix';
  var DATA_ICON = 'data-icon';
  var HTML_CLASS_I2SVG_BASE_CLASS = 'fontawesome-i2svg';
  var TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS = ['HTML', 'HEAD', 'STYLE', 'SCRIPT'];
  var PRODUCTION = function () {
    try {
      return "production" === 'production';
    } catch (e) {
      return false;
    }
  }();

  var oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var oneToTwenty = oneToTen.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

  var ATTRIBUTES_WATCHED_FOR_MUTATION = ['class', 'data-prefix', 'data-icon', 'data-fa-transform', 'data-fa-mask'];

  var RESERVED_CLASSES = ['xs', 'sm', 'lg', 'fw', 'ul', 'li', 'border', 'pull-left', 'pull-right', 'spin', 'pulse', 'rotate-90', 'rotate-180', 'rotate-270', 'flip-horizontal', 'flip-vertical', 'stack', 'stack-1x', 'stack-2x', 'inverse', 'layers', 'layers-text', 'layers-counter'].concat(oneToTen.map(function (n) {
    return n + 'x';
  })).concat(oneToTwenty.map(function (n) {
    return 'w-' + n;
  }));

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();



  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };



  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var initial = WINDOW.FontAwesomeConfig || {};

  function getAttrConfig(attr) {
    var element = DOCUMENT.querySelector('script[' + attr + ']');

    if (element) {
      return element.getAttribute(attr);
    }
  }

  function coerce(val) {
    // Getting an empty string will occur if the attribute is set on the HTML tag but without a value
    // We'll assume that this is an indication that it should be toggled to true
    // For example <script data-search-pseudo-elements src="..."></script>
    if (val === '') return true;
    if (val === 'false') return false;
    if (val === 'true') return true;
    return val;
  }

  if (DOCUMENT && typeof DOCUMENT.querySelector === 'function') {
    var attrs = [['data-family-prefix', 'familyPrefix'], ['data-replacement-class', 'replacementClass'], ['data-auto-replace-svg', 'autoReplaceSvg'], ['data-auto-add-css', 'autoAddCss'], ['data-auto-a11y', 'autoA11y'], ['data-search-pseudo-elements', 'searchPseudoElements'], ['data-observe-mutations', 'observeMutations'], ['data-keep-original-source', 'keepOriginalSource'], ['data-measure-performance', 'measurePerformance'], ['data-show-missing-icons', 'showMissingIcons']];

    attrs.forEach(function (_ref) {
      var _ref2 = slicedToArray(_ref, 2),
          attr = _ref2[0],
          key = _ref2[1];

      var val = coerce(getAttrConfig(attr));

      if (val !== undefined && val !== null) {
        initial[key] = val;
      }
    });
  }

  var _default = _extends({
    familyPrefix: DEFAULT_FAMILY_PREFIX,
    replacementClass: DEFAULT_REPLACEMENT_CLASS,
    autoReplaceSvg: true,
    autoAddCss: true,
    autoA11y: true,
    searchPseudoElements: false,
    observeMutations: true,
    keepOriginalSource: true,
    measurePerformance: false,
    showMissingIcons: true
  }, initial);

  if (!_default.autoReplaceSvg) _default.observeMutations = false;

  var config = _extends({}, _default);

  WINDOW.FontAwesomeConfig = config;

  var w = WINDOW || {};

  if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
  if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
  if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
  if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];

  var namespace = w[NAMESPACE_IDENTIFIER];

  var functions = [];
  var listener = function listener() {
    DOCUMENT.removeEventListener('DOMContentLoaded', listener);
    loaded = 1;
    functions.map(function (fn) {
      return fn();
    });
  };

  var loaded = false;

  if (IS_DOM) {
    loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);

    if (!loaded) DOCUMENT.addEventListener('DOMContentLoaded', listener);
  }

  var domready = function (fn) {
    if (!IS_DOM) return;
    loaded ? setTimeout(fn, 0) : functions.push(fn);
  };

  var d = UNITS_IN_GRID;

  var meaninglessTransform = {
    size: 16,
    x: 0,
    y: 0,
    rotate: 0,
    flipX: false,
    flipY: false
  };

  function isReserved(name) {
    return ~RESERVED_CLASSES.indexOf(name);
  }

  function bunker(fn) {
    try {
      fn();
    } catch (e) {
      if (!PRODUCTION) {
        throw e;
      }
    }
  }

  function insertCss(css) {
    if (!css || !IS_DOM) {
      return;
    }

    var style = DOCUMENT.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;

    var headChildren = DOCUMENT.head.childNodes;
    var beforeChild = null;

    for (var i = headChildren.length - 1; i > -1; i--) {
      var child = headChildren[i];
      var tagName = (child.tagName || '').toUpperCase();
      if (['STYLE', 'LINK'].indexOf(tagName) > -1) {
        beforeChild = child;
      }
    }

    DOCUMENT.head.insertBefore(style, beforeChild);

    return css;
  }

  var idPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function nextUniqueId() {
    var size = 12;
    var id = '';
    while (size-- > 0) {
      id += idPool[Math.random() * 62 | 0];
    }
    return id;
  }

  function toArray(obj) {
    var array = [];

    for (var i = (obj || []).length >>> 0; i--;) {
      array[i] = obj[i];
    }

    return array;
  }

  function classArray(node) {
    if (node.classList) {
      return toArray(node.classList);
    } else {
      return (node.getAttribute('class') || '').split(' ').filter(function (i) {
        return i;
      });
    }
  }

  function getIconName(familyPrefix, cls) {
    var parts = cls.split('-');
    var prefix = parts[0];
    var iconName = parts.slice(1).join('-');

    if (prefix === familyPrefix && iconName !== '' && !isReserved(iconName)) {
      return iconName;
    } else {
      return null;
    }
  }

  function htmlEscape(str) {
    return ('' + str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function joinAttributes(attributes) {
    return Object.keys(attributes || {}).reduce(function (acc, attributeName) {
      return acc + (attributeName + '="' + htmlEscape(attributes[attributeName]) + '" ');
    }, '').trim();
  }

  function joinStyles(styles) {
    return Object.keys(styles || {}).reduce(function (acc, styleName) {
      return acc + (styleName + ': ' + styles[styleName] + ';');
    }, '');
  }

  function transformIsMeaningful(transform) {
    return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
  }

  function transformForSvg(_ref) {
    var transform = _ref.transform,
        containerWidth = _ref.containerWidth,
        iconWidth = _ref.iconWidth;

    var outer = {
      transform: 'translate(' + containerWidth / 2 + ' 256)'
    };
    var innerTranslate = 'translate(' + transform.x * 32 + ', ' + transform.y * 32 + ') ';
    var innerScale = 'scale(' + transform.size / 16 * (transform.flipX ? -1 : 1) + ', ' + transform.size / 16 * (transform.flipY ? -1 : 1) + ') ';
    var innerRotate = 'rotate(' + transform.rotate + ' 0 0)';
    var inner = {
      transform: innerTranslate + ' ' + innerScale + ' ' + innerRotate
    };
    var path = {
      transform: 'translate(' + iconWidth / 2 * -1 + ' -256)'
    };
    return {
      outer: outer,
      inner: inner,
      path: path
    };
  }

  function transformForCss(_ref2) {
    var transform = _ref2.transform,
        _ref2$width = _ref2.width,
        width = _ref2$width === undefined ? UNITS_IN_GRID : _ref2$width,
        _ref2$height = _ref2.height,
        height = _ref2$height === undefined ? UNITS_IN_GRID : _ref2$height,
        _ref2$startCentered = _ref2.startCentered,
        startCentered = _ref2$startCentered === undefined ? false : _ref2$startCentered;

    var val = '';

    if (startCentered && IS_IE) {
      val += 'translate(' + (transform.x / d - width / 2) + 'em, ' + (transform.y / d - height / 2) + 'em) ';
    } else if (startCentered) {
      val += 'translate(calc(-50% + ' + transform.x / d + 'em), calc(-50% + ' + transform.y / d + 'em)) ';
    } else {
      val += 'translate(' + transform.x / d + 'em, ' + transform.y / d + 'em) ';
    }

    val += 'scale(' + transform.size / d * (transform.flipX ? -1 : 1) + ', ' + transform.size / d * (transform.flipY ? -1 : 1) + ') ';
    val += 'rotate(' + transform.rotate + 'deg) ';

    return val;
  }

  var ALL_SPACE = {
    x: 0,
    y: 0,
    width: '100%',
    height: '100%'
  };

  var makeIconMasking = function (_ref) {
    var children = _ref.children,
        attributes = _ref.attributes,
        main = _ref.main,
        mask = _ref.mask,
        transform = _ref.transform;
    var mainWidth = main.width,
        mainPath = main.icon;
    var maskWidth = mask.width,
        maskPath = mask.icon;


    var trans = transformForSvg({ transform: transform, containerWidth: maskWidth, iconWidth: mainWidth });

    var maskRect = {
      tag: 'rect',
      attributes: _extends({}, ALL_SPACE, {
        fill: 'white'
      })
    };
    var maskInnerGroup = {
      tag: 'g',
      attributes: _extends({}, trans.inner),
      children: [{ tag: 'path', attributes: _extends({}, mainPath.attributes, trans.path, { fill: 'black' }) }]
    };
    var maskOuterGroup = {
      tag: 'g',
      attributes: _extends({}, trans.outer),
      children: [maskInnerGroup]
    };
    var maskId = 'mask-' + nextUniqueId();
    var clipId = 'clip-' + nextUniqueId();
    var maskTag = {
      tag: 'mask',
      attributes: _extends({}, ALL_SPACE, {
        id: maskId,
        maskUnits: 'userSpaceOnUse',
        maskContentUnits: 'userSpaceOnUse'
      }),
      children: [maskRect, maskOuterGroup]
    };
    var defs = {
      tag: 'defs',
      children: [{ tag: 'clipPath', attributes: { id: clipId }, children: [maskPath] }, maskTag]
    };

    children.push(defs, { tag: 'rect', attributes: _extends({ fill: 'currentColor', 'clip-path': 'url(#' + clipId + ')', mask: 'url(#' + maskId + ')' }, ALL_SPACE) });

    return {
      children: children,
      attributes: attributes
    };
  };

  var makeIconStandard = function (_ref) {
    var children = _ref.children,
        attributes = _ref.attributes,
        main = _ref.main,
        transform = _ref.transform,
        styles = _ref.styles;

    var styleString = joinStyles(styles);

    if (styleString.length > 0) {
      attributes['style'] = styleString;
    }

    if (transformIsMeaningful(transform)) {
      var trans = transformForSvg({ transform: transform, containerWidth: main.width, iconWidth: main.width });
      children.push({
        tag: 'g',
        attributes: _extends({}, trans.outer),
        children: [{
          tag: 'g',
          attributes: _extends({}, trans.inner),
          children: [{
            tag: main.icon.tag,
            children: main.icon.children,
            attributes: _extends({}, main.icon.attributes, trans.path)
          }]
        }]
      });
    } else {
      children.push(main.icon);
    }

    return {
      children: children,
      attributes: attributes
    };
  };

  var asIcon = function (_ref) {
    var children = _ref.children,
        main = _ref.main,
        mask = _ref.mask,
        attributes = _ref.attributes,
        styles = _ref.styles,
        transform = _ref.transform;

    if (transformIsMeaningful(transform) && main.found && !mask.found) {
      var width = main.width,
          height = main.height;

      var offset = {
        x: width / height / 2,
        y: 0.5
      };
      attributes['style'] = joinStyles(_extends({}, styles, {
        'transform-origin': offset.x + transform.x / 16 + 'em ' + (offset.y + transform.y / 16) + 'em'
      }));
    }

    return [{
      tag: 'svg',
      attributes: attributes,
      children: children
    }];
  };

  var asSymbol = function (_ref) {
    var prefix = _ref.prefix,
        iconName = _ref.iconName,
        children = _ref.children,
        attributes = _ref.attributes,
        symbol = _ref.symbol;

    var id = symbol === true ? prefix + '-' + config.familyPrefix + '-' + iconName : symbol;

    return [{
      tag: 'svg',
      attributes: {
        style: 'display: none;'
      },
      children: [{
        tag: 'symbol',
        attributes: _extends({}, attributes, { id: id }),
        children: children
      }]
    }];
  };

  function makeInlineSvgAbstract(params) {
    var _params$icons = params.icons,
        main = _params$icons.main,
        mask = _params$icons.mask,
        prefix = params.prefix,
        iconName = params.iconName,
        transform = params.transform,
        symbol = params.symbol,
        title = params.title,
        extra = params.extra,
        _params$watchable = params.watchable,
        watchable = _params$watchable === undefined ? false : _params$watchable;

    var _ref = mask.found ? mask : main,
        width = _ref.width,
        height = _ref.height;

    var widthClass = 'fa-w-' + Math.ceil(width / height * 16);
    var attrClass = [config.replacementClass, iconName ? config.familyPrefix + '-' + iconName : '', widthClass].filter(function (c) {
      return extra.classes.indexOf(c) === -1;
    }).concat(extra.classes).join(' ');

    var content = {
      children: [],
      attributes: _extends({}, extra.attributes, {
        'data-prefix': prefix,
        'data-icon': iconName,
        'class': attrClass,
        'role': 'img',
        'xmlns': 'http://www.w3.org/2000/svg',
        'viewBox': '0 0 ' + width + ' ' + height
      })
    };

    if (watchable) {
      content.attributes[DATA_FA_I2SVG] = '';
    }

    if (title) content.children.push({ tag: 'title', attributes: { id: content.attributes['aria-labelledby'] || 'title-' + nextUniqueId() }, children: [title] });

    var args = _extends({}, content, {
      prefix: prefix,
      iconName: iconName,
      main: main,
      mask: mask,
      transform: transform,
      symbol: symbol,
      styles: extra.styles
    });

    var _ref2 = mask.found && main.found ? makeIconMasking(args) : makeIconStandard(args),
        children = _ref2.children,
        attributes = _ref2.attributes;

    args.children = children;
    args.attributes = attributes;

    if (symbol) {
      return asSymbol(args);
    } else {
      return asIcon(args);
    }
  }

  function makeLayersTextAbstract(params) {
    var content = params.content,
        width = params.width,
        height = params.height,
        transform = params.transform,
        title = params.title,
        extra = params.extra,
        _params$watchable2 = params.watchable,
        watchable = _params$watchable2 === undefined ? false : _params$watchable2;


    var attributes = _extends({}, extra.attributes, title ? { 'title': title } : {}, {
      'class': extra.classes.join(' ')
    });

    if (watchable) {
      attributes[DATA_FA_I2SVG] = '';
    }

    var styles = _extends({}, extra.styles);

    if (transformIsMeaningful(transform)) {
      styles['transform'] = transformForCss({ transform: transform, startCentered: true, width: width, height: height });
      styles['-webkit-transform'] = styles['transform'];
    }

    var styleString = joinStyles(styles);

    if (styleString.length > 0) {
      attributes['style'] = styleString;
    }

    var val = [];

    val.push({
      tag: 'span',
      attributes: attributes,
      children: [content]
    });

    if (title) {
      val.push({ tag: 'span', attributes: { class: 'sr-only' }, children: [title] });
    }

    return val;
  }

  function makeLayersCounterAbstract(params) {
    var content = params.content,
        title = params.title,
        extra = params.extra;


    var attributes = _extends({}, extra.attributes, title ? { 'title': title } : {}, {
      'class': extra.classes.join(' ')
    });

    var styleString = joinStyles(extra.styles);

    if (styleString.length > 0) {
      attributes['style'] = styleString;
    }

    var val = [];

    val.push({
      tag: 'span',
      attributes: attributes,
      children: [content]
    });

    if (title) {
      val.push({ tag: 'span', attributes: { class: 'sr-only' }, children: [title] });
    }

    return val;
  }

  var noop$2 = function noop() {};
  var p = config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : { mark: noop$2, measure: noop$2 };
  var preamble = 'FA "5.5.0"';

  var begin = function begin(name) {
    p.mark(preamble + ' ' + name + ' begins');
    return function () {
      return end(name);
    };
  };

  var end = function end(name) {
    p.mark(preamble + ' ' + name + ' ends');
    p.measure(preamble + ' ' + name, preamble + ' ' + name + ' begins', preamble + ' ' + name + ' ends');
  };

  var perf = { begin: begin, end: end };

  /**
   * Internal helper to bind a function known to have 4 arguments
   * to a given context.
   */
  var bindInternal4 = function bindInternal4 (func, thisContext) {
    return function (a, b, c, d) {
      return func.call(thisContext, a, b, c, d);
    };
  };



  /**
   * # Reduce
   *
   * A fast object `.reduce()` implementation.
   *
   * @param  {Object}   subject      The object to reduce over.
   * @param  {Function} fn           The reducer function.
   * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
   * @param  {Object}   thisContext  The context for the reducer.
   * @return {mixed}                 The final result.
   */
  var reduce = function fastReduceObject (subject, fn, initialValue, thisContext) {
    var keys = Object.keys(subject),
        length = keys.length,
        iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
        i, key, result;

    if (initialValue === undefined) {
      i = 1;
      result = subject[keys[0]];
    }
    else {
      i = 0;
      result = initialValue;
    }

    for (; i < length; i++) {
      key = keys[i];
      result = iterator(result, subject[key], key, subject);
    }

    return result;
  };

  var styles$2 = namespace.styles;
  var shims = namespace.shims;


  var _byUnicode = {};
  var _byLigature = {};
  var _byOldName = {};

  var build = function build() {
    var lookup = function lookup(reducer) {
      return reduce(styles$2, function (o, style, prefix) {
        o[prefix] = reduce(style, reducer, {});
        return o;
      }, {});
    };

    _byUnicode = lookup(function (acc, icon, iconName) {
      acc[icon[3]] = iconName;

      return acc;
    });

    _byLigature = lookup(function (acc, icon, iconName) {
      var ligatures = icon[2];

      acc[iconName] = iconName;

      ligatures.forEach(function (ligature) {
        acc[ligature] = iconName;
      });

      return acc;
    });

    var hasRegular = 'far' in styles$2;

    _byOldName = reduce(shims, function (acc, shim) {
      var oldName = shim[0];
      var prefix = shim[1];
      var iconName = shim[2];

      if (prefix === 'far' && !hasRegular) {
        prefix = 'fas';
      }

      acc[oldName] = { prefix: prefix, iconName: iconName };

      return acc;
    }, {});
  };

  build();

  function byUnicode(prefix, unicode) {
    return _byUnicode[prefix][unicode];
  }

  function byLigature(prefix, ligature) {
    return _byLigature[prefix][ligature];
  }

  function byOldName(name) {
    return _byOldName[name] || { prefix: null, iconName: null };
  }

  var styles$1 = namespace.styles;


  var emptyCanonicalIcon = function emptyCanonicalIcon() {
    return { prefix: null, iconName: null, rest: [] };
  };

  function getCanonicalIcon(values) {
    return values.reduce(function (acc, cls) {
      var iconName = getIconName(config.familyPrefix, cls);

      if (styles$1[cls]) {
        acc.prefix = cls;
      } else if (iconName) {
        var shim = acc.prefix === 'fa' ? byOldName(iconName) : {};

        acc.iconName = shim.iconName || iconName;
        acc.prefix = shim.prefix || acc.prefix;
      } else if (cls !== config.replacementClass && cls.indexOf('fa-w-') !== 0) {
        acc.rest.push(cls);
      }

      return acc;
    }, emptyCanonicalIcon());
  }

  function iconFromMapping(mapping, prefix, iconName) {
    if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
      return {
        prefix: prefix,
        iconName: iconName,
        icon: mapping[prefix][iconName]
      };
    }
  }

  function toHtml(abstractNodes) {
    var tag = abstractNodes.tag,
        _abstractNodes$attrib = abstractNodes.attributes,
        attributes = _abstractNodes$attrib === undefined ? {} : _abstractNodes$attrib,
        _abstractNodes$childr = abstractNodes.children,
        children = _abstractNodes$childr === undefined ? [] : _abstractNodes$childr;


    if (typeof abstractNodes === 'string') {
      return htmlEscape(abstractNodes);
    } else {
      return '<' + tag + ' ' + joinAttributes(attributes) + '>' + children.map(toHtml).join('') + '</' + tag + '>';
    }
  }

  var noop$1 = function noop() {};

  function isWatched(node) {
    var i2svg = node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null;

    return typeof i2svg === 'string';
  }

  function getMutator() {
    if (config.autoReplaceSvg === true) {
      return mutators.replace;
    }

    var mutator = mutators[config.autoReplaceSvg];

    return mutator || mutators.replace;
  }

  var mutators = {
    replace: function replace(mutation) {
      var node = mutation[0];
      var abstract = mutation[1];
      var newOuterHTML = abstract.map(function (a) {
        return toHtml(a);
      }).join('\n');

      if (node.parentNode && node.outerHTML) {
        node.outerHTML = newOuterHTML + (config.keepOriginalSource && node.tagName.toLowerCase() !== 'svg' ? '<!-- ' + node.outerHTML + ' -->' : '');
      } else if (node.parentNode) {
        var newNode = document.createElement('span');
        node.parentNode.replaceChild(newNode, node);
        newNode.outerHTML = newOuterHTML;
      }
    },
    nest: function nest(mutation) {
      var node = mutation[0];
      var abstract = mutation[1];

      // If we already have a replaced node we do not want to continue nesting within it.
      // Short-circuit to the standard replacement
      if (~classArray(node).indexOf(config.replacementClass)) {
        return mutators.replace(mutation);
      }

      var forSvg = new RegExp(config.familyPrefix + '-.*');

      delete abstract[0].attributes.style;

      var splitClasses = abstract[0].attributes.class.split(' ').reduce(function (acc, cls) {
        if (cls === config.replacementClass || cls.match(forSvg)) {
          acc.toSvg.push(cls);
        } else {
          acc.toNode.push(cls);
        }

        return acc;
      }, { toNode: [], toSvg: [] });

      abstract[0].attributes.class = splitClasses.toSvg.join(' ');

      var newInnerHTML = abstract.map(function (a) {
        return toHtml(a);
      }).join('\n');
      node.setAttribute('class', splitClasses.toNode.join(' '));
      node.setAttribute(DATA_FA_I2SVG, '');
      node.innerHTML = newInnerHTML;
    }
  };

  function perform(mutations, callback) {
    var callbackFunction = typeof callback === 'function' ? callback : noop$1;

    if (mutations.length === 0) {
      callbackFunction();
    } else {
      var frame = WINDOW.requestAnimationFrame || function (op) {
        return op();
      };

      frame(function () {
        var mutator = getMutator();
        var mark = perf.begin('mutate');

        mutations.map(mutator);

        mark();

        callbackFunction();
      });
    }
  }

  var disabled = false;

  function disableObservation(operation) {
    disabled = true;
    operation();
    disabled = false;
  }

  var mo = null;

  function observe(options) {
    if (!MUTATION_OBSERVER) {
      return;
    }

    if (!config.observeMutations) {
      return;
    }

    var treeCallback = options.treeCallback,
        nodeCallback = options.nodeCallback,
        pseudoElementsCallback = options.pseudoElementsCallback,
        _options$observeMutat = options.observeMutationsRoot,
        observeMutationsRoot = _options$observeMutat === undefined ? DOCUMENT.body : _options$observeMutat;


    mo = new MUTATION_OBSERVER(function (objects) {
      if (disabled) return;

      toArray(objects).forEach(function (mutationRecord) {
        if (mutationRecord.type === 'childList' && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
          if (config.searchPseudoElements) {
            pseudoElementsCallback(mutationRecord.target);
          }

          treeCallback(mutationRecord.target);
        }

        if (mutationRecord.type === 'attributes' && mutationRecord.target.parentNode && config.searchPseudoElements) {
          pseudoElementsCallback(mutationRecord.target.parentNode);
        }

        if (mutationRecord.type === 'attributes' && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
          if (mutationRecord.attributeName === 'class') {
            var _getCanonicalIcon = getCanonicalIcon(classArray(mutationRecord.target)),
                prefix = _getCanonicalIcon.prefix,
                iconName = _getCanonicalIcon.iconName;

            if (prefix) mutationRecord.target.setAttribute('data-prefix', prefix);
            if (iconName) mutationRecord.target.setAttribute('data-icon', iconName);
          } else {
            nodeCallback(mutationRecord.target);
          }
        }
      });
    });

    if (!IS_DOM) return;

    mo.observe(observeMutationsRoot, {
      childList: true, attributes: true, characterData: true, subtree: true
    });
  }

  function disconnect() {
    if (!mo) return;

    mo.disconnect();
  }

  var styleParser = function (node) {
    var style = node.getAttribute('style');

    var val = [];

    if (style) {
      val = style.split(';').reduce(function (acc, style) {
        var styles = style.split(':');
        var prop = styles[0];
        var value = styles.slice(1);

        if (prop && value.length > 0) {
          acc[prop] = value.join(':').trim();
        }

        return acc;
      }, {});
    }

    return val;
  };

  function toHex(unicode) {
    var result = '';

    for (var i = 0; i < unicode.length; i++) {
      var hex = unicode.charCodeAt(i).toString(16);
      result += ('000' + hex).slice(-4);
    }

    return result;
  }

  var classParser = function (node) {
    var existingPrefix = node.getAttribute('data-prefix');
    var existingIconName = node.getAttribute('data-icon');
    var innerText = node.innerText !== undefined ? node.innerText.trim() : '';

    var val = getCanonicalIcon(classArray(node));

    if (existingPrefix && existingIconName) {
      val.prefix = existingPrefix;
      val.iconName = existingIconName;
    }

    if (val.prefix && innerText.length > 1) {
      val.iconName = byLigature(val.prefix, node.innerText);
    } else if (val.prefix && innerText.length === 1) {
      val.iconName = byUnicode(val.prefix, toHex(node.innerText));
    }

    return val;
  };

  var parseTransformString = function parseTransformString(transformString) {
    var transform = {
      size: 16,
      x: 0,
      y: 0,
      flipX: false,
      flipY: false,
      rotate: 0
    };

    if (!transformString) {
      return transform;
    } else {
      return transformString.toLowerCase().split(' ').reduce(function (acc, n) {
        var parts = n.toLowerCase().split('-');
        var first = parts[0];
        var rest = parts.slice(1).join('-');

        if (first && rest === 'h') {
          acc.flipX = true;
          return acc;
        }

        if (first && rest === 'v') {
          acc.flipY = true;
          return acc;
        }

        rest = parseFloat(rest);

        if (isNaN(rest)) {
          return acc;
        }

        switch (first) {
          case 'grow':
            acc.size = acc.size + rest;
            break;
          case 'shrink':
            acc.size = acc.size - rest;
            break;
          case 'left':
            acc.x = acc.x - rest;
            break;
          case 'right':
            acc.x = acc.x + rest;
            break;
          case 'up':
            acc.y = acc.y - rest;
            break;
          case 'down':
            acc.y = acc.y + rest;
            break;
          case 'rotate':
            acc.rotate = acc.rotate + rest;
            break;
        }

        return acc;
      }, transform);
    }
  };

  var transformParser = function (node) {
    return parseTransformString(node.getAttribute('data-fa-transform'));
  };

  var symbolParser = function (node) {
    var symbol = node.getAttribute('data-fa-symbol');

    return symbol === null ? false : symbol === '' ? true : symbol;
  };

  var attributesParser = function (node) {
    var extraAttributes = toArray(node.attributes).reduce(function (acc, attr) {
      if (acc.name !== 'class' && acc.name !== 'style') {
        acc[attr.name] = attr.value;
      }
      return acc;
    }, {});

    var title = node.getAttribute('title');

    if (config.autoA11y) {
      if (title) {
        extraAttributes['aria-labelledby'] = config.replacementClass + '-title-' + nextUniqueId();
      } else {
        extraAttributes['aria-hidden'] = 'true';
      }
    }

    return extraAttributes;
  };

  var maskParser = function (node) {
    var mask = node.getAttribute('data-fa-mask');

    if (!mask) {
      return emptyCanonicalIcon();
    } else {
      return getCanonicalIcon(mask.split(' ').map(function (i) {
        return i.trim();
      }));
    }
  };

  var blankMeta = {
    iconName: null,
    title: null,
    prefix: null,
    transform: meaninglessTransform,
    symbol: false,
    mask: null,
    extra: { classes: [], styles: {}, attributes: {} }
  };

  function parseMeta(node) {
    var _classParser = classParser(node),
        iconName = _classParser.iconName,
        prefix = _classParser.prefix,
        extraClasses = _classParser.rest;

    var extraStyles = styleParser(node);
    var transform = transformParser(node);
    var symbol = symbolParser(node);
    var extraAttributes = attributesParser(node);
    var mask = maskParser(node);

    return {
      iconName: iconName,
      title: node.getAttribute('title'),
      prefix: prefix,
      transform: transform,
      symbol: symbol,
      mask: mask,
      extra: {
        classes: extraClasses,
        styles: extraStyles,
        attributes: extraAttributes
      }
    };
  }

  function MissingIcon(error) {
    this.name = 'MissingIcon';
    this.message = error || 'Icon unavailable';
    this.stack = new Error().stack;
  }

  MissingIcon.prototype = Object.create(Error.prototype);
  MissingIcon.prototype.constructor = MissingIcon;

  var FILL = { fill: 'currentColor' };
  var ANIMATION_BASE = {
    attributeType: 'XML',
    repeatCount: 'indefinite',
    dur: '2s'
  };
  var RING = {
    tag: 'path',
    attributes: _extends({}, FILL, {
      d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z'
    })
  };
  var OPACITY_ANIMATE = _extends({}, ANIMATION_BASE, {
    attributeName: 'opacity'
  });
  var DOT = {
    tag: 'circle',
    attributes: _extends({}, FILL, {
      cx: '256',
      cy: '364',
      r: '28'
    }),
    children: [{ tag: 'animate', attributes: _extends({}, ANIMATION_BASE, { attributeName: 'r', values: '28;14;28;28;14;28;' }) }, { tag: 'animate', attributes: _extends({}, OPACITY_ANIMATE, { values: '1;0;1;1;0;1;' }) }]
  };
  var QUESTION = {
    tag: 'path',
    attributes: _extends({}, FILL, {
      opacity: '1',
      d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z'
    }),
    children: [{ tag: 'animate', attributes: _extends({}, OPACITY_ANIMATE, { values: '1;0;0;0;0;1;' }) }]
  };
  var EXCLAMATION = {
    tag: 'path',
    attributes: _extends({}, FILL, {
      opacity: '0',
      d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z'
    }),
    children: [{ tag: 'animate', attributes: _extends({}, OPACITY_ANIMATE, { values: '0;0;1;1;0;0;' }) }]
  };

  var missing = { tag: 'g', children: [RING, DOT, QUESTION, EXCLAMATION] };

  var styles = namespace.styles;

  var LAYERS_TEXT_CLASSNAME = 'fa-layers-text';
  var FONT_FAMILY_PATTERN = /Font Awesome 5 (Solid|Regular|Light|Brands|Free|Pro)/;
  var STYLE_TO_PREFIX = {
    'Solid': 'fas',
    'Regular': 'far',
    'Light': 'fal',
    'Brands': 'fab'
  };
  var FONT_WEIGHT_TO_PREFIX = {
    '900': 'fas',
    '400': 'far',
    '300': 'fal'
  };

  function findIcon(iconName, prefix) {
    var val = {
      found: false,
      width: 512,
      height: 512,
      icon: missing
    };

    if (iconName && prefix && styles[prefix] && styles[prefix][iconName]) {
      var icon = styles[prefix][iconName];
      var width = icon[0];
      var height = icon[1];
      var vectorData = icon.slice(4);

      val = {
        found: true,
        width: width,
        height: height,
        icon: { tag: 'path', attributes: { fill: 'currentColor', d: vectorData[0] } }
      };
    } else if (iconName && prefix && !config.showMissingIcons) {
      throw new MissingIcon('Icon is missing for prefix ' + prefix + ' with icon name ' + iconName);
    }

    return val;
  }

  function generateSvgReplacementMutation(node, nodeMeta) {
    var iconName = nodeMeta.iconName,
        title = nodeMeta.title,
        prefix = nodeMeta.prefix,
        transform = nodeMeta.transform,
        symbol = nodeMeta.symbol,
        mask = nodeMeta.mask,
        extra = nodeMeta.extra;


    return [node, makeInlineSvgAbstract({
      icons: {
        main: findIcon(iconName, prefix),
        mask: findIcon(mask.iconName, mask.prefix)
      },
      prefix: prefix,
      iconName: iconName,
      transform: transform,
      symbol: symbol,
      mask: mask,
      title: title,
      extra: extra,
      watchable: true
    })];
  }

  function generateLayersText(node, nodeMeta) {
    var title = nodeMeta.title,
        transform = nodeMeta.transform,
        extra = nodeMeta.extra;


    var width = null;
    var height = null;

    if (IS_IE) {
      var computedFontSize = parseInt(getComputedStyle(node).fontSize, 10);
      var boundingClientRect = node.getBoundingClientRect();
      width = boundingClientRect.width / computedFontSize;
      height = boundingClientRect.height / computedFontSize;
    }

    if (config.autoA11y && !title) {
      extra.attributes['aria-hidden'] = 'true';
    }

    return [node, makeLayersTextAbstract({
      content: node.innerHTML,
      width: width,
      height: height,
      transform: transform,
      title: title,
      extra: extra,
      watchable: true
    })];
  }

  function generateMutation(node) {
    var nodeMeta = parseMeta(node);

    if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) {
      return generateLayersText(node, nodeMeta);
    } else {
      return generateSvgReplacementMutation(node, nodeMeta);
    }
  }

  function searchPseudoElements(root) {
    if (!IS_DOM) return;

    var end = perf.begin('searchPseudoElements');

    disableObservation(function () {
      toArray(root.querySelectorAll('*')).filter(function (n) {
        return n.parentNode !== document.head && !~TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS.indexOf(n.tagName.toUpperCase()) && !n.getAttribute(DATA_FA_PSEUDO_ELEMENT) && (!n.parentNode || n.parentNode.tagName !== 'svg');
      }).forEach(function (node) {
        [':before', ':after'].forEach(function (pos) {
          var children = toArray(node.children);
          var alreadyProcessedPseudoElement = children.filter(function (c) {
            return c.getAttribute(DATA_FA_PSEUDO_ELEMENT) === pos;
          })[0];

          var styles = WINDOW.getComputedStyle(node, pos);
          var fontFamily = styles.getPropertyValue('font-family').match(FONT_FAMILY_PATTERN);
          var fontWeight = styles.getPropertyValue('font-weight');

          if (alreadyProcessedPseudoElement && !fontFamily) {
            // If we've already processed it but the current computed style does not result in a font-family,
            // that probably means that a class name that was previously present to make the icon has been
            // removed. So we now should delete the icon.
            node.removeChild(alreadyProcessedPseudoElement);
          } else if (fontFamily) {
            var content = styles.getPropertyValue('content');
            var prefix = ~['Light', 'Regular', 'Solid', 'Brands'].indexOf(fontFamily[1]) ? STYLE_TO_PREFIX[fontFamily[1]] : FONT_WEIGHT_TO_PREFIX[fontWeight];
            var iconName = byUnicode(prefix, toHex(content.length === 3 ? content.substr(1, 1) : content));
            // Only convert the pseudo element in this :before/:after position into an icon if we haven't
            // already done so with the same prefix and iconName
            if (!alreadyProcessedPseudoElement || alreadyProcessedPseudoElement.getAttribute(DATA_PREFIX) !== prefix || alreadyProcessedPseudoElement.getAttribute(DATA_ICON) !== iconName) {
              if (alreadyProcessedPseudoElement) {
                // Delete the old one, since we're replacing it with a new one
                node.removeChild(alreadyProcessedPseudoElement);
              }

              var extra = blankMeta.extra;

              extra.attributes[DATA_FA_PSEUDO_ELEMENT] = pos;
              var abstract = makeInlineSvgAbstract(_extends({}, blankMeta, {
                icons: {
                  main: findIcon(iconName, prefix),
                  mask: emptyCanonicalIcon()
                },
                prefix: prefix,
                iconName: iconName,
                extra: extra,
                watchable: true
              }));

              var element = DOCUMENT.createElement('svg');

              if (pos === ':before') {
                node.insertBefore(element, node.firstChild);
              } else {
                node.appendChild(element);
              }

              element.outerHTML = abstract.map(function (a) {
                return toHtml(a);
              }).join('\n');
            }
          }
        });
      });
    });

    end();
  }

  function onTree(root) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (!IS_DOM) return;

    var htmlClassList = DOCUMENT.documentElement.classList;
    var hclAdd = function hclAdd(suffix) {
      return htmlClassList.add(HTML_CLASS_I2SVG_BASE_CLASS + '-' + suffix);
    };
    var hclRemove = function hclRemove(suffix) {
      return htmlClassList.remove(HTML_CLASS_I2SVG_BASE_CLASS + '-' + suffix);
    };
    var prefixes = Object.keys(styles);
    var prefixesDomQuery = ['.' + LAYERS_TEXT_CLASSNAME + ':not([' + DATA_FA_I2SVG + '])'].concat(prefixes.map(function (p) {
      return '.' + p + ':not([' + DATA_FA_I2SVG + '])';
    })).join(', ');

    if (prefixesDomQuery.length === 0) {
      return;
    }

    var candidates = toArray(root.querySelectorAll(prefixesDomQuery));

    if (candidates.length > 0) {
      hclAdd('pending');
      hclRemove('complete');
    } else {
      return;
    }

    var mark = perf.begin('onTree');

    var mutations = candidates.reduce(function (acc, node) {
      try {
        var mutation = generateMutation(node);

        if (mutation) {
          acc.push(mutation);
        }
      } catch (e) {
        if (!PRODUCTION) {
          if (e instanceof MissingIcon) {
            console.error(e);
          }
        }
      }

      return acc;
    }, []);

    mark();

    perform(mutations, function () {
      hclAdd('active');
      hclAdd('complete');
      hclRemove('pending');

      if (typeof callback === 'function') callback();
    });
  }

  function onNode(node) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var mutation = generateMutation(node);

    if (mutation) {
      perform([mutation], callback);
    }
  }

  var baseStyles = "svg:not(:root).svg-inline--fa{overflow:visible}.svg-inline--fa{display:inline-block;font-size:inherit;height:1em;overflow:visible;vertical-align:-.125em}.svg-inline--fa.fa-lg{vertical-align:-.225em}.svg-inline--fa.fa-w-1{width:.0625em}.svg-inline--fa.fa-w-2{width:.125em}.svg-inline--fa.fa-w-3{width:.1875em}.svg-inline--fa.fa-w-4{width:.25em}.svg-inline--fa.fa-w-5{width:.3125em}.svg-inline--fa.fa-w-6{width:.375em}.svg-inline--fa.fa-w-7{width:.4375em}.svg-inline--fa.fa-w-8{width:.5em}.svg-inline--fa.fa-w-9{width:.5625em}.svg-inline--fa.fa-w-10{width:.625em}.svg-inline--fa.fa-w-11{width:.6875em}.svg-inline--fa.fa-w-12{width:.75em}.svg-inline--fa.fa-w-13{width:.8125em}.svg-inline--fa.fa-w-14{width:.875em}.svg-inline--fa.fa-w-15{width:.9375em}.svg-inline--fa.fa-w-16{width:1em}.svg-inline--fa.fa-w-17{width:1.0625em}.svg-inline--fa.fa-w-18{width:1.125em}.svg-inline--fa.fa-w-19{width:1.1875em}.svg-inline--fa.fa-w-20{width:1.25em}.svg-inline--fa.fa-pull-left{margin-right:.3em;width:auto}.svg-inline--fa.fa-pull-right{margin-left:.3em;width:auto}.svg-inline--fa.fa-border{height:1.5em}.svg-inline--fa.fa-li{width:2em}.svg-inline--fa.fa-fw{width:1.25em}.fa-layers svg.svg-inline--fa{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0}.fa-layers{display:inline-block;height:1em;position:relative;text-align:center;vertical-align:-.125em;width:1em}.fa-layers svg.svg-inline--fa{-webkit-transform-origin:center center;transform-origin:center center}.fa-layers-counter,.fa-layers-text{display:inline-block;position:absolute;text-align:center}.fa-layers-text{left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-transform-origin:center center;transform-origin:center center}.fa-layers-counter{background-color:#ff253a;border-radius:1em;-webkit-box-sizing:border-box;box-sizing:border-box;color:#fff;height:1.5em;line-height:1;max-width:5em;min-width:1.5em;overflow:hidden;padding:.25em;right:0;text-overflow:ellipsis;top:0;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:top right;transform-origin:top right}.fa-layers-bottom-right{bottom:0;right:0;top:auto;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:bottom right;transform-origin:bottom right}.fa-layers-bottom-left{bottom:0;left:0;right:auto;top:auto;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:bottom left;transform-origin:bottom left}.fa-layers-top-right{right:0;top:0;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:top right;transform-origin:top right}.fa-layers-top-left{left:0;right:auto;top:0;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:top left;transform-origin:top left}.fa-lg{font-size:1.33333em;line-height:.75em;vertical-align:-.0667em}.fa-xs{font-size:.75em}.fa-sm{font-size:.875em}.fa-1x{font-size:1em}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}.fa-6x{font-size:6em}.fa-7x{font-size:7em}.fa-8x{font-size:8em}.fa-9x{font-size:9em}.fa-10x{font-size:10em}.fa-fw{text-align:center;width:1.25em}.fa-ul{list-style-type:none;margin-left:2.5em;padding-left:0}.fa-ul>li{position:relative}.fa-li{left:-2em;position:absolute;text-align:center;width:2em;line-height:inherit}.fa-border{border:solid .08em #eee;border-radius:.1em;padding:.2em .25em .15em}.fa-pull-left{float:left}.fa-pull-right{float:right}.fa.fa-pull-left,.fab.fa-pull-left,.fal.fa-pull-left,.far.fa-pull-left,.fas.fa-pull-left{margin-right:.3em}.fa.fa-pull-right,.fab.fa-pull-right,.fal.fa-pull-right,.far.fa-pull-right,.fas.fa-pull-right{margin-left:.3em}.fa-spin{-webkit-animation:fa-spin 2s infinite linear;animation:fa-spin 2s infinite linear}.fa-pulse{-webkit-animation:fa-spin 1s infinite steps(8);animation:fa-spin 1s infinite steps(8)}@-webkit-keyframes fa-spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes fa-spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.fa-rotate-90{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.fa-rotate-180{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.fa-rotate-270{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.fa-flip-horizontal{-webkit-transform:scale(-1,1);transform:scale(-1,1)}.fa-flip-vertical{-webkit-transform:scale(1,-1);transform:scale(1,-1)}.fa-flip-horizontal.fa-flip-vertical{-webkit-transform:scale(-1,-1);transform:scale(-1,-1)}:root .fa-flip-horizontal,:root .fa-flip-vertical,:root .fa-rotate-180,:root .fa-rotate-270,:root .fa-rotate-90{-webkit-filter:none;filter:none}.fa-stack{display:inline-block;height:2em;position:relative;width:2.5em}.fa-stack-1x,.fa-stack-2x{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0}.svg-inline--fa.fa-stack-1x{height:1em;width:1.25em}.svg-inline--fa.fa-stack-2x{height:2em;width:2.5em}.fa-inverse{color:#fff}.sr-only{border:0;clip:rect(0,0,0,0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.sr-only-focusable:active,.sr-only-focusable:focus{clip:auto;height:auto;margin:0;overflow:visible;position:static;width:auto}";

  var css = function () {
    var dfp = DEFAULT_FAMILY_PREFIX;
    var drc = DEFAULT_REPLACEMENT_CLASS;
    var fp = config.familyPrefix;
    var rc = config.replacementClass;
    var s = baseStyles;

    if (fp !== dfp || rc !== drc) {
      var dPatt = new RegExp('\\.' + dfp + '\\-', 'g');
      var rPatt = new RegExp('\\.' + drc, 'g');

      s = s.replace(dPatt, '.' + fp + '-').replace(rPatt, '.' + rc);
    }

    return s;
  };

  function define(prefix, icons) {
    var normalized = Object.keys(icons).reduce(function (acc, iconName) {
      var icon = icons[iconName];
      var expanded = !!icon.icon;

      if (expanded) {
        acc[icon.iconName] = icon.icon;
      } else {
        acc[iconName] = icon;
      }
      return acc;
    }, {});

    if (typeof namespace.hooks.addPack === 'function') {
      namespace.hooks.addPack(prefix, normalized);
    } else {
      namespace.styles[prefix] = _extends({}, namespace.styles[prefix] || {}, normalized);
    }

    /**
     * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
     * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
     * for `fas` so we'll easy the upgrade process for our users by automatically defining
     * this as well.
     */
    if (prefix === 'fas') {
      define('fa', icons);
    }
  }

  var Library = function () {
    function Library() {
      classCallCheck(this, Library);

      this.definitions = {};
    }

    createClass(Library, [{
      key: 'add',
      value: function add() {
        var _this = this;

        for (var _len = arguments.length, definitions = Array(_len), _key = 0; _key < _len; _key++) {
          definitions[_key] = arguments[_key];
        }

        var additions = definitions.reduce(this._pullDefinitions, {});

        Object.keys(additions).forEach(function (key) {
          _this.definitions[key] = _extends({}, _this.definitions[key] || {}, additions[key]);
          define(key, additions[key]);
          build();
        });
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.definitions = {};
      }
    }, {
      key: '_pullDefinitions',
      value: function _pullDefinitions(additions, definition) {
        var normalized = definition.prefix && definition.iconName && definition.icon ? { 0: definition } : definition;

        Object.keys(normalized).map(function (key) {
          var _normalized$key = normalized[key],
              prefix = _normalized$key.prefix,
              iconName = _normalized$key.iconName,
              icon = _normalized$key.icon;


          if (!additions[prefix]) additions[prefix] = {};

          additions[prefix][iconName] = icon;
        });

        return additions;
      }
    }]);
    return Library;
  }();

  function prepIcon(icon) {
    var width = icon[0];
    var height = icon[1];
    var vectorData = icon.slice(4);

    return {
      found: true,
      width: width,
      height: height,
      icon: { tag: 'path', attributes: { fill: 'currentColor', d: vectorData[0] } }
    };
  }

  function ensureCss() {
    if (config.autoAddCss && !_cssInserted) {
      insertCss(css());
      _cssInserted = true;
    }
  }

  function apiObject(val, abstractCreator) {
    Object.defineProperty(val, 'abstract', {
      get: abstractCreator
    });

    Object.defineProperty(val, 'html', {
      get: function get() {
        return val.abstract.map(function (a) {
          return toHtml(a);
        });
      }
    });

    Object.defineProperty(val, 'node', {
      get: function get() {
        if (!IS_DOM) return;

        var container = DOCUMENT.createElement('div');
        container.innerHTML = val.html;
        return container.children;
      }
    });

    return val;
  }

  function findIconDefinition(params) {
    var _params$prefix = params.prefix,
        prefix = _params$prefix === undefined ? 'fa' : _params$prefix,
        iconName = params.iconName;


    if (!iconName) return;

    return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
  }

  function resolveIcons(next) {
    return function (maybeIconDefinition) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});

      var mask = params.mask;


      if (mask) {
        mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
      }

      return next(iconDefinition, _extends({}, params, { mask: mask }));
    };
  }

  var library = new Library();

  var noAuto = function noAuto() {
    config.autoReplaceSvg = false;
    config.observeMutations = false;

    disconnect();
  };

  var _cssInserted = false;

  var dom = {
    i2svg: function i2svg() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (IS_DOM) {
        ensureCss();

        var _params$node = params.node,
            node = _params$node === undefined ? DOCUMENT : _params$node,
            _params$callback = params.callback,
            callback = _params$callback === undefined ? function () {} : _params$callback;


        if (config.searchPseudoElements) {
          searchPseudoElements(node);
        }

        onTree(node, callback);
      }
    },

    css: css,

    insertCss: function insertCss$$1() {
      if (!_cssInserted) {
        insertCss(css());
        _cssInserted = true;
      }
    },

    watch: function watch() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var autoReplaceSvgRoot = params.autoReplaceSvgRoot,
          observeMutationsRoot = params.observeMutationsRoot;


      if (config.autoReplaceSvg === false) {
        config.autoReplaceSvg = true;
      }

      config.observeMutations = true;

      domready(function () {
        autoReplace({
          autoReplaceSvgRoot: autoReplaceSvgRoot
        });

        observe({
          treeCallback: onTree,
          nodeCallback: onNode,
          pseudoElementsCallback: searchPseudoElements,
          observeMutationsRoot: observeMutationsRoot
        });
      });
    }
  };

  var parse = {
    transform: function transform(transformString) {
      return parseTransformString(transformString);
    }
  };

  var icon = resolveIcons(function (iconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _params$transform = params.transform,
        transform = _params$transform === undefined ? meaninglessTransform : _params$transform,
        _params$symbol = params.symbol,
        symbol = _params$symbol === undefined ? false : _params$symbol,
        _params$mask = params.mask,
        mask = _params$mask === undefined ? null : _params$mask,
        _params$title = params.title,
        title = _params$title === undefined ? null : _params$title,
        _params$classes = params.classes,
        classes = _params$classes === undefined ? [] : _params$classes,
        _params$attributes = params.attributes,
        attributes = _params$attributes === undefined ? {} : _params$attributes,
        _params$styles = params.styles,
        styles = _params$styles === undefined ? {} : _params$styles;


    if (!iconDefinition) return;

    var prefix = iconDefinition.prefix,
        iconName = iconDefinition.iconName,
        icon = iconDefinition.icon;


    return apiObject(_extends({ type: 'icon' }, iconDefinition), function () {
      ensureCss();

      if (config.autoA11y) {
        if (title) {
          attributes['aria-labelledby'] = config.replacementClass + '-title-' + nextUniqueId();
        } else {
          attributes['aria-hidden'] = 'true';
        }
      }

      return makeInlineSvgAbstract({
        icons: {
          main: prepIcon(icon),
          mask: mask ? prepIcon(mask.icon) : { found: false, width: null, height: null, icon: {} }
        },
        prefix: prefix,
        iconName: iconName,
        transform: _extends({}, meaninglessTransform, transform),
        symbol: symbol,
        title: title,
        extra: {
          attributes: attributes,
          styles: styles,
          classes: classes
        }
      });
    });
  });

  var text = function text(content) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _params$transform2 = params.transform,
        transform = _params$transform2 === undefined ? meaninglessTransform : _params$transform2,
        _params$title2 = params.title,
        title = _params$title2 === undefined ? null : _params$title2,
        _params$classes2 = params.classes,
        classes = _params$classes2 === undefined ? [] : _params$classes2,
        _params$attributes2 = params.attributes,
        attributes = _params$attributes2 === undefined ? {} : _params$attributes2,
        _params$styles2 = params.styles,
        styles = _params$styles2 === undefined ? {} : _params$styles2;


    return apiObject({ type: 'text', content: content }, function () {
      ensureCss();

      return makeLayersTextAbstract({
        content: content,
        transform: _extends({}, meaninglessTransform, transform),
        title: title,
        extra: {
          attributes: attributes,
          styles: styles,
          classes: [config.familyPrefix + '-layers-text'].concat(toConsumableArray(classes))
        }
      });
    });
  };

  var counter = function counter(content) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _params$title3 = params.title,
        title = _params$title3 === undefined ? null : _params$title3,
        _params$classes3 = params.classes,
        classes = _params$classes3 === undefined ? [] : _params$classes3,
        _params$attributes3 = params.attributes,
        attributes = _params$attributes3 === undefined ? {} : _params$attributes3,
        _params$styles3 = params.styles,
        styles = _params$styles3 === undefined ? {} : _params$styles3;


    return apiObject({ type: 'counter', content: content }, function () {
      ensureCss();

      return makeLayersCounterAbstract({
        content: content.toString(),
        title: title,
        extra: {
          attributes: attributes,
          styles: styles,
          classes: [config.familyPrefix + '-layers-counter'].concat(toConsumableArray(classes))
        }
      });
    });
  };

  var layer = function layer(assembler) {
    return apiObject({ type: 'layer' }, function () {
      ensureCss();

      var children = [];

      assembler(function (args) {
        Array.isArray(args) ? args.map(function (a) {
          children = children.concat(a.abstract);
        }) : children = children.concat(args.abstract);
      });

      return [{
        tag: 'span',
        attributes: { class: config.familyPrefix + '-layers' },
        children: children
      }];
    });
  };

  var api = {
    noAuto: noAuto,
    config: config,
    dom: dom,
    library: library,
    parse: parse,
    findIconDefinition: findIconDefinition,
    icon: icon,
    text: text,
    counter: counter,
    layer: layer,
    toHtml: toHtml
  };

  var autoReplace = function autoReplace() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _params$autoReplaceSv = params.autoReplaceSvgRoot,
        autoReplaceSvgRoot = _params$autoReplaceSv === undefined ? DOCUMENT : _params$autoReplaceSv;


    if (Object.keys(namespace.styles).length > 0 && IS_DOM && config.autoReplaceSvg) api.dom.i2svg({ node: autoReplaceSvgRoot });
  };

  function bootstrap() {
    if (IS_BROWSER) {
      if (!WINDOW.FontAwesome) {
        WINDOW.FontAwesome = api;
      }

      domready(function () {
        autoReplace();

        observe({
          treeCallback: onTree,
          nodeCallback: onNode,
          pseudoElementsCallback: searchPseudoElements
        });
      });
    }

    namespace.hooks = _extends({}, namespace.hooks, {

      addPack: function addPack(prefix, icons) {
        namespace.styles[prefix] = _extends({}, namespace.styles[prefix] || {}, icons);

        build();
        autoReplace();
      },

      addShims: function addShims(shims) {
        var _namespace$shims;

        (_namespace$shims = namespace.shims).push.apply(_namespace$shims, toConsumableArray(shims));

        build();
        autoReplace();
      }
    });
  }

  bunker(bootstrap);

  }());

  (function ($) {
    let header = document.querySelector('.main-header');

    if (!header) {
      return;
    } // Detect touch screen and enable scrollbar if necessary


    function is_touch_device() {
      try {
        document.createEvent('TouchEvent');
        return true;
      } catch (e) {
        return false;
      }
    }

    if (is_touch_device()) {
      $('.main-header #nav-mobile').css({
        overflow: 'auto'
      });
    }
  })(jQuery);

  (function ($) {
    let localNav = $('.local-navigation');

    if (!localNav.length) {
      return;
    }

    function throttle(type, name, obj) {
      obj = obj || window;
      var running = false;

      var func = function () {
        if (running) {
          return;
        }

        running = true;
        requestAnimationFrame(function () {
          obj.dispatchEvent(new CustomEvent(name));
          running = false;
        });
      };

      obj.addEventListener(type, func);
    }
    /* init - you can init any event */


    throttle('resize', 'optimizedResize'); // Floating-Fixed table of contents

    const toc = localNav.find('.table-of-contents');
    const footer = $('.main-footer');

    function alignLocalNavigation() {
      const tocHeight = toc.length ? toc.height() : 0;
      const footerOffset = footer.length ? footer.offset().top : 0;
      const bottomOffset = footerOffset - tocHeight;
      let top = 0;

      if ($('nav').length) {
        top = $('nav').height();
      } else if ($('#index-banner').length) {
        top = $('#index-banner').height();
      }

      localNav.pushpin({
        top: top,
        bottom: bottomOffset
      });
    }

    requestAnimationFrame(alignLocalNavigation);
    window.addEventListener('optimizedResize', alignLocalNavigation);
  })(jQuery);

  (function () {
    function highlightElements() {
      let codeBlocks = Array.from(document.querySelectorAll('.code pre'));
      codeBlocks.forEach(element => Prism.highlightElement(element));
    }

    requestAnimationFrame(highlightElements);
    document.addEventListener('Neos.NodeCreated', highlightElements, false);
  })();

}());
//# sourceMappingURL=app.js.map
