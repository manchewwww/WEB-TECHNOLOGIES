const express = require('express');
const app = express();
app.use(express.json());

let movies = [
    { id: 1, title: 'Inception', director: 'Christopher Nolan', year: 2010 },
    { id: 2, title: 'The Matrix', director: 'The Wachowskis', year: 1999 },
    { id: 3, title: 'The Day After Tomorrow', director: 'Roland Emmerich', year: 2004 },
    { id: 4, title: 'Grown Ups', director: 'Dennis Dugan', year: 2010 },
    { id: 5, title: 'The Godfather', director: 'Francis Ford Coppola', year: 1972 }
  ];  

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.post('/movies', (req, res) => {
  const newMovie = {
    id: movies.length + 1,
    title: req.body.title,
    director: req.body.director,
    year: req.body.year,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Movie API is running at http://localhost:${PORT}`);
  console.log(`All movies at http://localhost:${PORT}/movies`);
});
