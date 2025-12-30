# ProQA-Style Questionnaire

A lightweight, browser-based flow for guiding call takers through ProQA-inspired emergency protocols. The UI is fully client-side (vanilla HTML/CSS/JS) and captures a question/answer transcript as you progress through branching steps.

## Getting started
1. Start a local web server from this directory:
   ```bash
   python -m http.server 8000
   ```
2. Open http://localhost:8000 in your browser.
3. Pick a protocol and click through the presented options. Use **Back** to revisit the previous step or **Reset** to start over.

## Features
- Two sample protocols (Chest Pain, Structure Fire) with branching questions.
- Inline actions and outcomes to mirror ProQA-style instructions.
- Live transcript for clean handoff to responding units.
- Responsive layout with accessible buttons and keyboard focus states.
