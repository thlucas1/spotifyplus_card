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


}
