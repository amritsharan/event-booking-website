'use client';

import { useState, useEffect, useRef } from 'react';
import { askChatbotAction } from '@/app/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Sparkles, Send, X, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gilded_events_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    } else {
      // Default welcome message
      setMessages([
        {
          role: 'model',
          content: 'Hello! I am your Gilded Events AI Concierge. Ask me anything about our events, ticket booking, or how to download event details!',
        },
      ]);
    }
  }, []);

  // Save chat history to localStorage on changes
  const saveHistory = (newMessages: ChatMessage[]) => {
    setMessages(newMessages);
    localStorage.setItem('gilded_events_chat_history', JSON.stringify(newMessages));
  };

  // Scroll to bottom when messages or open state changes
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: textToSend };
    const updatedMessages = [...messages, userMessage];
    saveHistory(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Call server action
    const response = await askChatbotAction(
      updatedMessages.slice(0, -1), // send history up to now
      textToSend
    );

    setIsLoading(false);

    if (response.error) {
      saveHistory([
        ...updatedMessages,
        {
          role: 'model',
          content: `⚠️ Error: ${response.error}`,
        },
      ]);
    } else if (response.text) {
      saveHistory([
        ...updatedMessages,
        {
          role: 'model',
          content: response.text,
        },
      ]);
    }
  };

  const handleClearHistory = () => {
    const defaultMsg: ChatMessage[] = [
      {
        role: 'model',
        content: 'Hello! I am your Gilded Events AI Concierge. Ask me anything about our events, ticket booking, or how to download event details!',
      },
    ];
    saveHistory(defaultMsg);
  };

  const starterPrompts = [
    'What events are available?',
    'Suggest classical music events',
    'How do I book tickets?',
    'Any tech conferences?',
  ];

  // Inline custom Markdown formatter for bold (**text**), lists (- item), code blocks (```code```)
  const formatMessageText = (text: string) => {
    const blocks = text.split(/(```[\s\S]*?```)/g);
    return blocks.map((block, idx) => {
      if (block.startsWith('```') && block.endsWith('```')) {
        const code = block.slice(3, -3).replace(/^\w+\n/, ''); // Remove language tag if present
        return (
          <pre key={idx} className="bg-background/80 border border-border p-2 rounded text-xs overflow-x-auto font-mono my-2 text-primary-foreground/90">
            <code>{code}</code>
          </pre>
        );
      }

      const lines = block.split('\n');
      return (
        <div key={idx} className="space-y-1">
          {lines.map((line, lineIdx) => {
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
              const content = line.trim().substring(2);
              return (
                <ul key={lineIdx} className="list-disc pl-4 my-1 text-sm">
                  <li>{parseInlineFormatting(content)}</li>
                </ul>
              );
            }
            if (/^\d+\.\s/.test(line.trim())) {
              const content = line.trim().replace(/^\d+\.\s/, '');
              return (
                <ol key={lineIdx} className="list-decimal pl-4 my-1 text-sm">
                  <li>{parseInlineFormatting(content)}</li>
                </ol>
              );
            }
            if (line.trim() === '') return <div key={lineIdx} className="h-2" />;
            return <p key={lineIdx} className="text-sm leading-relaxed">{parseInlineFormatting(line)}</p>;
          })}
        </div>
      );
    });
  };

  const parseInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <Card className="w-[360px] md:w-[400px] h-[500px] flex flex-col mb-4 shadow-2xl shadow-primary/10 border-border bg-card/95 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="p-4 border-b flex flex-row items-center justify-between bg-secondary/30">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-primary/20 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-headline font-semibold text-primary">Gilded Concierge</CardTitle>
                <p className="text-[10px] text-muted-foreground">Powered by Gemini AI</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleClearHistory}
                title="Clear History"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-grow p-3 overflow-hidden flex flex-col justify-between">
            <ScrollArea className="flex-grow pr-3" ref={scrollRef}>
              <div className="space-y-4 py-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex w-max max-w-[85%] flex-col gap-1 rounded-lg px-3 py-2 text-sm",
                      msg.role === 'user'
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted border border-border/30 text-foreground"
                    )}
                  >
                    {msg.role === 'model' ? formatMessageText(msg.content) : <p className="leading-relaxed">{msg.content}</p>}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex w-max max-w-[85%] items-center gap-2 rounded-lg bg-muted border border-border/30 px-3 py-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-xs">Thinking...</span>
                  </div>
                )}
              </div>
            </ScrollArea>

            {messages.length <= 1 && !isLoading && (
              <div className="mt-2 pt-2 border-t border-border/20">
                <p className="text-[11px] text-muted-foreground mb-2 px-1">Suggested questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {starterPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="text-[11px] bg-secondary/50 text-secondary-foreground hover:bg-secondary border border-border/40 px-2 py-1 rounded-md transition-colors text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-3 border-t bg-secondary/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex w-full items-center space-x-2"
            >
              <Input
                type="text"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-grow bg-background/50 border-border/60 focus-visible:ring-primary"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/95">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      {/* Trigger Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-2xl shadow-primary/35 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center group relative border-2 border-primary-foreground/15 transition-transform duration-300 hover:scale-110"
        >
          <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25 group-hover:hidden duration-1000" />
          <MessageSquare className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
        </Button>
      )}
    </div>
  );
}
