/** 
 * Search Media Types enum. 
 */

export enum SearchMediaTypes {

  // general search types.
  ALBUMS = "Albums",
  ARTISTS = "Artists",
  AUDIOBOOKS = "AudioBooks",
  EPISODES = "Episodes",
  PLAYLISTS = "Playlists",
  SHOWS = "Shows",
  TRACKS = "Tracks",

  // album-specific search types.
  ALBUM_NEW_RELEASES = "Album New Releases",

  // artist-specific search types.
  ARTIST_ALBUMS = "Artist Albums",
  ARTIST_ALBUMS_APPEARSON = "Artist Album ApearsOn",
  ARTIST_ALBUMS_COMPILATION = "Artist Album Compilations",
  ARTIST_ALBUMS_SINGLE = "Artist Album Singles",
  ARTIST_RELATED_ARTISTS = "Artist Related Artists",
  ARTIST_TOP_TRACKS = "Artist Top Tracks",

  // audiobook-specific search types.
  AUDIOBOOK_EPISODES = "Audiobook Chapters",

  // show-specific search types.
  SHOW_EPISODES = "Show Episodes",

  // ui-specific search types.
  MAIN_MENU = "Menu",
}
