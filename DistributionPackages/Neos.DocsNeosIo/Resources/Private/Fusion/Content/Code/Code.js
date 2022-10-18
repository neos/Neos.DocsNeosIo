(function() {
	function highlightElements() {
		let codeBlocks = Array.from(document.querySelectorAll('.code pre code'));
		codeBlocks.forEach(element => Prism.highlightElement(element));
	}

	requestAnimationFrame(highlightElements);
	document.addEventListener('Neos.NodeCreated', highlightElements, false);
})()
