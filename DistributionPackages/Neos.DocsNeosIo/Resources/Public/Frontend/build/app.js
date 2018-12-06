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
