import Discord, { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import { Character } from '../lib/types';
import getCharacter from '../lib/utils/getCharacter';
import replyCharacter from '../lib/utils/replyCharacter';

const Roll = new Command({
  name: 's',
  description: 'Search for an anime character',
  type: CommandType.TEXT,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    message = message as Discord.Message;

    let endSlice = args.length;
    let index = 1;
    // @ts-ignore
    if (!isNaN(args[args.length - 1])) {
      endSlice = -1;
      index = Number(args[args.length - 1]);
    }
    const characterName = args.slice(1, endSlice).join(' ');
    console.log(characterName);
    console.log(index);

    let character: Character | undefined;
    try {
      character = await getCharacter(null, characterName, index - 1, false);

      if (!character) return message.reply("Can't find character!");
    } catch (err) {
      console.warn(err);
      return message.reply("Can't find character!");
    }

    replyCharacter(message, character);
  },
});

module.exports = Roll;
