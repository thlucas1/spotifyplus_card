import { IPageObject } from './page-object';
import { ITrackSaved } from './track-saved';
import { ITrack } from './track';

/**
 * Spotify Web API TrackPageSaved object.
 * 
 * This allows for multiple pages of `TrackSaved` objects to be navigated.
 */
export interface ITrackPageSaved extends IPageObject {


  /** 
   * Array of `TrackSaved` objects.
   */
  items: Array<ITrackSaved>;


  /**
   * Gets a list of all tracks contained in the underlying `items` list.
   * 
   * This is a convenience method so one does not have to loop through the `items`
   * array of ITrackSaved objects to get the list of tracks.
   * 
   * @returns An array of `ITrack` objects that exist in the collection; otherwise, an empty array.
   */
  GetTracks(): Array<ITrack>;

}


/**
* Gets a list of all tracks contained in the underlying `items` list.
* 
* This is a convenience method so one does not have to loop through the `items`
* array of ITrackSaved objects to get the list of albums.
* 
* @returns An array of `ITrack` objects that exist in the collection; otherwise, an empty array.
*/
export function GetTracks(page: ITrackPageSaved | IPageObject | undefined): Array<ITrack> {

  const result = new Array<ITrack>();
  if (page) {
    for (const item of ((page as ITrackPageSaved).items || [])) {
      result.push(item.track);
    }
  }
  return result
}
