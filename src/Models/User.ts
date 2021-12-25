import mongoose from 'mongoose';

import { CharacterSchema, CharacterDocument } from './Character';
export interface UserDocument extends mongoose.Document {
  userId: string;
  goalsStreak: number;
  coins: number;
  characters: CharacterDocument[];
  mainCharacter?: CharacterDocument;
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
    characters: {
      type: [CharacterSchema],
      required: true,
      default: [],
    },
    mainCharacter: {
      type: CharacterSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<UserDocument>('User', UserSchema);
