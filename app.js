require('dotenv').config();
require('./config/db').connect();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require("./middleware/auth");

const express = require('express');


// importing user content
const User = require('./model/user');

const app = express();

app.use(express.json());

app.post('/welcome', auth, (req, res) => {
  res.status(200).send({
    message: 'Welcome home'
  });
});

// Register
app.post('/register', async (req, res) => {
  // our register logic goes here...
  try {
    // Get the user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send({
        message:'All input is required!'
      });
    }

    // check if user already exists
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email: email.toLowerCase() });

    if (oldUser) {
      return res.status(409).send({
        message: 'User Already Exist. Please Login'
      });
    }

    // Encrypt User Password 
    encryptedPassword = await bcrypt.hash(password, 10);

    // create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // create signed JWT token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h"
      }
    );

    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);

  } catch (err) {
    console.log(err);
  }
  // logic ends here
});

// Login
app.post('/login', async (req, res) => {
  // our login logic starts here

  try {
    // Get user input
    const { email, password } = req.body;

    // validate user input
    if (!(email && password)) {
      res.status(400).send({
        message: 'All input is required!'
      });
    }
    // Validate if the user exiists
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // crreate a token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h'
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    } else {
      res.status(400).send({
        message: 'Invalid Credentials'
      });
  }

  } catch (error) {
    console.log(error);
  }
// Our register logic ends here
});

module.exports = app;
