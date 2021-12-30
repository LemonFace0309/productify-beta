import { Message, Permissions } from 'discord.js';

import Command from '../Structures/Command';
import { Character } from './types';
import { CharacterDocument } from '../Models/Character';

export const isMessage = (message: Message): message is Message => {
  return !!message;
};

export const isCommand = (arr: Command | undefined): arr is Command => {
  return arr !== undefined;
};

export const isPermissions = (p: Readonly<Permissions> | string): p is Readonly<Permissions> => {
  return typeof p !== 'string';
};

export const isApiCharacter = (c: Character | CharacterDocument): c is Character => {
  return (c as Character).siteUrl !== undefined;
};
