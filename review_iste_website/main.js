document.addEventListener("DOMContentLoaded", function () {
  // Inject scroll progress bar
  if (!document.getElementById("scroll-progress")) {
    const bar = document.createElement("div");
    bar.id = "scroll-progress";
    document.body.appendChild(bar);
  }

  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const progress = Math.max(0, Math.min(100, (scrollTop / height) * 100));
    const bar = document.getElementById("scroll-progress");
    if (bar) bar.style.width = progress + "%";
  }
  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  // Load Navbar
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  if (navbarPlaceholder) {
    fetch("navbar.html")
      .then((response) => response.text())
      .then((data) => {
        navbarPlaceholder.innerHTML = data;

        // Active link highlight
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".nav-links a").forEach((link) => {
          const href = link.getAttribute("href");
          if (href === currentPage) {
            link.classList.add("active");
          }
        });

        // Mobile toggle
        const toggle = document.getElementById("menu-toggle");
        const links = document.getElementById("nav-links");
        if (toggle && links) {
          toggle.addEventListener("click", () => {
            const open = links.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
          });
        }

        // Theme toggle
        const themeBtn = document.getElementById("theme-toggle");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const savedTheme = localStorage.getItem("theme");
        function applyTheme(theme) {
          const root = document.documentElement;
          if (theme === "light") {
            root.setAttribute("data-theme", "light");
          } else {
            root.removeAttribute("data-theme");
          }
          if (themeBtn) {
            themeBtn.innerHTML = theme === "light" ? "<i class='fas fa-sun'></i>" : "<i class='fas fa-moon'></i>";
          }
        }
        const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
        applyTheme(initialTheme);
        if (themeBtn) {
          themeBtn.addEventListener("click", () => {
            const isLight = document.documentElement.getAttribute("data-theme") === "light";
            const next = isLight ? "dark" : "light";
            localStorage.setItem("theme", next);
            applyTheme(next);
          });
        }
      });
  }

  // Navbar shrink on scroll
  function handleNavbarShrink() {
    const nb = document.querySelector(".navbar");
    if (!nb) return;
    if (window.scrollY > 24) nb.classList.add("shrink");
    else nb.classList.remove("shrink");
  }
  handleNavbarShrink();
  window.addEventListener("scroll", handleNavbarShrink, { passive: true });

  // Intersection reveal animations for elements with .reveal*
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
  );
  const obs = observer;
  document.querySelectorAll(".reveal, .reveal-up, .reveal-left, .reveal-right").forEach((el) => obs.observe(el));
});
