// lovelace card imports.
import { css, html } from 'lit';

// our imports.
import { MediaPlayer } from '../model/media-player';
import { CustomImageUrls } from '../types/custom-image-urls';
import { CardConfig } from '../types/card-config';
import { Section } from '../types/section';
import { Store } from '../model/store';
import { formatDateEpochSecondsToLocaleString, formatStringProperCase } from './utils';
import { IAlbumSimplified } from '../types/spotifyplus/album-simplified';
import { IArtist } from '../types/spotifyplus/artist';
import { IAudiobookSimplified, GetAudiobookAuthors } from '../types/spotifyplus/audiobook-simplified';
import { IEpisode } from '../types/spotifyplus/episode';
import { IMediaBrowserInfo, IMediaBrowserItem } from '../types/media-browser-item';
import { IPlaylistSimplified } from '../types/spotifyplus/playlist-simplified';
import { IShowSimplified } from '../types/spotifyplus/show-simplified';
import { ISpotifyConnectDevice } from '../types/spotifyplus/spotify-connect-device';
import { ITrackSimplified } from '../types/spotifyplus/track-simplified';
import { IUserPreset } from '../types/spotifyplus/user-preset';

const DEFAULT_MEDIA_IMAGEURL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TS0UqDnYQcchQnexiRXQrVSyChdJWaNXB5KV/0KQhSXFxFFwLDv4sVh1cnHV1cBUEwR8QZwcnRRcp8b6k0CLGC4/3cd49h/fuA4RWjalmXxxQNcvIJBNivrAqBl8RgA8hxDAnMVNPZRdz8Kyve+qluovyLO++P2tQKZoM8InEcaYbFvEG8cympXPeJw6ziqQQnxNPGnRB4keuyy6/cS47LPDMsJHLzBOHicVyD8s9zCqGSjxNHFFUjfKFvMsK5y3Oaq3BOvfkLwwVtZUs12mNIYklpJCGCBkNVFGDhSjtGikmMnSe8PCPOv40uWRyVcHIsYA6VEiOH/wPfs/WLMWm3KRQAgi82PbHOBDcBdpN2/4+tu32CeB/Bq60rr/eAmY/SW92tcgRMLQNXFx3NXkPuNwBRp50yZAcyU9LKJWA9zP6pgIwfAsMrLlz65zj9AHI0ayWb4CDQ2CiTNnrHu/u753bvz2d+f0A+AZy3KgprtwAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfoBQEMNhNCJ/KVAAACg0lEQVR42u3BgQAAAADDoPlTX+EAVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwG/GFwABsN92WwAAAABJRU5ErkJggg==';


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
 * The image to display is resolved in the following sequence:
 * - configuration `customImageUrls` `title` for matching item name (if one exists).
 * - item image_url value (if one exists).
 * - configuration `customImageUrls` `default` value (if one exists).
 * - hard-coded `default image` data if all else fails.
 * 
 * If the image_url is a Home Assistant brands logo, then the brand icon.png image is used instead.
 */
