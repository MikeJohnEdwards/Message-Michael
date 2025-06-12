const ADMIN = 'admin';
const BACKEND_URL = 'https://message-michael-1.onrender.com';

const authForm = document.getElementById('authForm');
const messageForm = document.getElementById('messageForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const messageText = document.getElementById('messageText');
const welcome = document.getElementById('welcome');
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const messagesDiv = document.getElementById('messages');
const logoutBtn = document.getElementById('logoutBtn');

let currentUser = null;

// Register
registerBtn.onclick = () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Please enter both a username and password.");
    return;
  }

  fetch(`${BACKEND_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Registered successfully. Please log in.");
        usernameInput.value = '';
        passwordInput.value = '';
      } else {
        alert(data.error);
      }
    });
};

// Login
loginBtn.onclick = () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Please enter both a username and password.");
    return;
  }

  fetch(`${BACKEND_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        currentUser = username;
        usernameInput.value = '';
        passwordInput.value = '';
        showApp();
      } else {
        alert(data.error);
      }
    });
};

// Logout
logoutBtn.onclick = () => {
  currentUser = null;
  showLogin();
};

// Send message
messageForm.onsubmit = (e) => {
  e.preventDefault();
  const text = messageText.value.trim();
  if (!text) return;

  fetch(`${BACKEND_URL}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: currentUser, text })
  })
    .then(res => res.json())
    .then(() => {
      messageText.value = '';
      if (currentUser === ADMIN) {
        loadMessages();
      }
    });
};

function showApp() {
  authSection.style.display = 'none';
  appSection.style.display = 'block';
  welcome.textContent = `Welcome, ${currentUser}!`;

  if (currentUser === ADMIN) {
    messagesDiv.style.display = 'block';
    loadMessages();
  } else {
    messagesDiv.style.display = 'none';
  }
}

function showLogin() {
  appSection.style.display = 'none';
  authSection.style.display = 'block';
}

function loadMessages() {
  fetch(`${BACKEND_URL}/messages`)
    .then(res => res.json())
    .then(data => {
      messagesDiv.innerHTML = "<h3>All Messages</h3>" + data.messages.map(m =>
        `<p><strong>${m.from}:</strong> ${m.text}</p>`
      ).join('');
    });
}
