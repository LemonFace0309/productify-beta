import Discord, { GuildMember } from 'discord.js';
import axios from 'axios';

import Command, { CommandType } from '../Structures/Command';
// import getOrCreateUser from '../utils/getOrCreateUser';

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
  name: 'roll',
  description: 'Roll for a random waifu or husbando',
  type: CommandType.TEXT,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    const variables = {
      page: Math.floor(Math.random() * 116313) + 1,
      perPage: 1,
    };

    try {
      const result = await axios.post(client.aniListUrl, {
        query,
        variables,
      });
      console.log(result.data?.data?.Page?.characters[0]);
    } catch (err) {
      console.warn(err);
    }
  },
});

module.exports = Roll;
