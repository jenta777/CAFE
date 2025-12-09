import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useStore } from '../services/store';
import { getBaristaResponse } from '../services/geminiService';
import { Button, Input } from './ui';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AIBarista: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I\'m your virtual barista. Looking for something specific or need a recommendation?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { menu } = useStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await getBaristaResponse(userMsg, menu);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-coffee-600 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:ring-offset-2"
        aria-label="Ask AI Barista"
      >
        {isOpen ? <X /> : <Sparkles />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 overflow-hidden rounded-2xl bg-white shadow-2xl border border-coffee-100 flex flex-col h-[500px] animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-coffee-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-full">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold">Lumina Barista</h3>
                <p className="text-xs text-coffee-100">Powered by Gemini AI</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-coffee-50" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-coffee-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-2 border border-gray-100 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for a recommendation..."
                className="flex-1"
              />
              <Button type="submit" disabled={!input.trim() || isTyping} className="w-10 px-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};