
import { useState } from "react";
import Header from "@/components/Header";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChatWindow from "@/components/ChatWindow";
import EncryptionIndicator from "@/components/EncryptionIndicator";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { X } from "lucide-react";

const Index = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const {
    messages,
    currentUser,
    partner,
    isTyping,
    privateRoom,
    initializeChat,
    sendMessage,
    sendTypingIndicator,
    disconnect,
    reportPartner,
    joinPrivateRoom
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
