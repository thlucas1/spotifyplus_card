import { IExternalUrls } from './external-urls';

/**
 * Spotify Web API SimplifiedArtist object.
 */
export interface IArtistSimplified {

  /** 
   * Known external URLs for this artist.
   */
  external_urls: IExternalUrls;


  /**
   * A link to the Web API endpoint providing full details of the artist.
   */
  href: string;


  /** 
   * The Spotify ID for the artist.
   * Example: `2CIMQHirSU0MQqyYHq0eOx`
   */
  id: string;


  /** 
   * The name of the artist.
   */
  name: string;


  /** 
   * The object type: `artist`.
   */
  type: string;


  /** 
   * The Spotify URI for the artist.
   * 
   * Example: `spotify:artist:2CIMQHirSU0MQqyYHq0eOx`
   */
  uri: string;

}