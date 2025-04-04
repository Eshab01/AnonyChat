
import { generateId, generateTemporaryName, mockEncrypt } from '@/utils/chat';

export class MockSocket {
  private callbacks: Record<string, ((...args: any[]) => void)[]> = {};
  private partnerId: string | null = null;
  private typingTimeout: NodeJS.Timeout | null = null;
  private privateRooms: Map<string, string[]> = new Map(); // Map of room code to user IDs
  private connectionRetries: number = 0;
  private maxRetries: number = 3;
  private isConnecting: boolean = false;
  private currentUserId: string | null = null;
  private currentRoomCode: string | null = null;
  
  constructor() {
    // Generate a unique ID for this socket instance
    this.currentUserId = generateId();
    
    setTimeout(() => {
      this.emit('connect');
    }, 1000);
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
    return this;
  }

  emit(event: string, ...args: any[]) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(...args));
    }
    
    // Simulate partner behavior
    if (event === 'message' && this.partnerId) {
      const [message] = args;
      setTimeout(() => {
        if (this.callbacks['message-received']) {
          this.callbacks['message-received'].forEach(callback => 
            callback({
              id: generateId(),
              content: mockEncrypt(message.content),
              senderId: this.partnerId,
              timestamp: new Date(),
              encrypted: true
            })
          );
        }
      }, 500 + Math.random() * 1000);
    } else if (event === 'message' && this.currentRoomCode && !this.partnerId) {
      // Store the message in the room for when someone joins
      // This is a simplified implementation - in a real app, you'd store these in a database
      console.log(`Message sent in private room ${this.currentRoomCode} with no partner yet`);
    }
    
    if (event === 'typing') {
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }
      
      if (args[0] === true && this.callbacks['partner-typing'] && this.partnerId) {
        this.callbacks['partner-typing'].forEach(callback => callback(true));
      }
      
      this.typingTimeout = setTimeout(() => {
        if (this.callbacks['partner-typing'] && this.partnerId) {
          this.callbacks['partner-typing'].forEach(callback => callback(false));
        }
      }, 3000);
    }
    
    // Handle private room creation
    if (event === 'create-private-room') {
      const roomCode = args[0];
      this.privateRooms.set(roomCode, [this.currentUserId || generateId()]); // Initialize with creator
      this.currentRoomCode = roomCode;
      
      if (this.callbacks['room-created']) {
        this.callbacks['room-created'].forEach(callback => 
          callback({
            roomCode,
            success: true
          })
        );
      }
      
      // Add system messages about the room
      if (this.callbacks['connection-status']) {
        this.callbacks['connection-status'].forEach(callback => 
          callback({
            type: 'info',
            message: 'Private room created. Waiting for someone to join...'
          })
        );
      }
    }
    
    // Handle joining private room
    if (event === 'join-private-room') {
      const roomCode = args[0];
      this.currentRoomCode = roomCode;
      
      setTimeout(() => {
        if (this.privateRooms.has(roomCode)) {
          const existingUsers = this.privateRooms.get(roomCode) || [];
          
          if (existingUsers.length > 0 && existingUsers[0] !== this.currentUserId) {
            // Someone else is already in the room, connect them
            this.partnerId = existingUsers[0];
            
            // Add this user to the room
            existingUsers.push(this.currentUserId || generateId());
            this.privateRooms.set(roomCode, existingUsers);
            
            if (this.callbacks['room-joined']) {
              this.callbacks['room-joined'].forEach(callback => 
                callback({
                  roomCode,
                  success: true
                })
              );
            }
            
            // Simulate finding a partner
            setTimeout(() => {
              if (this.callbacks['partner-found']) {
                this.callbacks['partner-found'].forEach(callback => 
                  callback({
                    id: this.partnerId,
                    temporaryName: generateTemporaryName()
                  })
                );
              }
            }, 1500);
          } else {
            // No one else is in the room or it's the same user
            if (this.callbacks['room-joined']) {
              this.callbacks['room-joined'].forEach(callback => 
                callback({
                  roomCode,
                  success: true
                })
              );
            }
            
            if (this.callbacks['connection-status']) {
              this.callbacks['connection-status'].forEach(callback => 
                callback({
                  type: 'info',
                  message: 'You joined the private room. Waiting for someone else to join...'
                })
              );
            }
          }
        } else {
          // Room doesn't exist yet, create it
          this.privateRooms.set(roomCode, [this.currentUserId || generateId()]);
          
          if (this.callbacks['room-joined']) {
            this.callbacks['room-joined'].forEach(callback => 
              callback({
                roomCode,
                success: true
              })
            );
          }
          
          if (this.callbacks['connection-status']) {
            this.callbacks['connection-status'].forEach(callback => 
              callback({
                type: 'info',
                message: 'Room created. Waiting for someone to join...'
              })
            );
          }
        }
      }, 1000);
    }
    
    return this;
  }
  
  disconnect() {
    this.isConnecting = false;
    this.connectionRetries = 0;
    this.partnerId = null;
    
    // Remove from private room if in one
    if (this.currentRoomCode) {
      const roomUsers = this.privateRooms.get(this.currentRoomCode) || [];
      const updatedUsers = roomUsers.filter(id => id !== this.currentUserId);
      
      if (updatedUsers.length > 0) {
        this.privateRooms.set(this.currentRoomCode, updatedUsers);
      } else {
        // Room is empty, remove it
        this.privateRooms.delete(this.currentRoomCode);
      }
      
      this.currentRoomCode = null;
    }
    
    if (this.callbacks['disconnect']) {
      this.callbacks['disconnect'].forEach(callback => callback());
    }
    return this;
  }
  
  findPartner() {
    if (this.isConnecting) return; // Prevent multiple connection attempts
    
    this.isConnecting = true;
    
    // Emit connecting status
    if (this.callbacks['connection-status']) {
      this.callbacks['connection-status'].forEach(callback => 
        callback({
          type: 'info',
          message: 'Searching for available chat partners...'
        })
      );
    }
    
    // If in a private room, check if there's another user
    if (this.currentRoomCode) {
      const roomUsers = this.privateRooms.get(this.currentRoomCode) || [];
      const otherUsers = roomUsers.filter(id => id !== this.currentUserId);
      
      if (otherUsers.length > 0) {
        // Found another user in the room
        this.partnerId = otherUsers[0];
        this.isConnecting = false;
        
        if (this.callbacks['partner-found']) {
          this.callbacks['partner-found'].forEach(callback => 
            callback({
              id: this.partnerId,
              temporaryName: generateTemporaryName()
            })
          );
        }
        return;
      }
      
      // No one else in the room
      if (this.callbacks['connection-status']) {
        this.callbacks['connection-status'].forEach(callback => 
          callback({
            type: 'info',
            message: 'Waiting for someone to join the private room...'
          })
        );
      }
      
      this.isConnecting = false;
      return;
    }
    
    // Simulate connection attempt with potential failure for random chat
    setTimeout(() => {
      // Random chance to fail connection attempt (for demo purposes)
      const connectionSuccess = Math.random() > 0.3; // 70% success rate
      
      if (connectionSuccess) {
        // Connection successful
        this.partnerId = generateId();
        this.isConnecting = false;
        
        if (this.callbacks['partner-found']) {
          this.callbacks['partner-found'].forEach(callback => 
            callback({
              id: this.partnerId,
              temporaryName: generateTemporaryName()
            })
          );
        }
      } else {
        // Connection failed, retry
        this.connectionRetries++;
        
        if (this.callbacks['connection-status']) {
          if (this.connectionRetries < this.maxRetries) {
            this.callbacks['connection-status'].forEach(callback => 
              callback({
                type: 'info',
                message: `Connection attempt ${this.connectionRetries} failed. Retrying...`
              })
            );
            
            // Retry after delay
            setTimeout(() => {
              this.isConnecting = false;
              this.findPartner();
            }, 2000);
          } else {
            // Max retries reached
            this.isConnecting = false;
            this.callbacks['connection-status'].forEach(callback => 
              callback({
                type: 'error',
                message: 'Could not find any available chat partners. Please try again later or create a private room.'
              })
            );
          }
        }
      }
    }, 3000);
  }
  
  // Add method to manually retry connection
  retryConnection() {
    if (!this.isConnecting) {
      this.connectionRetries = 0;
      this.findPartner();
    }
  }
}
