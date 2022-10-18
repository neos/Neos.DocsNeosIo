// noinspection JSVoidFunctionReturnValueUsed

$/**
 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
 * Modified by Miles Johnson: http://milesj.me
 * Rewritten by Tom Pavelec
 * Modified by Manuel Meister: https://meister.io
 *
 * Supports PHP 5.3 - 8.0
 */
	(function (Prism) {
		Prism.languages.neosfusion = {
			'eel': {
				alias: 'punctuation',
				pattern: /\$\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*?\}/s,
				greedy: true,
				inside: {
					'function': {
						pattern: /\$\{(?=.*?})|(?<=\$\{.*?)}/s,
						greedy: true
					},
					'eel': {
						pattern: /(?<=\$\{).*?(?=})/s,
						greedy: true,
						inside: Prism.languages.eel
					}
				}
			},
			'atrule': {
				pattern: /@\w+\b(\.\w*)?/,
				greedy: true,
				inside: {
					'punctuation': /\./,
					'attr-value': {
						pattern: /(?<=\.)\w+/,
						greedy: true,
						lookbehind: true
					}
				}
			},
			'constant': [
				/\b(?:null)\b/i,
				/\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/
			],
			'boolean': {
				pattern: /\b(?:false|true)\b/i,
			},
			'dsl': {
				pattern: /\b[a-zA-Z]+`(?:\\[\s\S]|[^\\`])*`/m,
				alias: 'string',
				lookbehind: true,
				greedy: true,
				inside: {
					'symbol': /\b[a-zA-Z]+(?=`)/,
					'afx': {
						pattern: /(?<=afx`)(?:\\[\s\S]|[^\\`])*(?=`)/m,
						greedy: true,
						inside: Prism.languages.afx
					}
				}
			},
			'string': [
				{
					pattern: /`.*?(?<!\\)`/,
					alias: 'backtick-quoted-string',
					greedy: true
				},
				{
					pattern: /'.*?(?<!\\)'/,
					alias: 'single-quoted-string',
					lookbehind: true,
					greedy: true
				},
				{
					pattern: /".*?(?<!\\)"/,
					alias: 'double-quoted-string',
					greedy: true
				}
			],
			'comment': [
				{
					pattern: /(?:\/\/.*)|(?:#(?!\[).*)$/m,
					greedy: true
				},
				{
					pattern: /\/\*[\s\S]*?(?:\*\/|$)/m,
					greedy: true
				}
			],
			'package': {
				pattern: /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
				lookbehind: true,
				inside: {
					'punctuation': /\\/
				}
			},
			'include-statement': {
				pattern: /^include:.*$/m,
				alias: 'url',
				lookbehind: true,
				greedy: true,
				inside: {
					'punctuation': /(?<=include):/,
					'keyword': {
						pattern: /include/i,
					}
				}
			},
			'keyword': [
				{
					pattern: /\brenderer\b/i,
					alias: 'type-hint',
					greedy: true,
					lookbehind: true
				}
			],
			'class-name': [
				{
					pattern: /\b[-.:@"'\w]+:[-.:@"'\w]+/i,
					alias: ['class-name-fully-qualified', 'static-context'],
					greedy: true,
					inside: {
						'namespace': /\b[-.:@"'\w]+(?=:[-.:@"'\w]+)/,
						'punctuation': /(?<!\\):/
					}
				},
			],
			'function': {
				pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
				lookbehind: true,
				inside: {
					'punctuation': /\\/
				}
			},
			'number': /(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
			'operator': /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>+-]=?/,
			'punctuation': /[{}\[\](),:;]/
		};

	}(Prism));
