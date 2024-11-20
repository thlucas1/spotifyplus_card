// our imports.
import { MediaPlayer } from '../model/media-player';
import { CustomImageUrls } from '../types/custom-image-urls';
import { CardConfig } from '../types/card-config';
import { formatDateEpochSecondsToLocaleString } from './utils';


/**
 * Removes all special characters from a string, so that it can be used
 * for comparison operations.
 * 
 * @param str String value to remove special characters from.
 * @returns The `str` value without special characters.
 */
export function removeSpecialChars(str: string) {
  let value = str.replace(/[^a-zA-Z ]/g, '');
  if (value)
    value = value.trim();
  return value;
}


/**
 * Searches the configuration custom ImageUrl's collection for a matching title.
 * The item imageUrl is returned if a match is found; otherwise, undefined.
 * 
 * @param collection Configuration customImageUrls collection to search.
 * @param title Title to search for in the collection.
 */
export function getCustomImageUrl(collection: CustomImageUrls | undefined, title: string) {

  // search collection for matching title and return the imageUrl.
  // remove any special characters from the title before comparing.
  // note that we already removed special characters from the collection 
  // in the setConfig() method when the card configuration was loaded.
  for (const itemTitle in collection) {
    if (itemTitle === removeSpecialChars(title)) {
      return collection[itemTitle];
    }
  }

  // if not found then return undefined.
  return undefined;
}


/**
 * Gets the image url that will be displayed in the media browser for items that contain 
 * an image_url attribute.
 * 
 * @param item media item to render an image for.
 * @param config card configuration object.
 * @param hasItemsWithImage true if any items in the parent collection have an image_url assigned; otherwise, false to indicate ALL items have no images.
 * @param imageUrlDefault default image url to use.
 * 
 * The image to display is resolved in the following sequence:
 * - configuration `customImageUrls` `title` for matching item name (if one exists).
 * - item image_url value (if one exists).
 * - configuration `customImageUrls` `default` value (if one exists).
 * - hard-coded `default image` data if all else fails.
 * 
 * If the image_url is a Home Assistant brands logo, then the brand icon.png image is used instead.
 */
export function getContentItemImageUrl(item: any, config: CardConfig, hasItemsWithImage: boolean, imageUrlDefault: string) {

  // if there are no other items with images then we are done;
  if (!hasItemsWithImage) {
    return undefined;
  }

  // check for a custom imageUrl; if not found, then use the item image_url (if supplied).
  let imageUrl = getCustomImageUrl(config.customImageUrls, item.name || '') ?? item.image_url;

  // did we resolve an image_url?
  if (!imageUrl) {

    // no - if there are other items with images, then we will use a default image;
    // otherwise, just return undefined so it doesn't insert a default image.
    //if (hasItemsWithImage) {
    imageUrl = config.customImageUrls?.['default'] || imageUrlDefault;
    //}

  }

  // if imageUrl is a home assistant brands logo, then use the 'icon.png' image.
  if (imageUrl?.match(/https:\/\/brands\.home-assistant\.io\/.+\/logo.png/)) {
    imageUrl = imageUrl?.replace('logo.png', 'icon.png');
  }

  // return imageUrl to caller.
  return imageUrl || '';
}


/**
 * Converts an mdiIcon path to a url that can be used as a CSS `background-image url()` value.
 * 
 * @param mdi_icon mdi icon to convert.
 */
export function getMdiIconImageUrl(mdi_icon: string): string {

  const mdiImageUrl = '\'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%232196F3" d="' + mdi_icon + '"></path></svg>\'';
  return mdiImageUrl

}


/**
 * Returns true if ANY of the items have an image_url specified; 
 * otherwise, false indicates no image_url's are present in the list.
 * 
 * @param items List of media content items to check.
 * @returns true if ANY of the items have an image_url specified; otherwise, false.
 */
export function hasMediaItemImages(items: any[]) {

  return items.some((item) => item.image_url);

}


/**
 * Formats a string with various configuration information.  This method finds selected keywords
 * and replaces them with the equivalent attribute values.
 * 
 * @param text Text string to replace keyword values with.
 * @param config CardConfig configuration data.
 * @param player MediaPlayer instance that contains information about the player.
 * @param mediaListLastUpdatedOn Epoch date(in seconds) when the last refresh of the media list took place.  Only used for services that don't have a media player `lastupdatedon` attribute.
 * @param mediaList A media list of content items.
 * @returns The text argument with keywords replaced with the equivalent attribute values.
 */
export function formatTitleInfo(
  text: string | undefined,
  config: CardConfig,
  player: MediaPlayer | undefined = undefined,
  mediaListLastUpdatedOn: number | undefined = undefined,
  mediaList: Array<any> | undefined = undefined,
): string | undefined {

  // call various formatting methods.
  let result = formatConfigInfo(text, config);
  result = formatPlayerInfo(result, player);
  result = formatMediaListInfo(result, mediaListLastUpdatedOn, mediaList);
  return result;
}


/**
 * Formats a string with MediaList information.  This method finds selected keywords
 * and replaces them with the equivalent MediaList attribute values.
 * 
 * @param text Text string to replace keyword values with.
 * @param mediaListLastUpdatedOn Epoch date(in seconds) when the last refresh of the media list took place.  Only used for services that don't have a media player `lastupdatedon` attribute.
 * @param mediaList A media list of content items.
 * @returns The text argument with keywords replaced with media list details.
 */
