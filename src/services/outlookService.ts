import { ConfidentialClientApplication } from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import config from '../config/config';

class OutlookService {
  private msalClient: ConfidentialClientApplication;

  constructor() {
    this.msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: config.outlook.clientId,
        clientSecret: config.outlook.clientSecret,
        authority: 'https://login.microsoftonline.com/common',
      },
    });
  }

  getAuthUrl(): string {
    const scopes = ['https://graph.microsoft.com/Mail.Read', 'https://graph.microsoft.com/Mail.Send'];
    return this.msalClient.getAuthCodeUrl({
      scopes: scopes,
      redirectUri: config.outlook.redirectUri,
    });
  }

  async getToken(code: string): Promise<string> {
    const result = await this.msalClient.acquireTokenByCode({
      code,
      scopes: ['https://graph.microsoft.com/Mail.Read', 'https://graph.microsoft.com/Mail.Send'],
      redirectUri: config.outlook.redirectUri,
    });

    return result.accessToken;
  }

  async getEmails(accessToken: string): Promise<any[]> {
    const authProvider = new TokenCredentialAuthenticationProvider({
      getToken: async () => accessToken,
    });

    const graphClient = Client.initWithMiddleware({ authProvider });

    const response = await graphClient
      .api('/me/messages')
      .top(10)
      .select('subject,body,from,receivedDateTime')
      .orderby('receivedDateTime DESC')
      .get();

    return response.value;
  }

  async sendEmail(accessToken: string, to: string, subject: string, body: string): Promise<void> {
    const authProvider = new TokenCredentialAuthenticationProvider({
      getToken: async () => accessToken,
    });

    const graphClient = Client.initWithMiddleware({ authProvider });

    const message = {
      subject: subject,
      body: {
        contentType: 'Text',
        content: body,
      },
      toRecipients: [
        {
          emailAddress: {
            address: to,
          },
        },
      ],
    };

    await graphClient.api('/me/sendMail').post({ message });
  }
}

export default new OutlookService();