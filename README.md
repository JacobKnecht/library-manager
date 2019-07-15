# Library Manager

Purpose  - The purpose of this application is to allow users to manage library
data. Users should be allowed to view the books within the library database, to
adds books to the database, as well as update and delete books within the
database.

Implementation - The application is implemented via leveraging the Sequelize
ORM to enable basic CRUD (create, read, update, delete) functionality. A model
representing book objects contains properties corresponding to book information
that is important to libraries (title, author, genre, year). The 'index.js' file
located at the top of the directory uses Express to implement various routes
that render Pug templates. These templates provide a full list of the library's
books, as well as forms to create books and update book information.
Additionally, the templates render error pages for server errors and 'not found'
errors. The application also provides pagination for the books list and a search
form to allow users to search for books based on title, author, genre or year.

Style Changes - The following is a list of the CSS classes and properties that
were changed to personalize the project (GitHub Markdown format):
1. body :  
* font-family: "Lucida Console", monospace;  
* background: #f5f5dc;
2. a :
* color: #cf2b0e;
3. .search-button :
* font-weight: bold;  
* margin-left: 10px;
4. a.button:hover, input[type=submit]:hover :
* background-color: #d65038;
5. li :
* display: inline-block;  
* margin-right: 10px; 
