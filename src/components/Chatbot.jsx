import React, { useState, useEffect, useRef } from 'react';
import { utc } from '@/api/utcClient';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from '@/components/ChatMessage';

export default function ChatBot({ isOpen, onClose }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && !conversationId) {
      initConversation();
    }
  }, [isOpen]);

  const initConversation = async () => {
    try {
      const conversation = await utc.agents.createConversation({
        agent_name: 'shopping_assistant',
        metadata: {
          name: 'Shopping Session',
        }
      });
      setConversationId(conversation.id);
      
      // Subscribe to updates
      utc.agents.subscribeToConversation(conversation.id, (data) => {
        setMessages(data.messages || []);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !conversationId || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      const conversation = await utc.agents.getConversation(conversationId);
      await utc.agents.addMessage(conversation, {
        role: 'user',
        content: userMessage,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: 'Browse Products', action: 'Show me all products' },
    { label: 'Best Sellers', action: 'What are your bestselling products?' },
    { label: 'Bulk Orders', action: 'I need bulk packaging for my restaurant' },
    { label: 'Eco-Friendly', action: 'Show eco-friendly options' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden z-50 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Shopping Assistant</h3>
                <p className="text-xs text-cyan-100">Powered by AI</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !isLoading ? (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h4 className="text-white font-medium mb-2">Welcome to UTC Packaging!</h4>
                <p className="text-slate-400 text-sm mb-6">
                  I'm your AI shopping assistant. Ask me anything about our products or place an order.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputValue(action.action);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="px-3 py-2 text-xs rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <ChatMessage key={idx} message={msg} />
                ))}
                {isLoading && <ChatMessage isLoading />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}