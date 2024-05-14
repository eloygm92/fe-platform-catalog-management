export declare type IWatchable = {
  id: number
  type: string
  name: string
  external_id: string
  overview: string
  original_name: string
  release_date: string
  poster_path: string
  backdrop_path: string
  tagline: string
  popularity: number
  vote_average: number
  vote_count: number
  created_at: string
  updated_at: string
  inWatchlist?: boolean
  genres?: IGenre[]
  provider?: IProvider[]
}

export declare type IUser = {
  id: number
  username: string
  email: string
  password?: string
  role?: string | IRole
  refresh_token?: string
  created_at?: string
  updated_at?: string
  deactivate_at?: string
  providers?: IProvider[]
  avatar_img?: string
}

export declare type IFilters = {
  sort: string,
  filter: {
    keyword: string
    vote_average: string
    vote_count: string
    'provider.id': string
    'genres.id': string
    release_date: string
  }
}

export declare type IGenre = {
  id: number | string
  name: string
  external_id: string
  checked?: boolean
}

export declare type IProvider = {
  id: number | string
  name: string
  external_id: string
  type: string
  logo_path: string
  created_at: string
  updated_at: string
  deleted_at?: string
  checked?: boolean
}

export declare type IRole = {
  id: number | string
  name: string
}

export declare type IVisualMap = {
  mapped: string,
  visibility: boolean
}

export declare type IWatchlist = {
  id?: number
  user: number | IUser
  watchable: number | IWatchable
  view: boolean
}

export declare type IMapper = {
  id: {
    mapped: string,
    visibility: boolean
  },
  name: {
    mapped: string,
    visibility: boolean
  },
  original_name: {
    mapped: string,
    visibility: boolean
  },
  external_id: {
    mapped: string,
    visibility: boolean
  },
  overview: {
    mapped: string,
    visibility: boolean
    //width: 500
  },
  vote_average: {
    mapped: string,
    visibility: boolean
  },
  vote_count: {
    mapped: string,
    visibility: boolean
  },
  type: {
    mapped: string,
    visibility: boolean
  },
  release_date: {
    mapped: string,
    visibility: boolean
  },
  created_at: {
    mapped: string,
    visibility: boolean
  },
  updated_at: {
    mapped: string,
    visibility: boolean
  },
  popularity: {
    mapped: string,
    visibility: boolean
  },
  poster_path: {
    mapped: string,
    visibility: boolean
  },
  deactivate_at: {
    mapped: string,
    visibility: boolean
  },
  role: {
    mapped: string,
    visibility: boolean
  }
}

export declare type IEpisode = {
  id: number
  name: string
  number: number
  air_date: string
  overview: string
}

export declare type ISeason = {
  id: number
  name: string
  overview: string
  air_date: string
  episode_count: number
  season_number: number
  poster_path: string
  episodes: IEpisode[]
}