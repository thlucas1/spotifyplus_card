import { IAlbumSimplified } from './album-simplified';
import { ICopyright } from './copyright';
import { IExternalUrls } from './external-urls';
import { ITrackPageSimplified } from './track-page-simplified';

/**
 * Spotify Web API IAlbum object.
 */
export interface IAlbum extends IAlbumSimplified {


  /** 
   * The copyright statements of the album.
   */
  copyrights: Array<ICopyright>;


  /** 
   * Known external url's for the album.
   */
  external_ids: IExternalUrls;


  /** 
   * A list of the genres the album is associated with. If not yet classified, the array is empty.
   * Example: `["Egg punk","Noise rock"]`
   */
  genres: Array<string>;


  /** 
   * The label associated with the album.
   */
  label: string;


  /** 
   * The popularity of the album.
   * 
   * The value will be between 0 and 100, with 100 being the most popular.
   */
  popularity: number;


  /**
   * The tracks of the album.
   * 
   * This is a `TrackPageSimplified` object, meaning only 50 tracks max are listed per request.
   */
  tracks?: ITrackPageSimplified;

}
