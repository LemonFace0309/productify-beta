import Discord, { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import { Character } from '../lib/types';
import getCharacter, { getCharacters } from '../lib/utils/getCharacter';
import replyCharacter, { replyCharacterScroll } from '../lib/utils/replyCharacter';

const Roll = new Command({
  name: 's',
  description: 'Search for an anime character',
  type: CommandType.TEXT,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    message = message as Discord.Message;

    try {
      // @ts-ignore
      if (!isNaN(args[args.length - 1])) {
        const index = Number(args[args.length - 1]);
        const characterName = args.slice(1, -1).join(' ');

        const character = await getCharacter(null, characterName, index - 1, false);

        if (!character) return message.reply("Can't find character!");

        replyCharacter(message, character);
      } else {
        const characterName = args.slice(1).join(' ');

        const characters = await getCharacters(5, characterName);

        if (!characters) return message.reply("Can't find character!");

        if (characters.length == 1) return replyCharacter(message, characters[0]);
      
        replyCharacterScroll(message, characters);
      }
    } catch (err) {
      console.warn(err);
      return message.reply("Can't find character!");
    }
  },
});

module.exports = Roll;
