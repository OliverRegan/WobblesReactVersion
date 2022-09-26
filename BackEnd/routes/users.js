var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get updates
router.post('/signup', function (req, res, next) {

  // Test request params
  if (!req.body.username || !req.body.contact || !req.body.email || !req.body.password) {
    return res.status(400).json({
      "error": true,
      "message": "Request body incomplete, username, contact, email and password are required"
    })
  }

  // Otherwise assign variables from request body
  const username = req.body.username;
  const email = req.body.email;
  const contact = req.body.contact;

  // Salt password for security
  const saltRounds = 10;
  const hash = bcrypt.hashSync(req.body.password, saltRounds);

  // prep db query for users and to insert user
  const queryUsers = req.db.from('users').select('*').where("userName", "=", username)
  const insertUser = req.db.insert({ 'userName': username, 'userContact': contact, "userEmail": email, "userPassword": hash }).into('users')

  // Throw error if there is a query in the URL
  // if (Object.keys(req.query).length !== 0) {
  //   return res.status(400).json({ "error": true, "message": "Invalid query parameters. Query parameters are not permitted." })
  // }

  console.log(req.body)

  queryUsers.then((users) => {
    // If user does not exist insert user
    if (users.length === 0) {
      insertUser.then(() => {
        return res.status(201).json({ "message": "User created" })
      })
    }
    // User already exists, throw error
    else {
      return res.status(409).json({
        "error": true,
        "message": "User already exists"
      })
    }
  }).then(() => {
    console.log("Successfully inserted user")
  })


});
// Get updates
router.post('/login', function (req, res, next) {

  // Test request params
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      "error": true,
      "message": "Request body incomplete, username and password are required"
    })
  }

  // Otherwise assign variables from request body
  const username = req.body.username;

  // Salt password for security
  const saltRounds = 10;
  const hash = bcrypt.hashSync(req.body.password, saltRounds);

  // prep db query for users and to insert user
  const queryUsers = req.db.from('users').select('*').where("userName", "=", username)

  queryUsers.then((users) => {
    // If user does not exist insert user
    if (users.length === 0) {
      return res.status(409).json({
        "error": true,
        "message": "User doesn't exists"
      })
    }
    // User exists, test if passwords are the same
    else {
      const user = users[0];
      let match = bcrypt.compare(req.body.password, user.userPassword)
      match.then((match) => {
        // if no match
        if (!match) {
          console.log("Passwords don't match");
          return res.status(401).json({
            "error": true,
            "message": "Incorrect username or password"
          })
        }

        // else passwords match
        const expires_in = 60 * 60 * 24;
        const exp = Date.now() + expires_in * 1000
        const token = jwt.sign({ username, exp }, res.locals.secretKey)

        console.log(token, expires_in)
        return res.status(200).json({ token_type: "Bearer", token, expires_in, messsage: "Successfully logged in" })
      })
    }
  }).then(() => {
    console.log("Successfully inserted user")
  })


});
// Get updates
router.get('/profile', function (req, res, next) {

  const jwt = req.headers.authorization;
  const username = res.locals.tokenState[0]

  // Check authorization and respond accordingly
  // If 1 then they are authorized
  if (res.locals.tokenState[1] === 1) {
    // prep db query for users and to insert user
    const queryUsers = req.db.from('users').select('*').where("userName", "=", username)
    queryUsers.then((users) => {
      // If user does not exist insert user
      if (users.length === 0) {
        return res.status(409).json({
          "error": true,
          "message": "User doesn't exist"
        })
      }
      // User exists, Get data and return
      else {

        const user = users[0];

        const querySkaters = req.db.from('skaters').select('*').where("skaterAssociatedUserId", '=', user.userId)

        querySkaters.then((skaters) => {

          return res.status(200).json({ "username": user.userName, "email": user.userEmail, "contact": user.userContact, "skaters": skaters })

        })

      }
    }).then(() => {
      console.log("Successfully inserted user")
    })
  } else {
    return res.status(403).json({ "error": true, "message": "Unauthorized" })
  }

});


// Get updates
router.post('/addSkater', function (req, res, next) {

  // Test authentication
  if (!req.headers.authorization) {
    return res.status(400).json({
      "error": true,
      "message": "Request header incomplete, authorization required"
    })
  }
  const username = res.locals.tokenState[0]
  // Check authorization and respond accordingly
  // If 1 then they are authorized
  if (res.locals.tokenState[1] === 1) {
    // prep db query for users and to insert user

    const queryUsers = req.db.from('users').select('userId').where("userName", "=", username)


    queryUsers.then((users) => {
      const addSkater = req.db.insert({ 'skaterName': req.body.firstName, 'skaterLastName': req.body.lastName, "skaterDOB": req.body.dob, "skaterAssociatedUserId": users[0].userId, "skaterEmergencyContact": req.body.contact }).into('skaters')


      addSkater.then((skater) => {
        return res.status(200).json({ "error": false, "message": "Skater added suuccessfully" })
      })

    })

  } else {
    return res.status(403).json({ "error": true, "message": "Unauthorized" })
  }

});

// Get skaters
router.post('/getSkaters', function (req, res, next) {

  // Test authentication
  if (!req.headers.authorization) {
    return res.status(400).json({
      "error": true,
      "message": "Request header incomplete, authorization required"
    })
  }
  const username = res.locals.tokenState[0]
  // Check authorization and respond accordingly
  // If 1 then they are authorized
  if (res.locals.tokenState[1] === 1) {
    // prep db query for users and to insert user

    const queryUsers = req.db.from('users').select('userId').where("userName", "=", username)


    queryUsers.then((users) => {
      const addSkater = req.db.insert({ 'skaterName': req.body.firstName, 'skaterLastName': req.body.lastName, "skaterDOB": req.body.dob, "skaterAssociatedUserId": users[0].userId, "skaterEmergencyContact": req.body.contact }).into('skaters')


      addSkater.then((skater) => {
        return res.status(200).json({ "error": false, "message": "Skater added suuccessfully" })
      })

    })

  } else {
    return res.status(403).json({ "error": true, "message": "Unauthorized" })
  }

});

module.exports = router;