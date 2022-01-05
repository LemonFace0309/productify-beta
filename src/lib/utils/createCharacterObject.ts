import Character from '../../Models/Character';
import { Character as CharacterType } from '../types';

export const createCharacterObjects = (characters: CharacterType[]) => {
  return characters.map((character) => {
    return new Character({
      characterId: character.id,
      name: character.name.full,
      mediaName:
        character?.media?.edges[0]?.node?.title.english ?? character?.media?.edges[0]?.node?.title.native ?? '',
      sukoa: Math.floor(character.favourites / 10),
    });
  });
};

const createCharacterObject = (character: CharacterType) => {
  return new Character({
    characterId: character.id,
    name: character.name.full,
    mediaName: character?.media?.edges[0]?.node?.title.english ?? character?.media?.edges[0]?.node?.title.native ?? '',
    sukoa: Math.floor(character.favourites / 10),
  });
};

export default createCharacterObject;
