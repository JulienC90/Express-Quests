require("dotenv").config();
const express = require("express");

const app = express();


app.use(express.json());

const port = process.env.APP_PORT ?? 4000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const { validateMovie, validateUser } = require("./validators.js");

// GET ROUTES
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", movieHandlers.getUsers);
app.get("/api/users/:id", movieHandlers.getUserById);


// POST ROUTES
app.post("/api/movies", validateMovie, movieHandlers.postMovie);

app.post("/api/users", validateUser, movieHandlers.postUser);


// PUT ROUTES
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);

app.put("/api/users/:id", validateUser, movieHandlers.updateUser);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
