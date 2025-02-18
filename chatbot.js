// Generate a unique user ID (can be based on session or randomly generated for each user)
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = Math.random().toString(36).substring(2, 15);  // Generate a random ID
    localStorage.setItem('userId', userId);  // Store the user ID in localStorage
}

// Function to toggle the chatbot visibility
function toggleChatbot() {
    const chatbot = document.getElementById('chatbot-popup');
    const chatButton = document.getElementById('open-chatbot-btn');
    
    if (chatbot.style.display === 'none' || chatbot.style.display === '') {
        chatbot.style.display = 'block';
        chatButton.style.display = 'none';
    } else {
        chatbot.style.display = 'none';
        chatButton.style.display = 'block';
    }
}

// Load messages from localStorage
function loadMessages() {
    const messages = localStorage.getItem('chatbotMessages');
    if (messages) {
        document.getElementById('chatbot-messages').innerHTML = messages;
    }
}

// Send message to Flask and get a response
function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    const messages = document.getElementById('chatbot-messages');
    messages.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

    // Save messages to localStorage
    localStorage.setItem('chatbotMessages', messages.innerHTML);

    // Clear input field
    document.getElementById('user-input').value = '';

    // Send input, user ID, and message history to Flask backend
    fetch('https://chatbot-for-website-ibuildwalls17.replit.app/ask', {  // Use localhost for local testing
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: userInput, user_id: userId })
    })
    .then(response => response.json())
    .then(data => {
        const botResponse = data.response.replace(/\n/g, '<br>'); // Convert new lines to <br>
        messages.innerHTML += `<p><strong>Bot:</strong> ${botResponse}</p>`;
        
        // Save messages to localStorage
        localStorage.setItem('chatbotMessages', messages.innerHTML);

        messages.scrollTop = messages.scrollHeight;
    });
}

// Call loadMessages when the page loads
window.onload = loadMessages;
