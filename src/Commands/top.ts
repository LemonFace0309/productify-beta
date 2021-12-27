import Discord, { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import { Character } from '../lib/types';
import { getCharacters } from '../lib/utils/getCharacter';
import { replyCharacters } from '../lib/utils/replyCharacter';

const Roll = new Command({
  name: 'top',
  description: 'Get the top characters',
  type: CommandType.TEXT,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    message = message as Discord.Message;

    let characters: Character[] | undefined;
    try {
      characters = await getCharacters(30, '', true);

      if (!characters) throw new Error('Unable to get characters');

    } catch (err) {
      console.warn(err);
      return message.reply('😱 Unable to get characters');
    }

    replyCharacters(message, characters);
  },
});

module.exports = Roll;
