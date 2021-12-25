export declare type MediaType = 'ANIME' | 'MANGA';

export declare interface Character {
  id: number;
  name: CharacterName;
  image: ImageSize;
  description?: string;
  gender?: string;
  dateOfBirth?: FuzzyDate;
  age?: string;
  bloodType?: string;
  isFavourite?: boolean;
  isFavouriteBlocked?: boolean;
  siteUrl?: string;
  media: MediaConnection;
  favourites: int;
  modNotes?: string;
}

declare interface CharacterName {
  first: string
  middle: string
  last: string
  full: string
  native: string
}

declare interface ImageSize {
  large: string;
  medium: string;
}

declare interface FuzzyDate {
  year?: number;
  month?: number;
  day?: number;
}

declare interface PageInfo {
  pageInfo: {
    total?: number;
    currentPage?: number;
    lastPage?: number;
    hasNextPage?: boolean;
    perPage?: number;
  };
}

export declare interface MediaConnection extends PageInfo {
  edges: MediaEdge[];
  nodes: Media[];
}

declare interface MediaEdge {
  id?: int;
  node?: Media;
}

export declare interface Media {
  id: int;
  title: MediaTitle;
  type: MediaType;
}

declare interface MediaTitle {
  english: string;
  native: string;
  romaji?: string;
  userPreferred?: string;
}
