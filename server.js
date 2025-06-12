const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const users = {};
const messages = [];

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  if (users[username]) return res.status(409).json({ error: 'User exists' });
  users[username] = password;
  res.json({ message: 'Registered successfully' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!users[username]) return res.status(404).json({ error: 'User not found' });
  if (users[username] !== password) return res.status(401).json({ error: 'Wrong password' });
  res.json({ message: 'Login success' });
});

app.post('/messages', (req, res) => {
  const { from, text } = req.body;
  if (!from || !text) return res.status(400).json({ error: 'Missing fields' });
  messages.push({ from, text });
  res.json({ message: 'Message stored' });
});

app.get('/messages', (req, res) => {
  const user = req.query.user;
  if (user !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  res.json(messages);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
