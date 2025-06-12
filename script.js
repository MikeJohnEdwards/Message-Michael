const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const messageForm = document.getElementById('messageForm');
const messageText = document.getElementById('messageText');
const welcome = document.getElementById('welcome');
const messagesDiv = document.getElementById('messages');
const app = document.getElementById('app');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

let currentUser = null;

registerBtn.onclick = async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const res = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  alert(data.message || data.error);
};

loginBtn.onclick = async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (res.ok) {
    currentUser = username;
    usernameInput.value = '';
    passwordInput.value = '';
    showApp();
  } else {
    alert(data.error);
  }
};

logoutBtn.onclick = () => {
  currentUser = null;
  app.style.display = 'none';
};

messageForm.onsubmit = async (e) => {
  e.preventDefault();
  const text = messageText.value.trim();
  const res = await fetch('/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: currentUser, text })
  });
  const data = await res.json();
  if (res.ok) {
    messageText.value = '';
    if (currentUser === 'admin') loadMessages();
  } else {
    alert(data.error);
  }
};

async function loadMessages() {
  const res = await fetch(`/messages?user=${currentUser}`);
  const data = await res.json();
  messagesDiv.innerHTML = "<h3>Messages</h3>" + data.map(m => 
    `<p><strong>${m.from}:</strong> ${m.text}</p>`).join('');
  messagesDiv.style.display = 'block';
}

function showApp() {
  welcome.textContent = `Welcome, ${currentUser}`;
  app.style.display = 'block';
  if (currentUser === 'admin') loadMessages();
  else messagesDiv.style.display = 'none';
}
