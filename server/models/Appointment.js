import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  phone:   { type: String, required: true },
  message: { type: String, default: '' },
  status:  { type: String, enum: ['new', 'called', 'done'], default: 'new' },
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
