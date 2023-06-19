const database = require("./database.js");

// GET => USERS
const getUsers = (req, res) => {
    // id, firstname, lastname, email, city, language
    database
    .query("SELECT * FROM users")
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
  }
  
// GET => USER WITH ID
const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
   // id, firstname, lastname, email, city, language
    database
    .query("SELECT * FROM users WHERE id = ?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

// GET => USER WITH EMAIL (POST ROUTE)
const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
    const { email } = req.body;

    database
    .query("SELECT * FROM users WHERE email = ?", [email])
    .then(([users]) => {
      if (users[0] != null) {
        req.user = users[0];

        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    })
}

// POST => USER
const postUser = (req, res) => {
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;
  
    database
      .query(
        "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
        [firstname, lastname, email, city, language, hashedPassword]
      )
      .then(([result]) => {
        res.location(`/api/users/${result.insertId}`).sendStatus(201);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving user");
      });
};

// UPDATE => USERS (BY ID)

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;
    if (id !== req.payload.sub) {
      res.sendStatus(403);
      return;
    }

    database
      .query(
        "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ?, hashedPassword = ? WHERE id = ?",
        [firstname, lastname, email, city, language, hashedPassword, id]
      )
      .then(([result]) => {
        if (result.affectedRows !== 0) {
          res.sendStatus(204);
        } else {
          res.status(404).send("Not Found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error updating the user");
      })
  }


  const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    if (id !== req.payload.sub) {
      res.sendStatus(403);
      return;
    }
  
    database
      .query("DELETE FROM users WHERE id = ?", [id])
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error deleting the user");
      })
  }

  module.exports = {
    getUsers,
    getUserById,
    getUserByEmailWithPasswordAndPassToNext,
    postUser,
    updateUser,
    deleteUser
  }