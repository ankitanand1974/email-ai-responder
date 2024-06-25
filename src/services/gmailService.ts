import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import config from '../config/config';

class GmailService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      config.gmail.clientId,
      config.gmail.clientSecret,
      config.gmail.redirectUri
    );
  }

  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.modify',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  async getToken(code: string): Promise<string> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens.access_token as string;
  }

  async getEmails(accessToken: string): Promise<any[]> {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
    });

    const messages = response.data.messages || [];
    const emails = await Promise.all(
      messages.map(async (message) => {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: message.id as string,
        });
        return email.data;
      })
    );

    return emails;
  }

  async sendEmail(accessToken: string, to: string, subject: string, body: string): Promise<void> {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      body,
    ];
    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
  }
}

export default new GmailService();