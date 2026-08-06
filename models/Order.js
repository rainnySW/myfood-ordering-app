import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  menu_item_id: { type: String, ref: 'Menu' },
  name: { type: String },
  price_per_unit: { type: Number },
  quantity: { type: Number, required: true },
  subtotal: { type: Number },
  special_instructions: { type: String }
});

const OrderSchema = new mongoose.Schema({
  table_number: { type: String, required: true },
  items: [OrderItemSchema],
  total_amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Served', 'Cancelled'], 
    default: 'Pending' 
  },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
