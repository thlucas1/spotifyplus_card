import { IPageObject } from './page-object';
import { IShow } from './show';
import { IShowSaved } from './show-saved';
import { IShowSimplified } from './show-simplified';

/**
 * Spotify Web API ShowPageSaved object.
 * 
 * This allows for multiple pages of `ShowSaved` objects to be navigated.
 */
export interface IShowPageSaved extends IPageObject {


  /** 
   * Array of `IShowSaved` objects.
   */
  items: Array<IShowSaved>;


  /**
   * Gets a list of all shows contained in the underlying `Items` list.
   * 
   * This is a convenience method so one does not have to loop through the `Items`
   * array of ShowSaved objects to get the list of shows.
   * 
   * @returns An array of `IShow` objects that exist in the collection; otherwise, an empty array.
   */
  GetShows(): Array<IShow>;

}




/**
 * Gets a list of all shows contained in the underlying `items` list.
 * 
 * This is a convenience method so one does not have to loop through the `items`
 * array of IShowSaved objects to get the list of shows.
 * 
 * @returns An array of `IShowSimplified` objects that exist in the collection; 
 * otherwise, an empty array.
 */
export function GetShows(page: IShowPageSaved | IPageObject | undefined): Array<IShowSimplified> {

  const result = new Array<IShowSimplified>();
  if (page) {
    for (const item of ((page as IShowPageSaved).items || [])) {
      result.push(item.show);
    }
  }
  return result
}
