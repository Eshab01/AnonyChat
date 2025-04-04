
import { generateId, generateTemporaryName, mockEncrypt } from '@/utils/chat';

export class MockSocket {
  private callbacks: Record<string, ((...args: any[]) => void)[]> = {};
  private partnerId: string | null = null;
  private typingTimeout: NodeJS.Timeout | null = null;
  private privateRooms: Map<string, string[]> = new Map(); // Map of room code to user IDs
  private connectionRetries: number = 0;
  private maxRetries: number = 3;
  private isConnecting: boolean = false;
  
  constructor() {
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
    }
    
    if (event === 'typing') {
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }
      
      if (args[0] === true && this.callbacks['partner-typing']) {
        this.callbacks['partner-typing'].forEach(callback => callback(true));
      }
      
      this.typingTimeout = setTimeout(() => {
        if (this.callbacks['partner-typing']) {
          this.callbacks['partner-typing'].forEach(callback => callback(false));
        }
      }, 3000);
    }
    
    // Handle private room creation
    if (event === 'create-private-room') {
      const roomCode = args[0];
      this.privateRooms.set(roomCode, [generateId()]); // Initialize with creator
      
      if (this.callbacks['room-created']) {
        this.callbacks['room-created'].forEach(callback => 
          callback({
            roomCode,
            success: true
          })
        );
      }
    }
    
    // Handle joining private room
    if (event === 'join-private-room') {
      const roomCode = args[0];
      setTimeout(() => {
        if (this.privateRooms.has(roomCode)) {
          this.partnerId = generateId();
          this.privateRooms.get(roomCode)?.push(this.partnerId);
          
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
          // Room doesn't exist
          if (this.callbacks['room-joined']) {
            this.callbacks['room-joined'].forEach(callback => 
              callback({
                roomCode,
                success: false,
                error: "Room not found"
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
    
    // Simulate connection attempt with potential failure
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
