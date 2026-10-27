import path from 'node:path';

/** Centralized names, routes, and expected application text used by tests and page objects. */
export const testData = {
  /** Relative upload route resolved against the configured base URL. */
  uploadPath: '/upload',
  /** Fixture file name used by both upload mechanisms. */
  sampleFileName: 'sample-upload.txt',
  /** Absolute path keeps file selection independent from the current working directory. */
  sampleFilePath: path.resolve(__dirname, 'files', 'sample-upload.txt'),
  /** Heading rendered after a successful form-based upload. */
  uploadedHeading: 'File Uploaded!',
  /** Heading rendered by the server when the upload form is submitted empty. */
  emptyUploadHeading: 'Internal Server Error',
  /** Exact server response shown after submitting without a selected file. */
  emptyUploadMessage: 'No file was chosen. Please choose a file to upload.',
  /** HTTP status returned by the live application for an empty form submission. */
  emptyUploadStatus: 200,
  /** Heading on the initial upload page. */
  uploadPageHeading: 'File Uploader',
  /** Stable success class applied by Dropzone after it completes a successful upload. */
  dropzoneSuccessClass: 'dz-success',
  /** Completion class applied alongside the Dropzone success class. */
  dropzoneCompleteClass: 'dz-complete',
} as const;
