let db;
let currentUser = null;
let chatWith = null;

// Open IndexedDB
const request = indexedDB.open("chatAppDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    db.createObjectStore("users", { keyPath: "pin" });
    db.createObjectStore("messages", { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    document.getElementById('signup-login').style.display = 'block';
};

request.onerror = function(event) {
    console.error("Error opening IndexedDB:", event.target.errorCode);
};

// Generate a 4-digit PIN
function generatePIN() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Sign up a new user
function signUp() {
    const username = document.getElementById('username').value.trim();

    if (!username) {
        alert("Username cannot be empty");
        return;
    }

    const pin = generatePIN();
    const user = { username, pin };

    const transaction = db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");
    store.add(user);

    transaction.oncomplete = function() {
        currentUser = user;
        document.getElementById('signup-login').style.display = 'none';
        document.getElementById('chat-system').style.display = 'block';
        document.getElementById('current-user').innerText = username;
        document.getElementById('user-pin').innerText = pin;
    };

    transaction.onerror = function() {
        alert("Error signing up. Try again.");
    };
}

// Find user by PIN
function findUser() {
    const pin = document.getElementById('search-pin').value.trim();

    const transaction = db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");
    const request = store.get(pin);

    request.onsuccess = function(event) {
        const user = event.target.result;
        if (user) {
            chatWith = user.pin;
            loadMessages();
        } else {
            alert("User not found.");
        }
    };
}

// Load messages from IndexedDB
function loadMessages() {
    const messageBox = document.getElementById('message-box');
    messageBox.innerHTML = '';

    const transaction = db.transaction(["messages"], "readonly");
    const store = transaction.objectStore("messages");
    const request = store.openCursor();

    request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            const message = cursor.value;
            // Only display messages between currentUser and chatWith
            if ((message.from === currentUser.pin && message.to === chatWith) ||
                (message.from === chatWith && message.to === currentUser.pin)) {
                const messageDiv = document.createElement('div');
                messageDiv.textContent = `${message.username}: ${message.text}`;
                messageBox.appendChild(messageDiv);
            }
            cursor.continue();
        }
    };
}

// Send message
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (!messageText || !chatWith) {
        alert("Message cannot be empty or no user selected.");
        return;
    }

    const message = {
        from: currentUser.pin,
        to: chatWith,
        username: currentUser.username,
        text: messageText,
        timestamp: new Date().toISOString()
    };

    const transaction = db.transaction(["messages"], "readwrite");
    const store = transaction.objectStore("messages");
    store.add(message);

    transaction.oncomplete = function() {
        messageInput.value = '';
        loadMessages();
    };

    transaction.onerror = function() {
        alert("Error sending message.");
    };
}

// Real-time updates (refresh messages every 2 seconds)
setInterval(loadMessages, 2000);
let db;
let currentUser = null;
let chatWith = null;

// Open IndexedDB
const request = indexedDB.open("chatAppDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    db.createObjectStore("users", { keyPath: "pin" });
    db.createObjectStore("messages", { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    document.getElementById('signup-login').style.display = 'block';
};

request.onerror = function(event) {
    console.error("Error opening IndexedDB:", event.target.errorCode);
};

// Generate a 4-digit PIN
function generatePIN() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Sign up a new user
function signUp() {
    const username = document.getElementById('username').value.trim();

    if (!username) {
        alert("Username cannot be empty");
        return;
    }

    const pin = generatePIN();
    const user = { username, pin };

    const transaction = db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");
    store.add(user);

    transaction.oncomplete = function() {
        currentUser = user;
        document.getElementById('signup-login').style.display = 'none';
        document.getElementById('chat-system').style.display = 'block';
        document.getElementById('current-user').innerText = username;
        document.getElementById('user-pin').innerText = pin;
    };

    transaction.onerror = function() {
        alert("Error signing up. Try again.");
    };
}

// Find user by PIN
function findUser() {
    const pin = document.getElementById('search-pin').value.trim();

    const transaction = db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");
    const request = store.get(pin);

    request.onsuccess = function(event) {
        const user = event.target.result;
        if (user) {
            chatWith = user.pin;
            loadMessages();
        } else {
            alert("User not found.");
        }
    };
}

// Load messages from IndexedDB
function loadMessages() {
    const messageBox = document.getElementById('message-box');
    messageBox.innerHTML = '';

    const transaction = db.transaction(["messages"], "readonly");
    const store = transaction.objectStore("messages");
    const request = store.openCursor();

    request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            const message = cursor.value;
            // Only display messages between currentUser and chatWith
            if ((message.from === currentUser.pin && message.to === chatWith) ||
                (message.from === chatWith && message.to === currentUser.pin)) {
                const messageDiv = document.createElement('div');
                messageDiv.textContent = `${message.username}: ${message.text}`;
                messageBox.appendChild(messageDiv);
            }
            cursor.continue();
        }
    };
}

// Send message
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (!messageText || !chatWith) {
        alert("Message cannot be empty or no user selected.");
        return;
    }

    const message = {
        from: currentUser.pin,
        to: chatWith,
        username: currentUser.username,
        text: messageText,
        timestamp: new Date().toISOString()
    };

    const transaction = db.transaction(["messages"], "readwrite");
    const store = transaction.objectStore("messages");
    store.add(message);

    transaction.oncomplete = function() {
        messageInput.value = '';
        loadMessages();
    };

    transaction.onerror = function() {
        alert("Error sending message.");
    };
}

// Real-time updates (refresh messages every 2 seconds)
setInterval(loadMessages, 2000);
