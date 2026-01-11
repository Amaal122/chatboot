import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageCircle, Menu, Plus } from 'lucide-react';

export default function ChatbotInterface() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! 💕 I'm so happy to chat with you today! What's on your mind?", sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentInput }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      const botResponse = {
        id: Date.now() + 1,
        text: data.response || "I received your message! ✨",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      console.error("Error:", err);
      
      const errorResponse = {
        id: Date.now() + 2,
        text: "Oops! Something went wrong. 💔 Please try again!",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-pink-50 to-purple-50 border-r border-pink-100 flex flex-col">
        <div className="p-4 border-b border-pink-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-pink-200">
            <Plus className="w-5 h-5 text-pink-500" />
            <span className="text-gray-700 font-medium">New Chat</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="px-4 py-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl cursor-pointer">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MessageCircle className="w-4 h-4 text-pink-500" />
              Today's Chat
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-pink-100">
          <div className="px-4 py-2 text-xs text-gray-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Girly AI Assistant</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-pink-100 bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">Chat Assistant</h1>
                <p className="text-xs text-gray-500">Always here for you ✨</p>
              </div>
            </div>
            <button className="p-2 hover:bg-pink-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'bot' 
                    ? 'bg-gradient-to-br from-pink-400 to-purple-400' 
                    : 'bg-gradient-to-br from-rose-300 to-pink-300'
                }`}>
                  {message.sender === 'bot' ? (
                    <Sparkles className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-4 h-4 bg-white rounded-full" />
                  )}
                </div>
                <div className={`flex flex-col gap-1 max-w-[70%]`}>
                  <div className={`px-5 py-3 rounded-2xl ${
                    message.sender === 'bot'
                      ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-gray-800 border border-pink-100'
                      : 'bg-gradient-to-r from-rose-400 to-pink-400 text-white'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 px-5 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-pink-100 bg-white px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-2 border border-pink-200 shadow-sm">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Message... ✨"
                aria-label="Message input"
                className="flex-1 bg-transparent px-4 py-3 text-gray-800 placeholder-gray-400 resize-none focus:outline-none text-sm"
                rows="1"
              />
              <button
                onClick={handleSend}
                disabled={input.trim() === ''}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() === ''
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 shadow-md hover:shadow-lg'
                }`}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-xs text-center text-gray-400 mt-3">
              Your friendly AI assistant 💕 Here to help and inspire!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

