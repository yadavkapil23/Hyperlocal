import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: databaseUrl });

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1 as ok');
    res.json({ status: 'ok', db: result.rows[0].ok === 1 });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.get('/api/v1/hello', (req, res) => {
  res.json({ message: 'Third-Place API' });
});

app.listen(port, () => {
  console.log(`Backend listening on :${port}`);
});


