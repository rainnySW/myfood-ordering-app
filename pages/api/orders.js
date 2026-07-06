import { createOrder } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const order = await createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  } else if (req.method === 'GET') {
    try {
      const { getOrders } = require('../../lib/db');
      const orders = await getOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
