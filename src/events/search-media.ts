import { DOMAIN_SPOTIFYPLUS } from '../constants';
import { SearchMediaTypes } from '../types/search-media-types';

/** 
 * Uniquely identifies the event. 
 * */
export const SEARCH_MEDIA = DOMAIN_SPOTIFYPLUS + '-card-search-media';


/**
 * Event arguments.
 */
export class SearchMediaEventArgs {

  // property storage.
  public searchType: SearchMediaTypes;
  public searchCriteria: string;

  /**
   * Initializes a new instance of the class.
   *
   * @param searchType Media type to search.
   * @param searchCriteria Criteria to search.
   */
  constructor() {
    this.searchType = SearchMediaTypes.PLAYLISTS;
    this.searchCriteria = "";
  }
}


/**
 * Event constructor.
 */
export function SearchMediaEvent(searchType: SearchMediaTypes, searchCriteria: string | undefined | null) {

  const args = new SearchMediaEventArgs();
  args.searchType = searchType;
  args.searchCriteria = (searchCriteria || "").trim();

  return new CustomEvent(SEARCH_MEDIA, {
    bubbles: true,
    composed: true,
    detail: args,
  });
}
