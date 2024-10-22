import { HassEntityAttributesMediaPlayer } from './hass-entity-attributes-media-player';

/**
 * SpotifyPlus MediaPlayer Hass Entity Attributes type.
 * 
 * Hass state attributes provided by the SpotifyPlus integration.
 * This also contains the HA MediaPlayer attributes, as the SpotifyPlus
 * integration inherits from HA MediaPlayer.
 */
export declare type SpotifyPlusHassEntityAttributes = HassEntityAttributesMediaPlayer & {
  sp_device_id?: string;
  sp_device_name?: string;
  sp_device_is_brand_sonos?: string;
  sp_context_uri?: string;
  sp_item_type?: string;
  sp_playlist_name?: string;
  sp_playlist_uri?: string;
  sp_user_country?: string;
  sp_user_display_name?: string;
  sp_user_email?: string;
  sp_user_id?: string;
  sp_user_product?: string;
  sp_user_uri?: string;
};
