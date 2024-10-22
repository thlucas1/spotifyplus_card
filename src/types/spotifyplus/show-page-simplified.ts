import { IShowSimplified } from './show-simplified';
import { IPageObject } from './page-object';

/**
 * Spotify Web API SimplifiedShowPage object.
 * 
 * This allows for multiple pages of `IShowSimplified` objects to be navigated.
 */
export interface IShowPageSimplified extends IPageObject {


  /** 
   * Array of `IShowSimplified` objects.
   */
  items: Array<IShowSimplified>;


  /** 
   * Date and time (in epoch format) of when the list was last updated.  
   * Note that this attribute does not exist in the service response.  It was added here for convenience.
   */
  lastUpdatedOn?: number;


  /**
   * Checks the `Items` collection to see if an item already exists with the
   * specified Id value.
   * 
   * @param itemId ID of the item to check for.
   * @returns True if the itemId exists in the collection; otherwise, False.
   */
  ContainsId(itemId: string): boolean;

}
