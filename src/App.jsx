import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaSun, FaMoon } from 'react-icons/fa'; // Font Awesome icons for theme toggle
import './App.css';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'; // Avatar components

const App = () => {
  // State hooks
  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage or use an empty array
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState('light'); // Light or dark theme
  const messagesEndRef = useRef(null); // Ref for scrolling to the latest message

  // Dummy responses for simulation
  const dummyResponses = [
    "Hello! How can I help you today?",
    "Sure, I can assist you with that.",
    "Here is some information: **Bold Text**, *Italic Text*, and [a link](https://example.com).",
    "Did you know? *Italicized text* can add emphasis to your message.",
    "Here’s a quote: *‘The only limit to our realization of tomorrow is our doubts of today.’*",
    "For code snippets, use inline code like `const example = 'code';`.",
    "Check this out: [React Documentation](https://reactjs.org).",
    "Here is a list of tasks: 1. Task one 2. Task two 3. Task three.",
    "Want more details? Visit [this link](https://example.com).",
    "Tip: **Use comments to make your code more readable!**",
    "Remember to use `try...catch` for error handling in JavaScript.",
    "Consider this: *A well-documented code is a sign of professionalism.*",
    "Reminder: Run `npm install` after cloning a repository.",
    "Here’s a fun fact: The first programming language was Fortran, created in 1957.",
    "Interested in algorithms? They are fundamental to programming.",
    "Explore [GitHub](https://github.com) for interesting open-source projects."
  ];

  // Function to send a message
  const sendMessage = () => {
    if (input.trim() === '') return;

    // Add user's message to the state
    setMessages(prevMessages => [...prevMessages, { text: input, sender: 'user' }]);

    // Clear input field
    setInput('');

    // Simulate system response
    setTimeout(() => {
      const response = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
      setMessages(prevMessages => [...prevMessages, { text: response, sender: 'system' }]);
    }, 1000);
  };

  // Scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Clear messages on tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('chatMessages');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Message component
  const Message = ({ children, isUser }) => {
    return (
      <div className={`message ${isUser ? 'user-message' : 'system-message'}`}>
        {children}
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className='darkmode'>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />} {/* Toggle icon based on theme */}
        </button>
        <p className='logo'>Nucleus</p>
      </div>
      <div className="chat-box">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.sender}`}>
              <Avatar>
                <AvatarImage
                  src={
                    msg.sender === 'user'
                      ? 'https://github.com/shadcn.png' // User avatar
                      : './src/assets/machine.png' // System avatar
                  }
                  alt={`${msg.sender} avatar`}
                />
                <AvatarFallback>
                  {msg.sender === 'user' ? 'U' : 'S'} {/* Initials as fallback */}
                </AvatarFallback>
              </Avatar>
              <Message isUser={msg.sender === 'user'}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </Message>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Scroll target */}
        </div>
        <div className="input-container">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <Button onClick={sendMessage}>
            <img src="./src/assets/send-icon.png" alt="Send" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
