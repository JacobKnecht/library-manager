//reqire statements
const express = require('express');
const path = require('path');

//application variables
const app = express();
const port = 5000;

//set view engine to Pug
app.set('view engine', 'pug');

//set static resource location
app.use('/static', express.static(path.join(__dirname, 'public')));

//listen statement
app.listen(port, () => console.log(`application is listening on port ${port}`));  
