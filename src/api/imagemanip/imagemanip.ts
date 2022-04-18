import express from 'express';
import getResizedImageAsync from '../../util/imagemaniputil';
import path from 'path';

const imagemanip = express.Router();

imagemanip.get('/', (req: express.Request, res: express.Response) => {
  // Check to see that all route parameters are present
  const params = req.query;
  const filename =
    params.filename == undefined ? 'undefined' : params.filename.toString();
  const width =
    params.width == undefined ? 'undefined' : params.width.toString();
  const height =
    params.height == undefined ? 'undefined' : params.height.toString();
  // Message information
  let code = 200;
  let message = 'Success';
  // All parameters are required
  if (
    filename === 'undefined' ||
    width === 'undefined' ||
    height === 'undefined'
  ) {
    code = 400;
    message =
      'Parameters are either not present or malformed. Correct paramters are filename=string, width=number, height=number<br/>';
    message +=
      'Your parameters: filename=' +
      filename +
      ' width=' +
      width +
      ' height=' +
      height;
  }
  // Non numberic width and height are not allowed
  // Negative or 0 values for width and height are not allowed
  if (width !== 'undefined' || height !== 'undefined') {
    const numWidth = Number(width);
    const numHeight = Number(height);
    if (isNaN(numWidth) || isNaN(numHeight)) {
      code = 400;
      message = '<br/>width and height must be numeric.';
    } else if (numWidth < 1 || numHeight < 1) {
      code = 400;
      message = '<br/>Width and height cannot be a negative or zero value';
    }
  }
  // If we have a handled exception, let the user know the sanitized results.
  if (code !== 200) {
    res.status(code).send(message);
    // If no expcetions were caught above, do the image resize.
  } else if (code === 200) {
    getResizedImageAsync(filename, Number(width), Number(height))
      .then((imgResponse) => {
        // Respond back with the resized image in an <img> tag
        const body =
          '<!DOCTYPE html><head><title>Image</title></head><body><img src="' +
          '/assets/resized/' +
          path.basename(imgResponse.getPath()) +
          '"></body></html>';
        res.status(code).send(body);
      })
      .catch(() => {
        // Catch any uncaught exceptions
        res.status(400).send('File not found.');
      });
  }
});

export default imagemanip;
