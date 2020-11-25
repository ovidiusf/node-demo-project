const express = require('express');
const router = express.Router();
const Blog = require('../models/blog.js');

// blog routes
router.get('/', (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render('index', { title: 'Home', blogs: result });
    })
    .catch((err) => console.log(err));
});

router.get('/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

router.get('/:id', async (req, res) => {
  // retrieve the id of the current blog
  const id = req.params.id;
  try {
    const result = await Blog.findById(id);
    res.render('details', { title: 'Blog Details', blog: result });
  } catch (err) {
    console.log(err);
  }
});

router.post('/', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  // retrieve the id of the current blog
  const id = req.params.id;

  try {
    await Blog.findByIdAndDelete(id);
    // redirect in the browser by sending a json
    res.json({
      redirect: '/blogs'
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
