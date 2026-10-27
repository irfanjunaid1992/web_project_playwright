import { testData } from '../test-data/testData';
import { expect, test } from '../src/fixtures/pageFixtures';

/**
 * Covers the three observed upload behaviors: form success, Dropzone success, and empty submission.
 */
test.describe('File Upload', () => {
  test('should upload a valid txt file using file input', async ({ uploadPage }) => {
    await test.step('Select the sample text file', async () => {
      await uploadPage.uploadFileViaInput(testData.sampleFilePath);
    });

    await test.step('Submit the file and verify the result', async () => {
      await uploadPage.clickUpload();
      await expect(uploadPage.resultHeading).toHaveText(testData.uploadedHeading);
      await expect(uploadPage.uploadedFiles).toHaveText(testData.sampleFileName);
    });
  });

  test('should upload a valid txt file using drag and drop', async ({ uploadPage }) => {
    await test.step('Drop the sample text file into the upload zone', async () => {
      await uploadPage.uploadFileViaDragAndDrop(testData.sampleFilePath);
    });

    await test.step('Verify the preview filename and success state', async () => {
      await expect(uploadPage.dropzoneFileName).toHaveText(testData.sampleFileName);
      await expect.poll(() => uploadPage.isDropzoneUploadSuccessful()).toBe(true);
    });
  });

  test('should show the application error when no file is selected', async ({ uploadPage }) => {
    await test.step('Submit the upload form without selecting a file', async () => {
      const uploadResponse = uploadPage.page.waitForResponse((response) =>
        new URL(response.url()).pathname === testData.uploadPath
        && response.request().method() === 'POST'
      );
      await uploadPage.clickUpload();
      const response = await uploadResponse;
      expect(response.status()).toBe(testData.emptyUploadStatus);
    });

    await test.step('Verify the observed server error response', async () => {
      await expect(uploadPage.resultHeading).toHaveText(testData.emptyUploadHeading);
      await expect(uploadPage.emptyUploadMessage).toBeVisible();
    });
  });
});
