import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  specialty:   { type: String, required: true },
  experience:  { type: String, default: '' },
  description: { type: String, default: '' },
  photo:       { type: String, default: '' },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);
