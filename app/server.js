const express = require('express');
const fs = require('fs/promises');

const app = express();
const PORT = 3000;
const DATA_FILE = '/data/message.json';

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Docker Persistence App is running!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/data', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    res.type('json').send(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.json({ message: 'No persistent data saved yet.' });
    }
    res.status(500).json({ error: 'Could not read persistent data' });
  }
});

app.post('/data', async (req, res) => {
  try {
    await fs.mkdir('/data', { recursive: true });
    const record = {
      message: req.body.message || 'Persistent data',
      savedAt: new Date().toISOString()
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(record, null, 2));
    res.status(201).json({
      status: 'saved',
      data: record
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not save data' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App listening on port ${PORT}`);
});
