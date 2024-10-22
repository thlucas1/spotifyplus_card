import { IAlbum } from './album';

/**
 * Spotify Web API SavedAlbum object.
 */
export interface IAlbumSaved {


  /** 
   * The date and time the album was saved. 
   * Timestamps are returned in ISO 8601 format as Coordinated Universal Time (UTC) with a zero 
   * offset: YYYY-MM-DDTHH:MM:SSZ. If the time is imprecise (for example, the date/time of an 
   * album release), an additional field indicates the precision; see for example, release_date 
   * in an album object.
   */
  added_at: number;


  /** 
   * Information about the album.
   */
  album: IAlbum;

}
