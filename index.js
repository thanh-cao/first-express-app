const express = require('express');  // import express framework
const app = express(); // initialize express app
const path = require('path');
const redditData = require('./data.json');
const methodOverride = require('method-override')
const { v4: uuid } = require('uuid'); //For generating ID's using uuid version 4

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));    //To parse form data in POST request body
app.use(express.json());    // To parse incoming JSON in POST request body
app.use(methodOverride('_method'));     // To 'fake' put/patch/delete requests

// Views folder and EJS setup:
app.set('view engine', 'ejs'); // set the view engine / templating tool the app is going to use
// there are many different templating tools can be used like handlebars, nunjucks, etc.
app.set('views', path.join(__dirname, 'views')); // create an absolute path


// --------------------------------------------------
// First part: routes / template / passing variable
// --------------------------------------------------

app.get('/', (req, res) => {
    res.render('home') // same as return render_template('home') in flask
})

app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    const data = redditData[subreddit];
    if (data) {
        res.render('subreddit', { ...data });
    } else {
        res.render('notfound', { subreddit });
    }
})

app.get('/random', (req, res) => {
    const random = Math.floor(Math.random() * 10) + 1;
    res.render('random', { random }); // render variable random to be used in the template
})

// --------------------------------------------------
// Second part: RESTFUL routes
// --------------------------------------------------
// Our fake database:
let comments = [
    {
        id: uuid(),
        username: 'Todd',
        comment: 'lol that is so funny!'
    },
    {
        id: uuid(),
        username: 'Skyler',
        comment: 'I like to go birdwatching with my dog'
    },
    {
        id: uuid(),
        username: 'Sk8erBoi',
        comment: 'Plz delete your account, Todd'
    },
    {
        id: uuid(),
        username: 'onlysayswoof',
        comment: 'woof woof woof'
    }
];


app.get('/getpost', (req, res) => {
    res.render('getpost');
})

app.get('/tacos', (req, res) => {
    res.send("GET /tacos response");
})

app.post('/tacos', (req, res) => {
    const { meat, qty } = req.body;
    res.send(`OK, here are your ${qty} ${meat} tacos`);
})

app.get('/comments', (req, res) => {
    res.render('comments/allcomments', { comments });
})

// GET request to render the form to create a new comment
app.get('/comments/new', (req, res) => {
    res.render('comments/new');
})

// POST request to send data to server to create a new comment
app.post('/comments', (req, res) => {
    const { username, comment } = req.body;
    comments.push({ username, comment, id: uuid() });
    res.redirect('/comments');
})

app.get('/comments/:id', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/show', { comment })
})

app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/edit', { comment })
})

// PATCH request is used to update partial data while POST needs to update all the params
app.patch('/comments/:id', (req, res) => {
    const { id } = req.params;
    const foundComment = comments.find(c => c.id === id);

    //get new text from req.body
    const newCommentText = req.body.comment;
    //update the comment with the data from req.body:
    foundComment.comment = newCommentText;
    //redirect back to index (or wherever you want)
    res.redirect('/comments')
})

app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    comments = comments.filter(c => c.id !== id);
    res.redirect('/comments');
})

// Another way to create a delete action which can be used for a tag instead of form
// app.get('/comments/:id/delete', (req, res) => {
//     const { id } = req.params;
//     comments = comments.filter(c => c.id !== id);
//     res.redirect('/comments');
// })

app.listen(3000, () => {
    console.log('Listening on port 3000');
})