document.addEventListener("DOMContentLoaded", () => {
	const pages = [...document.querySelectorAll(".page")];
	const links = [...document.querySelectorAll("[data-page-link]")];
	const navLinks = [...document.querySelectorAll(".nav-links [data-page-link]")];
	const pageNames = pages.map((page) => page.id);

	function showPage(pageName) {
		const selectedPage = pageNames.includes(pageName) ? pageName : "home";

		pages.forEach((page) => {
			page.hidden = page.id !== selectedPage;
		});

		navLinks.forEach((link) => {
			const isActive = link.dataset.pageLink === selectedPage;
			link.classList.toggle("active", isActive);
			if (isActive) {
				link.setAttribute("aria-current", "page");
			} else {
				link.removeAttribute("aria-current");
			}
		});

		document.title = `${selectedPage[0].toUpperCase()}${selectedPage.slice(1)} | Energy Guide`;
		history.replaceState(null, "", `#${selectedPage}`);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	links.forEach((link) => {
		link.addEventListener("click", () => showPage(link.dataset.pageLink));
	});

	document.getElementById("year").textContent = new Date().getFullYear();
	showPage(window.location.hash.slice(1));
});
