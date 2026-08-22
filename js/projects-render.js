// js/projects-render.js
//
// Renders projects.html's project cards from window.PROJECTS_DATA (defined
// in js/projects-data.js, which must be loaded first) into the #projects-root
// mount point. Building projects.html this way -- rather than hand-writing
// its cards as static markup -- means there is exactly one place project
// content is authored; js/pdf.js reads the same window.PROJECTS_DATA to
// build the Projects page of the generated CV PDF, so the two can never
// drift out of sync.
//
// Builds nodes with createElement/textContent rather than innerHTML/template
// strings, so descriptions containing characters like apostrophes (e.g.
// "Master's thesis") don't need any hand-rolled HTML-escaping.
//
// Only does anything on projects.html -- no-ops (quietly, via console.error)
// if the mount point or the data isn't there.

(function () {
  'use strict';

  const root = document.getElementById('projects-root');
  if (!root) {
    return;
  }

  if (!window.PROJECTS_DATA) {
    console.error('window.PROJECTS_DATA is missing -- js/projects-data.js failed to load before js/projects-render.js.');
    return;
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  window.PROJECTS_DATA.forEach((section) => {
    const sectionEl = document.createElement('section');
    sectionEl.id = section.id;
    sectionEl.setAttribute('aria-labelledby', section.id + '-heading');

    const heading = el('h2', null, section.heading);
    heading.id = section.id + '-heading';
    sectionEl.appendChild(heading);

    const grid = el('div', 'project-grid');
    section.cards.forEach((card) => {
      const cardEl = el('div', 'project-card');

      const h3 = document.createElement('h3');
      const link = document.createElement('a');
      link.href = card.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = card.title;
      h3.appendChild(link);
      cardEl.appendChild(h3);

      cardEl.appendChild(el('p', null, card.description));
      cardEl.appendChild(el('span', 'project-tag', card.tag));

      grid.appendChild(cardEl);
    });
    sectionEl.appendChild(grid);

    root.appendChild(sectionEl);
  });
})();
