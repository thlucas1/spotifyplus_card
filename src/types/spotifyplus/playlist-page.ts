import { IPageObject } from './page-object';
import { IPlaylistTrack } from './playlist-track';
import { ITrack } from './track';

/**
 * Spotify Web API PlaylistPage object.
 * 
 * This allows for multiple pages of `Playlist` objects to be navigated.
 */
export interface IPlaylistPage extends IPageObject {


  /** 
   * Array of `PlaylistTrack` objects.
   */
  items: Array<IPlaylistTrack>;


  /** 
   * Date and time (in epoch format) of when the list was last updated.  
   * Note that this attribute does not exist in the service response.  It was added here for convenience.
   */
  lastUpdatedOn?: number;


  /**
   * Gets a list of all tracks contained in the underlying `Items` list.
   * 
   * This is a convenience method so one does not have to loop through the `Items`
   * array of PlaylistTrack objects to get the list of tracks.
   * 
   * @returns An array of matching `IPlaylistTrack` objects; otherwise, an empty array.
   */
  GetTracks(): Array<IPlaylistTrack>;

}


/**
* Gets a list of all tracks contained in the underlying `items` list.
* 
* This is a convenience method so one does not have to loop through the `items`
* array of IPlaylistTrack objects to get the list of tracks.
* 
* @returns An array of `PlaylistTrack` objects that exist in the collection; otherwise, an empty array.
*/
export function GetPlaylistPageTracks(page: IPlaylistPage | undefined): Array<ITrack> {

  const result = new Array<ITrack>();
  if (page) {
    page.items.forEach(item => {
      if (item.track.name != null) {
        result.push(item.track);
      }
    })
  }

  return result
}


/**
* Gets a list of all tracks contained in the underlying `items` list.
* 
* This is a convenience method so one does not have to loop through the `items`
* array of IPlaylistTrack objects to get the list of tracks.
* 
* @returns An array of `PlaylistTrack` objects that exist in the collection; otherwise, an empty array.
*/
export function GetPlaylistPagePlaylistTracks(page: IPlaylistPage | undefined): Array<IPlaylistTrack> {

  const result = new Array<IPlaylistTrack>();
  if (page) {
    page.items.forEach(item => {
      if (item.track.name != null) {
        result.push(item);
      }
    })
  }

  return result
}
