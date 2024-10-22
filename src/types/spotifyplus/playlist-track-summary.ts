/**
 * Spotify Web API PlaylistTrackSummary object.
 */
export interface IPlaylistTrackSummary {

  /** 
   * A link to the Web API endpoint where full details of the playlist's tracks can be retrieved. 
   * */
  href: string;

  /** 
   * Number of tracks in the playlist. 
   * */
  total: number;

}