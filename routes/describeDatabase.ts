import express from 'express';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Route to describe a database structure
router.post('/describe-database', async (req, res) => {
  const { databaseId } = req.body;

  if (!databaseId) {
    return res.status(400).json({ error: 'Missing databaseId' });
  }

  try {
    const response = await notion.databases.retrieve({ database_id: databaseId });

    const properties = Object.entries(response.properties).map(([name, prop]: any) => ({
      name,
      type: prop.type,
      ...(prop.type === 'relation' && { relationDatabaseId: prop.relation?.database_id || null })
    }));

    res.json({ databaseId, title: response.title?.[0]?.plain_text || 'Untitled', properties });
  } catch (error: any) {
    console.error('Error describing database:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
