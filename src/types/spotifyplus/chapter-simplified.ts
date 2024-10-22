import { IExternalUrls } from './external-urls';
import { IImageObject } from './image-object';
import { IRestrictions } from './restrictions';
import { IResumePoint } from './resume-point';

/**
 * Spotify Web API Simplified Chapter object.
 */
export interface IChapterSimplified {


  /** 
   * A URL to a 30 second preview (MP3 format) of the chapter, or null if not available.
   * 
   * Example: `https://p.scdn.co/mp3-preview/2f37da1d4221f40b9d1a98cd191f4d6f1646ad17`
   */
  audio_preview_url: string;


  /**
   * A list of the countries in which the chapter can be played, identified by their ISO 3166-1 alpha-2 code.
   */
  available_markets: Array<string>;


  /**
   * The number of the chapter.
   * Example: `1`
   */
  chapter_number: number;


  /**
   * A description of the chapter.
   * 
   * HTML tags are stripped away from this field, use html_description field in case HTML tags are needed.
   */
  description: string;


  /**
   * The chapter length in milliseconds.
   * Example: `1686230`
   */
  duration_ms: number;


  /** 
   * Whether or not the chapter has explicit content (true = yes it does; false = no it does not OR unknown).
   */
  explicit: boolean;


  /** 
   * Known external url's for the chapter.
   */
  external_urls: IExternalUrls;


  /**
   * A link to the Web API endpoint providing full details of the chapter.
   * Example: `https://api.spotify.com/v1/chapters/0D5wENdkdwbqlrHoaJ9g29`
   */
  href: string;


  /**
   * A description of the chapter. This field may contain HTML tags.
   */
  html_description: string;


  /** 
   * The Spotify ID for the chapter.
   * Example: `0D5wENdkdwbqlrHoaJ9g29`
   */
  id: string;


  /** 
   * The cover art for the chapter in various sizes, widest first.
   */
  images: Array<IImageObject>;


  /**
   * The first image url in the `Images` list, if images are defined;
   * otherwise, null.
   */
  image_url?: string | undefined;


  /**
   * True if the chapter is playable in the given market. Otherwise false.
   */
  is_playable: boolean;


  /**
   * A list of the languages used in the chapter, identified by their ISO 639-1 code.
   * Example: `[fr,en]`
   */
  languages: Array<string>;


  /**
   * The name of the chapter. 
   */
  name: string;


  /**
   * The date the chapter was first released.
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
   * The user's most recent position in the chapter.
   * Set if the supplied access token is a user token and has the scope 'user-read-playback-position'.
   */
  resume_point: IResumePoint;


  /**
   * The object type: `chapter`.
   */
  type: string;


  /** 
   * The Spotify URI for the chapter.
   * 
   * Example: `spotify:chapter:0D5wENdkdwbqlrHoaJ9g29`
   */
  uri: string;

}
