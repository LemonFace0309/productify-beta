import Discord, { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import { CharacterDocument } from '../Models/Character';
import { Character as CharacterType } from '../lib/types';
import { getCharacters } from '../lib/utils/getCharacter';
import getOrCreateUser from '../lib/utils/getOrCreateUser';
import createCharacterObject from '../lib/utils/createCharacterObject';

const SetMainCharacter = new Command({
  name: 'set',
  description: 'Set your main character',
  type: CommandType.TEXT,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    message = message as Discord.Message;

    const author = message.author;
    const characterName = args.slice(1).join(' ');

    const userObj: GuildMember | undefined = message.guild?.members.cache.find((member) => member.id === author.id);
    if (!userObj) return message.reply(`User does not exist!`);
    const user = await getOrCreateUser(userObj.id);
    if (!user) return message.reply('Unable to set your main character');

    let characters: CharacterType[] | undefined;
    let mainCharacter: CharacterDocument;
    try {
      characters = await getCharacters(5, characterName);

      if (!characters || characters.length == 0) return message.reply("Can't find character!");

      const userCharacterIds = user.characters.map((c) => c.characterId);
      const matchedCharacter = characters.find((c) => userCharacterIds.includes(c.id));
      if (!matchedCharacter) return message.reply(`You don't own ${characters[0].name.full ?? characterName}!`);

      mainCharacter = createCharacterObject(matchedCharacter);
      user.mainCharacter = mainCharacter;
      await user.save();
    } catch (err) {
      console.warn(err);
      return message.reply("Can't find character!");
    }

    message.reply(`Successfully changed your main character to ${mainCharacter.name}`);
  },
});

module.exports = SetMainCharacter;
