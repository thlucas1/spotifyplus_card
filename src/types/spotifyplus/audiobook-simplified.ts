import { IAuthor } from './author';
import { ICopyright } from './copyright';
import { IExternalUrls } from './external-urls';
import { IImageObject } from './image-object';
import { INarrator } from './narrator';

/**
 * Spotify Web API Simplified Audiobook object.
 */
export interface IAudiobookSimplified {


  /** 
   * The author(s) for the audiobook.
   */
  authors: Array<IAuthor>;


  /**
   * A list of the countries in which the audiobook can be played, identified by their ISO 3166-1 alpha-2 code.
   */
  available_markets: Array<string>;


  /**
   * The copyright statements of the audiobook.
   */
  copyrights: Array<ICopyright>;


  /**
   * A description of the audiobook.
   * 
   * HTML tags are stripped away from this field, use html_description field in case HTML tags are needed.
   */
  description: string;


  /**
   * The edition of the audiobook.
   * Example: `Unabridged`
   */
  edition: string;


  /** 
   * Whether or not the audiobook has explicit content (true = yes it does; false = no it does not OR unknown).
   */
  explicit: boolean;


  /** 
   * Known external url's for the audiobook.
   */
  external_urls: IExternalUrls;


  /**
   * A link to the Web API endpoint providing full details of the audiobook.
   * Example: `https://api.spotify.com/v1/audiobooks/7iHfbu1YPACw6oZPAFJtqe`
   */
  href: string;


  /**
   * A description of the audiobook. This field may contain HTML tags.
   */
  html_description: string;


  /** 
   * The Spotify ID for the audiobook.
   * Example: `7iHfbu1YPACw6oZPAFJtqe`
   */
  id: string;


  /** 
   * The cover art for the audiobook in various sizes, widest first.
   */
  images: Array<IImageObject>;


  /**
   * The first image url in the `Images` list, if images are defined;
   * otherwise, null.
   */
  image_url?: string | undefined;


  /** 
   * A list of the languages used in the audiobook, identified by their ISO 639-1 code.
   * Example: `[fr,en]`
   */
  languages: Array<string>;


  /**
   * The media type of the audiobook.
   * Example: `audio`
   */
  media_type: string;


  /**
   * The name of the audiobook. 
   */
  name: string;


  /**
   * The narrator(s) for the audiobook.
   */
  narrators: Array<INarrator>;


  /**
   * The publisher of the audiobook.
   */
  publisher: string;


  /**
   * The number of chapters in the audiobook.
   */
  total_chapters: number;


  /**
   * The object type: `audiobook`.
   */
  type: string;


  /** 
   * The Spotify URI for the audiobook.
   * 
   * Example: `spotify:audiobook:7iHfbu1YPACw6oZPAFJtqe`
   */
  uri: string;

}


/**
 * Gets a user-friendly description of the `authors` object(s).
 * 
 * @param mediaItem Media item that contains a authors property.
 * @returns A string that contains a user-friendly description of the authors.
 */
export function GetAudiobookAuthors(mediaItem: IAudiobookSimplified | undefined, delimiter: string): string {

  if (delimiter == null)
    delimiter = "; ";

  let result = "";
  if (mediaItem) {
    for (const item of mediaItem.authors || []) {
      if ((item != null) && (item.name != null) && (item.name.length > 0)) {
        if (result.length > 0)
          result += delimiter;
        result += item.name;
      }
    }
  }

  return result
}


/**
 * Gets a user-friendly description of the `copyrights` object(s).
 * 
 * @param mediaItem Media item that contains a copyrights property.
 * @returns A string that contains a user-friendly description of the copyrights.
 */
export function GetAudiobookCopyrights(mediaItem: IAudiobookSimplified | undefined, delimiter: string): string {

  if (delimiter == null)
    delimiter = "; ";

  let result = "";
  if (mediaItem) {
    for (const item of mediaItem.copyrights || []) {
      if ((item != null) && (item.text != null) && (item.text.length > 0)) {
        if (result.length > 0)
          result += delimiter;
        result += item.text;
      }
    }
  }

  return result
}


/**
 * Gets a user-friendly description of the `narrator` object(s).
 * 
 * @param mediaItem Media item that contains a narrators property.
 * @returns A string that contains a user-friendly description of the narrators.
 */
export function GetAudiobookNarrators(mediaItem: IAudiobookSimplified | undefined, delimiter: string): string {

  if (delimiter == null)
    delimiter = "; ";

  let result = "";
  if (mediaItem) {
    for (const item of mediaItem.narrators || []) {
      if ((item != null) && (item.name != null) && (item.name.length > 0)) {
        if (result.length > 0)
          result += delimiter;
        result += item.name;
      }
    }
  }

  return result
}
