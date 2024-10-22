import { IEpisode } from './episode';

/**
 * Spotify Web API SavedEpisode object.
 */
export interface IEpisodeSaved {


  /** 
   * The date and time the episode was saved. 
   * 
   * Timestamps are returned in ISO 8601 format as Coordinated Universal Time (UTC) with a zero 
   * offset: YYYY-MM-DDTHH:MM:SSZ. If the time is imprecise (for example, the date/time of an 
   * episode release), an additional field indicates the precision; see for example, release_date 
   * in an episode object.
   */
  added_at: number;


  /** 
   * Information about the episode.
   */
  episode: IEpisode;

}
