import { ITrack } from './track';
import { IPageObject } from './page-object';

/**
 * Spotify Web API TrackPage object.
 * 
 * This allows for multiple pages of `Track` objects to be navigated.
 */
export interface ITrackPage extends IPageObject {


  /** 
   * Array of `Track` objects.
   */
  items: Array<ITrack>;


  /** 
   * Date and time (in epoch format) of when the list was last updated.  
   * Note that this attribute does not exist in the service response.  It was added here for convenience.
   */
  lastUpdatedOn?: number;

}
