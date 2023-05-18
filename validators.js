// MOVIE VALIDATORS :

const validateMovie = (req, res, next) => {
    // validate req.body then call next() if everything is ok
    const { title, director, year, color, duration } = req.body;
    const errors = [];

    if (title == null) {
        errors.push({ field: "title", message: "The field 'title' is required" });
        // res.status(422).send("The field 'title' is required");
    } else if (title.length >= 255) {
            errors.push({ field: "title", message: "Should contain less than 255 characters" });
            // res.status(422).send("The field 'title' is too long");
    }
    if (director == null) {
        errors.push({ field: "director", message: "The field 'director' is required" });
        // res.status(422).send("The field 'director' is required");
    }
    if (year == null) {
        errors.push({ field: "year", message: "The field 'year' is required" });
        // res.status(422).send("The field 'year' is required");
    }
    if (color == null) {
        errors.push({ field: "color", message: "The field 'color' is required" });
        // res.status(422).send("The field 'color' is required");
    }
    if (duration == null) {
        errors.push({ field: "duration", message: "The field 'duration' is required" });
        // res.status(422).send("The field 'duration' is required");
    }

    if (errors.length) {
        res.status(422).json({validationErrors: errors});
    } else {
        next();
    }
};


// USERS VALIDATORS :

const { body, validationResult } = require('express-validator');

const validateUser = [
    body("firstname").isLength({ max: 255 }).notEmpty().withMessage("Firstname is required"),
    body("lastname").isLength({ max: 255 }).notEmpty().withMessage("Lastname is required"),
    body("email").isEmail().notEmpty().withMessage("Email is required"),
    body("city").isLength({ min: 3, max: 255 }),
    body("language").isLength({ max: 255 }),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ validationErrors: errors.array() });
        } else {
        next();
        }
    },
];


module.exports = {
    validateMovie,
    validateUser,
};