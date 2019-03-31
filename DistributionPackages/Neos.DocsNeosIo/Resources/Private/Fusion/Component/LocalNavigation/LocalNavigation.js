(function($) {
	let localNav = $('.local-navigation');
	if(!localNav.length) {
		return;
	}

	function throttle(type, name, obj) {
		obj = obj || window;
		let running = false;
		const func = function() {
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
	const indexBanner = $('#index-banner');
	const toc = localNav.find('.table-of-contents');
	const footer = $('.main-footer');
	function alignLocalNavigation() {
		const topOffset = indexBanner.length ? $('#index-banner').outerHeight(true) : 0;
		const tocHeight = toc.length ? toc.height() : 0;
		const footerOffset = footer.length ? footer.offset().top : 0;
		const bottomOffset = footerOffset - tocHeight;

		console.info(topOffset);
		localNav.pushpin({
			top: topOffset,
			bottom: bottomOffset
		});
	}

	requestAnimationFrame(alignLocalNavigation);
	window.addEventListener('optimizedResize', alignLocalNavigation);
})(jQuery);
