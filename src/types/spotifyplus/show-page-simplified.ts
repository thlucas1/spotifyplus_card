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
   * Checks the `Items` collection to see if an item already exists with the
   * specified Id value.
   * 
   * @param itemId ID of the item to check for.
   * @returns True if the itemId exists in the collection; otherwise, False.
   */
  ContainsId(itemId: string): boolean;

}
