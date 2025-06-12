// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const users = {};     // { username: base64encodedPassword }
const messages = [];  // [{ from, text }]

// Register new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.status(400).json({ error: 'Username already taken' });
  }
  users[username] = password;
  res.json({ success: true });
});

// Login existing user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!users[username] || users[username] !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  res.json({ success: true });
});

// Send a message
app.post('/message', (req, res) => {
  const { from, text } = req.body;
  messages.push({ from, text });
  res.json({ success: true });
});

// Get all messages (admin only)
app.get('/messages', (req, res) => {
  const admin = req.query.admin;
  if (admin !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  res.json(messages);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
