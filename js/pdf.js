// js/pdf.js
//
// Powers the "Download PDF" button on index.html. Builds a standalone PDF
// (via the jsPDF library, loaded from a CDN <script> in index.html) from
// this page's CV content plus the Projects page content, then saves it as a
// real file -- no browser print dialog, so no browser-injected date/URL/
// page-number header ever appears, and the text in the PDF is real,
// selectable text (drawn with jsPDF's text API), not a rasterized image of
// the page.
//
// The avatar image is bundled as static data in js/pdf-assets.js (loaded
// before this file) rather than read live from the DOM, since canvas-based
// image reads are blocked when the page is opened via file://. Project data
// comes from window.PROJECTS_DATA (js/projects-data.js), the same data
// projects.html itself renders its cards from -- so the PDF's Projects page
// always matches projects.html exactly, regardless of how the page was
// opened, with no fetch() involved (which file:// would block anyway).
//
// Only does anything on index.html -- no-ops if the button isn't found.

(function () {
  'use strict';

  const downloadBtn = document.getElementById('download-pdf-btn');
  const statusEl = document.getElementById('pdf-status');

  if (!downloadBtn) {
    return;
  }

  const MARGIN = 18;
  const PAGE_WIDTH = 210; // A4, mm
  const PAGE_HEIGHT = 297; // A4, mm
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const COLOR_TEXT = [26, 26, 26];
  const COLOR_MUTED = [90, 90, 90];
  const COLOR_BORDER = [226, 226, 226];
  const CONTACT_FONT_SIZE = 9.5;
  // Helvetica's ascender, as a fraction of the em square, per its AFM font
  // metrics -- used to line up the *visual* top of a line of text with a
  // given y (jsPDF positions text by its baseline, not its top, so without
  // this offset text placed at the same y as the avatar's top edge actually
  // renders a couple mm below it).
  const HELVETICA_ASCENT = 0.718;

  function ptToMm(pt) {
    return (pt * 25.4) / 72;
  }

  // Collapses all whitespace (including the newlines/indentation that come
  // from how the HTML source is formatted) into single spaces, the same way
  // a browser would visually render it. Without this, text pulled from a
  // multi-line-indented <p> in the HTML source carries literal "\n    " runs
  // into the PDF, which jsPDF renders as a real line break plus leading
  // spaces instead of collapsing it like the browser does.
  function clean(str) {
    return (str || '').replace(/\s+/g, ' ').trim();
  }

  function text(el) {
    return el ? clean(el.textContent) : '';
  }

  function setStatus(message) {
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  function setBusy(isBusy) {
    downloadBtn.disabled = isBusy;
    downloadBtn.textContent = isBusy ? 'Preparing PDF…' : 'Download PDF';
  }

  function buildPdf(projectsData) {
    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    let y = MARGIN;

    function ensureSpace(height) {
      if (y + height > PAGE_HEIGHT - MARGIN) {
        doc.addPage();
        y = MARGIN;
      }
    }

    function addDivider() {
      doc.setDrawColor.apply(doc, COLOR_BORDER);
      doc.setLineWidth(0.2);
      doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
      y += 5;
    }

    function addHeading2(heading) {
      ensureSpace(12);
      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor.apply(doc, COLOR_TEXT);
      doc.text(heading, MARGIN, y);
      y += 2;
      addDivider();
    }

    function addHeading3(heading, rightText) {
      ensureSpace(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor.apply(doc, COLOR_TEXT);
      doc.text(heading, MARGIN, y);
      if (rightText) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor.apply(doc, COLOR_MUTED);
        doc.text(rightText, PAGE_WIDTH - MARGIN, y, { align: 'right' });
      }
      y += 5;
    }

    // Project titles are both a heading and a link to the repo.
    function addLinkedHeading3(heading, url) {
      ensureSpace(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor.apply(doc, COLOR_TEXT);
      doc.textWithLink(heading, MARGIN, y, { url });
      y += 5;
    }

    function addMeta(meta) {
      ensureSpace(6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor.apply(doc, COLOR_MUTED);
      doc.text(meta, MARGIN, y);
      y += 5;
    }

    function addParagraph(paragraph) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor.apply(doc, COLOR_TEXT);
      const lines = doc.splitTextToSize(paragraph, CONTENT_WIDTH);
      lines.forEach((line) => {
        ensureSpace(5.5);
        doc.text(line, MARGIN, y);
        y += 5.2;
      });
      y += 2;
    }

    // items: [{ text, href }] -- href is optional; when present the whole
    // bullet (including wrapped lines) is a clickable link to it.
    function addBullets(items) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor.apply(doc, COLOR_TEXT);
      items.forEach((item) => {
        const lines = doc.splitTextToSize(item.text, CONTENT_WIDTH - 5);
        lines.forEach((line, i) => {
          ensureSpace(5.5);
          const rendered = (i === 0 ? '•  ' : '   ') + line;
          if (item.href) {
            doc.textWithLink(rendered, MARGIN, y, { url: item.href });
          } else {
            doc.text(rendered, MARGIN, y);
          }
          y += 5.2;
        });
      });
      y += 2;
    }

    // ---- Header: name, meta lines, avatar, contact ----
    const nameEl = document.querySelector('header h1');
    const name = text(nameEl) || 'CV';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor.apply(doc, COLOR_TEXT);
    doc.text(name, MARGIN, y);
    y += 8;

    document.querySelectorAll('header > p.meta').forEach((p) => addMeta(text(p)));
    y += 2;

    let contactX = MARGIN;
    const avatarTop = y;
    if (window.PDF_AVATAR_BASE64) {
      try {
        doc.addImage(window.PDF_AVATAR_BASE64, 'JPEG', MARGIN, y, 28, 28);
        contactX = MARGIN + 28 + 6;
      } catch (err) {
        console.error('Could not embed avatar image in PDF.', err);
      }
    }
    // Nudge the contact list's first line down from the avatar's top edge by
    // one ascent, so the *visual* top of "email" lines up with the top of
    // the photo instead of sitting above it (see HELVETICA_ASCENT above).
    let contactY = avatarTop + ptToMm(CONTACT_FONT_SIZE) * HELVETICA_ASCENT;
    document.querySelectorAll('.contact li').forEach((li) => {
      const link = li.querySelector('a');
      const label = text(li);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(CONTACT_FONT_SIZE);
      doc.setTextColor.apply(doc, COLOR_TEXT);
      if (link) {
        doc.textWithLink(label, contactX, contactY, { url: link.href });
      } else {
        doc.text(label, contactX, contactY);
      }
      contactY += 5;
    });
    y = Math.max(contactY, avatarTop + 30) + 6;

    // ---- CV sections: About, Experience, Education, Skills ----
    document.querySelectorAll('main > section').forEach((section) => {
      const heading = section.querySelector(':scope > h2');
      if (heading) addHeading2(text(heading));

      section.querySelectorAll(':scope > p').forEach((p) => addParagraph(text(p)));

      section.querySelectorAll(':scope > .entry').forEach((entry) => {
        const h3 = entry.querySelector('h3');
        const dateEl = entry.querySelector('.entry-header .meta');
        addHeading3(text(h3), text(dateEl));

        entry.querySelectorAll(':scope > .meta').forEach((m) => addMeta(text(m)));

        const items = Array.from(entry.querySelectorAll('ul li')).map((li) => {
          const link = li.querySelector('a');
          return { text: text(li), href: link ? link.href : null };
        });
        if (items.length) addBullets(items);
        y += 2;
      });

      section.querySelectorAll(':scope > .skills-group').forEach((group) => {
        const h3 = group.querySelector('h3');
        if (h3) addHeading3(text(h3));
        const items = Array.from(group.querySelectorAll('.skills-list li')).map((li) => text(li));
        addParagraph(items.join('   ·   '));
      });
    });

    // ---- Projects, on their own page ----
    doc.addPage();
    y = MARGIN;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor.apply(doc, COLOR_TEXT);
    doc.text('Projects', MARGIN, y);
    y += 9;

    projectsData.forEach((section) => {
      if (section.heading) addHeading2(section.heading);

      section.cards.forEach((card) => {
        ensureSpace(8);
        if (card.url) {
          addLinkedHeading3(card.title, card.url);
        } else if (card.title) {
          addHeading3(card.title);
        }
        if (card.description) addParagraph(card.description);
        if (card.tag) addMeta(card.tag);
        y += 2;
      });
    });

    return doc;
  }

  function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'CV';
  }

  function handleDownloadClick() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      setStatus('Could not load the PDF library (check your internet connection) -- try again.');
      return;
    }

    setBusy(true);
    setStatus('');

    const projectsData = window.PROJECTS_DATA;
    if (!projectsData) {
      setStatus('Note: Projects could not be included -- js/projects-data.js failed to load. Check the browser console for details.');
    }

    try {
      const doc = buildPdf(projectsData || []);
      const nameEl = document.querySelector('header h1');
      const filename = sanitizeFilename(text(nameEl) || 'CV') + '-CV.pdf';
      doc.save(filename);
    } catch (err) {
      console.error('Could not generate the PDF.', err);
      setStatus('Something went wrong generating the PDF. Check the browser console for details.');
    } finally {
      setBusy(false);
    }
  }

  downloadBtn.addEventListener('click', handleDownloadClick);
})();
