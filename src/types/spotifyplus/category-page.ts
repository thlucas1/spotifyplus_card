import { ICategory } from './category';
import { IPageObject } from './page-object';

/**
 * Spotify Web API CategoryPage object.
 * 
 * This allows for multiple pages of `Category` objects to be navigated.
 */
export interface ICategoryPage extends IPageObject {


  /** 
   * Array of `ICategory` objects.
   */
  items: Array<ICategory>;


}
