import { Context } from 'home-assistant-js-websocket';
import { SpotifyPlusHassEntityAttributes } from './spotifyplus-hass-entity-attributes';

/**
 * SpotifyPlus MediaPlayer Hass Entity type.
 * 
 * Hass state representation of a SpotifyPlus MediaPlayer integration.
 * This is a copy of the HassEntityBase object, but with the `attributes`
 * key mapped to the SpotifyPlusHassEntityAttributes type.
 */
export declare type SpotifyPlusHassEntity = {
  entity_id: string;
  state: string;
  last_changed: string;
  last_updated: string;
  attributes: SpotifyPlusHassEntityAttributes;
  context: Context;
};