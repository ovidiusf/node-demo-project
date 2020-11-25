const Blog = require('../models/blog.js');

// get all blogs
const blog_index = (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render('blogs/index', { title: 'Home', blogs: result });
    })
    .catch((err) => console.log(err));
};

//get a single blog details/complete information
const blog_details = async (req, res) => {
  // retrieve the id of the current blog
  const id = req.params.id;
  try {
    const result = await Blog.findById(id);
    res.render('blogs/details', { title: 'Blog Details', blog: result });
  } catch (err) {
    res.status(404).render('404', { title: 'Blog not found' });
  }
};

// get the create page blog
const blog_create_get = (req, res) => {
  res.render('blogs/create', { title: 'Create a new blog' });
};

// post a blog that was created
const blog_create_post = async (req, res) => {
  const blog = new Blog(req.body);
  try {
    const result = await blog.save();
    if (result) {
      res.redirect('/blogs');
    }
  } catch (err) {
    console.log(err);
  }
};

// delete a single blog
const blog_delete = async (req, res) => {
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
};

module.exports = {
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_delete
};
