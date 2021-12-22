const express = require('express');  // import express framework
const app = express(); // initialize express app

app.set('view engine', 'ejs') // set the view engine / templating tool the app is going to use
// there are many different templating tools can be used like handlebars, nunjucks, etc.

app.get('/', (req, res) => {
    res.render('home') // same as return render_template('home') in flask
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})