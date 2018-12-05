(function($) {
	let localNav = $('.local-navigation');
	if(!localNav.length) {
		return;
	}

	// Floating-Fixed table of contents
	setTimeout(function() {
		var tocHeight = localNav.find('.table-of-contents').length
			? localNav.find('.table-of-contents').height()
			: 0;
		var footerOffset = $('body > footer').first().length
			? $('body > footer')
				.first()
				.offset().top
			: 0;
		var bottomOffset = footerOffset - tocHeight;

		var top = 0;
		if ($('nav').length) {
			top = $('nav').height();
		} else if ($('#index-banner').length) {
			top = $('#index-banner').height();
		}
		localNav.pushpin({
			top: top,
			bottom: bottomOffset
		});
	}, 100);
})(jQuery);