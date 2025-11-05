'use client';

// ═══════════════════════════════════════════════════════════════
// AI CHAT COMPONENT - Bubble Gum
// ═══════════════════════════════════════════════════════════════
// Chat interface for AI assistant in page editor
// Version: 1.0.0
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc/client';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { QUICK_PROMPTS } from '@/lib/ai/prompts';

interface AIChatProps {
  projectId?: string; // Optional for future use
  pageId?: string; // Optional for future use
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
  isLoading?: boolean;
}

export function AIChat({ projectId: _projectId, pageId: _pageId, isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const loadComponents = useCanvasStore((state) => state.loadComponents);
  const components = useCanvasStore((state) => state.components);

  // Mutations
  const generatePageMutation = trpc.ai.generatePage.useMutation();
  const chatMutation = trpc.ai.chat.useMutation();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Generating...',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Determine if this is a page generation request
      const isPageGeneration =
        userMessage.content.toLowerCase().includes('create') ||
        userMessage.content.toLowerCase().includes('generate') ||
        userMessage.content.toLowerCase().includes('page') ||
        userMessage.content.toLowerCase().includes('landing');

      if (isPageGeneration) {
        // Generate full page
        const result = await generatePageMutation.mutateAsync({
          prompt: userMessage.content,
          model: 'claude-sonnet-4-5-20250929',
        });

        if (result.success && result.data) {
          // Add components to canvas (append to existing)
          const newComponents = [...components, ...result.data.components];
          loadComponents(newComponents);

          // Update loading message with success
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === loadingMessage.id
                ? {
                    ...msg,
                    content: `I've created a page with ${result.data?.components.length || 0} components. You can see them on the canvas now!`,
                    tokens: result.tokens.total,
                    isLoading: false,
                  }
                : msg
            )
          );
        } else {
          throw new Error(result.error?.message || 'Failed to generate page');
        }
      } else {
        // Simple chat response
        const result = await chatMutation.mutateAsync({
          message: userMessage.content,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        });

        if (result.success && result.data) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === loadingMessage.id
                ? {
                    ...msg,
                    content: result.data.message,
                    tokens: result.data.tokens,
                    isLoading: false,
                  }
                : msg
            )
          );
        } else {
          throw new Error('Failed to get chat response');
        }
      }
    } catch (error) {
      console.error('AI Chat error:', error);

      // Update loading message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                content:
                  error instanceof Error
                    ? `Error: ${error.message}`
                    : 'Sorry, I encountered an error. Please try again.',
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 z-30 flex w-96 flex-col border-l border-slate-200 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <h2 className="text-sm font-semibold text-slate-900">AI Assistant</h2>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600"
          aria-label="Close AI chat"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 text-4xl">💬</div>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">
              Start a conversation
            </h3>
            <p className="mb-6 text-xs text-slate-600">
              Ask me to create pages, add components, or improve your content
            </p>

            {/* Quick prompts */}
            <div className="w-full space-y-2">
              <p className="text-xs font-medium text-slate-700">Quick prompts:</p>
              {QUICK_PROMPTS.slice(0, 4).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  className="w-full rounded border border-slate-200 px-3 py-2 text-left text-xs text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="font-medium">{prompt.label}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  } ${message.isLoading ? 'animate-pulse' : ''}`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>

                  {message.tokens && (
                    <div className="mt-2 text-xs opacity-70">
                      {message.tokens.toLocaleString()} tokens
                    </div>
                  )}

                  <div className="mt-1 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm">
                    👤
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Quick prompts (when chat has messages) */}
      {messages.length > 0 && (
        <div className="border-t border-slate-200 px-4 py-2">
          <details className="group">
            <summary className="cursor-pointer text-xs font-medium text-slate-700 hover:text-slate-900">
              Quick prompts
            </summary>
            <div className="mt-2 space-y-1">
              {QUICK_PROMPTS.slice(0, 6).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  disabled={isGenerating}
                  className="w-full rounded border border-slate-200 px-2 py-1 text-left text-xs text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-slate-200 p-4">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to create..."
            disabled={isGenerating}
            className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 pr-12 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
            rows={3}
          />

          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isGenerating}
            size="sm"
            className="absolute bottom-2 right-2"
          >
            {isGenerating ? '...' : '→'}
          </Button>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Press <kbd className="rounded bg-slate-100 px-1 py-0.5">Ctrl+Enter</kbd> to
          send
        </p>
      </div>
    </div>
  );
}
