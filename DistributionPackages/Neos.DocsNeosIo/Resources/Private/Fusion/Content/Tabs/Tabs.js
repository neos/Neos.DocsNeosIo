const tabElement = document.querySelectorAll('.tabs__wrapper:not(:empty)');

if (tabElement) {
	[...tabElement].forEach(tabs => {
		const tabButtons = [...(tabs.querySelectorAll('.tab'))];
		const tabItems = [...tabs.querySelectorAll('.tab-item')]
		tabItems[0]?.classList.add('active');
		tabButtons.forEach(tab => {
				tab.addEventListener('click', () => {
					tabButtons.forEach(button => button.classList.toggle('active', button === tab));
					tabItems.forEach(tabItem => {
						tabItem.classList.toggle('active', tabItem.id === tab.getAttribute('aria-controls'));
					});
				});
			}
		)
	})
}
