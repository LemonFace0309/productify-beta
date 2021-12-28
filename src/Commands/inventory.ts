import Discord, { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import getOrCreateUser from '../lib/utils/getOrCreateUser';
import paginationEmbed from '../lib/utils/paginationEmbed';
import { CharacterDocument } from '../Models/Character';

const Roll = new Command({
  name: 'inv',
  description: 'Get all your characters',
  type: CommandType.TEXT,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    message = message as Discord.Message;

    let authorId = message.author.id;
    if (args.length > 1) {
      const startingIndex = args[1][2] == '!' ? 3 : 2;
      authorId = args[1].slice(startingIndex, -1);
    }

    const userObj: GuildMember | undefined = message.guild?.members.cache.find((member) => member.id === authorId);

    if (!userObj) return message.reply(`User does not exist!`);

    const user = await getOrCreateUser(userObj.id);

    if (!user) return message.reply('Unable to check your inventory');

    let characters: CharacterDocument[] = user.characters;
    const quantity = characters.length;

    // creating embed pages
    const pages: Discord.MessageEmbed[] = [];
    let isFirstPage = true;
    for (let i = 0; i < Math.ceil(quantity / 15); ++i) {
      const embed = new Discord.MessageEmbed();
      let description = '';

      for (let j = 0; j < 15; ++j) {
        const rank = i * 15 + j + 1;
        const character = characters[rank - 1];

        if (!character) break;

        description += `**#${rank} ${character.name}:** ${character.mediaName} - ${character.sukoa} 💎\n`;

        if (isFirstPage) {
          embed.setAuthor(`Inventory: ${quantity} characters owned`);
          isFirstPage = false;
        }
      }
      embed.setDescription(description);
      pages.push(embed);
    }

    try {
      await paginationEmbed(message, pages);
    } catch (err) {
      console.log(err);
      message.reply('Unable to get top characters!');
    }
  },
});

module.exports = Roll;
