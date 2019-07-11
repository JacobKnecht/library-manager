//reqire statements
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./models').sequelize;
const Book = require('./models').Book;

//application variables
const app = express();
const port = 3000;
const op = sequelize.Op;

//body parser to read form body data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//set view engine to Pug
app.set('view engine', 'pug');

//set static resource location
app.use('/static', express.static(path.join(__dirname, 'public')));

//Home route - redirects to full list of books
app.get('/', (req, res) => res.redirect('/books/pages/1'));

//'/books' route - shows the full list of books
app.get('/books/pages/:page', (req, res, next) => {
  const books = [];
  let page = req.params.page;
  let limit = 5;
  let offset = limit * (page - 1);
  Book.findAndCountAll({raw: true, limit: limit, offset: offset})
    .then(libraryData => {
      let numberOfPages = Math.ceil(libraryData.count / limit);
      for(let book in libraryData.rows) {
        books.push(libraryData.rows[book]);
      }
      res.render('index', {books: books, title: 'All Books', pages: numberOfPages});
    })
    .catch(err => {
      const error = new Error('Server Error');
      error.status = 500;
      next(error);
    })
});

//'/books/search' route - provides search functionality
app.get('/books/search', (req, res) => {
  let searchTerm = req.query.term;
  searchTerm = searchTerm.toLowerCase();
  Book.findAll({
    raw: true,
    where: {
      [op.or]: [
        {
          title: { [op.like]: `%${searchTerm}%` }
        }, //title
        {
          author: { [op.like]: `%${searchTerm}%` }
        }, //author
        {
          genre: { [op.like]: `%${searchTerm}%` }
        }, //genre
        {
          year: { [op.like]: `%${searchTerm}%` }
        } //year
      ]
    }
  })
    .then(searchData => {
      //render the search results here
      console.log(typeof searchData);
    })
    .catch(err => {
      const error = new Error('Server Error');
      error.status = 500;
      next(error);
    })
})

//'/books/new' route - shows the 'create new book' form
app.get('/books/new', (req, res) => {
  res.render('new-book', {book: Book.build(), title: 'New Book'});
});

//'/books/new' route - posts a new book to the database
app.post('/books/new', (req, res, next) => {
  Book.create(req.body)
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      if(err.name === 'SequelizeValidationError') {
        res.render('new-book', {
          book: Book.build(req.body),
          title: 'New Book',
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      const error = new Error('Server Error');
      error.status = 500;
      next(error);
    })
});

//'/books/:id' route - shows 'book detail' (update book) form
app.get('/books/:id', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      res.render('update-book', {book: book, title: book.title});
    })
    .catch(err => {
      const error = new Error('Server Error');
      error.status = 500;
      next(error);
    })
});

//'/books/:id' route - updates book info in the database
app.post('/books/:id', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => book.update(req.body))
    .then(book => res.redirect('/'))
    .catch(err => {
      if(err.name === 'SequelizeValidationError') {
        let book = Book.build(req.body);
        book.id = req.params.id;
        res.render('update-book', {
          book: book,
          title: book.title,
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      const error = new Error('Server Error');
      error.status = 500;
      next(error);
    })
});

//'/books/:id/delete route - deletes a book
app.post('/books/:id/delete', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => book.destroy())
    .then(book => res.redirect('/'))
    .catch(err => {
      const error = new Error('Server Error');
      error.status = 500;
      next(error);
    })
});

//Handler to ignore requests for favicon.ico
//such requests were triggering the 404 'not found' middleware though the
//browser would render correctly matched routes
app.get('/favicon.ico', (req, res) => res.status(204));

//404/'Not Found' route
app.use((req, res, next) => {
  const error = new Error('Page Not Found');
  error.status = 404;
  res.render('page-not-found', {error});
});

//error handler route
app.use((err, req, res, next) => {
  res.render('error', {error: err});
  console.log(`There was an error with the application: ${err}`);
});

//listen statement - needs to occur after Book table has been created
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`application is listening on port ${port}`);
  });
});
