const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes.js');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

console.log(PORT);

// express app
const app = express();

// connect to MongoDB
const dbURI = process.env.DB_CON || process.env.MONGO_TOKEN;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    // listen for requests
    app.listen(PORT);
    console.log('connected to mongoDB');
  })
  .catch((err) => console.log('Error connecting to DB', err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
// Morgan is used for logging. Selected option: dev
app.use(morgan('dev'));

//accept form data
app.use(express.urlencoded({ extended: true }));

// Middleware used for logging
app.use((req, res, next) => {
  console.log('New request made:');
  console.log('> host: ', req.hostname);
  console.log('> path: ', req.path);
  console.log('> method: ', req.method);
  next();
});

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// use the defined blog routes
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
