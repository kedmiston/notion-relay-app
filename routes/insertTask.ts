// routes/insertTask.ts

import { Router } from 'express';
import { Client } from '@notionhq/client';

const router = Router();
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// POST /insert-task
router.post('/insert-task', async (req, res) => {
  try {
    const { databaseId, name, description } = req.body;

    if (!databaseId || !name) {
      return res.status(400).json({ error: 'Missing databaseId or name' });
    }

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name
              }
            }
          ]
        },
        Description: description
          ? {
              rich_text: [
                {
                  text: {
                    content: description
                  }
                }
              ]
            }
          : undefined
      }
    });

    res.status(200).json({ success: true, pageId: response.id });
  } catch (error: any) {
    console.error('Failed to insert task:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
