const express = require('express');  // import express framework
const app = express(); // initialize express app

app.set('view engine', 'ejs') // set the view engine / templating tool the app is going to use
// there are many different templating tools can be used like handlebars, nunjucks, etc.

app.get('/', (req, res) => {
    res.render('home') // same as return render_template('home') in flask
})

app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    res.render('subreddit', { subreddit });
})

app.get('/random', (req, res) => {
    const random = Math.floor(Math.random() * 10) + 1;
    res.render('random', { random }); // render variable random to be used in the template
})
app.listen(3000, () => {
    console.log('Listening on port 3000');
})