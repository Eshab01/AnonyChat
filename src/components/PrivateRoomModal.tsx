
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Users, Copy, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface PrivateRoomModalProps {
  open: boolean;
  onClose: () => void;
  onJoinRoom: (roomCode: string) => void;
  onCreateRoom: () => void;
}

const PrivateRoomModal = ({ open, onClose, onJoinRoom, onCreateRoom }: PrivateRoomModalProps) => {
  const [roomCode, setRoomCode] = useState("");
  const [createdRoomCode, setCreatedRoomCode] = useState("");
  const [activeTab, setActiveTab] = useState("join");

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }
    onJoinRoom(roomCode);
  };

  const handleCreateRoom = () => {
    // Generate a random room code using the utility function
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCreatedRoomCode(newRoomCode);
    onCreateRoom();
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(createdRoomCode);
    toast.success("Room code copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">Private Room</DialogTitle>
          <DialogDescription className="text-center">
            Create or join a private chat room for secure conversations
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="join" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="join">Join Room</TabsTrigger>
            <TabsTrigger value="create">Create Room</TabsTrigger>
          </TabsList>
          
          <TabsContent value="join" className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="text-muted-foreground h-5 w-5" />
              <p className="text-sm">Enter a room code to join an existing private room</p>
            </div>
            
            <div className="space-y-2">
              <Input 
                placeholder="Enter room code" 
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="uppercase"
              />
              
              <Button 
                onClick={handleJoinRoom} 
                className="w-full"
              >
                Join Private Room
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="create" className="mt-4 space-y-4">
            {!createdRoomCode ? (
              <>
                <div className="flex items-center space-x-2">
                  <Lock className="text-muted-foreground h-5 w-5" />
                  <p className="text-sm">Create a new private room and share the code</p>
                </div>
                
                <Button 
                  onClick={handleCreateRoom} 
                  className="w-full"
                >
                  Create Private Room
                  <Lock className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-3">
                  <p className="text-sm font-medium mb-1">Your Room Code:</p>
                  <div className="flex items-center justify-between">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-lg font-semibold">
                      {createdRoomCode}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyRoomCode}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm">Share this code with someone you want to chat privately with.</p>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => {
                    onJoinRoom(createdRoomCode);
                  }}
                >
                  Enter Room
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PrivateRoomModal;
