import express from 'express';
import gmailService from '../services/gmailService';
import outlookService from '../services/outlookService';
import emailQueue from '../queue/emailQueue';

const router = express.Router();

router.get('/gmail', (req, res) => {
  const authUrl = gmailService.getAuthUrl();
  res.redirect(authUrl);
});

router.get('/gmail/callback', async (req, res) => {
  const { code } = req.query;
  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid authorization code' });
  }

  try {
    const accessToken = await gmailService.getToken(code);
    await emailQueue.addJob(accessToken, 'gmail');
    res.json({ message: 'Gmail authentication successful, email processing job added to queue' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to authenticate with Gmail' });
  }
});

router.get('/outlook', (req, res) => {
  const authUrl = outlookService.getAuthUrl();
  res.redirect(authUrl);
});

router.get('/outlook/callback', async (req, res) => {
  const { code } = req.query;
  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid authorization code' });
  }

  try {
    const accessToken = await outlookService.getToken(code);
    await emailQueue.addJob(accessToken, 'outlook');
    res.json({ message: 'Outlook authentication successful, email processing job added to queue' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to authenticate with Outlook' });
  }
});

export default router;