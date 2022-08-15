var express = require('express');
var router = express.Router();

// Get updates
router.get('/:id', function (req, res, next) {

  // Query database
  const queryUsers = req.db.from('users').select().where("userId", "=", req.params.id)
  console.log(req.params.id)
  const users = []

  // Throw error if there is a query in the URL
  if (Object.keys(req.query).length !== 0) {
    return res.status(400).json({ "error": true, "message": "Invalid query parameters. Query parameters are not permitted." })
  }

  queryUsers.then((update) => {
    // Map into array
    update.map((updateObj) => {
      users.push(updateObj)
    })
  }).then(() => {
    return res.status(200).json(users)
  })
});

module.exports = router;