import supertest from 'supertest';
import app from '../../index';
import path from 'path';
import { promises as fsPromise } from 'fs';

const request = supertest(app);

describe('Endpoint Testing Suite', () => {
  let filename: string;
  let width: string;
  let height: string;
  const fullAssetFolder = path.resolve('./assets/full');
  const resizedAssetFolder = path.resolve('./assets/resized');
  const testFileName = path.resolve(
    './src/assets/full/WikimediaCommonsArcticFox.jpg'
  );
  describe('Endpoint Status Code Responses', () => {
    beforeAll(async () => {
      await fsPromise.copyFile(
        testFileName,
        fullAssetFolder + '/WikimediaCommonsArcticFox.jpg'

      );
    });
    beforeEach(() => {
      width = '300';
      height = '300';
      filename = 'WikimediaCommonsArcticFox.jpg';
    });
    it('Call to /api returns a 403', async () => {
      const response = await request.get('/api');
      expect(response.status).toBe(403);
    });
    it('Call to /api/imagemanip with correct params returns a 200 response', async () => {
      const response = await request.get(
        '/api/imagemanip?filename=' +
          filename +
          '&width=' +
          width +
          '&height=' +
          height
      );
      expect(response.status).toBe(200);
    });
    it('Call to /api/imagemanip with non-numeric params returns a 400 response', async () => {
      width = 'nonnumeric';
      height = 'nonnumeric';
      const response = await request.get(
        '/api/imagemanip?filename=' +
          filename +
          '&width=' +
          width +
          '&height=' +
          height
      );
      expect(response.status).toBe(400);
    });
    it('Call to /api/imagemanip with no params generates a 400 response.', async () => {
      const response = await request.get('/api/imagemanip');
      expect(response.status).toBe(400);
    });
    it('Call to /api/imagemanip with 0 or negative parameters for width and height generates a 400 response.', async () => {
      width = '-30';
      height = '0';
      const response = await request.get(
        '/api/imagemanip?filename=' +
          filename +
          '&width=' +
          width +
          '&height=' +
          height
      );
      expect(response.status).toBe(400);
    });

    afterAll(async () => {
      fsPromise.unlink(path.join(fullAssetFolder, filename)).then(() => {
        console.log('Removed temporary file from out directory');
      });
      fsPromise
        .unlink(
          path.join(resizedAssetFolder, 'WikimediaCommonsArcticFox_300x300.png')
        )
        .then(() => {
          console.log('Removed temporary resized file.');
        });
    });
  });
});
