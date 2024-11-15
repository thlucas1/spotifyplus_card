/**
 * User preset item configuration object.
 */

import { ITrackRecommendationsProperties } from "./track-recommendations-properties";

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
  origin?: string | null;


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


  /**
   * Properties used for calls to the GetTrackRecommendations service. or null.
   * This property should only be populated for type = "recommendations".
   */
  recommendations?: ITrackRecommendationsProperties | null;

}


/**
* Gets a text-representation of an `IUserPreset` object, which can then be pasted into
* the card configuration under the `userPresets:` key.
* 
* @param mediaItem A media item object that contains the following properties: name, type, image_url, and uri.
* @param subTitle Value to use for the sub-title text; null value will use the mediaItem type value.
* @returns An array of `ITrack` objects that exist in the collection; otherwise, an empty array.
*/
export function GetUserPresetConfigEntry(
  mediaItem: any,
  subTitle: string | undefined | null = null,
): string {

  const CRLF = "\n";

  // create text-representation of user preset object.
  let presetText = "";
  presetText += "  - name: " + mediaItem.name + CRLF;
  presetText += "    subtitle: " + (subTitle || mediaItem.type) + CRLF;
  presetText += "    image_url: " + mediaItem.image_url + CRLF;
  presetText += "    uri: " + mediaItem.uri + CRLF;
  presetText += "    type: " + mediaItem.type + CRLF;

  // return to caller.
  return presetText;

}
