import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image_url: { type: String, required: true },
  description: { type: String },
  is_available: { type: Boolean, default: true }
});

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
