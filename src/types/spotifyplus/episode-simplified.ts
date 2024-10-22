import { IExternalUrls } from './external-urls';
import { IImageObject } from './image-object';
import { IRestrictions } from './restrictions';
import { IResumePoint } from './resume-point';

/**
 * Spotify Web API Simplified Episode object.
 */
export interface IEpisodeSimplified {


  /**
   * A URL to a 30 second preview (MP3 format) of the episode, or null if not available.
   * 
   * Important policy note:
   * Spotify Audio preview clips can not be a standalone service.
   * 
   * Example: `https://p.scdn.co/mp3-preview/2f37da1d4221f40b9d1a98cd191f4d6f1646ad17`
   */
  audio_preview_url: string;


  /**
   * A description of the episode.
   * 
   * HTML tags are stripped away from this field, use html_description field in case HTML tags are needed.
   */
  description: string;


  /**
   * The episode length in milliseconds.
   * Example: `1686230`
   */
  duration_ms: number;


  /**
   * Whether or not the episode has explicit content (true = yes it does; false = no it does not OR unknown).
   */
  explicit: boolean;


  /**
   * Known external url's for the episode.
   */
  external_urls: IExternalUrls;


  /**
   * A link to the Web API endpoint providing full details of the episode.
   * Example: `https://api.spotify.com/v1/episodes/5Xt5DXGzch68nYYamXrNxZ`
   */
  href: string;


  /**
   * A description of the episode. This field may contain HTML tags.
   */
  html_description: string;


  /**
   * The Spotify ID for the episode.
   * Example: `5Xt5DXGzch68nYYamXrNxZ`
   */
  id: string;


  /** 
   * The cover art for the episode in various sizes, widest first.
   */
  images: Array<IImageObject>;


  /**
   * The first image url in the `Images` list, if images are defined;
   * otherwise, null.
   */
  image_url?: string | undefined;


  /**
   * True if the episode is hosted outside of Spotify's CDN.
   */
  is_externally_hosted: boolean;


  /**
   * True if the episode is playable in the given market. Otherwise false.
   */
  is_playable: boolean;


  /**
   * A list of the languages used in the episode, identified by their ISO 639-1 code.
   * Example: `[fr,en]`
   */
  languages: Array<string>;


  /**
   * The name of the episode. 
   */
  name: string;


  /**
   * The date the episode was first released.
   * 
   * Example: `1981-12`
   * Depending on the precision, it might be shown as "1981" or "1981-12".
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
   * The user's most recent position in the episode.
   * Set if the supplied access token is a user token and has the scope 'user-read-playback-position'.
   */
  resume_point: IResumePoint;


  /**
   * The object type: `episode`.
   */
  type: string;


  /** 
   * The Spotify URI for the episode.
   * 
   * Example: `spotify:episode:5Xt5DXGzch68nYYamXrNxZ`
   */
  uri: string;

}
