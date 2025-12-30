# ProQA-Style Questionnaire

A lightweight, browser-based flow for guiding call takers through ProQA-inspired emergency protocols. The UI is fully client-side (vanilla HTML/CSS/JS) and captures a question/answer transcript as you progress through branching steps.

## Getting started
You can run the questionnaire either from a lightweight web server (recommended for sharing) or directly from the file system (useful when offline).

### Option A: Local web server
1. Start a local web server from this directory:
   ```bash
   python -m http.server 8000
   ```
2. Open http://localhost:8000 in your browser.
3. Pick a protocol and click through the presented options. Use **Back** to revisit the previous step or **Reset** to start over.

### Option B: Offline / local file
1. Double-click `index.html` (or use `file:///path/to/index.html` in the address bar) to open it directly.
2. The app and data store run entirely in the browser; edits you make in **Admin** are saved to your local storage.
3. If you want to revert to the shipped defaults, click **Load defaults** in the admin page.

## Features
- Two sample protocols (Chest Pain, Structure Fire) with branching questions.
- Inline actions and outcomes to mirror ProQA-style instructions.
- Live transcript for clean handoff to responding units.
- Responsive layout with accessible buttons and keyboard focus states.
