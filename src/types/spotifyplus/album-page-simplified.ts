import { IAlbumSimplified } from './album-simplified';
import { IPageObject } from './page-object';

/**
 * Spotify Web API SimplifiedAlbumPage object.
 * 
 * This allows for multiple pages of `AlbumSimplified` objects to be navigated.
 */
export interface IAlbumPageSimplified extends IPageObject {


  /** 
   * Array of `IAlbumSimplified` objects.
   */
  items: Array<IAlbumSimplified>;


  /** 
   * Date and time (in epoch format) of when the list was last updated.  
   * Note that this attribute does not exist in the service response.  It was added here for convenience.
   */
  lastUpdatedOn?: number;

}


//class AlbumPageSimplified(PageObject):

//    def ContainsId(self, itemId:str=False) -> bool:
//        """
//        Checks the `Items` collection to see if an item already exists with the
//        specified Id value.
        
//        Returns True if the itemId exists in the collection; otherwise, False.
//        """
//        result:bool = False
        
//        item:AlbumSimplified
//        for item in self._Items:
//            if item.Id == itemId:
//                result = True
//                break
            
//        return result
