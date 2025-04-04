
import { useState } from 'react';
import { ChatState } from '@/types/chat';
import { MockSocket } from '@/services/MockSocket';
import { useChatSocketHandlers } from './useChatSocketHandlers';
import { useChatActions } from './useChatActions';

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    currentUser: null,
    partner: null,
    isConnecting: false,
    isConnected: false,
    isTyping: false,
    error: null,
    privateRoom: null
  });
  
  const [socket, setSocket] = useState<MockSocket | null>(null);
  
  // Set up socket event handlers
  const { setupSocketHandlers } = useChatSocketHandlers(setState, socket, setSocket);
  
  // Set up chat actions
  const {
    sendMessage,
    sendTypingIndicator,
    disconnect,
    reportPartner,
    createPrivateRoom,
    joinPrivateRoom,
    initializeChat,
    retryConnection
  } = useChatActions(state, setState, socket, setSocket, setupSocketHandlers);
  
  return {
    ...state,
    initializeChat,
    sendMessage,
    sendTypingIndicator,
    disconnect,
    reportPartner,
    createPrivateRoom,
    joinPrivateRoom,
    retryConnection
  };
}
