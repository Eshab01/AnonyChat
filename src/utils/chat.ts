
import { Message, MessageType } from "@/types/chat";

// Generate a random UUID (simplified version)
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Generate a random temporary name
export const generateTemporaryName = (): string => {
  const adjectives = ['Anonymous', 'Hidden', 'Secret', 'Shadow', 'Silent', 'Veiled', 'Unseen', 'Masked'];
  const nouns = ['Ghost', 'Whisper', 'Enigma', 'Phantom', 'Echo', 'Shade', 'Specter', 'Spirit'];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}${randomNoun}`;
};

// Create a new message
export const createMessage = (
  content: string, 
  senderId: string, 
  type: MessageType = 'text',
  encrypted: boolean = false
): Message => {
  return {
    id: generateId(),
    content,
    senderId,
    timestamp: new Date(),
    type,
    encrypted
  };
};

// Simple "encryption" (for demo purposes only - NOT real encryption)
export const mockEncrypt = (message: string): string => {
  return btoa(message); // This is NOT secure encryption, just for UI demonstration
};

// Simple "decryption" (for demo purposes only)
export const mockDecrypt = (encryptedMessage: string): string => {
  try {
    return atob(encryptedMessage);
  } catch (e) {
    return "Unable to decrypt message";
  }
};

// Format timestamp for chat
export const formatTimestamp = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
