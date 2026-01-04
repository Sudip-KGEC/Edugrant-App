import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendMessageToGemini } from '../services/geminiService'; 
import { ChatMessage, GeminiHistoryItem } from '../../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '0', 
      role: 'model', 
      text: 'Hi! I am your **Edugrant Assistant**. Ask me about scholarships, eligibility, or deadlines!', 
      timestamp: new Date() 
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyForBackend: GeminiHistoryItem[] = [...messages, userMsg]
        .filter((msg, index) => !(index === 0 && msg.role === 'model'))
        .map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));

      const responseText = await sendMessageToGemini(input, historyForBackend.slice(0, -1));
      const botMsg: ChatMessage = { id: Date.now().toString(), role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMsg: ChatMessage = { id: 'err', role: 'model', text: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[50] flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[340px] sm:w-[385px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 flex flex-col h-[420px] animate-in slide-in-from-bottom-4 zoom-in-95 duration-200 overflow-hidden">
          
          {/* Stylish Header */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-sm block tracking-tight">Edugrant Assistant</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-teal-100 font-medium">AI Agent Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-black/10 rounded-full p-1.5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-950/50 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-teal-600 text-white border-teal-500' 
                    : 'bg-white dark:bg-slate-800 text-teal-600 border-slate-200 dark:border-slate-700'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] px-4 py-2.5 text-[13px] shadow-sm transition-all ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-2xl rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-none'
                  }`}
                >
                  <div className="prose prose-xs dark:prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-inherit">
                    <ReactMarkdown>{msg.text || ""}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 items-center">
                 <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border dark:border-slate-700 flex items-center justify-center text-teal-600">
                    <Bot size={16} />
                 </div>
                 <div className="flex gap-1.5 bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700">
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800 shrink-0">
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:border-teal-500/50 focus-within:ring-2 focus-within:ring-teal-500/10 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent px-3 py-1.5 text-slate-900 dark:text-white outline-none text-[13.5px]"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:grayscale transition-all shadow-md active:scale-90"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
        {isOpen ? (
          <X size={28} className="rotate-90 transition-transform duration-300" />
        ) : (
          <div className="relative">
             <MessageCircle size={28} />
             <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatBot;