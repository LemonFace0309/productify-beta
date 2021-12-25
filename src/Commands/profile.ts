import Discord, { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import { Character } from '../lib/types';
import getCharacter from '../lib/utils/getCharacter';
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

    if (!user) return message.reply('Unable to check your profile');

    const totalSukao = user.characters.reduce((acc, val) => (acc += val.sukoa), 0) ?? 0;
    embed
      .setTitle('Profile')
      // .setAuthor(author.username)
      .setDescription(`Knowledge is Power <:PandaCool:908492210679455786>`)
      .setThumbnail(<string>author.avatarURL({ dynamic: true }))
      .setColor('GREEN')
      .setFields([
        {
          name: 'Balance',
          value: `${user.coins ?? 0} coins`,
          inline: true,
        },
        {
          name: 'Total Sukoa',
          value: `${totalSukao} 💎`,
          inline: true,
        },
      ]);

    if (user.mainCharacter) {
      try {
        const character: Character | undefined = await getCharacter(user.mainCharacter.characterId);
        if (character) {
          embed.setImage(character.image.large);
        }
      } catch (err) {
        console.warn(err);
      }
    }

    message.reply({ embeds: [embed] });
  },
});

module.exports = Give;
