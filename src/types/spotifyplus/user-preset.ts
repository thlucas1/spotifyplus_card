/**
 * User preset item configuration object.
 */

export interface IUserPreset {

  /**
   * Image url that will be displayed when icons are used for browsing.
   */
  image_url: string;


  /**
   * Friendly name to display that represents the media item.
   */
  name: string | null;


  /**
   * Origin location of the content item (e.g. `config`, `file`).
   */
  origin: string | null;


  /**
   * Friendly subtitle to display that represents the media item.
   */
  subtitle: string | null;


  /**
   * Item type (e.g. "playlist", "album", "artist", etc).
   */
  type: string | null;


  /**
   * Spotify URI value that uniquely identifies the item (e.g. spotify:album:xxxxxx, etc)
   */
  uri: string | null;

}
