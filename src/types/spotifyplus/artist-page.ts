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


}
