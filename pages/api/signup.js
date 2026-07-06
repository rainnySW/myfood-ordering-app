import { createUser } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name } = req.body;
    try {
      const user = await createUser(email, password, name);
      if (user.error) {
        res.status(400).json({ error: user.error });
      } else {
        res.status(201).json(user);
      }
    } catch (error) {
      console.error("Signup API Error:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
