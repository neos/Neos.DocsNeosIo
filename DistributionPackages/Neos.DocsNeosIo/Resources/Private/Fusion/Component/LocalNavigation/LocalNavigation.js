(() => {
	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			const id = entry.target.getAttribute('id');
			const target = document.querySelector(`.toc li a[href="#${id}"]`)
			target?.classList.toggle('active', entry.intersectionRatio > .1);
		});
	}, {
		threshold: .1,
		rootMargin: '-58px 0px 0px'
	});

	// Track all sections that have an `id` applied
	document.querySelectorAll('.content-section[id],.content-navigation[id]').forEach((section) => {
		observer.observe(section);
	});
})()
