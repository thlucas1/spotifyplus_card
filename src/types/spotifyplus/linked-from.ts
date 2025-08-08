import { IExternalUrls } from './external-urls';

/**
 * Spotify Web API Content LinkedFrom object.
 * 
 * Part of the response when Track Relinking is applied, and the requested track has been 
 * replaced with different track. The track in the `linked_from` object contains information 
 * about the originally requested track.
 */
export interface ILinkedFrom {


  /** 
   * Known external URLs for this track.
   */
  external_urls: IExternalUrls;


  /**
   * A link to the Web API endpoint providing full details of the track.
   */
  href: string;


  /** 
   * The Spotify ID for the track.
   * 
   * Example: `6kLCHFM39wkFjOuyPGLGeQ`
   */
  id: string;


  /**
   * The object type: `track`.
   */
  type: string;


  /** 
   * The Spotify URI for the track.
   * 
   * Example: `spotify:track:6kLCHFM39wkFjOuyPGLGeQ`
   */
  uri: string;

}
