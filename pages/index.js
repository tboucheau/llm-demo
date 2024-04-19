import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const sendMessage = async (message) => {
    try {
      setLoading(true);
      const requestBody = {
        messages: [
          {
            content: message,
            role: 'user'
          }
        ],
        stream: false
      };

      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message && responseData.choices[0].message.content) {
          const content = responseData.choices[0].message.content;
          // Ajouter la nouvelle réponse en haut de la conversation
          setConversationHistory(prevHistory => [
            { role: 'assistant', content },
            ...prevHistory
          ]);
        } else {
          throw new Error('Invalid response from API');
        }
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('An error occurred while processing your message.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Ajouter immédiatement le message de l'utilisateur à l'historique
      setConversationHistory(prevHistory => [
        { role: 'user', content: inputValue },
        ...prevHistory
      ]);
      // Envoyer ensuite le message à l'API
      await sendMessage(inputValue);
      setInputValue('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('An error occurred while processing your message.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5 mb-4">Chat with AI</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>
      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-md-8 mx-auto">
          {conversationHistory.map((message, index) => (
            <div key={index} className={`alert alert-${message.role === 'user' ? 'primary' : 'secondary'}`} role="alert">
              <b>{message.role === 'user' ? 'You' : 'AI'}</b>: {message.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
