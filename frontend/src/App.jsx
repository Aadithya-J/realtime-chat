import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css'; // Import the CSS

const socket = io('http://localhost:3000');

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [activeUsers, setActiveUsers] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of messages when a new message arrives
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    socket.on('chat-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('active-users', (count) => {
      setActiveUsers(count);
    });

    return () => {
      socket.off('chat-message');
      socket.off('active-users');
    };
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input && username) {
      const message = {
        username,
        text: input,
      };
      socket.emit('chat-message', message);
      setInput('');
    }
  };

  return (
    <div className="chat-app">
      <h1>Socket.IO Chat</h1>
      <div id="online-display">
        <div>Online:</div>
        <div id="active-users">{activeUsers} 🟢</div>
      </div>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.username}:</strong> {msg.text}
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
      <form id="form" onSubmit={handleSubmit}>
        <input
          id="input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
      <div className="username-container">
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </div>
    </div>
  );
};

export default ChatApp;