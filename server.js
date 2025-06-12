import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Simple in-memory store — use a DB for production!
const users = {};
const messages = [];

const ADMIN = "admin";

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Register
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  if (users[username])
    return res.status(409).json({ error: "Username already taken" });

  users[username] = Buffer.from(password).toString("base64");
  return res.json({ message: "Registered successfully" });
});

// Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  const stored = users[username];
  if (!stored) return res.status(404).json({ error: "User not found" });

  if (stored !== Buffer.from(password).toString("base64"))
    return res.status(401).json({ error: "Incorrect password" });

  return res.json({ message: "Login successful" });
});

// Post message
app.post("/api/message", (req, res) => {
  const { from, text } = req.body;
  if (!from || !text)
    return res.status(400).json({ error: "From and text required" });

  messages.push({ from, text });
  return res.json({ message: "Message sent" });
});

// Get messages (only admin can get all)
app.get("/api/messages", (req, res) => {
  const { user } = req.query;
  if (user !== ADMIN)
    return res.status(403).json({ error: "Only admin can view messages" });

  return res.json({ messages });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
