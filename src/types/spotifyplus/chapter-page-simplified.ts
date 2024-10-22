import { IChapterSimplified } from './chapter-simplified';
import { IPageObject } from './page-object';

/**
 * Spotify Web API SimplifiedChapterPage object.
 * 
 * This allows for multiple pages of `ChapterSimplified` objects to be navigated.
 */
export interface IChapterPageSimplified extends IPageObject {


  /** 
   * Array of `IChapterSimplified` objects.
   */
  items: Array<IChapterSimplified>;


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
