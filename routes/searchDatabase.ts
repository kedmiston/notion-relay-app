// routes/searchDatabase.ts

import { Router } from 'express';
import { Client } from '@notionhq/client';

const router = Router();
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// POST /search-database
router.post('/search-database', async (req, res) => {
  try {
    const { databaseId, keyword } = req.body;

    if (!databaseId || !keyword) {
      return res.status(400).json({ error: 'Missing databaseId or keyword' });
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        or: [
          {
            property: 'Name',
            title: {
              contains: keyword
            }
          },
          {
            property: 'Description',
            rich_text: {
              contains: keyword
            }
          }
        ]
      }
    });

    res.json({ results: response.results });
  } catch (error: any) {
    console.error('Failed to search database:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
