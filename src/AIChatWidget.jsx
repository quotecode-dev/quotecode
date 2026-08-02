import React, { useState } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import { supabase } from './supabase';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'שלום! אני עוזר ה-AI של ProFlow. איך אעזור לך היום?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-support', {
        body: { messages: newMessages.map(m => ({ role: m.role, content: m.content })) }
      });

      if (error) throw error;

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: 'סליחה, אירעה שגיאה בקבלת התשובה. נסה שוב.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[99999]" dir="rtl">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2.5 cursor-pointer font-bold text-sm border-2 border-white/20 hover:scale-105"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-indigo-600 animate-pulse"></span>
          </div>
          <span>שירות לקוחות ותמיכה AI</span>
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col h-[520px] border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/10 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-indigo-200" />
              </div>
              <div>
                <h3 className="font-bold text-sm">שירות לקוחות ProFlow</h3>
                <span className="text-[11px] text-indigo-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span> זמין 24/7 לעזרה
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-right">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-bl-none shadow-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-br-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="bg-white text-gray-500 p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> מעבד את השאלה...
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="כתוב הודעה לשירות הלקוחות..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-right bg-gray-50/50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition disabled:opacity-40 flex items-center justify-center cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}