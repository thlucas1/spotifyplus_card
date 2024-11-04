import { IEpisode } from './episode';
import { ITrack } from './track';

/**
 * Spotify Web API PlayerQueueInfo object.
 * 
 * Information about the user's current playback queue.
 */
export interface IPlayerQueueInfo {

  //            'queue': [ item.ToDictionary() for item in self._Queue ],

  /**
   * The currently playing track or episode; can be null.
   */
  currently_playing: IEpisode | ITrack | null;


  /**
   * The object type of the currently playing item, or null if nothing is playing.
   * 
   * If not null, it can be one of `track`, `episode`, `ad` or `unknown`.
   */
  currently_playing_type: string | null;


  /**
   * The tracks or episodes in the queue. Can be empty.
   * 
   * Will be an array of one of the following: `IEpisode` or `ITrack`.
   */
  queue: Array<IEpisode> | Array<ITrack>;


  /** 
   * Date and time (in epoch format) of when the list was last updated.  
   * Note that this attribute does not exist in the service response.  It was added here for convenience.
   */
  date_last_refreshed?: number;

}
