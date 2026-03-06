import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Bot, User, Loader2 } from 'lucide-react';

export default function ChatMessage({ message, isLoading }) {
  const isUser = message?.role === 'user';
  const isBot = message?.role === 'assistant';

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 mb-6"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/50 backdrop-blur-sm">
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          <span className="text-slate-300 text-sm">Thinking...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
            : 'bg-slate-800/50 backdrop-blur-sm text-slate-100 border border-slate-700/50'
        }`}>
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown 
              className="text-sm prose prose-invert prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-cyan-400">{children}</strong>,
                code: ({ inline, children }) => 
                  inline ? (
                    <code className="px-1.5 py-0.5 rounded bg-slate-900/50 text-cyan-400 text-xs font-mono">
                      {children}
                    </code>
                  ) : (
                    <code className="block px-3 py-2 rounded bg-slate-900/50 text-cyan-400 text-xs font-mono my-2">
                      {children}
                    </code>
                  ),
                h3: ({ children }) => <h3 className="font-semibold text-base mt-3 mb-2">{children}</h3>,
                h4: ({ children }) => <h4 className="font-semibold text-sm mt-2 mb-1">{children}</h4>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        
        {/* Tool Calls Display */}
        {message.tool_calls?.map((toolCall, idx) => (
          <div key={idx} className="mt-2 text-xs text-slate-400 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-cyan-500" />
            <span>{toolCall.name?.split('.').pop() || 'Action'}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}