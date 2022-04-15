import express from 'express';
import routes from './api/index';
import path from 'path';

const app = express();
const port = 3000;

app.use('/api', routes);

// Define static directories
app.use('/assets', express.static(path.resolve(__dirname, '../assets')));

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

export default app;
