import { promises as fsPromise } from 'fs';
import fsExists from 'fs.promises.exists';
import path from 'path';
import getResizedImageAsync from '../../util/imagemaniputil';
import { ImageResponse } from '../../class/ImageResponse';

describe('Image Manipulation Tests', () => {
  const fullAssetFolder = path.resolve('./assets/full');
  const resizedAssetFolder = path.resolve('./assets/resized');
  const testFileName = path.resolve(
    './src/assets/full/WikimediaCommonsArcticFox.jpg'
  );
  let filename: string;
  let resizedFileName: string;

  beforeAll(async () => {
    // First check for the existence of an assets directory. If not, create it and its subdirectories
    await fsPromise.mkdir(fullAssetFolder, { recursive: true });
    await fsPromise.mkdir(resizedAssetFolder, { recursive: true });
    await fsPromise.copyFile(
      testFileName,
      fullAssetFolder + '/WikimediaCommonsArcticFox.jpg'
    );
    filename = '/WikimediaCommonsArcticFox.jpg';
    resizedFileName = path.parse(filename).name + '_' + '1070x686.png';
  });

  it('Does the test file exist in /assets/full?', async () => {
    const result = await fsExists(path.join(fullAssetFolder, filename));
    expect(result).toBeTrue();
  });

  it('Image processing fails with exception on a non-existent file', async () => {
    await expectAsync(
      getResizedImageAsync('nonexistentfile.jpg', 200, 200)
    ).toBeRejectedWithError();
  });

  it('Image processing succeeds with a resize to 1070x686', async () => {
    const response = new ImageResponse(
      path.join(resizedAssetFolder, resizedFileName),
      false
    );
    const reportResponse = await getResizedImageAsync(filename, 1070, 686);
    expect(response.getPath()).toEqual(reportResponse.getPath());
    expect(reportResponse.isCached()).toBeFalse();
  });

  it('Resized image exists in /assets/resized?', async () => {
    await expectAsync(
      fsExists(path.join(resizedAssetFolder, resizedFileName))
    ).toBeResolvedTo(true);
  });

  it('Calling original image with original parameters returns the cached file', async () => {
    const response = new ImageResponse(
      path.join(resizedAssetFolder, resizedFileName),
      true
    );
    const reportResponse = await getResizedImageAsync(filename, 1070, 686);
    expect(response.getPath()).toEqual(reportResponse.getPath());
    expect(reportResponse.isCached()).toBeTrue();
  });

  afterAll(() => {
    fsPromise.unlink(path.join(fullAssetFolder, filename)).then(() => {
      console.log('Removed temporary file from out directory');
    });
    fsPromise
      .unlink(path.join(resizedAssetFolder, resizedFileName))
      .then(() => {
        console.log('Removed temporary resized file.');
      });
  });
});
