# QStash Receiver Server

This is a simple Node.js server that receives and processes messages from QStash.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example` and fill in your QStash credentials:

   ```
   PORT=3001
   QSTASH_TOKEN=your_qstash_token
   QSTASH_CURRENT_SIGNING_KEY=your_current_signing_key
   QSTASH_NEXT_SIGNING_KEY=your_next_signing_key
   ```

3. Start the server:

   ```
   npm start
   ```

   For development with auto-restart:

   ```
   npm run dev
   ```

## Endpoints

- `GET /`: Health check endpoint
- `POST /api/receive`: Endpoint to receive messages from QStash

## How to Use

1. Deploy this server to a publicly accessible URL
2. Configure QStash to send messages to `your-server-url/api/receive`
3. Make sure to set up the correct signing keys in your environment variables

## Security

This server verifies the signature of incoming QStash messages to ensure they are authentic. Make sure to keep your signing keys secure.
