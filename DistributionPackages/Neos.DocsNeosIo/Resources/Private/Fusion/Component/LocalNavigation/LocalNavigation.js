(function($) {
	let localNav = $('.local-navigation');
	if(!localNav.length) {
		return;
	}

	function throttle(type, name, obj) {
		obj = obj || window;
		var running = false;
		var func = function() {
			if (running) { return; }
			running = true;
			requestAnimationFrame(function() {
				obj.dispatchEvent(new CustomEvent(name));
				running = false;
			});
		};
		obj.addEventListener(type, func);
	}
	/* init - you can init any event */
	throttle('resize', 'optimizedResize');

	// Floating-Fixed table of contents
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