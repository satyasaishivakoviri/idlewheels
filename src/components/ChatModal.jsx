import React, { useState, useEffect, useRef, useContext } from 'react';
import { X, Send } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const ChatModal = ({ isOpen, onClose, context }) => {
  const { user, messages, sendMessage } = useContext(AppContext);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Filter messages relevant to this specific context (booking)
  const filteredMessages = messages.filter(msg => 
    msg.bookingId === context?._id && 
    (msg.senderEmail === user?.email || msg.receiverEmail === user?.email)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [isOpen, filteredMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user || !context) return;

    const messageData = {
      bookingId: context._id,
      carName: context.carName,
      senderEmail: user.email,
      senderName: user.name,
      receiverEmail: user.email === context.userEmail ? (context.ownerId || "admin@example.com") : context.userEmail,
      receiverName: user.email === context.userEmail ? (context.ownerName || "Owner") : (context.userName || "Renter"),
      text: input,
    };

    await sendMessage(messageData);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[150] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/95 w-full max-w-2xl h-[80vh] rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col relative animate-scale-up">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white/50">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center relative shadow-sm border border-primary/5">
               <img src={assets.user_profile} className="w-10 h-10 opacity-80" alt="" />
               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">
                {user.email === context.userEmail ? (context.ownerName || "Vehicle Owner") : (context.userName || "Renter")}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
                  {context.carName}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• Booking #{context._id?.slice(-6)}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-gray-50/30">
          {filteredMessages.length > 0 ? filteredMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.senderEmail === user.email ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] group`}>
                <div className={`
                    p-6 rounded-[2rem] text-sm leading-relaxed shadow-sm
                    ${msg.senderEmail === user.email 
                        ? 'bg-primary text-white rounded-br-none shadow-primary/20' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'}
                `}>
                  {msg.text}
                </div>
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] mt-3 ${msg.senderEmail === user.email ? 'text-right text-primary/40' : 'text-gray-300'}`}>
                   {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <Send className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                   <p className="font-black text-gray-900 uppercase text-xs tracking-[0.3em]">No Messages Yet</p>
                   <p className="text-xs font-medium text-gray-500 mt-1">Start a conversation about your rental.</p>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 bg-white border-t border-gray-100">
           <form onSubmit={handleSend} className="relative flex items-center gap-4">
               <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-[2rem] px-8 py-5 text-sm font-medium outline-none transition-all duration-500 text-gray-900 placeholder:text-gray-300 shadow-inner"
               />
               <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-primary text-white h-16 w-16 rounded-full flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all cursor-pointer group"
               >
                  <Send className="w-6 h-6 translate-x-[2px] -translate-y-[1px] group-hover:rotate-12 transition-transform" />
               </button>
           </form>
           <p className="text-[10px] text-gray-400 font-bold uppercase text-center mt-6 tracking-[0.3em]">
             IdleWheels Secure Messaging
           </p>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
