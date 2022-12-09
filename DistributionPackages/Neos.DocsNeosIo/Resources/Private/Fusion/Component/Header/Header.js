const sidebar = document.querySelector('.sidebar');
const sidebarButton = document.querySelector('.sidebar-button');
const sidebarBackdrop = document.querySelector('.sidebar-mobile-backdrop');

function toggleSidebar(open = undefined) {
	sidebar.classList.toggle('open', open);
	const expand = open ?? sidebarButton.getAttribute('aria-expanded') !== 'true';
	sidebarButton.setAttribute('aria-expanded', expand ? 'true' : 'false');
	sidebarButton.setAttribute('aria-label', expand ? 'close menu' : 'open menu');
	if (expand) {
		sidebar.focus();
	}
}

document.body.addEventListener('keydown', event => event.key === 'Escape' && toggleSidebar(false));

sidebarButton.addEventListener('click', () => toggleSidebar());

sidebarBackdrop.addEventListener('click', () => toggleSidebar(false))
