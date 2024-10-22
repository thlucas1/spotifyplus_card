import { IPageObject } from './page-object';
import { IEpisode } from './episode';
import { IEpisodeSaved } from './episode-saved';

/**
 * Spotify Web API EpisodePageSaved object.
 * 
 * This allows for multiple pages of `EpisodeSaved` objects to be navigated.
 */
export interface IEpisodePageSaved extends IPageObject {


  /** 
   * Array of `IEpisodeSaved` objects.
   */
  items: Array<IEpisodeSaved>;


  /** 
   * Date and time (in epoch format) of when the list was last updated.  
   * Note that this attribute does not exist in the service response.  It was added here for convenience.
   */
  lastUpdatedOn?: number;


  /**
   * Gets a list of all episodes contained in the underlying `Items` list.
   * 
   * This is a convenience method so one does not have to loop through the `Items`
   * array of `IEpisodeSaved` objects to get the list of episodes.
   * 
   * @returns An array of `IEpisode` objects that exist in the collection; otherwise, an empty array.
   */
  GetEpisodes(): Array<IEpisode>;

}


/**
 * Gets a list of all episodes contained in the underlying `Items` list.
 * 
 * This is a convenience method so one does not have to loop through the `Items`
 * array of `IEpisodeSaved` objects to get the list of episodes.
 * 
 * @returns An array of `IEpisode` objects that exist in the collection; otherwise, an empty array.
*/
export function GetEpisodes(page: IEpisodePageSaved | IPageObject | undefined): Array<IEpisode> {

  const result = new Array<IEpisode>();
  if (page) {
    for (const item of ((page as IEpisodePageSaved).items || [])) {
      result.push(item.episode);
    }
  }
  return result
}

