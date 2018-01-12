import * as express from 'express';
import * as jwt from 'jsonwebtoken';

const app = express();

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.listen(5000, () => console.log('Server started on port 5000'));
