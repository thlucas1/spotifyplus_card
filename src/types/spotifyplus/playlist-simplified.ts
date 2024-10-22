import { IExternalUrls } from './external-urls';
import { IImageObject } from './image-object';
import { IOwner } from './owner';
import { IPlaylistPage } from './playlist-page';
import { IPlaylistTrackSummary } from './playlist-track-summary';

/**
 * Spotify Web API PlaylistSimplified object.
 */
export interface IPlaylistSimplified {


  /** 
   * True if the owner allows other users to modify the playlist.
   */
  collaborative: boolean;


  /** 
   * The playlist description.  
   * Only returned for modified, verified playlists; otherwise null.
   */
  description: string;


  /** 
   * Known external URLs for this playlist.
   */
  external_urls: IExternalUrls;


  /**
   * A link to the Web API endpoint providing full details of the playlist.
   */
  href: string;


  /** 
   * The Spotify user ID for the playlist.
   * Example: `5v5ETK9WFXAnGQ3MRubKuE`
   */
  id: string;


  /** 
   * Images for the playlist.  
   * 
   * The array may be empty or contain up to three images.  
   * The images are returned by size in descending order.  
   * Note: If returned, the source URL for the image (url) is temporary and will expire in less than a day.
   */
  images: Array<IImageObject>;


  /**
   * Image to use for media browser displays.
   * 
   * This will default to the first image in the `images` collection if not set, courtesy of
   * the `media_browser_utils.getContentItemImageUrl()` method.
   */
  image_url?: string | undefined;


  /** 
   * The name of the playlist.
   */
  name: string;


  /** 
   * The user who owns the playlist.
   */
  owner: IOwner;


  /** 
   * The playlist's public/private status:  
   * - true: the playlist is public.  
   * - false: the playlist is private.  
   * - null: the playlist status is not relevant.  
   */
  public: boolean | void;


  /** 
   * The version identifier for the current playlist.  
   * 
   * Can be supplied in other requests to target a specific playlist version.
   */
  snapshotId: string;


  /** 
   * The tracks summary of the playlist.
   */
  tracks: IPlaylistTrackSummary | IPlaylistPage;


  /** 
   * The object type: `playlist`.
   */
  type: string;


  /** 
   * The Spotify URI for the playlist.
   * 
   * Example: `spotify:playlist:5v5ETK9WFXAnGQ3MRubKuE`
   */
  uri: string;

}