import { IContext } from './context';
import { ITrack } from './track';

/**
 * Spotify Web API PlayHistory object.
 */
export interface IPlayHistory {


  /** 
   * The context the track was played from.
   */
  context: IContext;


  /**
   * The date and time the track was played (in local time).
   * Example: `2024-01-25T15:33:17.136Z`
   */
  played_at: string;


  /** 
   * The `PlayedAt` value in Unix millisecond timestamp format, or null if the `PlayedAt` value is null.
   * Example: 1706213826000
   */
  played_at_ms: string;


  /** 
   * The track the user listened to.
   */
  track: ITrack;


}
