import React, { useState, useEffect, useRef } from 'react';
import { AgentConfig, ChatMessage } from '../types';
import { GeminiService } from '../services/geminiService';
import { Send, RefreshCw, Sparkles, Bot, User } from 'lucide-react';

interface ChatPreviewProps {
  config: AgentConfig;
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({ config }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const geminiServiceRef = useRef<GeminiService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize service when config changes
  useEffect(() => {
    geminiServiceRef.current = new GeminiService(config);
    // Set welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: config.welcomeMessage || "Hello! How can I help you?",
        timestamp: new Date()
      }
    ]);
  }, [config]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !geminiServiceRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await geminiServiceRef.current.sendMessage(userMsg.text);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    geminiServiceRef.current?.reset();
    setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: config.welcomeMessage || "Hello! How can I help you?",
          timestamp: new Date()
        }
      ]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-8">
        {/* Context Sidebar (Visible in Preview for debugging) */}
        <div className="w-full md:w-80 hidden md:flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex-1">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Sparkles size={16} className="text-yellow-500" />
                    Agent Context
                </h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <span className="text-slate-500 block text-xs uppercase tracking-wide">Business</span>
                        <p className="font-medium text-slate-900">{config.businessName}</p>
                    </div>
                    <div>
                        <span className="text-slate-500 block text-xs uppercase tracking-wide">System Prompt</span>
                        <p className="text-slate-600 line-clamp-6 italic bg-slate-50 p-2 rounded mt-1 border border-slate-100">
                            {config.systemPrompt}
                        </p>
                    </div>
                    <div>
                        <span className="text-slate-500 block text-xs uppercase tracking-wide">Documents Loaded</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {config.documents.length === 0 ? (
                                <span className="text-slate-400 italic">No docs</span>
                            ) : (
                                config.documents.map(d => (
                                    <span key={d.id} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100">
                                        {d.name}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={resetChat}
                className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 rounded-xl transition-all font-medium text-sm shadow-sm"
            >
                <RefreshCw size={16} /> Reset Conversation
            </button>
        </div>

      {/* Chat Interface - The actual preview */}
      <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col relative">
        {/* Header simulating widget header */}
        <div 
            className="p-4 flex items-center gap-3 border-b border-white/10 text-white shadow-sm"
            style={{ backgroundColor: config.primaryColor }}
        >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bot size={24} className="text-white" />
            </div>
            <div>
                <h3 className="font-bold text-lg leading-tight">{config.businessName} Assistant</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
                </p>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                        msg.role === 'user' ? 'bg-slate-200 text-slate-500' : 'text-white'
                    }`} style={{ backgroundColor: msg.role === 'model' ? config.primaryColor : undefined }}>
                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    
                    <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-tr-none' 
                        : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                        {msg.text.split('\n').map((line, i) => (
                            <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                        ))}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex gap-3">
                    <div 
                        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white"
                        style={{ backgroundColor: config.primaryColor }}
                    >
                        <Bot size={16} />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                    style={{ 
                        // Using CSS variable for focus ring color trick or just simulated inline
                        // For simplicity, relying on Tailwind focus classes but applying color dynamically via wrapper if needed
                     }}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 p-2 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
                    style={{ backgroundColor: config.primaryColor }}
                >
                    <Send size={18} />
                </button>
            </div>
            <div className="text-center mt-2">
                <span className="text-[10px] text-slate-400">Powered by Nexus AI</span>
            </div>
        </div>
      </div>
    </div>
  );
};