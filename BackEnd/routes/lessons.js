var express = require('express');
var router = express.Router();

// Get lessons
router.get('/', function (req, res, next) {

    // Query database
    const queryNames = req.db.from('lessons').select()
    const lessons = []

    // Throw error if there is a query in the URL
    if (Object.keys(req.query).length !== 0) {
        return res.status(400).json({ "error": true, "message": "Invalid query parameters. Query parameters are not permitted." })
    }

    // Put names into array
    queryNames.then((lesson) => {
        // Map into array
        lesson.map((lessonObj) => {
            lessons.push(lessonObj)
        })
    }).then(() => {
        return res.status(200).json(lessons)
    })
});

// Get coaches
router.get('/:id', function (req, res, next) {

    // Get id
    const id = req.params.id;

    // Query database
    const queryLessons = req.db.from('lessons').select().where("lessonId", '=', id)
    const lessonArray = []

    // Throw error if there is a query in the URL
    if (Object.keys(req.query).length !== 0) {
        return res.status(400).json({ "error": true, "message": "Invalid query parameters. Query parameters are not permitted." })
    }

    // Put names into array
    queryLessons.then((lessons) => {
        // Map into array
        lessons.map((nameObj) => {
            lessonArray.push(nameObj)
        })
    }).then(() => {
        return res.status(200).json(lessonArray)
    })
});


module.exports = router;
