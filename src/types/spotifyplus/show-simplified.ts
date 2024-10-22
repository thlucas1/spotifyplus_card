import { ICopyright } from './copyright';
import { IExternalUrls } from './external-urls';
import { IImageObject } from './image-object';

/**
 * Spotify Web API SimplifiedShow object.
 */
export interface IShowSimplified {


  /**
   * A list of the countries in which the show can be played, identified by their ISO 3166-1 alpha-2 code.
   */
  available_markets: Array<string>;


  /**
   * The copyright statements of the show.
   */
  copyrights: Array<ICopyright>;


  /**
   * A description of the show.
   * 
   * HTML tags are stripped away from this field, use html_description field in case HTML tags are needed.
   */
  description: string;


  /**
   * Whether or not the show has explicit content (true = yes it does; false = no it does not OR unknown).
   */
  explicit: boolean;


  /** 
   * Known external url's for the show.
   */
  external_urls: IExternalUrls;


  /**
   * A link to the Web API endpoint providing full details of the show.
   * Example: `https://api.spotify.com/v1/shows/3IM0lmZxpFAY7CwMuv9H4g?locale=en-US%2Cen%3Bq%3D0.9`
   */
  href: string;


  /**
   * A description of the show. This field may contain HTML tags.
   */
  html_description: string;


  /**
   * The Spotify ID for the show.
   * Example: `3IM0lmZxpFAY7CwMuv9H4g`
   */
  id: string;


  /** 
   * The cover art for the show in various sizes, widest first.
   */
  images: Array<IImageObject>;


  /**
   * The first image url in the `Images` list, if images are defined;
   * otherwise, null.
   */
  image_url?: string | undefined;


  /**
   * True if all of the shows episodes are hosted outside of Spotify's CDN.
   * This field might be null in some cases.
   */
  is_externally_hosted: boolean;


  /**
   * A list of the languages used in the show, identified by their ISO 639-1 code.
   * Example: `[fr,en]`
   */
  languages: Array<string>;


  /**
   * The media type of the show.
   * Example: `audio`
   */
  media_type: string;


  /**
   * The name of the show. 
   */
  name: string;


  /**
   * The publisher of the show.
   */
  publisher: string;


  /**
   * The total number of episodes in the show.
   */
  total_episodes: number;


  /**
   * The object type: `show`.
   */
  type: string;


  /** 
   * The Spotify URI for the show.
   * 
   * Example: `spotify:show:3IM0lmZxpFAY7CwMuv9H4g`
   */
  uri: string;

}
