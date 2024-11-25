// lovelace card imports.
import { HomeAssistant } from '../types/home-assistant-frontend/home-assistant';

// our imports.
import { HassService } from '../services/hass-service';
import { MediaControlService } from '../services/media-control-service';
import { SpotifyPlusService } from '../services/spotifyplus-service';
import { Card } from '../card';
import { BaseEditor } from '../editor/base-editor';
import { CardConfig } from '../types/card-config';
import { ConfigArea } from '../types/config-area';
import { Section } from '../types/section';
import { MediaPlayer } from './media-player';


/**
 * Card storage class instance.  
 * 
 * This class is used to store references to common services and data areas
 * that are used by the various card sections.
 * */
export class Store {

  /** Home Assistant instance. */
  public hass: HomeAssistant;

  /** Card configuration data. */
  public config: CardConfig;

  /** Custom card instance. */
  public readonly card: Card | BaseEditor;

  /** Home Assistant services helper instance. */
  public hassService: HassService;

  /** SpotifyPlus services helper instance. */
  public spotifyPlusService: SpotifyPlusService;

  /** MediaControlService services helper instance. */
  public mediaControlService: MediaControlService;

  /** SpotifyPlus MediaPlayer object that will process requests. */
  public player: MediaPlayer;

  /** Currently selected section. */
  public section: Section;

  /** Currently selected ConfigArea **/
  static selectedConfigArea: ConfigArea = ConfigArea.GENERAL;

  /** card editor render flags for individual sections. */
  static hasCardEditLoadedMediaList: { [key: string]: boolean } = {};


  /**
   * Initializes a new instance of the class.
   * 
   * @param hass Home Assistant instance.
   * @param config Card configuration data.
   * @param card Custom card instance.
   * @param section Currently selected section of the card.
   * @param playerId Entity ID of the SpotifyPlus device that will process requests.
   */
  constructor(hass: HomeAssistant, config: CardConfig, card: Card | BaseEditor, section: Section, playerId: string) {

    // if hass property has not been set yet, then it's a programmer problem!
    if (!hass) {
      throw new Error("STPC0005 hass property has not been set!");
    }

    // initialize storage.
    this.hass = hass;
    this.config = config;
    this.card = card;
    this.hassService = new HassService(hass);
    this.mediaControlService = new MediaControlService(this.hassService);
    this.spotifyPlusService = new SpotifyPlusService(hass, card);
    this.player = this.getMediaPlayerObject(playerId);
    this.section = section;
  }


  /**
   * Returns a MediaPlayer object for the given entity id value.
   * 
   * @param entityId Entity ID of the media player.
   * @returns A MediaPlayer object.
   * @throws Error if the specified entityId values does not exist in the hass.states data.
   */
  public getMediaPlayerObject(entityId: string) {

    // does entity id exist in hass state data?
    const hassEntity = Object.values(this.hass.states)
      .filter((ent) => ent.entity_id.match(entityId));

    // if not, then it's an error!
    if (!hassEntity)
      throw new Error("Entity id '" + JSON.stringify(entityId) + "' does not exist in the state machine");

    // convert the hass state representation to a media player object.
    return new MediaPlayer(hassEntity[0]);
  }

}
