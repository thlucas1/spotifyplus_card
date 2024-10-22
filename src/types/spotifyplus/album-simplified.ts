import { IArtistSimplified } from './artist-simplified';
import { IExternalUrls } from './external-urls';
import { IImageObject } from './image-object';
import { IRestrictions } from './restrictions';

/**
 * Spotify Web API Simplified Album object.
 */
export interface IAlbumSimplified {

  /**
   * The type of the album.
   * 
   * Allowed values: `album`, `single`, `compilation`.
   * 
   * Example: `album`
   */
  album_type: string;


  /** 
   * The artists of the album.
   * 
   * Each artist object includes a link in href to more detailed information about the artist.
   */
  artists: Array<IArtistSimplified>


  /** 
   * The markets in which the album is available: ISO 3166-1 alpha-2 country codes.
   * 
   * NOTE: an album is considered available in a market when at least 1 of its tracks is available in that market.
   * 
   * Example: `["CA","BR","IT"]`
   */
  available_markets: Array<string>


  /** 
   * Known external URLs for this album.
   */
  external_urls: IExternalUrls;


  /**
   * A link to the Web API endpoint providing full details of the album.
   */
  href: string;


  /** 
   * The Spotify user ID for the album.
   * Example: `2up3OPMp9Tb4dAKM2erWXQ`
   */
  id: string;


  /** 
   * Images for the album.  
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
   * The name of the album.
   * 
   * In case of an album takedown, the value may be an empty string.
   */
  name: string;


  /**
   * The date the album was first released.
   * 
   * Example: `1981-12`
   */
  release_date: string;


  /**
   * The precision with which release_date value is known.
   * Allowed values: `year`, `month`, `day`.
   * 
   * Example: `year`
   */
  release_date_precision: string;


  /** 
   * Included in the response when a content restriction is applied.
   */
  restrictions: IRestrictions;


  /** 
   * The number of tracks in the album.
   */
  total_tracks: number;


  /**
   * The object type: `album`.
   */
  type: string;


  /** 
   * The Spotify URI for the album.
   * 
   * Example: `spotify:album:2up3OPMp9Tb4dAKM2erWXQ`
   */
  uri: string;

}
