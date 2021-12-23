import mongoose from 'mongoose';

export interface CharacterDocument extends mongoose.Document {
  characterId: string;
}

const CharacterSchema = new mongoose.Schema<CharacterDocument>({
  characterId: {
    type: String,
    required: true,
  },
});

export default CharacterSchema;
