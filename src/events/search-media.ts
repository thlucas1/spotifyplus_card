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

  /**
   * Parent media item.
   */
  public parentMediaItem: any | null;

  /**
   * Media type to search.
   */
  public searchType: SearchMediaTypes;

  /**
   * Criteria to search for.
   */
  public searchCriteria: string;

  /**
   * Title to search for.
   */
  public title: string | undefined | null;

  /**
   * Uri to search for.
   */
  public uri: string | undefined | null;

  /**
   * Item sub-type (if required); for show search type, this should be 'Audiobook' or 'Podcast'. 
   */
  public subtype: string | undefined | null;

  /**
   * Initializes a new instance of the class.
   * 
   * @param searchType Media type to search.
   * @param searchCriteria Criteria to search.
   * @param title Title to search for.
   * @param uri Uri to search for.
   * @param subtype Item sub-type (if required); for show search type, this should be 'audiobook' or 'podcast'.
   * @param parentMediaItem Parent media item.
   */
  constructor(
    searchType: SearchMediaTypes,
    searchCriteria: string | undefined | null = null,
    title: string | undefined | null = null,
    uri: string | undefined | null = null,
    subtype: string | undefined | null = null,
    parentMediaItem: any | undefined | null = null,
  ) {
    this.searchType = searchType || SearchMediaTypes.PLAYLISTS;
    this.searchCriteria = searchCriteria || "";
    this.title = title || "";
    this.uri = uri || "";
    this.subtype = subtype || "";
    this.parentMediaItem = parentMediaItem;
  }
}


/**
 * Event constructor.
 * 
 * @param searchType Media type to search.
 * @param searchCriteria Criteria to search.
 * @param title Title to search for.
 * @param uri Uri to search for.
 * @param subtype Item sub-type (if required); for show search type, this should be 'audiobook' or 'podcast'.
 * @param parentMediaItem Parent media item.
 */
export function SearchMediaEvent(
  searchType: SearchMediaTypes,
  searchCriteria: string | undefined | null,
  title: string | undefined | null = null,
  uri: string | undefined | null = null,
  subtype: string | undefined | null = null,
  parentMediaItem: any | undefined | null = null,
) {

  const args = new SearchMediaEventArgs(searchType);
  args.searchCriteria = (searchCriteria || "").trim();
  args.title = title || "";
  args.uri = uri || "";
  args.subtype = subtype || "";
  args.parentMediaItem = parentMediaItem;

  if (!args.subtype) {
    if (searchType == SearchMediaTypes.AUDIOBOOK_EPISODES) {
      args.subtype = 'audiobook';
    } else if (searchType == SearchMediaTypes.SHOW_EPISODES) {
      args.subtype = 'podcast';
    }
  }

  return new CustomEvent(SEARCH_MEDIA, {
    bubbles: true,
    composed: true,
    detail: args,
  });
}
