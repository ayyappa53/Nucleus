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
                      : 'data:image/png;base64,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' // System avatar
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
            <img src="https://img.icons8.com/?size=80&id=oYf0c4KxvaEp&format=png" alt="Send" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
