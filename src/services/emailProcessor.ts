import gmailService from './gmailService';
import outlookService from './outlookService';
import openAIService from './openaiService';

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  service: 'gmail' | 'outlook';
}

class EmailProcessor {
  async processEmails(accessToken: string, service: 'gmail' | 'outlook'): Promise<void> {
    let emails: Email[];

    if (service === 'gmail') {
      const gmailEmails = await gmailService.getEmails(accessToken);
      emails = gmailEmails.map(email => ({
        id: email.id,
        from: email.payload.headers.find((header: any) => header.name === 'From').value,
        subject: email.payload.headers.find((header: any) => header.name === 'Subject').value,
        body: this.getEmailBody(email),
        service: 'gmail'
      }));
    } else {
      const outlookEmails = await outlookService.getEmails(accessToken);
      emails = outlookEmails.map(email => ({
        id: email.id,
        from: email.from.emailAddress.address,
        subject: email.subject,
        body: email.body.content,
        service: 'outlook'
      }));
    }

    for (const email of emails) {
      await this.processEmail(accessToken, email);
    }
  }

  private async processEmail(accessToken: string, email: Email): Promise<void> {
    const category = await openAIService.analyzeEmailContent(email.body);
    const response = await openAIService.generateResponse(category, email.body);

    if (email.service === 'gmail') {
      await gmailService.sendEmail(accessToken, email.from, `Re: ${email.subject}`, response);
    } else {
      await outlookService.sendEmail(accessToken, email.from, `Re: ${email.subject}`, response);
    }

    console.log(`Processed email: ${email.id}, Category: ${category}`);
  }

  private getEmailBody(email: any): string {
    const body = email.payload.parts.find((part: any) => part.mimeType === 'text/plain');
    return body ? Buffer.from(body.body.data, 'base64').toString() : '';
  }
}

export default new EmailProcessor();