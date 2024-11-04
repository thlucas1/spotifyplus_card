import { IPageObject } from './page-object';
import { IPlaylistSimplified } from './playlist-simplified';

/**
 * Spotify Web API PlaylistPageSimplified object.
 * 
 * This allows for multiple pages of `PlaylistSimplified` objects to be navigated.
 */
export interface IPlaylistPageSimplified extends IPageObject {


  /** 
   * Array of `PlaylistSimplified` objects.
   */
  items: Array<IPlaylistSimplified>;


  /**
   * Checks the `Items` collection to see if an item already exists with the
   * specified Id value.
   * 
   * @param itemId ID of the item to check for.
   * @returns True if the itemId exists in the collection; otherwise, False.
   */
  ContainsId(itemId: string): boolean;


  /**
   * Gets a list of all items contained in the `Items` list that are owned 
   * by `spotify:user:spotify`
   * 
   * @returns An array of matching `IPlaylistSimplified` objects; otherwise, an empty array.
   */
  GetSpotifyOwnedItems(): Array<IPlaylistSimplified>;

}
