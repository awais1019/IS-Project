import mongoose from 'mongoose';

const AnalysisResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  label: { type: String, enum: ['POSITIVE', 'NEGATIVE'], required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('AnalysisResult', AnalysisResultSchema);