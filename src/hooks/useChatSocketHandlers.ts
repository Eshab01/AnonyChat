
import { useCallback } from 'react';
import { toast } from "sonner";
import { ChatState } from '@/types/chat';
import { createMessage, mockDecrypt } from '@/utils/chat';
import { MockSocket } from '@/services/MockSocket';

export function useChatSocketHandlers(
  setState: React.Dispatch<React.SetStateAction<ChatState>>,
  socket: MockSocket | null,
  setSocket: React.Dispatch<React.SetStateAction<MockSocket | null>>
) {
  // Setup socket event handlers
  const setupSocketHandlers = useCallback((newSocket: MockSocket) => {
    newSocket.on('connect', () => {
      setState(prevState => ({
        ...prevState,
        isConnected: true,
        messages: [
          ...prevState.messages,
          createMessage('Connecting to secure server...', 'system', 'system')
        ]
      }));
      
      setTimeout(() => {
        setState(prevState => ({
          ...prevState,
          isConnecting: false,
          messages: [
            ...prevState.messages,
            createMessage('Connected securely. Finding a chat partner...', 'system', 'system')
          ]
        }));
      
        setTimeout(() => {
          // Fix: Using proper state reference by using setState callback
          setState(prevState => {
            if (!prevState.privateRoom) {  
              newSocket.findPartner();
            }
            return prevState;
          });
        }, 2000);
      }, 1500);
      
    });
    
    newSocket.on('partner-found', (partner) => {
      setState(prevState => ({
        ...prevState,
        partner,
        messages: [
          ...prevState.messages,
          createMessage(`You are now chatting with ${partner.temporaryName}. Your identity is hidden.`, 'system', 'system')
        ]
      }));
      
      toast.success(`Connected with ${partner.temporaryName}`);
    });
    
    newSocket.on('message-received', (message) => {
      setState(prevState => {
        // Decrypt the message (mock)
        const decryptedMessage = {
          ...message,
          content: mockDecrypt(message.content),
          encrypted: false
        };
        
        return {
          ...prevState,
          messages: [...prevState.messages, decryptedMessage]
        };
      });
    });
    
    newSocket.on('disconnect', () => {
      setState(prevState => ({
        ...prevState,
        isConnected: false,
        partner: null,
        privateRoom: null,
        messages: [
          ...prevState.messages,
          createMessage('Connection closed. Your chat has ended.', 'system', 'system')
        ]
      }));
    });
    
    newSocket.on('partner-typing', (isTyping: boolean) => {
      setState(prevState => ({
        ...prevState,
        isTyping
      }));
    });
    
    // Handle private room events
    newSocket.on('room-created', (data) => {
      if (data.success) {
        setState(prevState => ({
          ...prevState,
          privateRoom: {
            code: data.roomCode,
            isCreator: true
          },
          messages: [
            ...prevState.messages,
            createMessage(`Private room created with code: ${data.roomCode}. Share this code with someone to start chatting!`, 'system', 'system')
          ]
        }));
        
        // Display toast with room code for easy copying
        toast.success(
          <div className="flex flex-col">
            <span>Room created! Share this code:</span>
            <span className="font-bold text-lg select-all mt-1">{data.roomCode}</span>
          </div>
        );
      } else {
        toast.error("Failed to create private room. Please try again.");
      }
    });
    
    newSocket.on('room-joined', (data) => {
      if (data.success) {
        setState(prevState => ({
          ...prevState,
          privateRoom: {
            code: data.roomCode,
            isCreator: false
          },
          messages: [
            ...prevState.messages,
            createMessage(`You've joined private room: ${data.roomCode}. Connecting to chat partner...`, 'system', 'system')
          ]
        }));
        
        // Force find a partner when joining a room
        setTimeout(() => newSocket.findPartner(), 1000);
      } else {
        toast.error(data.error || "Failed to join private room. Please check the code and try again.");
        // Reset the connecting state since we failed to join
        setState(prevState => ({
          ...prevState,
          isConnecting: false
        }));
      }
    });
    
    // Add connection status event
    newSocket.on('connection-status', (status) => {
      setState(prevState => ({
        ...prevState,
        messages: [
          ...prevState.messages,
          createMessage(status.message, 'system', 'system')
        ]
      }));
      
      if (status.type === 'error') {
        toast.error(status.message);
      } else if (status.type === 'info') {
        toast.info(status.message);
      }
    });
    
  }, [setState]);
  
  return { setupSocketHandlers };
}
