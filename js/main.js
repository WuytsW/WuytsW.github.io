/*
 * Progressive-enhancement script for the site.
 * Nothing here is required for the page to be usable: navigation, layout,
 * and dark mode (via prefers-color-scheme) all work without JS. This file
 * only adds theme persistence, small scroll-driven UI touches, and the
 * scroll-reveal animation.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "ww-theme";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Theme toggle
     --------------------------------------------------------------------- */
  var themeToggle = document.getElementById("theme-toggle");

  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* localStorage unavailable (private mode, etc.) — theme just won't persist */
    }
    if (themeToggle) themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  try {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored) root.setAttribute("data-theme", stored);
  } catch (e) {
    /* ignore */
  }

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", currentTheme() === "dark" ? "true" : "false");
    themeToggle.addEventListener("click", function () {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  /* ---------------------------------------------------------------------
     Mobile nav: close the <details> menu after a link is clicked
     --------------------------------------------------------------------- */
  var navDetails = document.querySelector(".nav-details");
  if (navDetails) {
    navDetails.querySelectorAll(".nav-menu a").forEach(function (link) {
      link.addEventListener("click", function () {
        navDetails.removeAttribute("open");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Nav shadow + back-to-top visibility on scroll
     --------------------------------------------------------------------- */
  var siteNav = document.querySelector(".site-nav");
  var backToTop = document.querySelector(".back-to-top");

  function onScroll() {
    if (siteNav) {
      if (window.scrollY > 8) siteNav.classList.add("scrolled");
      else siteNav.classList.remove("scrolled");
    }
    if (backToTop) {
      if (window.scrollY > 480) backToTop.classList.add("visible");
      else backToTop.classList.remove("visible");
    }
  }

  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------------------
     Scroll-reveal animation
     --------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (!reduceMotion && "IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------------------------------------------------------------------
     Scrollspy: highlight the current section's nav link
     --------------------------------------------------------------------- */
  var sections = document.querySelectorAll("main section[id]");
  if (sections.length && "IntersectionObserver" in window) {
    var navLinks = document.querySelectorAll(".nav-menu a[data-section]");
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("data-section") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }
})();
