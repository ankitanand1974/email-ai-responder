import { Configuration, OpenAIApi } from 'openai';
import config from '../config/config';

class OpenAIService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: config.openai.apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async analyzeEmailContent(content: string): Promise<string> {
    const prompt = `Analyze the following email content and categorize it as 'Interested', 'Not Interested', or 'More Information':

${content}

Category:`;

    const response = await this.openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 10,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    return response.data.choices[0].text.trim();
  }

  async generateResponse(category: string, content: string): Promise<string> {
    let prompt = '';

    switch (category) {
      case 'Interested':
        prompt = `Generate a friendly response to the following email, suggesting a demo call and proposing a time:

${content}

Response:`;
        break;
      case 'Not Interested':
        prompt = `Generate a polite response to the following email, thanking them for their time and leaving the door open for future communication:

${content}

Response:`;
        break;
      case 'More Information':
        prompt = `Generate a helpful response to the following email, providing more information about our product/service and inviting further questions:

${content}

Response:`;
        break;
      default:
        throw new Error('Invalid category');
    }

    const response = await this.openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  }
}

export default new OpenAIService();