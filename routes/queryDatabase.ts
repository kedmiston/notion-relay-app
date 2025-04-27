import express from 'express';
import { Client } from '@notionhq/client';

const router = express.Router();
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// POST /query-database
router.post('/query-database', async (req, res) => {
  try {
    const { databaseId, filter } = req.body;

    if (!databaseId) {
      return res.status(400).json({ error: 'Missing databaseId' });
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: filter || undefined,
    });

    res.json({ results: response.results });
  } catch (error: any) {
    console.error('Failed to query database:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
