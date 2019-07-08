//reqire statements
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./models').sequelize;
const Book = require('./models').Book;

//application variables
const app = express();
const port = 3000;

//body parser to read form body data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//set view engine to Pug
app.set('view engine', 'pug');

//set static resource location
app.use('/static', express.static(path.join(__dirname, 'public')));

//Home route
app.get('/', (req, res) => res.redirect('/books'));

//'/books' route shows the full list of books GET Book.findAll()
app.get('/books', (req, res) => {
  const books = [];
  Book.findAll({raw: true})
    .then(data => {
      for(let prop in data) {
        books.push(data[prop]);
      }
      console.log(books);
      res.render('index', {books: books, title: 'All Books'});
    })
});

//'/books/new' route shows the 'create new book' form GET
app.get('/books/new', (req, res) => {
  res.render('new-book', {book: Book.build(), title: 'New Book'});
});

//'/books/new' route posts a new book to the database POST Book.create(req.body)
app.post('/books/new', (req, res) => {
  Book.create(req.body).then(newBook => {
    console.log(req.body);
    res.redirect('/books');
  });
});

//'/books/:id' route shows 'book detail' (update-book view) form GET
app.get('/books/:id', (req, res) => {
  Book.findByPk(req.params.id)
    .then(book => {
      res.render('update-book', {book: book, title: book.title});
    })
});

//'/books/:id' route updates book info in the database POST
app.post('/books/:id', (req, res) => {
  Book.findByPk(req.params.id)
    .then(book => book.update(req.body))
    .then(book => res.redirect('/books'))
});

//'/books/:id/delete route deletes a book (can't be undone, use test book)' POST
app.post('/books/:id/delete', (req, res) => {});

//Handler to ignore requests for favicon.ico
//such requests were triggering the 404 'not found' middleware though the
//browser would render correctly matched routes
app.get('/favicon.ico', (req, res) => res.status(204));

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

//listen statement - needs to occur after Book table has been created
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`application is listening on port ${port}`);
  });
});
