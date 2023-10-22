const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const { join } = require('path');
const { getContent, getReentryStories } = require('./controllers.js');

// MIDDLWARE
app.use(express.static('public'));
app.use(cors());

// ROUTES

// GET INDEX PAGE
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(join(__dirname, 'home.html'));
});

app.get('/outside-team', (req, res) => {
  res.sendFile(join(__dirname, 'outsideteam.html'));
});

app.get('/inside-team', (req, res) => {
  res.sendFile(join(__dirname, 'insideteam.html'));
});

// GET REENTRY STORIES
app.get('/podcast/reentry-stories', async (req, res) => {
  try {
    const data = await getReentryStories();
    res.json(data);
  } catch (err) {
    console.log('Error in server.js: ', err);
    res.sendStatus(500);
  }
});

// GET CONTENT BASED ON CATEGORY
app.get('/podcast/:category', async (req, res) => {
  try {
    const data = await getContent(req.params.category);
    res.json(data);
  } catch (err) {
    console.log('Error in server.js: ', err);
    res.sendStatus(500);
  }
});

const localhostURl = 'http://localhost:';
app.listen(port, () => console.log(`Listening on port ${port}!  ${localhostURl}${port}`));