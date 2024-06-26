import OpenAI from 'openai';
import config from '../config/config';

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  async analyzeEmailContent(content: string): Promise<string> {
    const prompt = `Analyze the following email content and categorize it as 'Interested', 'Not Interested', or 'More Information':
${content}
Category:`;

    const response = await this.openai.completions.create({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 10,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    return response.choices[0].text.trim();
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

    const response = await this.openai.completions.create({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    return response.choices[0].text.trim();
  }
}

export default new OpenAIService();