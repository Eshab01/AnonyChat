
import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
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
    <DialogPrimitive.Root open={open} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <DialogPrimitive.Title className="text-xl font-semibold">Private Room</DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-center text-sm text-muted-foreground">
              Create or join a private chat room for secure conversations
            </DialogPrimitive.Description>
          </div>

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
          
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default PrivateRoomModal;
