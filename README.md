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
    ```sh
    git clone https://github.com/ankitanand1974/email-ai-responder.git
    cd email-ai-responder
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
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
    ```

4. Start Redis server:
    ```sh
    redis-server
    ```

5. Compile TypeScript:
    ```sh
    npx tsc
    ```

6. Start the application:
    ```sh
    npm start
    ```

## Usage

- Access the application at [http://localhost:3000](http://localhost:3000)
- Authenticate with Gmail or Outlook
- The system will automatically process incoming emails and generate responses

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
