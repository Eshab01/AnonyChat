
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
      
        if (!prevState.privateRoom) {  
          setTimeout(() => newSocket.findPartner(), 2000);
        }
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
            createMessage(`Private room created with code: ${data.roomCode}. Waiting for someone to join...`, 'system', 'system')
          ]
        }));
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
            createMessage(`You've joined private room: ${data.roomCode}. Waiting for connection...`, 'system', 'system')
          ]
        }));
      } else {
        toast.error(data.error || "Failed to join private room. Please check the code and try again.");
        // Reset the connecting state since we failed to join
        setState(prevState => ({
          ...prevState,
          isConnecting: false
        }));
      }
    });
    
  }, [setState]);
  
  return { setupSocketHandlers };
}
