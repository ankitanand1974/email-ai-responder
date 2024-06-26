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

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 10,
        n: 1,
        temperature: 0.5,
      });

      const message = response.choices[0]?.message;
      if (message && message.content) {
        return message.content.trim();
      } else {
        throw new Error('Unexpected response structure from OpenAI');
      }
    } catch (error) {
      console.error('Error in analyzeEmailContent:', error);
      throw error;
    }
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

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        n: 1,
        temperature: 0.7,
      });

      const message = response.choices[0]?.message;
      if (message && message.content) {
        return message.content.trim();
      } else {
        throw new Error('Unexpected response structure from OpenAI');
      }
    } catch (error) {
      console.error('Error in generateResponse:', error);
      throw error;
    }
  }
}

export default new OpenAIService();