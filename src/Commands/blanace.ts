import Discord, { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import getOrCreateUser from '../lib/utils/getOrCreateUser'; 

const Give = new Command({
  name: 'profile',
  description: 'View your profile',
  type: CommandType.TEXT,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    message = message as Discord.Message;

    const embed = new Discord.MessageEmbed();
    const author = message.author;

    const userObj: GuildMember | undefined = message.guild?.members.cache.find((member) => member.id === author.id);

    if (!userObj) return message.reply(`User does not exist!`);

    const user = await getOrCreateUser(userObj.id);

    if (!user) return message.reply('Unable to check your balance');

    embed
      .setTitle('Profile')
      .setAuthor(author.username)
      .setDescription(`Each roll costs 25 coins for an anime waifu or husbando <:pepelove:917313905422893146>`)
      .setThumbnail(<string>author.avatarURL({ dynamic: true }))
      .setColor('GREEN')
      .setFields([
        {
          name: 'Balance',
          value: `${user.coins ?? 0} coins`,
          inline: true,
        },
      ])

    message.reply({ embeds: [embed] });
  },
});

module.exports = Give;
