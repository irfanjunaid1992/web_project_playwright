import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Locator } from '@playwright/test';

/**
 * Dispatches browser-native drag events carrying a real File through DataTransfer.
 * setInputFiles() assigns an input's files directly and does not exercise a drop target's
 * dragenter/dragover/drop handlers, so it cannot verify a true drag-and-drop workflow.
 *
 * @param dropTarget Dropzone element that receives the browser drag events.
 * @param filePath Absolute path to the file whose bytes should be transferred.
 */
export async function dispatchFileDrop(dropTarget: Locator, filePath: string): Promise<void> {
  const fileBytes = await readFile(filePath);
  const payload = {
    fileName: path.basename(filePath),
    mimeType: 'text/plain',
    bytes: Array.from(fileBytes)
  };

  await dropTarget.evaluate((element, filePayload) => {
    const dataTransfer = new DataTransfer();
    const file = new File(
      [new Uint8Array(filePayload.bytes)],
      filePayload.fileName,
      { type: filePayload.mimeType }
    );
    dataTransfer.items.add(file);

    for (const eventName of ['dragenter', 'dragover', 'drop']) {
      element.dispatchEvent(new DragEvent(eventName, {
        bubbles: true,
        cancelable: true,
        dataTransfer
      }));
    }
  }, payload);
}
