const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog.js');
const { render } = require('ejs');
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

// blog routes
app.get('/blogs', (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render('index', { title: 'Home', blogs: result });
    })
    .catch((err) => console.log(err));
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

app.get('/blogs/:id', async (req, res) => {
  // retrieve the id of the current blog
  const id = req.params.id;
  try {
    const result = await Blog.findById(id);
    res.render('details', { title: 'Blog Details', blog: result });
  } catch (err) {
    console.log(err);
  }
});

app.post('/blogs', async (req, res) => {
  const blog = new Blog(req.body);
  try {
    const result = await blog.save();
    if (result) {
      res.redirect('/blogs');
    }
  } catch (err) {
    console.log(err);
  }
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
