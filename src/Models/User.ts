import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
  userId: string;
  goalsStreak: number;
  coins: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    goalsStreak: {
      type: Number,
      required: true,
    },
    coins: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<UserDocument>('User', UserSchema);
