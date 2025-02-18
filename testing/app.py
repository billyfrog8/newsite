from flask import Flask, request, jsonify
import openai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  


with open('website_content.txt', 'r', encoding='utf-8') as file:
    website_content = file.read()

user_histories = {}

@app.route('/')
def home():
    return "Chatbot Server Running!"  

'''@app.route('/ask', methods=['POST'])
def ask():
    user_input = request.json['user_input']
    user_id = request.json.get('user_id', 'default')  
    max_length = request.json.get('max_length', 500)

    if user_id not in user_histories:
        user_histories[user_id] = [{"role": "system", "content": website_content}]

    user_histories[user_id] = user_histories[user_id][-9:]  

    messages = user_histories[user_id] + [{"role": "user", "content": user_input}]

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini", 
        messages=messages,
        max_tokens=max_length  
    )

    bot_response = response['choices'][0]['message']['content'].strip()

    user_histories[user_id].append({"role": "assistant", "content": bot_response})

    return jsonify({'response': bot_response, 'message_history': user_histories[user_id]})'''

import google.generativeai as genai

# Replace this with your actual Gemini API Key
GENAI_API_KEY = "AIzaSyAZIZN51ISQ-vcDlIh2j186HoL2OYO97d0"

# Configure API Key
genai.configure(api_key=GENAI_API_KEY)

@app.route('/ask', methods=['POST'])
def ask():
    user_input = request.json['user_input']
    user_id = request.json.get('user_id', 'default')  
    max_length = request.json.get('max_length', 500)

    if user_id not in user_histories:
        user_histories[user_id] = [{"role": "system", "content": website_content}]

    user_histories[user_id] = user_histories[user_id][-9:]  
    messages = user_histories[user_id] + [{"role": "user", "content": user_input}]

    # Convert messages for Gemini format
    gemini_input = "\n".join([f"{m['role']}: {m['content']}" for m in messages])

    # Generate response
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(gemini_input)

    bot_response = response.text.strip()

    user_histories[user_id].append({"role": "assistant", "content": bot_response})

    return jsonify({'response': bot_response, 'message_history': user_histories[user_id]})


if __name__ == '__main__':
    app.run(debug=True)


