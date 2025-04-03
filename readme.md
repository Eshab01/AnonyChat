# AnonyChat: Anonymous Chat Platform

## Overview
AnonyChat is a real-time anonymous chat platform that allows users to connect via text, audio, and video chat without requiring any personal information. Users can join topic-based chat rooms or be randomly matched with others for private conversations. The platform prioritizes security, privacy, and seamless user experience.

## Features
### Security & Privacy
- **End-to-End Encryption (E2EE):** Ensures messages can only be read by the intended recipient.
- **Anonymous Identifiers:** Users receive temporary session-based IDs with no persistent identifiers.
- **Data Minimization:**
  - No registration or personal information required.
  - Messages are only stored temporarily during active sessions.
  - All data is deleted when chats end or users disconnect.
- **Privacy-First Architecture:**
  - No IP address storage beyond the active connection.
  - No chat logs are saved after a session ends.

### Core Functionality
- **Random Chat Pairing:** Matches users looking for conversations while maintaining anonymity.
- **Topic-Based Rooms:** Allows users to join and participate in interest-based discussions.
- **Real-Time Communication:** Uses Socket.IO for instant messaging with typing indicators and user presence awareness.
- **Content Moderation:** Includes a reporting system for inappropriate behavior or content.

## Backend Implementation
The backend is built using Node.js and Express with Socket.IO for WebSocket-based real-time messaging.

### Tech Stack
- **Node.js & Express:** Backend API and WebSocket management.
- **Socket.IO:** Handles real-time bidirectional communication.
- **Crypto Module:** Generates encryption keys and ensures secure messaging.
- **Rate Limiting (express-rate-limit):** Protects against abuse and spam.
- **UUID:** Generates unique chat session IDs.

### Key Components
#### 1. Server Setup
- Express.js initializes the API server.
- HTTP server hosts the WebSocket connection.
- CORS configuration ensures secure cross-origin requests.

#### 2. Security Middleware
- Implements request rate limiting.
- Enforces JSON request validation.

#### 3. Data Structures
- `activeUsers`: Stores active user sessions.
- `waitingUsers`: Manages users waiting for random pairing.
- `activePairs`: Stores ongoing chat sessions.
- `topicRooms`: Manages users in topic-based chat rooms.

#### 4. Chat Pairing Logic
- Users enter the waiting pool for random pairing.
- If two users are available, they are connected and assigned a session.

#### 5. Messaging & Encryption
- Messages are encrypted using RSA keys.
- Public keys are exchanged during session initialization.
- Messages are transmitted securely and decrypted on the client side.

#### 6. Handling Disconnections
- Removes inactive users from waiting lists and active chat sessions.
- Notifies paired users if their partner disconnects.
- Clears empty topic-based rooms.

## Frontend Implementation (Planned)
The frontend will be built using React with WebSockets to communicate with the backend.

### Planned Features
- **User Interface:**
  - Join random chat or select a topic-based room.
  - Send text messages with E2EE.
  - Initiate audio/video calls.
- **Encryption & Security:**
  - Client-side key generation for RSA encryption.
  - Secure WebRTC implementation for calls.

## Installation & Setup
### Prerequisites
- Node.js (>=14.x)
- npm or yarn

### Steps to Run Locally
1. **Clone the repository**
   ```bash
   git clone https://github.com/Eshab01/AnonyChat.git
   cd AnonyChat
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the server**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:8080`.

## Deployment
The platform can be deployed on cloud services like:
- **Vercel** (for frontend)
- **Heroku/DigitalOcean** (for backend)

## Future Enhancements
- **AI-based moderation system** to detect inappropriate content.
- **Decentralized peer-to-peer chat** for better anonymity.
- **Mobile application** for better accessibility.

## License
Private License

---
AnonyChat is designed to be a completely private and secure communication platform. Contribute, report issues, or suggest improvements via GitHub!

