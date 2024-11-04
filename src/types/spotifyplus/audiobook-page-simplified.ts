import { IAudiobookSimplified } from './audiobook-simplified';
import { IPageObject } from './page-object';

/**
 * Spotify Web API SimplifiedAudiobookPage object.
 * 
 * This allows for multiple pages of `AudiobookSimplified` objects to be navigated.
 */
export interface IAudiobookPageSimplified extends IPageObject {


  /** 
   * Array of `IAudiobookSimplified` objects.
   */
  items: Array<IAudiobookSimplified>;


  /**
   * Checks the `Items` collection to see if an item already exists with the
   * specified Id value.
   * 
   * @param itemId ID of the item to check for.
   * @returns True if the itemId exists in the collection; otherwise, False.
   */
  ContainsId(itemId: string): boolean;

}
