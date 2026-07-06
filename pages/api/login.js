import { authenticateUser } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { identifier, password } = req.body;
    try {
      const user = await authenticateUser(identifier, password);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (error) {
      console.error("Login API Error:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
