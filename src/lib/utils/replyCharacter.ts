import Discord from 'discord.js';

import { Character } from '../types';
import paginationEmbed from './paginationEmbed';

const embedCharacter = (character: Character) => {
  const embed = new Discord.MessageEmbed();

  const charLink = character?.media?.edges[0];

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
  const sukoa = Math.floor(character.favourites / 10);
  let colour: Discord.ColorResolvable = 'LIGHT_GREY';
  if (sukoa < 100) {
    colour = 'LIGHT_GREY';
  } else if (sukoa < 250) {
    colour = 'DARK_RED';
  } else if (sukoa < 500) {
    colour = 'BLUE';
  } else if (sukoa < 1000) {
    colour = 'AQUA';
  } else {
    colour = 'GOLD';
  }

  embed
    .setTitle(character.name.full)
    .setDescription(`${charLink?.node?.title.english ?? charLink?.node?.title.native}`)
    .setImage(`${character.image.large}`)
    .setColor(colour)
    .setFields([
      {
        name: 'Gender',
        value: `${character.gender ?? unknown}`,
        inline: true,
      },
      // {
      //   name: 'Age',
      //   value: `${character.age ?? unknown}`,
      //   inline: true,
      // },
      {
        name: 'Birthday',
        value: `${birthday ?? unknown}`,
        inline: true,
      },
      {
        name: 'Sukoa 💎',
        value: `${sukoa}`,
        inline: true,
      },
    ]);

  return embed;
};

export const replyCharacterScroll = async (
  message: Discord.Message | Discord.CommandInteraction,
  characters: Character[]
) => {
  const pages: Discord.MessageEmbed[] = [];
  characters.forEach((character) => {
    pages.push(embedCharacter(character));
  })

  try {
    await paginationEmbed(message, pages);
  } catch (err) {
    console.log(err);
    message.reply('Unable to get users inventory!');
  }
};

export const replyCharacterList = (
  message: Discord.Message | Discord.CommandInteraction,
  characters: Character[],
  title: string | null = null
) => {
  const embed = new Discord.MessageEmbed();
  let description = '';

  characters.forEach((character, rank) => {
    const charLink = character?.media?.edges[0];
    const sukoa = Math.floor(character.favourites / 10);
    description += `**#${rank + 1} ${character.name.full}:** ${
      charLink?.node?.title.english ?? charLink?.node?.title.native
    } - ${sukoa} 💎\n`;
  });

  if (title) embed.setAuthor(title);
  embed.setDescription(description);
  message.reply({ embeds: [embed] });
};

const replyCharacter = (message: Discord.Message | Discord.CommandInteraction, character: Character) => {
  const embed = embedCharacter(character);

  message.reply({ embeds: [embed] });
};

export default replyCharacter;
