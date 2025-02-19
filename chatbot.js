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
function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    const messages = document.getElementById('chatbot-messages');
    
    // Insert at the beginning instead of appending
    const newMessage = document.createElement('p');
    newMessage.innerHTML = `<strong>You:</strong> ${userInput}`;
    messages.insertBefore(newMessage, messages.firstChild);
    
    // Save messages immediately after user input
    saveMessages(messages.innerHTML);

    // Clear input field
    document.getElementById('user-input').value = '';

    fetch('https://chatbot-for-website-ibuildwalls17.replit.app/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            user_input: userInput, 
            user_id: userId,
            max_length: 500
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
        
        // Insert bot response at the beginning as well
        const botMessage = document.createElement('p');
        botMessage.innerHTML = `<strong>Bot:</strong> ${botResponse}`;
        messages.insertBefore(botMessage, messages.firstChild);
        
        // Save messages after bot response
        saveMessages(messages.innerHTML);
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = document.createElement('p');
        errorMessage.innerHTML = `<strong>Error:</strong> ${error.message || 'Failed to get response. Please try again.'}`;
        messages.insertBefore(errorMessage, messages.firstChild);
        saveMessages(messages.innerHTML);
    });
}

// Update the loadMessages function to handle the new structure
function loadMessages() {
    try {
        const messages = localStorage.getItem('chatbotMessages');
        const messagesContainer = document.getElementById('chatbot-messages');
        
        if (!messagesContainer) {
            console.error('Messages container not found');
            return;
        }

        if (!messages) {
            messagesContainer.innerHTML = '';
            return;
        }

        if (messages === "[object Object]" || messages === "null" || messages === "undefined") {
            localStorage.removeItem('chatbotMessages');
            messagesContainer.innerHTML = '';
            return;
        }

        // Convert the stored HTML string to DOM elements and reverse their order
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = messages;
        const messageElements = Array.from(tempDiv.children);
        messagesContainer.innerHTML = '';
        messageElements.reverse().forEach(element => {
            messagesContainer.appendChild(element);
        });

    } catch (error) {
        console.error('Error loading messages:', error);
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


// Add these event listeners to ensure messages load on all page changes
document.addEventListener('DOMContentLoaded', loadMessages);
window.addEventListener('load', loadMessages);
window.addEventListener('pageshow', loadMessages); // Handles back/forward cache
