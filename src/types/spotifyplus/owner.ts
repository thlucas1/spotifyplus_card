import { IExternalUrls } from './external-urls';
import { IFollowers } from './followers';

/**
 * Spotify Web API Owner object.
 * 
 * Information about the owner of an object (e.g. playlist, etc).
 */
export interface IOwner {


  /** 
   * The name displayed on the user's profile, or null if not available.
   * 
   * Example: `John S`
   */
  display_name: string;


  /** 
   * Known public external URLs for this user.
   */
  external_urls: IExternalUrls;


  /** 
   * Information about the followers of the user.
   */
  followers: IFollowers;


  /** 
   * A link to the Web API endpoint providing full details of the user.
   */
  href: string;


  /** 
   * The Spotify user ID for the user.
   * 
   * Example: `2up3OPMp9Tb4dAKM2erWXQ`
   */
  id: string;


  /** 
   * The object type: `user`.
   */
  type: string;


  /** 
   * The Spotify URI for the user.
   * 
   * Example: `spotify:user:2up3OPMp9Tb4dAKM2erWXQ`
   */
  uri: string;

}