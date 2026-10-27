# Playwright File Upload Framework

## Overview

This project is a small end-to-end automation framework for the file upload page at `https://the-internet.herokuapp.com/upload`. It verifies regular file-input uploads, Dropzone drag-and-drop uploads, and the application's response when the upload form is submitted without a file.

## Tech stack

- Node.js 20 or newer (the framework was verified with Node.js 24.16.0)
- TypeScript 5.9.3
- Playwright Test 1.64.1

`package-lock.json` pins these exact dependency versions.

## Prerequisites

- Node.js 20+ and npm
- Google Chrome is used when installed. Otherwise the bootstrap installs and uses Playwright's bundled Chromium.
- No graphical desktop session is required; browsers run in headless mode.

## Project structure

```text
.
├── src/
│   ├── fixtures/pageFixtures.ts  # Custom Playwright fixture and expect export
│   ├── pages/UploadPage.ts       # Upload page object and stable locators
│   └── utils/fileHelper.ts       # Real DataTransfer drag-and-drop helper
├── test-data/
│   ├── files/sample-upload.txt   # Small upload fixture
│   └── testData.ts               # Central paths, file names, and expected text
├── tests/upload.spec.ts          # The three upload scenarios
├── scripts/e2e.cjs               # Cross-platform one-command bootstrap and runner
├── playwright.config.ts          # Browser, timeout, trace, and reporter settings
├── package.json                  # Dependencies and npm scripts
├── package-lock.json             # Reproducible dependency versions
├── tsconfig.json                 # Strict TypeScript compiler settings
└── .gitignore                    # Generated reports, results, and dependencies
```

## Design notes

- **Page Object Model:** `UploadPage` owns selectors and user-level actions, while all assertions remain in the test spec.
- **Fixtures:** each test gets an isolated Playwright page, wrapped in a `UploadPage` fixture that navigates to the upload page.
- **Central test data:** test file paths, file names, routes, and expected application messages are defined in `test-data/testData.ts`.
- **Playwright HTML report:** the built-in HTML reporter creates a report after each test run, and the one-command runner opens it afterward.
- **Drag and drop:** the helper reads the local file bytes, creates a browser `File` and `DataTransfer`, and dispatches `dragenter`, `dragover`, and `drop`. Calling `setInputFiles()` alone bypasses those Dropzone handlers and would not test a true drop.
- **Browser selection:** the one-command runner prefers locally installed Google Chrome and otherwise falls back to Playwright's bundled Chromium. Both modes use a single Chromium project.

## Clone and run

Replace `<repository-url>` with the clone URL for this project:

```sh
git clone <repository-url> playwright-upload
cd playwright-upload
npm run e2e
```

`npm run e2e` installs npm dependencies and the Chromium browser, removes old results, runs all tests in headless mode, and opens the Playwright HTML report. The HTML report is opened even if a test fails, while the command preserves a non-zero test status. The report server stays in the foreground while the report is open; press Ctrl+C after reviewing it.

## Available npm scripts

| Script | Description |
|---|---|
| `npm run e2e` | One-command dependency/browser install, test run, and Playwright HTML report open |
| `npm test` | Run the Playwright scenarios |
| `npm run report:open` | Open the generated Playwright HTML report |
| `npm run clean` | Remove generated Playwright report and test results |

## Reports and traces

Playwright's HTML report is written to `playwright-report/` and opened automatically by `npm run e2e`. Failure traces are retained under `test-results/`; inspect one with:

```sh
npx playwright show-trace test-results/<test-artifact>/trace.zip
```

## Automated scenarios

| Scenario | Expected result |
|---|---|
| Upload a valid `.txt` file through the native file input | “File Uploaded!” heading and matching filename |
| Drop a valid `.txt` file into Dropzone | Matching preview filename and successful completed preview state |
| Submit with no file selected | “Internal Server Error” and “No file was chosen. Please choose a file to upload.” |

## Troubleshooting

- **Chrome not found:** this is supported; the runner installs Playwright's bundled Chromium and uses it instead.
- **Dropzone preview absent:** confirm the public page and its Dropzone script loaded, then inspect the failure trace. Network outages or changes to the site can prevent the asynchronous upload from completing.
