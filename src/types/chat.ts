
export type MessageType = 'text' | 'system';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  type: MessageType;
  encrypted?: boolean;
}

export interface ChatUser {
  id: string;
  temporaryName: string;
}

export interface PrivateRoom {
  code: string;
  isCreator: boolean;
}

export interface ChatState {
  messages: Message[];
  currentUser: ChatUser | null;
  partner: ChatUser | null;
  isConnecting: boolean;
  isConnected: boolean;
  isTyping: boolean;
  error: string | null;
  privateRoom: PrivateRoom | null;
}
