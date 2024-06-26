# Email AI Responder

Email AI Responder is an automated system that processes incoming emails from Gmail and Outlook accounts, analyzes their content using OpenAI's GPT model, and generates appropriate responses based on the email's context.

## Features

- OAuth 2.0 authentication for Gmail and Outlook
- Email fetching from Gmail and Outlook
- Content analysis using OpenAI's GPT-3.5-turbo model
- Automated response generation
- Redis-based job queue for scalable email processing
- Rate limiting and error handling for API requests

## Technologies Used

- Node.js
- TypeScript
- Express.js
- Redis (Bull MQ)
- OpenAI API
- Gmail API
- Microsoft Graph API (for Outlook)

## Setup

1. Clone the repository:
git clone https://github.com/ankitanand1974/email-ai-responder.git
cd email-ai-responder

3. Install dependencies:
npm install
   
4. Set up environment variables:
Create a `.env` file in the root directory and add the following:
PORT=3000
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REDIRECT_URI=http://localhost:3000/auth/gmail/callback
OUTLOOK_CLIENT_ID=your_outlook_client_id
OUTLOOK_CLIENT_SECRET=your_outlook_client_secret
OUTLOOK_REDIRECT_URI=http://localhost:3000/auth/outlook/callback
OPENAI_API_KEY=your_openai_api_key
REDIS_HOST=localhost
REDIS_PORT=6379

5. Start Redis server:
redis-server

6. Compile TypeScript:
npx tsc

7. Start the application:
npm start

## Usage

1. Access the application at `http://localhost:3000`
2. Authenticate with Gmail or Outlook
3. The system will automatically process incoming emails and generate responses

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
