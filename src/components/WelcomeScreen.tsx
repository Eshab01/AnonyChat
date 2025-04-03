
import { useState } from "react";
import { Shield, ArrowRight, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrivateRoomModal from "./PrivateRoomModal";

interface WelcomeScreenProps {
  onStartChat: () => void;
  onJoinPrivateRoom: (roomCode: string) => void;
}

const WelcomeScreen = ({ onStartChat, onJoinPrivateRoom }: WelcomeScreenProps) => {
  const [privateRoomModalOpen, setPrivateRoomModalOpen] = useState(false);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
      <Shield className="h-16 w-16 text-primary mb-6 animate-pulse-slow" />
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 animate-fade-in">
        AnonyChat
      </h1>
      <p className="text-xl mb-8 animate-slide-in opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        Secure Anonymous Communication Platform
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
        {[
          {
            icon: Lock,
            title: "End-to-End Encryption",
            description: "Your messages are encrypted and can only be read by you and your chat partner.",
            color: "primary"
          },
          {
            icon: Shield,
            title: "Complete Anonymity",
            description: "No registration, no personal data, no trace. Just pure anonymous conversation.",
            color: "success"
          },
          {
            icon: ArrowRight,
            title: "Instant Connection",
            description: "Connect instantly with random users from around the world.",
            color: "warning"
          }
        ].map((feature, index) => (
          <div 
            key={feature.title}
            className="bg-card/70 backdrop-blur-sm p-4 rounded-lg border border-border/50 hover:shadow-md hover:bg-card/90 transition-all duration-300 hover:scale-105 animate-fade-in opacity-0"
            style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <feature.icon className={`h-8 w-8 text-anony-${feature.color} mx-auto mb-2`} />
            <h3 className="font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md mx-auto animate-fade-in opacity-0" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
        <Button
          onClick={onStartChat}
          className="bg-primary hover:bg-primary/80 text-white font-semibold py-6 px-8 rounded-full text-lg transition-all hover:shadow-lg hover:shadow-primary/20 hover:translate-y-[-2px] flex-1"
        >
          Random Chat
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <Button
          onClick={() => setPrivateRoomModalOpen(true)}
          variant="outline" 
          className="font-semibold py-6 px-8 rounded-full text-lg transition-all hover:shadow-lg hover:translate-y-[-2px] border-2 flex-1"
        >
          Private Room
          <Users className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      <p className="mt-6 text-sm text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}>
        By using AnonyChat, you agree to our community guidelines prohibiting harmful or illegal content.
      </p>
      
      <PrivateRoomModal 
        open={privateRoomModalOpen}
        onClose={() => setPrivateRoomModalOpen(false)}
        onJoinRoom={(roomCode) => {
          setPrivateRoomModalOpen(false);
          onJoinPrivateRoom(roomCode);
        }}
        onCreateRoom={() => {
          // This function handles room creation in the modal
          // and will call onJoinRoom when the user is ready to enter
        }}
      />
    </div>
  );
};

export default WelcomeScreen;
