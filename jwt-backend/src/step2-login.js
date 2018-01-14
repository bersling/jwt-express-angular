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


/**
 * Some hardcoded users to make the demo work
 */
const appUsers = {
  'max@gmail.com': {
    email: 'max@gmail.com',
    name: 'Max Miller',
    pw: '1234' // YOU DO NOT WANT TO STORE PW's LIKE THIS IN REAL LIFE - HASH THEM FOR STORAGE
  },
  'lily@gmail.com': {
    email: 'lily@gmail.com',
    name: 'Lily Walter',
    pw: '1235' // YOU DO NOT WANT TO STORE PW's LIKE THIS IN REAL LIFE - HASH THEM FOR STORAGE
  }
};

/**
 * Secret Encryption Key
 */
const serverJWT_Secret = 'kpTxN=)7mX3W3SEJ58Ubt8-';

/**
 * Middleware to check that a payload is present
 */
const validatePayloadMiddleware = (req, res, next) => {
  if (req.body) {
    next();
  } else {
    res.status(403).send({
      errorMessage: 'You need a payload'
    });
  }
};

/**
 * Log the user in.
 * User needs to provide pw and email, this is then compared to the pw in the "database"
 * If pw and email match, the user is fetched from the database.
 * Then the JWT-magic happens, where the jwt.sign function takes a JSON and a secret key (string) as an input,
 * and returns a token (string).
 * Finally the user and the generated token are returned from the request.
 */
app.post('/api/login', validatePayloadMiddleware, (req, res) => {
  const user = appUsers[req.body.email];
  if (user && user.pw === req.body.password) {
    const userWithoutPassword = {...user};
    delete userWithoutPassword.pw;
    const token = jwt.sign(userWithoutPassword, serverJWT_Secret); // <==== The all-important "jwt.sign" function
    res.status(200).send({
      user: userWithoutPassword,
      token: token
    });
  } else {
    res.status(403).send({
      errorMessage: 'Permission denied!'
    });
  }
});

app.listen(5000, () => console.log('Server started on port 5000'));
