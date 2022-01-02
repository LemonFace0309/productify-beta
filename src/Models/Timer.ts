import mongoose from 'mongoose';

export interface TimerDocument extends mongoose.Document {
  guildId: string;
  channels: string[];
}

const TimerSchema = new mongoose.Schema<TimerDocument>({
  guildId: {
    type: String,
    required: true,
  },
  channels: {
    type: [String],
    required: true,
  },
});

export default mongoose.model<TimerDocument>('Timer', TimerSchema);
