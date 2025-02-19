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
        document.body.classList.add('chatbot-open'); // Prevent body scroll
    } else {
        chatbot.style.display = 'none';
        chatButton.style.display = 'block';
        document.body.classList.remove('chatbot-open'); // Re-enable body scroll
    }
}

// Function to load messages with error handling
function loadMessages() {
    try {
        const messages = localStorage.getItem('chatbotMessages');
        const messagesContainer = document.getElementById('chatbot-messages');
        
        // Check if container exists
        if (!messagesContainer) {
            console.error('Messages container not found');
            return;
        }

        // Only clear if there's no stored messages
        if (!messages) {
            messagesContainer.innerHTML = '';
            return;
        }

        // Validate stored messages
        if (messages === "[object Object]" || messages === "null" || messages === "undefined") {
            localStorage.removeItem('chatbotMessages');
            messagesContainer.innerHTML = '';
            return;
        }

        // Set the messages and scroll to bottom
        messagesContainer.innerHTML = messages;

    } catch (error) {
        console.error('Error loading messages:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('chatbotMessages');
    }
}

// Function to save messages with error handling
function saveMessages(messagesHTML) {
    try {
        localStorage.setItem('chatbotMessages', messagesHTML);
    } catch (error) {
        console.error('Error saving messages:', error);
    }
}

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    const messages = document.getElementById('chatbot-messages');
    messages.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
    
    // Save messages immediately after user input
    saveMessages(messages.innerHTML);

    // Scroll to top after user sends message
    messages.scrollTop = 0;

    // Clear input field
    document.getElementById('user-input').value = '';

    fetch('https://chatbot-for-website-ibuildwalls17.replit.app/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            user_input: userInput, 
            user_id: userId,
            max_length: 500 // Adjust as needed
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        const botResponse = data.response.replace(/\n/g, '<br>');
        messages.innerHTML += `<p><strong>Bot:</strong> ${botResponse}</p>`;
        
        // Save messages after bot response
        saveMessages(messages.innerHTML);
        
        // No scrolling after bot response
    })
    .catch(error => {
        console.error('Error:', error);
        messages.innerHTML += `<p><strong>Error:</strong> ${error.message || 'Failed to get response. Please try again.'}</p>`;
        saveMessages(messages.innerHTML);
    });
}

// Add these event listeners to ensure messages load on all page changes
document.addEventListener('DOMContentLoaded', loadMessages);
window.addEventListener('load', loadMessages);
window.addEventListener('pageshow', loadMessages); // Handles back/forward cache
