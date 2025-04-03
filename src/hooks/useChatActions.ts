
import { useCallback } from 'react';
import { toast } from "sonner";
import { ChatState } from '@/types/chat';
import { createMessage, generateId, generateTemporaryName } from '@/utils/chat';
import { MockSocket } from '@/services/MockSocket';

export function useChatActions(
  state: ChatState,
  setState: React.Dispatch<React.SetStateAction<ChatState>>,
  socket: MockSocket | null,
  setSocket: React.Dispatch<React.SetStateAction<MockSocket | null>>,
  setupSocketHandlers: (socket: MockSocket) => void
) {
  // Send message
  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !state.currentUser || !socket) return;
    
    // Create new message
    const newMessage = createMessage(content, state.currentUser.id);
    
    // Add message to state
    setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, newMessage]
    }));
    
    // Emit message through socket
    socket.emit('message', { content, userId: state.currentUser.id });
  }, [state.currentUser, socket, setState]);
  
  // Send typing indicator
  const sendTypingIndicator = useCallback((isTyping: boolean) => {
    if (socket) {
      socket.emit('typing', isTyping);
    }
  }, [socket]);
  
  // Disconnect from chat
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      
      setState(prevState => ({
        ...prevState,
        isConnected: false,
        isConnecting: false,
        partner: null,
        privateRoom: null
      }));
      
      toast.info("Disconnected from chat");
    }
  }, [socket, setSocket, setState]);
  
  // Report current partner
  const reportPartner = useCallback(() => {
    if (state.partner) {
      toast.success(`Reported ${state.partner.temporaryName}. Our team will review this conversation.`);
      
      // In a real app, you would send a report to the server here
      setState(prevState => ({
        ...prevState,
        messages: [
          ...prevState.messages,
          createMessage(`You reported ${state.partner.temporaryName}. Our team will review this conversation.`, 'system', 'system')
        ]
      }));
    }
  }, [state.partner, setState]);
  
  // Initialize chat
  const initializeChat = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isConnecting: true,
      error: null,
      messages: []
    }));
    
    // Create current user
    const currentUser = {
      id: generateId(),
      temporaryName: generateTemporaryName()
    };
    
    setState(prevState => ({
      ...prevState,
      currentUser
    }));
    
    // Initialize mock socket
    const newSocket = new MockSocket();
    
    // Setup socket event handlers
    setupSocketHandlers(newSocket);
    setSocket(newSocket);
    
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [setState, setSocket, setupSocketHandlers]);
  
  // Create a private room
  const createPrivateRoom = useCallback((roomCode: string) => {
    if (!socket || !state.currentUser) return;
    
    setState(prevState => ({
      ...prevState,
      isConnecting: true,
      messages: [
        ...prevState.messages,
        createMessage('Creating private room...', 'system', 'system')
      ]
    }));
    
    socket.emit('create-private-room', roomCode);
  }, [socket, state.currentUser, setState]);
  
  // Join a private room
  const joinPrivateRoom = useCallback((roomCode: string) => {
    if (!socket || !state.currentUser) {
      // Initialize chat first if not already done
      const newSocket = new MockSocket();
      setSocket(newSocket);
      
      // Create current user if not exists
      if (!state.currentUser) {
        const currentUser = {
          id: generateId(),
          temporaryName: generateTemporaryName()
        };
        
        setState(prevState => ({
          ...prevState,
          currentUser,
          isConnecting: true,
          messages: [
            createMessage('Connecting to secure server...', 'system', 'system')
          ]
        }));
        
        // Setup socket event handlers
        setupSocketHandlers(newSocket);
        
        // Now try to join the room
        newSocket.emit('join-private-room', roomCode);
      } else {
        // We have a user but no socket
        setupSocketHandlers(newSocket);
        newSocket.emit('join-private-room', roomCode);
      }
    } else {
      // We already have a socket, just join the room
      setState(prevState => ({
        ...prevState,
        isConnecting: true,
        messages: [
          ...prevState.messages,
          createMessage('Joining private room...', 'system', 'system')
        ]
      }));
      
      socket.emit('join-private-room', roomCode);
    }
  }, [socket, state.currentUser, setState, setSocket, setupSocketHandlers]);
  
  return {
    sendMessage,
    sendTypingIndicator,
    disconnect,
    reportPartner,
    createPrivateRoom,
    joinPrivateRoom,
    initializeChat
  };
}
