import { getMenu } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const menu = await getMenu();
      res.status(200).json(menu);
    } catch (error) {
      console.error("API GET /api/menu Error:", error);
      res.status(500).json({ error: 'Failed to fetch menu' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
