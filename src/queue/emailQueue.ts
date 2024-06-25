import { Queue, Worker, Job } from 'bullmq';
import config from '../config/config';
import emailProcessor from '../services/emailProcessor';

interface EmailProcessingJob {
  accessToken: string;
  service: 'gmail' | 'outlook';
}

class EmailQueue {
  private queue: Queue;
  private worker: Worker;

  constructor() {
    this.queue = new Queue('email-processing', {
      connection: {
        host: config.redis.host,
        port: config.redis.port,
      },
    });

    this.worker = new Worker('email-processing', this.processJob, {
      connection: {
        host: config.redis.host,
        port: config.redis.port,
      },
    });

    this.worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed with error: ${err.message}`);
    });
  }

  async addJob(accessToken: string, service: 'gmail' | 'outlook'): Promise<void> {
    await this.queue.add('process-emails', { accessToken, service });
  }

  private async processJob(job: Job<EmailProcessingJob>): Promise<void> {
    const { accessToken, service } = job.data;
    await emailProcessor.processEmails(accessToken, service);
  }
}

export default new EmailQueue();