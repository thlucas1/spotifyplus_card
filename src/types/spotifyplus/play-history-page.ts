import { IPageObject } from './page-object';
import { IPlayHistory } from './play-history';
import { ITrack } from './track';

/**
 * Spotify Web API PlayHistoryPage object.
 * 
 * This allows for multiple pages of `PlayHistory` objects to be navigated.
 */
export interface IPlayHistoryPage extends IPageObject {


  /** 
   * Array of `IPlayHistory` objects.
   */
  items: Array<IPlayHistory>;


  /**
   * Gets a list of all tracks contained in the underlying `Items` list.
   * 
   * This is a convenience method so one does not have to loop through the `Items`
   * array of PlayHistory objects to get the list of tracks.
   * 
   * @returns An array of `ITrack` objects that exist in the collection; otherwise, an empty array.
   */
  GetTracks(): Array<ITrack>;

}
