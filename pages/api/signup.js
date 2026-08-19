import { createUser } from '../../lib/db';

function validateEmail(email) {
    if (!email || email.length < 5 || email.length > 50) return 'ERR_EMAIL_LENGTH';
    if (email.includes(' ')) return 'ERR_EMAIL_SPACE';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'ERR_EMAIL_FORMAT';
    return null;
}

function validatePassword(password) {
    if (!password) return 'ERR_PWD_EMPTY';
    if (password.length < 4 || password.length > 12) return 'ERR_PWD_LENGTH';
    if (password.includes(' ')) return 'ERR_PWD_SPACE';
    const validCharsRegex = /^[a-zA-Z0-9.\-_@]+$/;
    if (!validCharsRegex.test(password)) return 'ERR_PWD_INVALID_CHARS';
    const numberRegex = /[0-9]/;
    if (!numberRegex.test(password)) return 'ERR_PWD_NO_NUMBER';
    return null;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name } = req.body;
    
    const emailErr = validateEmail(email);
    if (emailErr) return res.status(400).json({ error: 'Error: Please write down email correctly', code: emailErr });
    
    const pwdErr = validatePassword(password);
    if (pwdErr) return res.status(400).json({ error: 'Invalid password format', code: pwdErr });

    try {
      const user = await createUser(email, password, name);
      if (user.error) {
        res.status(400).json({ error: user.error, code: 'ERR_DB_USER_CREATE' });
      } else {
        res.status(201).json(user);
      }
    } catch (error) {
      console.error("Signup API Error:", error);
      res.status(500).json({ error: 'Internal server error', code: 'ERR_SERVER' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
