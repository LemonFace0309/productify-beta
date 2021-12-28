import mongoose from 'mongoose';

export interface CharacterDocument extends mongoose.Document {
  characterId: number;
  sukoa: number;
  name: string,
  mediaName: string;
}

export const CharacterSchema = new mongoose.Schema<CharacterDocument>({
  characterId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mediaName: {
    type: String,
    required: true,
  },
  sukoa: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<CharacterDocument>('Character', CharacterSchema);
