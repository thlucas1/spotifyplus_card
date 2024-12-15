import { HassEntityAttributeBase } from 'home-assistant-js-websocket';
import { RepeatMode } from '../services/media-control-service';

/**
 * MediaPlayer Hass Entity Attributes type.
 * 
 * Hass state attributes provided by the HA MediaPlayer integration.
 */
export declare type HassEntityAttributesMediaPlayer = HassEntityAttributeBase & {

  /**
   * 
   */
  app_id?: string;

  /**
   * 
   */
  app_name?: string;

  /**
   * 
   */
  device_class?: string;

  /**
   * 
   */
  entity_picture_local?: string;

  /**
   * An array of members in the group.
   */
  group_members?: [string];

  /**
   * True if volume is currently muted; otherwise, false.
   */
  is_volume_muted?: boolean;

  /**
   * Media Album Artist name.
   */
  media_album_artist?: string;

  /**
   * Media Album name.
   */
  media_album_name?: string;

  /**
   * Media Artist name.
   */
  media_artist?: string;

  /**
   * Media channel name.
   */
  media_channel?: string;

  /**
   * URL of media currently playing.
   */
  media_content_id?: string;

  /**
   * Type of media currently playing.
   */
  media_content_type?: string;

  /**
   * Duration of current playing media in seconds.
   */
  media_duration?: number;

  /**
   * Media episode number.
   */
  media_episode?: string;

  /**
   * 
   */
  media_image_hash?: string;

  /**
   * True if media image is remotely accessible; otherwise, false.
   */
  media_image_remotely_accessible?: boolean;

  /**
   * Media image URL.
   */
  media_image_url?: string;

  /**
   * Title of current playing playlist; otherwise, null if no playlist.
   */
  media_playlist?: string;

  /**
   * When was the position of the current playing media was last refreshed
   * (not calculated) from the source.
   */
  media_position_updated_at?: string;

  /**
   * Position of current playing media in seconds.
   */
  media_position?: number;

  /**
   * Media season title.
   */
  media_season?: string;

  /**
   * Media series title.
   */
  media_series_title?: string;

  /**
   * Media title.
   */
  media_title?: string;

  /**
   * Track number of current playing media, music track only. 
   */
  media_track?: number;

  /**
   * Current repeat mode.
   */
  repeat?: RepeatMode;

  /**
   * Current shuffle state.
   */
  shuffle?: boolean;

  /**
   * List of sound modes if supported; otherwise, null.
   */
  sound_mode_list?: [string];

  /**
   * Currently selected sound mode..
   */
  sound_mode?: string;

  /**
   * List of source devices if supported; otherwise, null.
   */
  source_list?: [string];

  /**
   * Currently selected source.
   */
  source?: string;

  /**
   * Current playback state.
   */
  state?: string;  // MediaPlayerState | None = None

  /**
   * Supported feature flags.
   */
  supported_features?: number;  // MediaPlayerEntityFeature(0)

  /**
   * Volume level of the media player (0.0 to 1.0).
   */
  volume_level?: number;

};