export function formatMediaListInfo(
  text: string | undefined,
  mediaListLastUpdatedOn: number | undefined = undefined,
  mediaList: Array<any> | undefined = undefined,
): string | undefined {

  // if text not set then don't bother.
  if (!text)
    return text;

  // if media list not set, then use an empty array to resolve to 0 items.
  if (text.indexOf("{medialist.itemcount}") > -1) {
    const count = (mediaList || []).length.toString();
    text = text.replace("{medialist.itemcount}", count);
  }

  if (text.indexOf("{medialist.lastupdatedon}") > -1) {
    const localeDT = formatDateEpochSecondsToLocaleString(mediaListLastUpdatedOn || 0);
    text = text.replace("{medialist.lastupdatedon}", localeDT || '');
  }

  return text;
}


/**
 * Formats a string with MediaPlayer information.  This method finds selected keywords
 * and replaces them with the equivalent MediaPlayer attribute values.
 * 
 * @param text Text string to replace media player keyword values with.
 * @param player MediaPlayer instance that contains information about the player.
 * @returns The text argument with keywords replaced with media player details.
 */
export function formatPlayerInfo(
  text: string | undefined,
  player: MediaPlayer | undefined,
  ): string | undefined {

  // if player instance not set then don't bother.
  if (!player)
    return text;

  // replace keyword parameters with media player equivalents.
  if (text) {

    text = text.replace("{player.name}", player.name);
    text = text.replace("{player.friendly_name}", player.attributes.friendly_name || '');
    text = text.replace("{player.source}", player.attributes.source || '');
    text = text.replace("{player.media_album_name}", player.attributes.media_album_name || '');
    text = text.replace("{player.media_artist}", player.attributes.media_artist || '');
    text = text.replace("{player.media_title}", player.attributes.media_title || '');
    text = text.replace("{player.media_track}", player.attributes.media_track?.toString() || '');
    text = text.replace("{player.state}", player.state || '');

    // drop everything after the first parenthesis.
    if (text.indexOf("{player.source_noaccount}") > -1) {
      let value = player.attributes.source || '';
      const idx = value.indexOf('(');
      if (idx > 0) {
        value = value.substring(0, idx - 1);
      }
      text = text.replace("{player.source_noaccount}", (value || '').trim());
    }

    // spotifyplus extra state attributes.
    text = text.replace("{player.sp_context_uri}", player.attributes.sp_context_uri || '');
    text = text.replace("{player.sp_device_id}", player.attributes.sp_device_id || '');
    text = text.replace("{player.sp_device_name}", player.attributes.sp_device_name || '');
    text = text.replace("{player.sp_item_type}", player.attributes.sp_item_type || '');
    text = text.replace("{player.sp_playlist_name}", player.attributes.sp_playlist_name || '');
    text = text.replace("{player.sp_playlist_name_title}", "Playlist: " + (player.attributes.sp_playlist_name || 'n/a'));
    text = text.replace("{player.sp_playlist_uri}", player.attributes.sp_playlist_uri || '');
    text = text.replace("{player.sp_user_country}", player.attributes.sp_user_country || '');
    text = text.replace("{player.sp_user_display_name}", player.attributes.sp_user_display_name || '');
    text = text.replace("{player.sp_user_email}", player.attributes.sp_user_email || '');
    text = text.replace("{player.sp_user_id}", player.attributes.sp_user_id || '');
    text = text.replace("{player.sp_user_product}", player.attributes.sp_user_product || '');
    text = text.replace("{player.sp_user_uri}", player.attributes.sp_user_uri || '');

    // other possible keywords:
    //media_duration: 276
    //media_position: 182
    //media_position_updated_at: "2024-04-30T21:32:12.303343+00:00"
    //shuffle: false
    //repeat: "off"
    //device_class: speaker
    //entity_picture: /api/media_player_proxy/media_player.bose_st10_1?token=f447f9b3fbdb647d9df2f7b0a5a474be9e17ffa51d26eb18f414d5120a2bdeb8&cache=2a8a6a76b27e209a
    //icon: mdi: speaker
    //supported_features: 1040319

  }

  return text;
}


/**
 * Formats a string with CardConfig information.  This method finds selected keywords
 * and replaces them with the equivalent CardConfig attribute values.
 * 
 * The following replacement keywords are supported:
 * - {config.pandoraUserAccount} : player name (e.g. "Livingroom Soundbar").
 * 
 * @param text Text string to replace configuration keyword values with.
 * @param config CardConfig configuration data.
 * @returns The text argument with keywords replaced with configuration details.
 */
export function formatConfigInfo(
  text: string | undefined,
  config: CardConfig,
): string | undefined {

  // if config instance not set then don't bother.
  if (!config)
    return text;

  // replace keyword parameters with configuration equivalents.
  if (text) {
    // TODO - possibly remove this?
    //text = text.replace("{config.xxxx}", config.xxxx || '');
  }

  return text;
}


export function truncateMediaList(mediaList: any, maxItems: number): string | undefined {

  let result: string | undefined = undefined;

  // if media list exceeds max items, then truncate the list.
  if ((mediaList?.length || 0) > maxItems) {

    result = "Limited to " + maxItems + " items while editing card configuration.";

    for (let i = 0, l = mediaList?.length || 0; i <= l; i++) {
      if (i > maxItems)
        mediaList?.pop()
    }
  }

  return result;

}


/**
 * Opens a new browser tab to the specified link.
 * 
 * @param url Link to open.
 */
export function openWindowNewTab(url: string):void {
  window.open(url, "_blank");
}
