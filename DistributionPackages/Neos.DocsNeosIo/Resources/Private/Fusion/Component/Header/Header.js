(function($) {
	let header = document.querySelector('.main-header');
	if(!header) {
		return;
	}

	// Detect touch screen and enable scrollbar if necessary
	function is_touch_device() {
		try {
			document.createEvent('TouchEvent');
			return true;
		} catch (e) {
			return false;
		}
	}
	if (is_touch_device()) {
		$('.main-header #nav-mobile').css({ overflow: 'auto' });
	}
})(jQuery);