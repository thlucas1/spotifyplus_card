import { IAlbumSaved } from './album-saved';
import { IAlbumSimplified } from './album-simplified';
import { IArtist } from './artist';
import { IAudiobookSimplified } from './audiobook-simplified';
import { IChapterSimplified } from './chapter-simplified';
import { IUserPreset } from './user-preset';
import { IEpisodeSaved } from './episode-saved';
import { IEpisodeSimplified } from './episode-simplified';
import { IPlayHistory } from './play-history';
import { IPlaylistSimplified } from './playlist-simplified';
import { IPlaylistTrack } from './playlist-track';
import { IShowSaved } from './show-saved';
import { IShowSimplified } from './show-simplified';
import { ITrackSaved } from './track-saved';
import { ITrackSimplified } from './track-simplified';

/**
 * Spotify Web API PageObject object.
 * 
 * This allows for multiple pages of objects to be navigated.
 */
export interface IPageObject {


  /** 
   * The cursor to use as key to find the next page of items.  
   * This value will only be populated when cursor-based paging is used, which is infrrequent.
   * The value can be of multiple types: string, integer, etc.
   * 
   * Example: `3jdODvx7rIdq0UGU7BOVR3`
   * Example: 1708495520273
   * */
  cursor_after?: unknown;


  /**
   * The cursor to use as key to find the previous page of items.  
   * This value will only be populated when cursor-based paging is used, which is infrrequent.
   * The value can be of multiple types: string, integer, etc.
   * 
   * Example: `3jdODvx7rIdq0UGU7BOVR3`
   * Example: 1708495520273
   * */
  cursor_before?: unknown;


  /**
   * A link to the Web API endpoint returning the full result of the request.
   * 
   * Example: `https://api.spotify.com/v1/me/shows?offset=0&limit=20`
   * */
  href: string;


  /**
   * True if cursors were returned at some point during the life of this paging object.
   * */
  is_cursor: boolean;


  /** 
   * Array of objects.
   * 
   * This property will be overrriden by inheriting classes.
   */
  items: Array<IAlbumSaved | IAlbumSimplified | IArtist | IAudiobookSimplified | IChapterSimplified |
  IEpisodeSaved | IEpisodeSimplified | IPlayHistory | IPlaylistSimplified | IPlaylistTrack |
  IShowSaved | IShowSimplified | ITrackSaved | ITrackSimplified | IUserPreset>;


  /**
   * Number of objects in the `Items` property array.
   * */
  items_count?: number;
  //    @property
  //    def ItemsCount(self) -> int:
  //        """
  //        Number of objects in the `Items` property array.
  //        """
  //        if self._Items is not None:
  //            return len(self._Items)
  //        return 0


  /**
   * The maximum number of items in the response (as set in the query or by default).
   * 
   * This property can be modified in case the paging request needs to be adjusted
   * based upon overall request limits.
   * */
  limit: number;


  /**
   * URL to the next page of items; null if none.
   * 
   * Example: `https://api.spotify.com/v1/me/shows?offset=1&limit=1`
   * */
  next: string;


  /**
   * The offset of the items returned (as set in the query or by default).
   * 
   * This property can be modified in case the paging request needs to be adjusted
   * based upon overall request limits.
   * */
  offset?: number;


  /**
   * URL to the previous page of items; null if none.
   * 
   * Example: `https://api.spotify.com/v1/me/shows?offset=1&limit=1`
   * */
  previous: string;


  /**
   * The total number of items available from the Spotify Web API to return.
   * 
   * Note that sometimes the Spotify Web API returns a larger total than the actual number
   * of items available.  Not sure why this is, but it may not match the `ItemsCount` value.
   * */
  total?: number;

}