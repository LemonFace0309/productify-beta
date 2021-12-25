import axios from 'axios';

import { UserDocument } from '../../Models/User';
import { Character } from '../types';

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
    characters (sort: FAVOURITES_DESC) {
      id
      name {
        full
        native
        userPreferred
      }
      description
      image {
        large
        medium
      }
      favourites
      age
      dateOfBirth {
        year
        month
        day
      }
      gender
      siteUrl
      media {
        edges {
          node {
            title {
              english
              native
            }
          }
        }
      }
    }
  }
}
`;

const getCharacter = async (user: UserDocument, name: string, isRandom: boolean = false) => {
  let character: Character;

  const variables = {
    page: Math.floor(Math.random() * 3000),
    perPage: 1,
    sort: 'FAVOURITES_DESC',
  };

  const result = await axios.post('https://graphql.anilist.co', {
    query,
    variables,
  });
  character = result.data?.data?.Page?.characters[0];

  return character;
};

export default getCharacter;
