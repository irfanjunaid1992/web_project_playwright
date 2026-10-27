import type { Locator, Page } from '@playwright/test';
import { testData } from '../../test-data/testData';
import { dispatchFileDrop } from '../utils/fileHelper';

/**
 * Encapsulates the upload page's locators and user-level upload actions.
 * Assertions are deliberately kept in the spec so the page object only describes behavior.
 */
export class UploadPage {
  /** Browser page controlled by this page object. */
  readonly page: Page;

  /** Native file input used by the regular multipart upload form. */
  readonly fileInput: Locator;

  /** Form submit control which starts the regular upload request. */
  readonly uploadButton: Locator;

  /** Dropzone element that accepts browser drag-and-drop events. */
  readonly dropzone: Locator;

  /** Preview container created by Dropzone for the uploaded file. */
  readonly dropzonePreview: Locator;

  /** Visible filename label inside the Dropzone preview. */
  readonly dropzoneFileName: Locator;

  /** Result heading shared by successful and unsuccessful form responses. */
  readonly resultHeading: Locator;

  /** Filename rendered by the successful form upload response. */
  readonly uploadedFiles: Locator;

  /** Error paragraph rendered when the form is submitted without a file. */
  readonly emptyUploadMessage: Locator;

  /**
   * Builds stable locators for the observed upload page DOM.
   *
   * @param page Playwright page provided by the custom fixture.
   */
  constructor(page: Page) {
    this.page = page;
    this.fileInput = page.locator('#file-upload');
    this.uploadButton = page.locator('#file-submit');
    this.dropzone = page.locator('#drag-drop-upload');
    this.dropzonePreview = this.dropzone.locator('.dz-preview');
    this.dropzoneFileName = this.dropzone.locator('.dz-preview .dz-filename [data-dz-name]');
    this.resultHeading = page.locator('h3');
    this.uploadedFiles = page.locator('#uploaded-files');
    this.emptyUploadMessage = page.getByText(testData.emptyUploadMessage, { exact: true });
  }

  /**
   * Opens the upload form using the route configured in centralized test data.
   */
  async goto(): Promise<void> {
    await this.page.goto(testData.uploadPath);
  }

  /**
   * Selects a local file through the page's native file input.
   *
   * @param filePath Absolute path to the upload file.
   */
  async uploadFileViaInput(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
  }

  /**
   * Submits the regular upload form.
   */
  async clickUpload(): Promise<void> {
    await this.uploadButton.click();
  }

  /**
   * Sends a real drag-and-drop sequence to the Dropzone target.
   *
   * @param filePath Absolute path to the file whose bytes are dropped.
   */
  async uploadFileViaDragAndDrop(filePath: string): Promise<void> {
    await dispatchFileDrop(this.dropzone, filePath);
  }

  /**
   * Reads the uploaded filename displayed by the form response.
   *
   * @returns The visible uploaded filename.
   */
  async getUploadedFileName(): Promise<string> {
    return this.uploadedFiles.innerText();
  }

  /**
   * Reads the response heading after a form submission.
   *
   * @returns The current response heading.
   */
  async getResultHeading(): Promise<string> {
    return this.resultHeading.innerText();
  }

  /**
   * Reads the file name displayed in the Dropzone preview.
   *
   * @returns The filename in the active preview.
   */
  async getDropzoneFileName(): Promise<string> {
    return this.dropzoneFileName.innerText();
  }

  /**
   * Checks whether Dropzone marks its current preview as successfully complete.
   *
   * @returns True when the preview has both success and completion state classes.
   */
  async isDropzoneUploadSuccessful(): Promise<boolean> {
    const previewClasses = (await this.dropzonePreview.getAttribute('class') ?? '').split(/\s+/);
    return previewClasses.includes(testData.dropzoneSuccessClass)
      && previewClasses.includes(testData.dropzoneCompleteClass);
  }
}
