import express from 'express';
import imagemanip from './imagemanip/imagemanip';

const routes = express.Router();

// Default route. Returns a 403 Forbidden error for now
routes.get('/', (req: express.Request, res: express.Response) => {
  res.status(403).send('FORBIDDEN');
});

routes.use('/imagemanip', imagemanip);

export default routes;
