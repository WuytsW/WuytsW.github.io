// js/projects-data.js
//
// The single source of truth for the project list. Edit this file (not
// projects.html's markup, and not js/pdf-assets.js) when adding, removing,
// or editing a project -- it is consumed by two independent things that
// must never fall out of sync:
//
//   - projects.html, which renders its cards from this data at page load
//     (see js/projects-render.js).
//   - js/pdf.js, which reads this data directly to build the Projects page
//     of the generated CV PDF.
//
// Because both consumers read the same array, the "Download PDF" button
// always includes the actual, current project list -- regardless of
// whether the page was opened via file:// or http(s)://. There used to be a
// second, hand-duplicated copy of this data used only as a fetch() fallback
// under file://; that duplication (and the risk of the two copies drifting)
// is exactly what this file exists to eliminate.

window.PROJECTS_DATA = [
  {
    id: 'school-projects',
    heading: 'School Projects',
    cards: [
      {
        title: 'CeT2SAgent',
        url: 'https://github.com/WuytsW-KUL/CeT2SAgent',
        description:
          "Master's thesis project: a context-enhanced text-to-SPARQL agent (FastAPI + LangGraph) that turns natural-language questions into SPARQL queries against DBpedia",
        tag: 'Python, FastAPI, LangGraph',
      },
      {
        title: 'Engineering Experience 3: Battle Command',
        url: 'https://github.com/LiamHeynderickx/BattleCommand_EE3',
        description:
          'Group project for the Engineering Experience 3 course: a re-imagined Battleship board game with a physical LED grid, controlled hands-free via voice commands and computer-vision boat detection, paired with a React web app.',
        tag: 'Embedded Systems',
      },
      {
        title: 'Advanced Programming Techniques',
        url: 'https://github.com/WuytsW-KUL/Advanced-Programming-Techniques',
        description:
          'Group final project for the Advanced Programming Techniques course: a 2D grid-based game built with Qt using an MVC architecture an autoplay mode utilising A* pathfinding.',
        tag: 'C++, Qt',
      },
      {
        title: 'Distributed Systems',
        url: 'https://github.com/WuytsW-KUL/dsgt',
        description:
          'Group final project for the Distributed Systems course: a frontend, broker, and supplier services deployed on Azure across servers in different countries to simulate a real-world distributed environment.',
        tag: 'Java, Azure',
      },
      {
        title: 'eXtended Reality: Blind Cat and Mouse',
        url: 'https://github.com/WuytsW-KUL/eXtendedReality',
        description:
          'Group final project for the eXtended Reality course: a real-life cat-and-mouse game where a blindfolded "cat" is guided toward the "mouse" by phone vibrations that encode direction and distance. An overhead camera tracks both players via OpenCV colour detection, homography calibration, and a Kalman filter, streaming positions to the phones over MQTT.',
        tag: 'Python, OpenCV, MQTT, Android',
      }
    ],
  },
  {
    id: 'personal-projects',
    heading: 'Personal Projects',
    cards: [
      {
        title: 'ChatApp',
        url: 'https://github.com/WuytsW/ChatApp',
        description: 'A simple Java chat application: an experiment in client/server messaging.',
        tag: 'Java',
      },
      {
        title: 'Minesweeper',
        url: 'https://github.com/WuytsW/Minesweeper',
        description: 'A simple browser-based Minesweeper clone, built in JavaScript, p5.js.',
        tag: 'JavaScript, p5.js',
      },
    ],
  },
];
