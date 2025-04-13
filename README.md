# Text Summarization App with QStash

This application demonstrates two approaches to text summarization using OpenAI:

1. **Direct Client-Server Approach**: The client sends text directly to the API and waits for the response.
2. **Queue-Based Processing**: The client creates a record and sends the ID to QStash, which forwards it to a processing server that handles the OpenAI request and updates the database.

The purpose is to compare response times and scalability between synchronous processing and asynchronous queue-based processing.

## Architecture

![Architecture Diagram](https://via.placeholder.com/800x400?text=Architecture+Diagram)

- **Frontend**: Next.js application with text input interface
- **Backend**: Express server for processing summaries
- **Queue**: QStash for message passing
- **Database**: PostgreSQL (via Supabase)
- **AI**: OpenAI API for text summarization

## Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL database (Supabase recommended)
- OpenAI API key
- QStash account (Upstash)

### Environment Setup

1. Clone the repository
2. Copy the environment files:
   ```bash
   cp .env.example .env.local
   cp server/.env.example server/.env
   ```
3. Fill in the required environment variables:

#### Main Application (.env.local)

```
# OpenAI API key for GPT integration
OPENAI_API_KEY="your_openai_api_key_here"

# QStash token for message queue
QSTASH_TOKEN="your_qstash_token_here"

# QStash signing keys for verification
QSTASH_CURRENT_SIGNING_KEY="your_current_signing_key_here"
QSTASH_NEXT_SIGNING_KEY="your_next_signing_key_here"

# Database connection (with connection pooling for production)
DATABASE_URL="postgresql://username:password@host:port/database?pgbouncer=true"

# Direct database connection (for migrations)
DIRECT_URL="postgresql://username:password@host:port/database"
```

#### Processing Server (server/.env)

```
PORT=3001
OPENAI_API_KEY="your_openai_api_key_here"

# QStash verification keys
QSTASH_CURRENT_SIGNING_KEY="your_current_signing_key_here"
QSTASH_NEXT_SIGNING_KEY="your_next_signing_key_here"

# Database connection
DATABASE_URL="postgresql://username:password@host:port/database?pgbouncer=true"
```

### Running the Application

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run database migrations:

   ```bash
   pnpm prisma migrate dev
   ```

3. Start the Next.js application:

   ```bash
   pnpm dev
   ```

4. Start the processing server:
   ```bash
   cd server
   pnpm install
   pnpm start
   ```

## Processing Server (server/index.js)

The processing server handles asynchronous summary generation through QStash messages:

### Endpoints

- `GET /`: Health check endpoint
- `GET /api/summaries`: Retrieve all summaries
- `GET /api/summaries/:id`: Get a specific summary by ID
- `POST /api/webhook`: QStash webhook for general messages
- `POST /api/process-summary`: QStash webhook for processing summary requests

### How It Works

1. When a user submits text for summarization via the queue method:

   - The client creates a database record with the original text
   - The client sends the record ID to QStash
   - QStash forwards the message to the processing server

2. The processing server:

   - Verifies the QStash signature
   - Retrieves the text from the database using the provided ID
   - Calls OpenAI to generate the summary
   - Updates the database record with the summary
   - Logs the completion

3. Meanwhile, the client can:
   - Show a loading state
   - Poll for updates
   - Display the summary when ready

## Performance Comparison

The application includes a performance dashboard that compares:

- Response time for direct API calls
- End-to-end time for queue-based processing
- Server load under different concurrency levels
- Cost implications of both approaches

## Technologies Used

- **Next.js**: Frontend framework
- **Express**: Backend server
- **Prisma**: Database ORM
- **PostgreSQL**: Database
- **QStash**: Message queue
- **OpenAI API**: AI text summarization
- **ShadCN UI**: Component library

## Development

### Adding UI Components

```bash
pnpm dlx shadcn@latest add [component-name]
```

### Database Schema Updates

```bash
pnpm prisma migrate dev --name [migration-name]
```

## License

[MIT](LICENSE)
