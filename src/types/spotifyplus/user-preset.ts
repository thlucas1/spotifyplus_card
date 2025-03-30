// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":user-presets");

// our imports.
import { ITrackRecommendationsProperties } from "./track-recommendations-properties";

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
   * Properties used for calls to the GetTrackRecommendations service, or null.
   * This property should only be populated for type = "recommendations".
   */
  recommendations?: ITrackRecommendationsProperties | null;

  /**
   * True if shuffle is enabled; otherwise, false (or null).
   * This property should only be populated for type = "trackfavorites".
   */
  shuffle?: boolean | null;

  /**
   * Filter criteria that will be applied to the specified filter section.
   * This property should only be populated for type = "filtersection".
   * This is a UI helper property, and is not part of the Spotify Web API specification
   */
  filter_criteria?: string | null;

  /**
   * Section to be filtered.
   * This property should only be populated for type = "filtersection".
   * This is a UI helper property, and is not part of the Spotify Web API specification
   */
  filter_section?: string | null;

}


/**
 * Gets an `IUserPreset` object from a media item content.
 * 
 * @param mediaItem A media item object that contains the following properties: name, type, image_url, and uri.
 * @param subTitle Value to use for the sub-title text; null value will use the mediaItem type value.
 * @returns An `IUserPreset` object.
*/
export function GetUserPresetObject(
  mediaItem: any,
  subTitle: string | undefined | null = null,
): IUserPreset {

  // create user preset object.
  const preset: IUserPreset = {
    name: mediaItem.name,
    image_url: mediaItem.image_url || "",
    subtitle: (subTitle || mediaItem.type),
    type: mediaItem.type,
    uri: mediaItem.uri,
  };

  // trace.
  if (debuglog.enabled) {
    debuglog("%cGetUserPresetConfigEntry - preset object:\n%s",
      "color: orange",
      JSON.stringify(preset, null, 2),
    );
  }

  // return to caller.
  return preset;
}

/**
 * Gets a text-representation of an `IUserPreset` object, which can then be pasted into
 * the card configuration under the `userPresets:` key.
 * 
 * @param mediaItem A media item object that contains the following properties: name, type, image_url, and uri.
 * @param subTitle Value to use for the sub-title text; null value will use the mediaItem type value.
 * @returns A text-representation of an `IUserPreset` object.
*/
export function GetUserPresetConfigEntry(
  mediaItem: any,
  subTitle: string | undefined | null = null,
): string {

  // create user preset object.
  const preset = GetUserPresetObject(mediaItem, subTitle);

  // create text-representation of user preset object.
  const CRLF = "\n";
  let presetText = "";
  presetText += "  - name: " + preset.name + CRLF;
  presetText += "    subtitle: " + preset.type + CRLF;
  presetText += "    image_url: " + preset.image_url + CRLF;
  presetText += "    uri: " + preset.uri + CRLF;
  presetText += "    type: " + preset.type + CRLF;

  // return to caller.
  return presetText;
}

/**
 * Gets a JSON-representation of an `IUserPreset` object, which can then be pasted into
 * the userPresets.json file.
 * 
 * @param mediaItem A media item object that contains the following properties: name, type, image_url, and uri.
 * @param subTitle Value to use for the sub-title text; null value will use the mediaItem type value.
 * @returns A JSON-representation of an `IUserPreset` object.
*/
export function GetUserPresetConfigEntryJson(
  mediaItem: any,
  subTitle: string | undefined | null = null,
): string {

  // create user preset object.
  const preset = GetUserPresetObject(mediaItem, subTitle);

  // create text-representation of user preset object.
  const CRLF = "\n";
  let presetText = "";
  presetText += "  {" + CRLF;
  presetText += "    \"name\": \"" + preset.name + "\"," + CRLF;
  presetText += "    \"subtitle\": \"" + preset.type + "\"," + CRLF;
  presetText += "    \"image_url\": \"" + preset.image_url + "\"," + CRLF;
  presetText += "    \"uri\": \"" + preset.uri + "\"," + CRLF;
  presetText += "    \"type\": \"" + preset.type + "\"" + CRLF;
  presetText += "  }," + CRLF;

  // return to caller.
  return presetText;
}
