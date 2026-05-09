import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  discount:    { type: String, default: '' }, // например "20%" или "1000 ₽"
  active:      { type: Boolean, default: true },
  expiresAt:   { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('Promotion', promotionSchema);
