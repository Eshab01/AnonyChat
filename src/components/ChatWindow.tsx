
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatTimestamp } from "@/utils/chat";
import { Message, PrivateRoom } from "@/types/chat";

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string | null;
  partnerName: string | null;
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  onReport: () => void;
  privateRoom?: PrivateRoom | null;
}

const ChatWindow = ({
  messages,
  currentUserId,
  partnerName,
  isTyping,
  onSendMessage,
  onTyping,
  onReport,
  privateRoom
}: ChatWindowProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    // Send typing indicator
    onTyping(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };
  
  const handleSendMessage = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
      
      // Clear typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onTyping(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-gradient-to-b from-background to-background/80">
      <div className="flex justify-between items-center px-6 py-3 bg-card/50 backdrop-blur-sm border-b border-border/50 shadow-sm">
        <div>
          <h2 className="font-semibold flex items-center">
            {partnerName ? `Chatting with ${partnerName}` : "AnonyChat"}
            {privateRoom && (
              <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full animate-pulse-slow">
                Private Room: {privateRoom.code}
              </span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground">
            {partnerName ? "Your identity is hidden" : "Waiting for connection..."}
          </p>
        </div>
        {partnerName && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onReport}
                className="text-anony-warning hover:text-anony-error hover:bg-anony-error/10 transition-all"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Report
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Report inappropriate behavior</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <div className="chat-message-container">
          {messages.map((message, index) => {
            if (message.type === 'system') {
              return (
                <div 
                  key={message.id} 
                  className="text-center text-xs text-muted-foreground bg-muted/30 py-1 px-2 rounded-md mx-auto my-2 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {message.content}
                </div>
              );
            }
            
            const isMyMessage = message.senderId === currentUserId;
            
            return (
              <div 
                key={message.id} 
                className={`${isMyMessage ? 'my-message' : 'their-message'} animate-slide-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {message.content}
                <div className="text-xs opacity-70 text-right mt-1">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="typing-indicator">
              <span className="animate-pulse"></span>
              <span className="animate-pulse delay-150"></span>
              <span className="animate-pulse delay-300"></span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="px-4 py-3 bg-card/50 backdrop-blur-sm border-t border-border/50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="chat-input focus:ring-primary/50 transition-all duration-200"
            disabled={!partnerName}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || !partnerName}
            className="rounded-full bg-anony-primary hover:bg-anony-primary/80 shadow-md hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
