import sharp from 'sharp';
import { promises as fsPromise } from 'fs';
import fsExists from 'fs.promises.exists';
import path from 'path';
import { ImageResponse } from '../class/ImageResponse';

const fullSizedDir = path.resolve('./assets/full');
const resizedDir = path.resolve('./assets/resized');

/**
 * Performs image resizing via the sharp library
 * @param filename Fully qualified path to the base image. Usually this resides in /assets/full
 * @param resizeFileName Fully qualified path to write the image to. Usually this resides in /assets/resized
 * @param width Width in pixels
 * @param height Height in pixels
 */
async function doResize(
  filename: string,
  resizeFileName: string,
  width: number,
  height: number
) {
  await sharp(filename)
    .resize(width, height)
    .toFile(resizeFileName)
    .catch((err) => {
      throw err;
    });
}

/**
 * Asynchronously resizes a given image
 * @param filename filename given by the user to resize
 * @param width Width of the image after resizing, in pixels
 * @param height Height of the image after resizing, in pixels
 * @returns An ImageResponse Promise containing the Metadata about the resized image, or a rejected Promise in case of an error.

 */
async function getResizedImageAsync(
  filename: string,
  width: number,
  height: number
): Promise<ImageResponse> {
  // First check for the existence of an assets directory. If not, create it and its subdirectories
  await fsPromise.mkdir(fullSizedDir, { recursive: true });
  await fsPromise.mkdir(resizedDir, { recursive: true });
  // First, check to see if the image has already been made
  const fullFileWithPath = path.join(fullSizedDir, filename);
  const resizedFileNameWithPath = path.join(
    resizedDir,
    path.parse(filename).name + '_' + width + 'x' + height + '.png'
  );
  console.log('DEBUG!');
  console.log({
    fullFileName: fullFileWithPath,
    resizedFileName: resizedFileNameWithPath,
  });
  // If the file exists, return the cached file
  const cachedExists = await fsExists(resizedFileNameWithPath);
  if (cachedExists) {
    const returnValue = new ImageResponse(resizedFileNameWithPath, true);
    return Promise.resolve(returnValue);
  }
  // If this does not exist, then use Sharp to resize the image
  await doResize(
    fullFileWithPath,
    resizedFileNameWithPath,
    width,
    height
  ).catch((err) => {
    return Promise.reject(err);
  });

  const returnValue = new ImageResponse(resizedFileNameWithPath, false);
  return Promise.resolve(returnValue);
}

export default getResizedImageAsync;
