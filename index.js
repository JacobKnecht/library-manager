//reqire statements
const express = require('express');
const path = require('path');
const Book = require('../models').Book;

//application variables
const app = express();
const port = 5000;

//set view engine to Pug
app.set('view engine', 'pug');

//set static resource location
app.use('/static', express.static(path.join(__dirname, 'public')));

//Home route
app.get('/', (req, res) => res.redirect('/books'));

//'/books' route shows the full list of books GET Book.findAll()
app.get('/books', (req, res) => {}); 

//'/books/new' route shows the 'create new book' form GET
app.get('/books/new', (req, res) => {
  res.render('new-book', {book: Book.build(), title: 'New Book'});
});

//'/books/new' route posts a new book to the database POST Book.create(req.body)
app.post('/books/new', (req, res) => {

});

//'/books/:id' route shows 'book detail' form GET
app.get('/books/:id', (req, res) => {});

//'/books/:id' route updates book info in the database POST
app.post('/books/:id', (req, res) => {});

//'/books/:id/delete route deletes a book (can't be undone, use test book)' POST
app.post('/books/:id/delete', (req, res) => {});

//404/'Not Found' route
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

//error handler route
app.use((err, req, res, next) => {
  console.log(`There was an error with the application: ${err}`);
});

//listen statement
app.listen(port, () => console.log(`application is listening on port ${port}`));
