import { test as base, expect } from '@playwright/test';
import { UploadPage } from '../pages/UploadPage';

/** Fixture type supplied to each upload test. */
type UploadFixtures = {
  /** Navigated page object for the file upload application. */
  uploadPage: UploadPage;
};

/**
 * Extends Playwright's base test with a ready-to-use upload page object.
 */
export const test = base.extend<UploadFixtures>({
  /**
   * Creates the page object and opens the upload form before each dependent test.
   *
   * @param page Isolated Playwright page managed by the base fixture.
   * @param use Makes the initialized page object available to the test body.
   */
  uploadPage: async ({ page }, use) => {
    const uploadPage = new UploadPage(page);
    await uploadPage.goto();
    await use(uploadPage);
  }
});

/** Re-exports Playwright's assertion API alongside the custom test fixture. */
export { expect };
