
import { useState } from "react";
import Header from "@/components/Header";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChatWindow from "@/components/ChatWindow";
import EncryptionIndicator from "@/components/EncryptionIndicator";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { RefreshCw, X } from "lucide-react";

const Index = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const {
    messages,
    currentUser,
    partner,
    isTyping,
    isConnecting,
    privateRoom,
    initializeChat,
    sendMessage,
    sendTypingIndicator,
    disconnect,
    reportPartner,
    joinPrivateRoom,
    retryConnection
  } = useChat();

  const handleStartChat = () => {
    setChatStarted(true);
    initializeChat();
  };

  const handleJoinPrivateRoom = (roomCode: string) => {
    setChatStarted(true);
    joinPrivateRoom(roomCode);
  };

  const handleDisconnect = () => {
    disconnect();
    setChatStarted(false);
  };

  // Check if waiting for connection more than 10 seconds
  const isConnectionStalled = !partner && messages.some(msg => 
    msg.type === 'system' && 
    msg.content.includes('Finding a chat partner')
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {!chatStarted ? (
        <WelcomeScreen 
          onStartChat={handleStartChat} 
          onJoinPrivateRoom={handleJoinPrivateRoom}
        />
      ) : (
        <>
          <ChatWindow
            messages={messages}
            currentUserId={currentUser?.id || null}
            partnerName={partner?.temporaryName || null}
            isTyping={isTyping}
            onSendMessage={sendMessage}
            onTyping={sendTypingIndicator}
            onReport={reportPartner}
            privateRoom={privateRoom}
          />
          
          {/* Show retry button when connection is stalled */}
          {isConnectionStalled && !isConnecting && (
            <Button 
              variant="secondary"
              size="sm"
              onClick={retryConnection}
              className="fixed top-20 right-4 rounded-full animate-pulse shadow-md"
              disabled={isConnecting}
            >
              <RefreshCw className="h-4 w-4 mr-1 animate-spin-slow" />
              Find Partner
            </Button>
          )}
          
          <Button 
            variant="destructive"
            size="sm"
            onClick={handleDisconnect} 
            className="fixed top-4 right-4 rounded-full"
          >
            <X className="h-4 w-4 mr-1" />
            End Chat
          </Button>
          
          <EncryptionIndicator />
        </>
      )}
    </div>
  );
};

export default Index;
