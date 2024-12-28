import { HassEntityAttributesMediaPlayer } from './hass-entity-attributes-media-player';

/**
 * SpotifyPlus MediaPlayer Hass Entity Attributes type.
 * 
 * Hass state attributes provided by the SpotifyPlus integration.
 * This also contains the HA MediaPlayer attributes, as the SpotifyPlus
 * integration inherits from HA MediaPlayer.
 */
export declare type SpotifyPlusHassEntityAttributes = HassEntityAttributesMediaPlayer & {

  /**
   * Spotify uri for the currently playing context (e.g. "spotify:album:5ovMagVMhha9qq0OYDzXFm"). 
   */
  sp_context_uri?: string;

  /**
   * Spotify device identifier that is currently active (e.g. "5d4931f9d0684b625d702eaa24137b2c1d99539c").
   */
  sp_device_id?: string;

  /**
   * Spotify device name that is currently active (e.g. "Bose-ST10-2").
   */
  sp_device_name?: string;

  /**
   * Denotes if the source device is a Sonos brand device (true) or not (false).
   */
  sp_device_is_brand_sonos?: boolean;

  /**
   * Denotes the type of item being played: `track`, `podcast`, or `audiobook`.
   */
  sp_item_type?: string;

  /**
   * The object type of the currently playing item, or null if nothing is playing.
   * If not null, it can be one of `track`, `episode`, `ad` or `unknown`.
   */
  sp_playing_type?: string;

  /**
   * Playlist name being played, if the current context is a playlist (e.g. "DJ").
   */
  sp_playlist_name?: string;

  /**
   * Playlist uri being played, if the current context is a playlist (e.g. "spotify:playlist:37i9dQZF1EYkqdzj48dyYq").
   */
  sp_playlist_uri?: string;

  /**
   * List of device names (in lower-case) to hide from the source list.
   */
  sp_source_list_hide?: Array<string>;

  /**
   * True if the track / episode has explicit content; otherwise, false.
   */
  sp_track_is_explicit?: boolean;

  /**
   * Country code for the active Spotify user account (e.g. "US").
   */
  sp_user_country?: string;

  /**
   * Display name for the active Spotify user account (e.g. "Todd L").
   */
  sp_user_display_name?: string;

  /**
   * Email address for the active Spotify user account (e.g. "youremail@gmail.com").
   */
  sp_user_email?: string;

  /**
   * User-id for the active Spotify user account (e.g. "31l77fh76whjfr7987fhebpfhqke").
   */
  sp_user_id?: string;

  /**
   * Product code for the active Spotify user account (e.g. "premium", "free", "unknown").
   */
  sp_user_product?: string;

  /**
   * Uri for the active Spotify user account (e.g. "spotify:user:31l77fh76whjfr7987fhebpfhqke").
   */
  sp_user_uri?: string;

};
