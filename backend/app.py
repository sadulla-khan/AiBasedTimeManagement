import os
from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

try:
    genai.configure(api_key=os.environ.get("YOUR_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash")
    print("Gemini model initialized successfully.")
except Exception as e:
    print(f"Error initializing Gemini API: {e}")
    exit()

chat_sessions = {}

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        print("Received data:", data)
        session_id = data.get('session_id')
        print("Session ID:", session_id)
        user_message = data.get('prompt')
        if isinstance(user_message, list) and len(user_message) > 0 and isinstance(user_message[0], dict) and 'text' in user_message[0]:
            user_message = user_message[0]['text']

        print("User message:", user_message, type(user_message))

        if not user_message:
            return jsonify({'error': 'Prompt is required'}), 400
        if not session_id:
            return jsonify({'error': 'session_id is required'}), 400

        if session_id not in chat_sessions:
            chat_sessions[session_id] = model.start_chat()

        chat = chat_sessions[session_id]
        response = chat.send_message(user_message)
        print("Gemini API Response:", response)

        # Correctly serialize the history
        history_for_json = []
        for message in chat.history:
            parts = []
            for part in message.parts:
                parts.append({"text": part.text})
            history_for_json.append({"role": message.role, "parts": parts})
        print("Chat History:", history_for_json)
        return jsonify({'text': response.text, 'history': history_for_json})

    except Exception as e:
        print(f"Error generating text: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)