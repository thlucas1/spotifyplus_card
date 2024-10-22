import { IPageObject } from './page-object';
import { ITrackSimplified } from './track-simplified';

/**
 * Spotify Web API SimplifiedTrackPage object.
 * 
 * This allows for multiple pages of `TrackSimplified` objects to be navigated.
 */
export interface ITrackPageSimplified extends IPageObject {


  /** 
   * Array of `TrackSimplified` objects.
   */
  items: Array<ITrackSimplified>;

}


/**
* Gets a list of all tracks contained in the underlying `items` list.
* 
* This is a convenience method so one does not have to loop through the `items`
* array of ITrackPageSimplified objects to get the list of tracks.
* 
* @returns An array of `ITrackSimplified` objects that exist in the collection; otherwise, an empty array.
*/
export function GetTracks(page: ITrackPageSimplified | undefined): Array<ITrackSimplified> {

  //console.log("GetTracks (track-page-simplified)\n- pages:\n%s",
  //  JSON.stringify(page),
  //);

  const result = new Array<ITrackSimplified>();
  if (page) {
    page.items.forEach(item => {
      result.push(item);
    })
  }

  //console.log("GetTracks (track-page-simplified)\n- tracks (result):\n%s",
  //  JSON.stringify(result),
  //);

  return result
}



//    def ContainsId(self, itemId:str=False) -> bool:
//        """
//        Checks the `Items` collection to see if an item already exists with the
//        specified Id value.
        
//        Returns True if the itemId exists in the collection; otherwise, False.
//        """
//        result:bool = False
        
//        item:TrackSimplified
//        for item in self._Items:
//            if item.Id == itemId:
//                result = True
//                break
            
//        return result
