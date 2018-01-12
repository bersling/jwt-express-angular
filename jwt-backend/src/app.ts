import * as express from 'express';
import * as jwt from 'jsonwebtoken';
const cors = require('cors');
import * as bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

const appUsers = {
  'max@gmail.com': {
    name: 'Max Miller',
    pw: '1234' // YOU DO NOT WANT TO STORE PW's LIKE THIS IN REAL LIFE - HASH THEM FOR STORAGE
  },
  'lily@gmail.com': {
    name: 'Lily Walter',
    pw: '1235' // YOU DO NOT WANT TO STORE PW's LIKE THIS IN REAL LIFE - HASH THEM FOR STORAGE
  }
};

app.post('/api/login', (req, res) => {

  if (req.body) {
    const user = appUsers[req.body.email];
    if (user && user.pw === req.body.password) {
      const userWithoutPassword = {...user};
      delete userWithoutPassword.pw;
      res.status(200).send(userWithoutPassword);
    } else {
      res.status(403).send({
        errorMessage: 'Permission denied!'
      });
    }
  } else {
    res.status(403).send({
      errorMessage: 'Please provide email and password'
    });
  }

});

app.listen(5000, () => console.log('Server started on port 5000'));
