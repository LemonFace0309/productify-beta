import Discord, { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import Character from '../Models/Character';
import { Character as CharacterType } from '../lib/types';
import getCharacter from '../lib/utils/getCharacter';
import getOrCreateUser from '../lib/utils/getOrCreateUser';

const Give = new Command({
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

    let character: CharacterType | undefined;
    try {
      character = await getCharacter(null, characterName, false);

      if (!character) return message.reply("Can't find character!");

      const id = character.id;
      const hasCharacter = user.characters.some((c) => c.characterId === id);
      if (!hasCharacter) return message.reply(`You don't own ${character.name.full}!`);

      const mainCharacter = new Character({
        characterId: id,
        sukoa: Math.floor(character.favourites / 10),
      });
      user.mainCharacter = mainCharacter;
      await user.save();
    } catch (err) {
      console.warn(err);
      return message.reply("Can't find character!");
    }

    message.reply(`Successfully changed your main character to ${character.name.full}`);
  },
});

module.exports = Give;
