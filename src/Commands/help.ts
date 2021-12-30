import Discord, { GuildMember } from 'discord.js';

import Command, { CommandType } from '../Structures/Command';
import { Character } from '../lib/types';
import getOrCreateUser from '../lib/utils/getOrCreateUser';
import getCharacter from '../lib/utils/getCharacter';
import replyCharacter from '../lib/utils/replyCharacter';
import createCharacterObject from '../lib/utils/createCharacterObject';

const Help = new Command({
  name: 'help',
  description: 'Get a list of available commands',
  type: CommandType.TEXT,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    const embed = new Discord.MessageEmbed();

    embed.setTitle('Productify Help Menu').setDescription(`
      **Anime Rewards**
      $r - rolls for a random anime character (costs 50 coins)
      $s *character* [*index*] - searches for an anime character
      $top - gets the top 50 characters
      $set *character* - sets your main character, viewable with $profile
      $profile [*@name*] - displays profile information
      $inv  [*@name*] - displays inventory information

      **100 coins** are given out to those in a **voice channel or stage channel** every **15 minutes**.
      Additionally, you can get another 100 coins by setting your **goals every 24 hours**.
    `);

    return message.reply({ embeds: [embed] });

  },
});

module.exports = Help;
