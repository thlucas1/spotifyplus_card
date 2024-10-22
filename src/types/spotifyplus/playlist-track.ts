import { IOwner } from './owner';
import { ITrack } from './track';

/**
 * Spotify Web API PlaylistTrack object.
 */
export interface IPlaylistTrack {


  /** 
   * The date and time the track or episode was added.  
   * Timestamps are returned in ISO 8601 format as Coordinated Universal Time (UTC) with a zero 
   * offset: YYYY-MM-DDTHH:MM:SSZ. If the time is imprecise (for example, the date/time of an 
   * album release), an additional field indicates the precision; see for example, release_date 
   * in an album object.
   * 
   * Note: some very old playlists may return null in this field.
   */
  added_at: number | undefined;


  /** 
   * The Spotify user who added the track or episode.  
   * 
   * Note: some very old playlists may return null in this field.
   */
  added_by: IOwner | undefined;


  /**
   * The first image url in the underlying track album `Images` list, if images are defined;
   * otherwise, null.
   */
  image_url?: string | undefined;


  /**
   * Whether this track or episode is a local file (True) or not False).
   */
  is_local?: boolean;


  /**
   * Information about the track.
   */
  track: ITrack;

}
