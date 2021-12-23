import Discord, { GuildMember } from 'discord.js';
import axios from 'axios';

import Command, { CommandType } from '../Structures/Command';
import getOrCreateUser from '../utils/getOrCreateUser';

const query = `
query ($page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    characters {
      id
      name {
        first
        middle
        last
        full
        native
        userPreferred
      }
      description
      image {
        large
        medium
      }
      age
      dateOfBirth {
        month
        day
      }
      gender
      siteUrl
      media {
        edges {
          characterName
          characterRole
          node {
            title {
              english
              native
            }
            averageScore
            popularity
            trending
            favourites
          }
        }
      }
    }
  }
}
`;

const Roll = new Command({
  name: 'r',
  description: 'Roll for a random waifu or husbando',
  type: CommandType.TEXT,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    message = message as Discord.Message;

    const author = message.author;
    const userObj: GuildMember | undefined = message.guild?.members.cache.find((member) => member.id === author.id);

    if (!userObj) return message.reply(`User does not exist!`);

    const user = await getOrCreateUser(userObj.id);

    if (!user) return message.reply('Unable to roll. Try again later 😴');

    if (user.coins < 25)
      return message.reply('Insufficient balance! You need at least 25 coins to roll <PandaCry:908492210717200485>');

    const variables = {
      page: Math.floor(Math.random() * 116313) + 1,
      perPage: 1,
    };

    let character;
    let charLink;
    try {
      const result = await axios.post(client.aniListUrl, {
        query,
        variables,
      });
      character = result.data?.data?.Page?.characters[0];
      charLink = character.media.edges[0];

      user.coins -= 25;
      // @ts-ignore
      user.characters.push({ characterId: character.id });
      await user.save();
    } catch (err) {
      console.warn(err);
    }

    const embed = new Discord.MessageEmbed();

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const unknown = 'Unknown';
    const birthday =
      character?.dateOfBirth?.day &&
      character?.dateOfBirth?.month &&
      character.dateOfBirth.day + ' ' + months[character.dateOfBirth.month - 1];
    const sukoa = Math.floor((+charLink?.node?.popularity + +charLink?.node?.favourites) / 100);
    let colour: Discord.ColorResolvable = 'LIGHT_GREY';
    if (sukoa < 10) {
      colour = 'LIGHT_GREY';
    } else if (sukoa < 100) {
      colour = 'DARK_RED';
    } else if (sukoa < 800) {
      colour = 'BLUE';
    } else if (sukoa < 1750) {
      colour = 'AQUA';
    } else {
      colour = 'GOLD';
    }

    embed
      .setTitle(character?.name?.full)
      .setDescription(`${charLink?.node?.title?.english ?? charLink?.node?.title?.native}`)
      .setImage(`${character.image.large}`)
      .setColor(colour)
      .setFields([
        // {
        //   name: 'Gender',
        //   value: `${character.gender ?? unknown}`,
        //   inline: true,
        // },
        // {
        //   name: 'Age',
        //   value: `${character.age ?? unknown}`,
        //   inline: true,
        // },
        // {
        //   name: 'Birthday',
        //   value: `${birthday ?? unknown}`,
        //   inline: true,
        // },
        {
          name: 'Sukoa 💎',
          value: `${sukoa}`,
          inline: true,
        },
      ]);

    message.reply({ embeds: [embed] });
  },
});

module.exports = Roll;
