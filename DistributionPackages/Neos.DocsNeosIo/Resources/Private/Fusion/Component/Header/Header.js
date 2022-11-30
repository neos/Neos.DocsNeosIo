const sidebar = document.querySelector('.sidebar');
const sidebarButton = document.querySelector('.sidebar-button');
const sidebarBackdrop = document.querySelector('.sidebar-mobile-backdrop');

function toggleSidebar() {
	sidebar.classList.toggle('open');
	const isExpanded = sidebarButton.getAttribute('aria-expanded') === 'true';
	sidebarButton.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
	sidebarButton.setAttribute('aria-label', isExpanded ? 'open menu' : 'close menu');
	if (!isExpanded) {
		sidebar.focus();
	}
}

sidebarButton.addEventListener('click', function () {
	toggleSidebar();
})

sidebarBackdrop.addEventListener('click', function () {
	toggleSidebar();
})
