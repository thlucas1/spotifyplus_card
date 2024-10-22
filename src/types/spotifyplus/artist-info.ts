import { IArtistInfoTourEvent } from './artist-info-tour-event';

/**
 * Artist Information About object.
 */
export interface IArtistInfo {


  /** 
   * URL link to artist Facebook page, if supplied; otherwise, null.
   */
  about_url_facebook: string | null;


  /** 
   * URL link to artist Instagram page, if supplied; otherwise, null.
   */
  about_url_instagram: string | null;


  /** 
   * URL link to artist Twitter page, if supplied; otherwise, null.
   */
  about_url_twitter: string | null;


  /** 
   * URL link to artist Wikipedia page, if supplied; otherwise, null.
   */
  about_url_wikipedia: string | null;


  /** 
   * Biography text.
   */
  bio: string | null;


  /** 
   * The Spotify ID for the artist.
   */
  id: string;


  /** 
   * Image url of the artist, if defined; otheriwse, the `ImageUrlDefault` url value.
   */
  image_url: string | null;


  /** 
   * Default Image url of the artist, if defined; otherwise, null.
   */
  image_url_default: string | null;


  /** 
   * The name of the artist.
   */
  name: string;


  /** 
   * Monthly Listeners text.
   */
  monthly_listeners: number;


  /** 
   * An array of `ArtistInfoTourEvent` objects, if the artist has any upcoming tour
   * dates on file; otherwise, an empty list.
   */
  tour_events: Array<IArtistInfoTourEvent>;


  /** 
   * The object type: `artist`.
   */
  type: string;


  /** 
   * The Spotify URI for the artist.
   */
  uri: string;

}
