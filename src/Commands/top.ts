import Discord from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import { Character } from '../lib/types';
import { getCharacters } from '../lib/utils/getCharacter';
import { replyCharacterList } from '../lib/utils/replyCharacter';

const Top = new Command({
  name: 'top',
  description: 'Get the top characters',
  type: CommandType.TEXT,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    message = message as Discord.Message;

    let characters: Character[] | undefined;
    const quantity = 50;
    try {
      characters = await getCharacters(quantity, null, false);

      if (!characters) throw new Error('Unable to get characters');

    } catch (err) {
      console.warn(err);
      return message.reply('😱 Unable to get characters');
    }

    // creating embed pages
    const pages: Discord.MessageEmbed[] = [];
    let isFirstPage = true;
    for (let i = 0; i < Math.ceil(quantity / 15); ++i) {
      const embed = new Discord.MessageEmbed();
      let description = '';
  
      for (let j = 0; j < 15; ++j) {
        const rank = (i * 15) + j + 1;
        const character = characters[rank - 1];

        if (!character) break;

        const charLink = character?.media?.edges[0];
        const sukoa = Math.floor(character.favourites / 10);
        description += `**#${rank} ${character.name.full}:** ${
          charLink?.node?.title.english ?? charLink?.node?.title.native
        } - ${sukoa} 💎\n`;

        if (isFirstPage) {
          embed.setAuthor(`🏆 TOP ${quantity}`);
          isFirstPage = false;
        }
      }
      embed.setDescription(description);
      pages.push(embed);
    }

    try {
      await replyCharacterList(message, characters, `🏆 TOP ${quantity}`);
    } catch (err) {
      console.log(err);
      message.reply('Unable to get top characters!')
    }
  },
});

module.exports = Top;
