import axios from 'axios';

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

export const getCharacters = async (quantity: number, name: string | null = null, isRandom: boolean = false) => {
  const variables: Variables = {
    page: Math.floor(Math.random() * 5000),
    perPage: quantity,
    sort: ['FAVOURITES_DESC'],
    search: null,
  };

  let characters: Character[] | undefined = [];
  if (isRandom) {
    const randoms = await Promise.all([...new Array(quantity)].map(() => getCharacter(null, '', 0, true)));

    if (randoms.some((c) => c === undefined)) return undefined;
    characters = randoms as Character[];
  } else {
    variables.page = 1;
    variables.search = name;

    const result = await axios.post('https://graphql.anilist.co', {
      query: searchQuery,
      variables,
    });
    characters = result.data.data?.Page?.characters;
  }

  return characters;
};

const getCharacter = async (id: number | null, name: string | null = '', index = 0, isRandom: boolean = false) => {
  let query = searchQuery;

  const variables: Variables = {
    page: Math.floor(Math.random() * 5000),
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

  if (index) {
    variables.perPage = 10;
  }

  const result = await axios.post('https://graphql.anilist.co', {
    query,
    variables,
  });
  let character: Character | undefined = id ? result.data.data.Character : result.data.data?.Page?.characters[index];

  return character;
};

export default getCharacter;
