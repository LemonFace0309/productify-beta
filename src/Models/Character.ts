import mongoose from 'mongoose';

export interface CharacterDocument extends mongoose.Document {
  characterId: number;
  sukoa: number;
}

const CharacterSchema = new mongoose.Schema<CharacterDocument>({
  characterId: {
    type: Number,
    required: true,
  },
  sukoa: {
    type: Number,
    required: true,
  },
});

export default CharacterSchema;
