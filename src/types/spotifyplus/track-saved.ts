import { ITrack } from './track';

/**
 * Spotify Web API SavedTrack object.
 */
export interface ITrackSaved {


  /** 
   * The date and time the track was saved. 
   * Timestamps are returned in ISO 8601 format as Coordinated Universal Time (UTC) with a zero 
   * offset: YYYY-MM-DDTHH:MM:SSZ. If the time is imprecise (for example, the date/time of an 
   * track release), an additional field indicates the precision; see for example, release_date 
   * in an track object.
   */
  added_at: number;


  /** 
   * Information about the track.
   */
  track: ITrack;

}
