import { updateUserProfile } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, portrait_url, name, preferences } = req.body;
  const updateData = {};
  if (portrait_url !== undefined) updateData.portrait_url = portrait_url;
  if (name !== undefined) updateData.name = name;
  if (preferences !== undefined) updateData.preferences = preferences;

  const updatedUser = await updateUserProfile(email, updateData);
  if (updatedUser) {
    // Only return the fields we explicitly updated to prevent wiping frontend state with fallback defaults!
    return res.status(200).json({ email, ...updateData });
  } else {
    return res.status(404).json({ error: 'User not found' });
  }
}
