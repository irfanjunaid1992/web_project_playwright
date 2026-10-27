const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

/**
 * Checks common installation paths for Google Chrome so the config can use it when available.
 *
 * @returns True when an installed Chrome executable can be located.
 */
function hasGoogleChrome() {
  const home = os.homedir();
  const candidates = process.platform === 'darwin'
    ? [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        path.join(home, 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
      ]
    : process.platform === 'win32'
      ? [
          path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Google/Chrome/Application/chrome.exe'),
          path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Google/Chrome/Application/chrome.exe'),
          path.join(process.env.LOCALAPPDATA || path.join(home, 'AppData/Local'), 'Google/Chrome/Application/chrome.exe')
        ]
      : (process.env.PATH || '').split(path.delimiter).flatMap((directory) =>
          ['google-chrome', 'google-chrome-stable', 'chrome'].map((name) => path.join(directory, name))
        );

  return candidates.some((candidate) => fs.existsSync(candidate));
}

/**
 * Runs a child command with inherited terminal output and returns its exit status.
 *
 * @param command Executable to launch.
 * @param args Arguments passed without shell interpolation.
 * @returns The command exit code, or a non-zero status when it could not start.
 */
function run(command, args) {
  const executable = process.platform === 'win32' && ['npm', 'npx'].includes(command)
    ? `${command}.cmd`
    : command;
  const result = spawnSync(executable, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env
  });

  if (result.error) {
    console.error(`Could not run ${command}: ${result.error.message}`);
    return 1;
  }

  return result.status ?? 1;
}

/**
 * Installs dependencies and Chromium, runs tests, and opens the Playwright HTML report.
 * The HTML reporter writes its report even when tests fail, and failures do not skip opening it.
 */
function main() {
  console.log('Installing project dependencies...');
  if (run('npm', ['install', '--no-fund']) !== 0) {
    return 1;
  }

  process.env.PLAYWRIGHT_CHROME_CHANNEL = hasGoogleChrome() ? 'chrome' : '';
  console.log(process.env.PLAYWRIGHT_CHROME_CHANNEL
    ? 'Google Chrome detected; tests will use the Chrome channel.'
    : 'Google Chrome not detected; tests will use bundled Chromium.');

  console.log('Installing the Playwright Chromium browser...');
  if (run('npx', ['playwright', 'install', 'chromium']) !== 0) {
    return 1;
  }

  if (run('npm', ['run', 'clean']) !== 0) {
    return 1;
  }

  const testExitCode = run('npm', ['test']);
  const openExitCode = run('npm', ['run', 'report:open']);

  return testExitCode || openExitCode;
}

process.exitCode = main();
