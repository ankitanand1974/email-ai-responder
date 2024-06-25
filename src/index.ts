import express from 'express';
import config from './config/config';
import authRoutes from './routes/authRoutes';
import emailQueue from './queue/emailQueue';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

// Endpoint to manually trigger email processing
app.post('/process-emails', async (req, res) => {
  const { accessToken, service } = req.body;
  if (!accessToken || !service) {
    return res.status(400).json({ error: 'Missing accessToken or service' });
  }

  await emailQueue.addJob(accessToken, service);
  res.json({ message: 'Email processing job added to queue' });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});