import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  portrait_url: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'kitchen'], default: 'customer' },
  preferences: {
    darkMode: { type: Boolean, default: false },
    language: { type: String, default: 'th', enum: ['en', 'th'] },
    disableAnimations: { type: Boolean, default: false }
  },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
