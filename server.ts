import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Client } from '@notionhq/client';
import path from 'path';
import listDatabases from './routes/listDatabases';
import queryDatabase from './routes/queryDatabase';
import searchDatabase from './routes/searchDatabase';
import insertTask from './routes/insertTask';
import describeDatabase from './routes/describeDatabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });

app.use(express.json());
app.use('/', listDatabases);
app.use('/', queryDatabase);
app.use('/', searchDatabase);
app.use('/', insertTask);
app.use('/', describeDatabase);

// Serve static files (important!)
app.use(express.static(path.join(__dirname, 'public')));

// Root health check
app.get('/', (req: Request, res: Response) => {
  res.send('Relay App is live!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
