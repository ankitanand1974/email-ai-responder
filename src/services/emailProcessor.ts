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
      emails = gmailEmails.map(email => {
        console.log('Processing email:', JSON.stringify(email, null, 2));
        if (!email || !email.payload || !email.payload.headers) {
          console.error('Unexpected email structure:', email);
          return null;
        }
        const fromHeader = email.payload.headers.find((header: any) => header.name === 'From');
        const subjectHeader = email.payload.headers.find((header: any) => header.name === 'Subject');
        return {
          id: email.id,
          from: fromHeader ? fromHeader.value : 'Unknown',
          subject: subjectHeader ? subjectHeader.value : 'No Subject',
          body: this.getEmailBody(email),
          service: 'gmail'
        };
      }).filter((email): email is Email => email !== null);
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
      if (email) {
        await this.processEmail(accessToken, email);
      }
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
    if (!email || !email.payload || !email.payload.parts) {
      console.error('Invalid email structure for body extraction:', email);
      return '';
    }
    const body = email.payload.parts.find((part: any) => part.mimeType === 'text/plain');
    return body && body.body && body.body.data
      ? Buffer.from(body.body.data, 'base64').toString()
      : '';
  }
}

export default new EmailProcessor();