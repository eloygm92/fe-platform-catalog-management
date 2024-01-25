export declare type IWatchable = {
  id: number
  type: string
  name: string
  external_id: string
  overview: string
  original_name: string
  release_date: string
  poster_path: string
  popularity: number
  vote_average: number
  vote_count: number
  created_at: string
  updated_at: string
}

export declare type IUser = {
  id: number
  username: string
  email: string
  password?: string
  /*refresh_token: string
  created_at: string
  updated_at: string
  deactivate_at: string*/
}