export function getContentItemImageUrl(item: any, config: CardConfig, itemsWithImage: boolean, imageUrlDefault: string) {

  // check for a custom imageUrl; if not found, then use the item image_url (if supplied).
  let imageUrl = getCustomImageUrl(config.customImageUrls, item.name || '') ?? item.image_url;

  // did we resolve an image_url?
  if (!imageUrl) {
    // no - if there are other items with images, then we will use a default image;
    // otherwise, just return undefined so it doesn't insert a default image.
    if (itemsWithImage) {
      imageUrl = config.customImageUrls?.['default'] || imageUrlDefault;
    }
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
function hasItemsWithImage(items: any[]) {

  return items.some((item) => item.image_url);

}


/**
 * Appends IMediaBrowserItem properties to each item in a collection of items
 * that are destined to be displayed in the media browser.
 * 
 * @items Collection of items to display in the media browser.
 * @config CardConfig object that contains card configuration details.
 * @section Current section that is active.
 * @store Common application storage area.
 * @returns The collection of items, with each item containing IMediaListItem arguments that will be used by the media browser.
 */
export function buildMediaBrowserItems(items: any, config: CardConfig, section: Section, store: Store) {

  // do ANY of the items have images?  returns true if so, otherwise false.
  const itemsWithImage = hasItemsWithImage(items);

  // process all items in the collection.
  return items.map((item) => {

    //console.log("%c buildMediaBrowserItems - media list item:\n%s",
    //  "color: yellow;",
    //  JSON.stringify(item),
    //);

    // build media browser info item, that will be merged with the base item.
    // get image to use as a thumbnail for the item;
    // if no image can be obtained, then use the default.
    const mbi_info: IMediaBrowserInfo = {
      image_url: getContentItemImageUrl(item, config, itemsWithImage, DEFAULT_MEDIA_IMAGEURL),
      title: item.name,
      subtitle: item.type,
      is_active: false,
    };

    // modify subtitle value based on selected section type.
    if (section == Section.ALBUM_FAVORITES) {
      const itemInfo = (item as IAlbumSimplified);
      if ((itemInfo.artists) && (itemInfo.artists.length > 0)) {
        mbi_info.subtitle = itemInfo.artists[0]?.name || (itemInfo.total_tracks || 0 + " tracks") || item.type;
      }
    } else if (section == Section.ARTIST_FAVORITES) {
      const itemInfo = (item as IArtist);
      mbi_info.subtitle = ((itemInfo?.followers?.total || 0) + " followers") || item.type;
    } else if (section == Section.AUDIOBOOK_FAVORITES) {
      const itemInfo = (item as IAudiobookSimplified);
      mbi_info.subtitle = GetAudiobookAuthors(itemInfo, ", ") || item.type;
    } else if (section == Section.DEVICES) {
      // for device item, the object uses Camel-case names, so we have to use "Name" instead of "name".
      // we will also show the device brand and model names as the subtitle.
      // we will also indicate which device is active.
      const device = (item as ISpotifyConnectDevice);
      mbi_info.title = device.Name;
      mbi_info.subtitle = (device.DeviceInfo.BrandDisplayName || "unknown") + ", " + (device.DeviceInfo.ModelDisplayName || "unknown");
      mbi_info.is_active = (item.Name == store.player.attributes.source);
    } else if (section == Section.EPISODE_FAVORITES) {
      // spotify search episode returns an IEpisodeSimplified, so show property will by null.
      // for search results, use release date for subtitle.
      // for favorite results, use the show name for subtitle.
      const itemInfo = (item as IEpisode);
      mbi_info.subtitle = itemInfo.show?.name || itemInfo.release_date || "";
    } else if (section == Section.PLAYLIST_FAVORITES) {
      const itemInfo = (item as IPlaylistSimplified);
      mbi_info.subtitle = (itemInfo.tracks?.total || 0) + " tracks";
    } else if (section == Section.SHOW_FAVORITES) {
      const itemInfo = (item as IShowSimplified);
      mbi_info.subtitle = (itemInfo.total_episodes || 0) + " episodes";
    } else if (section == Section.TRACK_FAVORITES) {
      const itemInfo = (item as ITrackSimplified);
      if ((itemInfo.artists) && (itemInfo.artists.length > 0)) {
        mbi_info.subtitle = itemInfo.artists[0].name || item.type;
      }
    } else if (section == Section.USERPRESETS) {
      const itemInfo = (item as IUserPreset);
      mbi_info.subtitle = itemInfo.subtitle || item.uri;
    }

    //console.log("%c buildMediaBrowserItems - media browser item:\n%s",
    //  "color: yellow;",
    //  JSON.stringify({
    //    ...item,
    //    mbi_item: mbi_info,
    //  }),
    //);

    // append media browser item arguments to the item.
    return {
      ...item,
      mbi_item: mbi_info
    };
  });
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


/**
 * Style definition used to style a media browser item background image.
 */
export function styleMediaBrowserItemBackgroundImage(thumbnail: string, index: number, section: Section) {

  let bgSize = '100%';
  if (section == Section.DEVICES) {
    bgSize = '50%';
  }

  return html`
    <style>
      .button:nth-of-type(${index + 1}) .thumbnail {
        background-image: url(${thumbnail});
        background-size: ${bgSize};
      }
    </style>
  `;
}


/**
 * Style definition used to style a media browser item title.
 */
export const styleMediaBrowserItemTitle = css`
  .title {
    color: var(--secondary-text-color);
    font-weight: normal;
    padding: 0 0.5rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;


export function renderMediaBrowserItem(
  item: IMediaBrowserItem,
  showTitle: boolean = true,
  showSubTitle: boolean = true,
) {

  let clsActive = ''
  if (item.mbi_item.is_active) {
    clsActive = ' title-active';
  }

  return html`
    <div class="thumbnail"></div>
    <div class="title${clsActive}" ?hidden=${!showTitle}>
      ${item.mbi_item.title}
      <div class="title-source" ?hidden=${!showSubTitle}>${formatStringProperCase(item.mbi_item.subtitle || '')}</div>
    </div>
  `;
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
