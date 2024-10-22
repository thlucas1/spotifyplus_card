import { IShowSimplified } from './show-simplified';

/**
 * Spotify Web API SavedShow object.
 */
export interface IShowSaved {


  /** 
   * The date and time the show was saved. 
   * 
   * Timestamps are returned in ISO 8601 format as Coordinated Universal Time (UTC) with a zero 
   * offset: YYYY-MM-DDTHH:MM:SSZ. If the time is imprecise (for example, the date/time of a 
   * episode release), an additional field indicates the precision; see for example, release_date 
   * in a episode object.
   */
  added_at: number;


  /** 
   * Information about the show.
   */
  show: IShowSimplified;

}
