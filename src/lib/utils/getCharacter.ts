import axios from 'axios';

import { UserDocument } from '../../Models/User';
import { Character } from '../types';

interface Variables {
  id?: number;
  page: number;
  perPage: number;
  sort: string[];
  search: string | null;
}

const searchQuery = `
query ($page: Int, $perPage: Int, $sort: [CharacterSort], $search: String) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    characters (sort: $sort, search: $search) {
      id
      name {
        full
        native
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

const idQuery = `
query ($id: Int) {
  Character (id: $id) {
    id
    name {
      full
      native
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
`;

const getCharacter = async (id: number | null, name: string = '', isRandom: boolean = false) => {
  let query = searchQuery;

  const variables: Variables = {
    page: Math.floor(Math.random() * 3000),
    perPage: 1,
    sort: ['FAVOURITES_DESC'],
    search: null,
  };

  if (!isRandom) {
    variables.page = 1;
    variables.search = name;
  }

  if (id) {
    query = idQuery;
    variables.id = id;
  }

  const result = await axios.post('https://graphql.anilist.co', {
    query,
    variables,
  });
  let character: Character | undefined = id ? result.data.data.Character : result.data.data?.Page?.characters[0];

  return character;
};

export default getCharacter;
