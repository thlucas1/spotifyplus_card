import { IPageObject } from './page-object';
import { IAlbumSaved } from './album-saved';
import { IAlbum } from './album';

/**
 * Spotify Web API AlbumPageSaved object.
 * 
 * This allows for multiple pages of `AlbumSaved` objects to be navigated.
 */
export interface IAlbumPageSaved extends IPageObject {


  /** 
   * Array of `AlbumSaved` objects.
   */
  items: Array<IAlbumSaved>;


  /** 
   * Date and time (in epoch format) of when the list was last updated.  
   * Note that this attribute does not exist in the service response.  It was added here for convenience.
   */
  lastUpdatedOn?: number;


  /**
   * Gets a list of all albums contained in the underlying `Items` list.
   * 
   * This is a convenience method so one does not have to loop through the `Items`
   * array of AlbumSaved objects to get the list of albums.
   * 
   * @returns a list of all albums contained in the underlying `Items` list.
   */
  GetAlbums(): Array<IAlbum>;

}


/**
 * Gets a list of all albums contained in the underlying `items` list.
 * 
 * This is a convenience method so one does not have to loop through the `items`
 * array of IAlbumSaved objects to get the list of albums.
 * 
 * @returns An array of `IAlbum` objects that exist in the collection; otherwise, an empty array.
 */
export function GetAlbums(page: IAlbumPageSaved | IPageObject | undefined): Array<IAlbum> {

  const result = new Array<IAlbum>();
  if (page) {
    for (const item of ((page as IAlbumPageSaved).items || [])) {
      result.push(item.album);
    }
  }
  return result
}
