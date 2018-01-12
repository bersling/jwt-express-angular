import * as express from 'express';
import * as jwt from 'jsonwebtoken';
const cors = require('cors');
import * as bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

declare global {
  namespace Express {
    interface Request {
      decoded: any;
    }
  }
}

interface User {
  email: string,
  name: string,
  pw: string
}

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

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
const accountBalances = {
  'max@gmail.com': 53762,
  'lily@gmail.com': 4826
};

const getBalance = (email: string) => {
  return accountBalances[email];
};

const serverJWT_Secret = 'kpTxN=)7mX3W3SEJ58Ubt8-';

const validatePayloadMiddleware = (req, res, next) => {
  if (req.body) {
    next();
  } else {
    res.status(403).send({
      errorMessage: 'You need a payload'
    });
  }
};

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

const jwtMiddleware = (req, res, next) => {
  /**
   * In JWT it is convention that the token is provided to the server in the authorization header including a prefix,
   * separated by a space. The authorization header could be:
   * 'Token eyJhbGciOiJIUzI1NiIsInR...' or 'Bearer eyJhbGciOiJIUzI1NiIsInR...' or something like this.
   */
  const authString = req.headers['authorization'];
  if(typeof authString === 'string' && authString.indexOf(' ') > -1) {
    const authArray = authString.split(' ');
    const token = authArray[1];
    jwt.verify(token, serverJWT_Secret, (err, decoded) => {
      if(err) {
        res.sendStatus(403);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
}

app.get('/api/balance', jwtMiddleware, (req, res) => {
  const user: User = req.decoded;
  const balance = getBalance(user.email);
  if (balance) {
    res.status(200).send({
      balance: balance
    })
  } else {
    res.status(500);
  }
});

app.listen(5000, () => console.log('Server started on port 5000'));
