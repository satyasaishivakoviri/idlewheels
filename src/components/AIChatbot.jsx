import React, { useState, useEffect, useRef, useContext } from 'react';
import { MessageCircle, X, Send, Bot, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const AIChatbot = () => {
  const { user } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
      const userName = user ? user.name.split(' ')[0] : 'Guest';
      setMessages([
          { role: 'bot', text: `Hi ${userName}! I am your AI Booking Assistant. I can help you find the perfect car for your next trip. What are you looking for?` }
      ]);
  }, [user]);

  const quickSuggestions = [
    "Suggest me a car under ₹2000",
    "Best car for long trip",
    "Cars available near me"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages })
      });
      
      if (!response.ok) {
          throw new Error('Server returned ' + response.status);
      }
      
      const data = await response.json();
      
      if (data && data.message) {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: data.message,
          cars: data.cars || []
        }]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "Sorry, I'm having trouble connecting to the server. Please check if the backend is running."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-fadeIn duration-200 origin-bottom-right">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Smart AI Assistant</h3>
                <p className="text-[10px] text-white/80 uppercase font-semibold tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full text-white cursor-pointer transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl p-3 ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none shadow-md' : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-none'}`}>
                  <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  
                  {/* Car Result Cards */}
                  {msg.cars && msg.cars.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {msg.cars.map(car => (
                        <div key={car._id} className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 flex flex-col gap-2 hover:border-primary/30 transition-colors">
                          <div className="relative h-28 w-full rounded-lg overflow-hidden group">
                            <img src={car.image} alt={car.carName} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm">
                              <span className="text-xs font-bold text-gray-800">{car.transmission}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-[13px] text-gray-900 line-clamp-1">{car.carName}</h4>
                            <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                              <Navigation className="w-3 h-3 text-primary" /> {car.location}
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <p className="text-sm font-black text-primary">₹{car.pricePerDay}<span className="text-[10px] font-medium text-gray-500">/day</span></p>
                                <button 
                                  onClick={() => {
                                    setIsOpen(false);
                                    navigate('/rides');
                                  }}
                                  className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer"
                                >
                                  Book
                                </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none px-4 py-3.5 flex gap-1 items-center">
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions (only if history is just the welcome message) */}
          {messages.length === 1 && (
            <div className="px-4 py-3 bg-white border-t border-gray-50 flex gap-2 overflow-x-auto scrollbar-hide">
              {quickSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(suggestion)}
                  className="whitespace-nowrap px-4 py-1.5 bg-gray-50 hover:bg-primary/5 border border-gray-200 hover:border-primary/30 hover:text-primary text-[11px] font-medium text-gray-600 rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
             <div className="flex gap-2 items-center relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                  placeholder="Tell me what you need..."
                  className="flex-1 bg-gray-50 text-[13px] text-gray-800 rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-gray-200 transition-all"
                />
                <button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1 text-white bg-primary disabled:opacity-50 disabled:bg-gray-300 p-2 rounded-full transition-colors cursor-pointer group flex items-center justify-center"
                >
                  <Send className="w-4 h-4 translate-x-[1px] translate-y-[-1px] group-hover:scale-110 transition-transform" />
                </button>
              </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white w-14 h-14 rounded-full shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center cursor-pointer relative"
      >
        <div className={`absolute transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'}`}>
           <MessageCircle fill="currentColor" strokeWidth={1} className="w-7 h-7" />
        </div>
        <div className={`absolute transition-all duration-300 flex items-center justify-center ${isOpen ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'}`}>
           <X className="w-7 h-7" />
        </div>
        
        {/* Unread dot indicator (mock logic) */}
        {!isOpen && messages.length > 0 && messages[messages.length - 1].role === 'bot' && (
           <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>
    </div>
  );
};

export default AIChatbot;
