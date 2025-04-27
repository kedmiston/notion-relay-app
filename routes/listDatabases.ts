// routes/listDatabases.ts

import { Router } from 'express';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// GET /list-databases
router.get('/list-databases', async (req, res) => {
  try {
    const response = await notion.search({
      page_size: 20,
      filter: { property: 'object', value: 'database' }
    });

    const databases = response.results.map((db: any) => ({
      id: db.id,
      title: db?.title?.[0]?.plain_text || 'Untitled',
      url: db.url
    }));

    res.json({ databases });
  } catch (error: any) {
    console.error('Error listing databases:', error);
    res.status(500).json({ error: 'Failed to fetch databases.' });
  }
});

export default router;
