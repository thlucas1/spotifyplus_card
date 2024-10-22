import { IArtist } from './artist';
import { IPageObject } from './page-object';

/**
 * Spotify Web API ArtistPage object.
 * 
 * This allows for multiple pages of `Artist` objects to be navigated.
 */
export interface IArtistPage extends IPageObject {


  /** 
   * Array of `Artist` objects.
   */
  items: Array<IArtist>;


  /** 
   * Date and time (in epoch format) of when the list was last updated.  
   * Note that this attribute does not exist in the service response.  It was added here for convenience.
   */
  lastUpdatedOn?: number;

}
