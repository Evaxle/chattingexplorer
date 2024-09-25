let db;
let currentUserPin;

// Open or create IndexedDB
const request = indexedDB.open('ChatApp', 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    // Create an object store for user data with 'pin' as the keyPath
    if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'pin', autoIncrement: true });
        userStore.createIndex('nickname', 'nickname', { unique: false });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    assignUserPin();
};

request.onerror = function (event) {
    console.error('IndexedDB error:', event.target.errorCode);
};

// Assign the user a PIN (incremental)
function assignUserPin() {
    const transaction = db.transaction(['users'], 'readwrite');
    const userStore = transaction.objectStore('users');
    
    // Count total users to assign a PIN
    const request = userStore.count();

    request.onsuccess = function () {
        currentUserPin = request.result + 1; // PIN starts at 1
        document.getElementById('user-pin').textContent = currentUserPin;
    };

    request.onerror = function (event) {
        console.error('Error counting users:', event.target.errorCode);
    };
}

// Save the user's nickname to IndexedDB
function saveNickname() {
    const nickname = document.getElementById('nickname').value;
    if (nickname.trim() === '') {
        alert('Please enter a valid nickname.');
        return;
    }

    const transaction = db.transaction(['users'], 'readwrite');
    const userStore = transaction.objectStore('users');

    const userData = { pin: currentUserPin, nickname: nickname };

    userStore.put(userData);

    transaction.oncomplete = function () {
        alert('Nickname saved successfully!');
    };

    transaction.onerror = function (event) {
        console.error('Error saving nickname:', event.target.errorCode);
    };
}

// Find user by PIN and display their nickname
function findUser() {
    const searchPin = parseInt(document.getElementById('search-pin').value);

    if (isNaN(searchPin)) {
        alert('Please enter a valid PIN.');
        return;
    }

    const transaction = db.transaction(['users'], 'readonly');
    const userStore = transaction.objectStore('users');
    
    const request = userStore.get(searchPin);

    request.onsuccess = function () {
        const result = request.result;
        if (result) {
            alert('User found: ' + result.nickname);
        } else {
            alert('No user found with PIN: ' + searchPin);
        }
    };

    request.onerror = function (event) {
        console.error('Error searching user by PIN:', event.target.errorCode);
    };
}

// Send message (just as a placeholder for now)
function sendMessage() {
    const message = document.getElementById('message-input').value;
    if (message.trim() === '') {
        alert('Enter a message.');
        return;
    }

    // For now, just append the message to the message-box div
    const messageBox = document.getElementById('message-box');
    const newMessage = document.createElement('div');
    newMessage.textContent = 'You: ' + message;
    messageBox.appendChild(newMessage);
    document.getElementById('message-input').value = ''; // Clear input
}
