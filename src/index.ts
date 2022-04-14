import express from 'express';
import routes from './api/index';

const app = express();
const port = 3000;

app.use('/api', routes);

// Define static directories
app.use('/assets', express.static(__dirname + '/assets'));

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

export default app;
