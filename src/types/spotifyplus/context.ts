import { IExternalUrls } from './external-urls';

/**
 * Spotify Web API Context object.
 */
export interface IContext {

  /** 
   * Known external URLs for this context.
   */
  external_urls: IExternalUrls;


  /**
   * A link to the Web API endpoint providing full details of the context.
   */
  href: string;


  /**
   * Object type, such as `artist`, `playlist`, `album` or `show`.
   */
  type: string;


  /** 
   * The Spotify URI for the context.
   * 
   * Example: `spotify:album:2up3OPMp9Tb4dAKM2erWXQ`
   */
  uri: string;

}
