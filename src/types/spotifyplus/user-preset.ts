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
   * Properties used for calls to the GetTrackRecommendations service. or null.
   * This property should only be populated for type = "recommendations".
   */
  recommendations?: ITrackRecommendationsProperties | null;

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


  // the following was my attempt to automatically add the new preset to the
  // configuration.  it partially worked, in that it would add the preset to
  // the configuration in memory, the preset would be displayed in the preset
  // browser, but the update was not applied to the lovelace configuration that
  // is stored on disk in the `\config\.storage\lovelace.xxxxx` location.
  // the following was located in the `playlist-actions.ts` module, `onClickAction` method.

  //import { IUserPreset } from '../types/spotifyplus/user-preset';
  //import { fireEvent } from '../types/home-assistant-frontend/fire-event';
  //import { getLovelace } from '../utils/config-util';
  //import { parseLovelaceCardPath } from '../utils/config-util';

  //// create user preset object.
  //const preset: IUserPreset = {
  //  name: this.mediaItem.name,
  //  image_url: this.mediaItem.image_url || "",
  //  subtitle: this.mediaItem.type,
  //  type: this.mediaItem.type,
  //  uri: this.mediaItem.uri,
  //};

  //console.log("%conClickAction - new preset:\n%s",
  //  "color: gold",
  //  JSON.stringify(preset,null,2),
  //);

  //// add to configuration; insert new item at the beginning.
  //this.store.config.userPresets?.unshift(preset);

  //// update configuration (in memory).
  //// note that this will ONLY update the configuration stored in memory; it
  //// does not apply the updates to the lovelace raw config stored on disk in
  //// the `\config\.storage\lovelace.xxxxx` location!
  //fireEvent(this, 'config-changed', { config: this.store.config });

  //// prepare to update the lovelace configuration (on disk).
  //const lovelace = getLovelace();
  //if (lovelace) {

  //  console.log("%conClickAction - lovelace data:\n- editMode = %s\n- mode = %s\n- locale = %s\n- urlPath = %s",
  //    "color: gold",
  //    JSON.stringify(lovelace.editMode),
  //    JSON.stringify(lovelace.mode),
  //    JSON.stringify(lovelace.locale),
  //    JSON.stringify(lovelace.urlPath),
  //  );

  //  console.log("%conClickAction - lovelace.rawConfig:\n%s",
  //    "color: red",
  //    JSON.stringify(lovelace.rawConfig, null, 2),
  //  );

  //  console.log("%conClickAction - lovelace.config:\n%s",
  //    "color: gold",
  //    JSON.stringify(lovelace.config, null, 2),
  //  );

  //  // find nearest `<hui-card-options>` tag above the `<ha-card>` tag;
  //  // this will contain the `path` property, which is a LovelaceCardPath object.
  //  const cardOptions = closestElement("hui-card-options", this) as any | null;
  //  if (!cardOptions) {
  //    console.log("%conClickAction - could not find <hui-card-options> parent tag!",
  //      "color: red",
  //    );
  //  }

  //  console.log("%conClickAction - cardOptions.path:\n%s",
  //    "color: gold",
  //    JSON.stringify(cardOptions?.path, null, 2),
  //  );

  ////  //export const replaceCard = (
  ////  //  config: LovelaceConfig,
  ////  //  path: LovelaceCardPath,
  ////  //  cardConfig: LovelaceCardConfig
  ////  //): LovelaceConfig => {

  ////  //  const { cardIndex } = parseLovelaceCardPath(path);
  ////  //  const containerPath = getLovelaceContainerPath(path);

  ////  //  const cards = findLovelaceItems("cards", config, containerPath);

  ////  //  const newCards = (cards ?? []).map((origConf, ind) =>
  ////  //    ind === cardIndex ? cardConfig : origConf
  ////  //  );

  ////  //  const newConfig = updateLovelaceItems(
  ////  //    "cards",
  ////  //    config,
  ////  //    containerPath,
  ////  //    newCards
  ////  //  );
  ////  //  return newConfig;
  ////  //};

  ////  //let config: LovelaceRawConfig;
  ////  //await lovelace.saveConfig(config);   <- this is the LovelaceRawConfig, not the card config!!!

  //} else {

  //  console.log("%conClickAction - could not get lovelace object!",
  //    "color: red",
  //  );

  //}

//}
