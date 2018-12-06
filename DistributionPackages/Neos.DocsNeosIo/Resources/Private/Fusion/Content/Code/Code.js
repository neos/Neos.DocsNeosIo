import '../../../../Public/Frontend/node_modules/prismjs/prism.js';
import '../../../../Public/Frontend/node_modules/prismjs/components/prism-yaml.js';
import '../../../../Public/Frontend/node_modules/prismjs/components/prism-markup-templating.js'; // required for php
import '../../../../Public/Frontend/node_modules/prismjs/components/prism-php.js';
import '../../../../Public/Frontend/node_modules/prismjs/components/prism-bash.js';
import '../../../../Public/Frontend/node_modules/prismjs/components/prism-scss.js';
import '../../../../Public/Frontend/node_modules/prismjs/components/prism-sass.js';
import '../../../../Public/Frontend/node_modules/prismjs/components/prism-typescript.js';
import '../../../../Public/Frontend/node_modules/prismjs/components/prism-sql.js';
import '../../../../Public/Frontend/node_modules/prismjs/components/prism-markdown.js';

(function() {
	function highlightElements() {
		let codeBlocks = Array.from(document.querySelectorAll('.code code'));
		codeBlocks.forEach(element => Prism.highlightElement(element));
	}

	requestAnimationFrame(highlightElements);
	document.addEventListener('Neos.NodeCreated', highlightElements, false);
}())