(function($) {
	let form = $('.search-form');
	if(!form.length) {
		return;
	}

	let renderResults = function(searchInput, results) {
		let resultsContainer = $(searchInput.dataset.ajaxTarget);
		if(resultsContainer) {
			resultsContainer.html(results);
		}
	};

	let debounce = function (fn) {
		let timeout;
		return function () {
			var args = Array.prototype.slice.call(arguments),
				ctx = this;

			clearTimeout(timeout);
			timeout = setTimeout(function () {
				fn.apply(ctx, args);
			}, 100);
		};
	};

	let searchInput = $('.search-input');
	searchInput.focus(function() {
		$(this).parent().addClass('focused');
	});

	searchInput.blur(function() {
		if (!$(this).val()) {
			$(this).parent().removeClass('focused');
		}
	});

	searchInput.on('keyup', debounce(function (e) {
		return; // AJAX search doesn't work yet
		if(!this.dataset.ajaxTarget) {
			return;
		}
		if ($(this).val() < 2) {
			renderResults(this, []);
			return;
		}

		if (e.which === 38 || e.which === 40 || e.keyCode === 13) return;

		renderResults(this, ' <div class="progress"><div class="indeterminate"></div></div>')

		let query = $(this).data('ajaxSearchUri') + '&q=' + $(this).val();
		$.get(query)
			.done(data => renderResults(this, $(data).children()))
			.fail(data => renderResults(this, '<h5>Could not load results</h5>'))
	}));

	searchInput.on('keydown', function(e) {
		return; // AJAX search doesn't work yet
		// this must not be debounced
		// on enter, go to new page if focused

		let results = $(this.dataset.ajaxTarget);
		let focusedEl = results.find('.search-result.focused').first();

		if (e.keyCode === 13) {
			if (focusedEl.length) {
				e.preventDefault();
				focusedEl.find('a')[0].click();
			}
		}
	});

	searchInput.on('keydown', debounce(function (e) {
		return; // AJAX search doesn't work yet
		if(!this.dataset.ajaxTarget) {
			return;
		}

		let results = $(this.dataset.ajaxTarget);
		let focusedEl = results.find('.search-result.focused').first();

		// Escape.
		if (e.keyCode === 27) {
			$(this).val('');
			$(this).blur();
			renderResults(this, []);
			return;
		} else if (e.keyCode === 13) {
			// enter
			return;
		}

		// Arrow keys.
		let focused;
		switch(e.which) {
			case 38: // up
				if (focusedEl.length) {
					focusedEl.removeClass('focused');
					focusedEl.prev().addClass('focused');
				}
				break;

			case 40: // down
				if (!focusedEl.length) {
					focused = results.children().first();
					focused.addClass('focused');
				} else {
					if (focusedEl.next().length) {
						focusedEl.removeClass('focused');
						focusedEl.next().addClass('focused');
					}
				}
				break;

			default: return; // exit this handler for other keys
		}
		e.preventDefault();
	}));


})(jQuery);