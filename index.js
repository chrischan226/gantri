const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express()
const port = 3000
const axios = require('axios');
const db = require('./queries');

app.use(morgan('tiny'));
app.use(bodyParser());

app.get('/api/art', db.getArt);
app.get('/api/art/:id', db.getArtByID);
app.post('/api/art/:id/comments', db.postComment);
app.post('/api/users', db.createUser);
app.get('/api/users', db.getUsers);

app.post('/api/users/maxBid', db.setMaxBid);
app.post('/api/art/:id/startBid', db.startBid);

app.listen(port, () => console.log(`Listening on port ${port}!`));