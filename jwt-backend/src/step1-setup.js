const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

/**
 * Creating a new express app
 */
const app = express();

/**
 * Setting up CORS, such that it can work together with an Application at another domain / port
 */
app.use(cors());

/**
 * For being able to read request bodies
 */
app.use(bodyParser.json());

/**
 * Hello World Route, JWT-unrelated
 */
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.listen(5000, () => console.log('Server started on port 5000'));
