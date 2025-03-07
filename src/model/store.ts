// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":store");

// lovelace card imports.
import { HomeAssistant } from '../types/home-assistant-frontend/home-assistant';
import { HassEntity } from 'home-assistant-js-websocket';

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
   */
  constructor(hass: HomeAssistant, config: CardConfig, card: Card | BaseEditor, section: Section) {

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
    this.spotifyPlusService = new SpotifyPlusService(hass, card, config);
    this.player = this.getMediaPlayerObject();
    this.section = section;

  }


  /**
   * Returns a MediaPlayer object for the given card configuration entity id value.
   * 
   * @returns A MediaPlayer object.
   * @throws Error if the specified entityId values does not exist in the hass.states data.
   */
  public getMediaPlayerObject(): MediaPlayer {

    let player: MediaPlayer | null = null;
    let playerEntityId = "";
    let playerState = "";

    do {

      // has an entity been configured?
      if ((!this.config) || (!this.config.entity) || (this.config.entity.trim() == "")) {
        // `entity` value will not be set in the config if coming from the card picker;
        // this is ok, as we want it to render a "needs configured" card ui.
        // in this case, we just return an "empty" MediaPlayer instance.
        break;
      }

      // does entity id prefix exist in hass state data?
      playerEntityId = this.config.entity;
      const hassEntitys = Object.values(this.hass.states)
        .filter((ent) => ent.entity_id.match(playerEntityId));

      // if not, then it's an error!
      if (!hassEntitys) {
        playerState = "Card configuration `entity` value " + JSON.stringify(playerEntityId) + " could not be matched in the HA state machine.";
        break;
      }

      // find the exact matching HA media player entity and create the media player instance.
      hassEntitys.forEach(item => {
        const haEntity = item as HassEntity;
        if (haEntity.entity_id.toLowerCase() == playerEntityId.toLowerCase()) {
          player = new MediaPlayer(haEntity);
        }
      })

      // did we find the player? if so, then return it if it's a media_player instance.
      if (player) {
        player = player as MediaPlayer;
        if (!player.id.startsWith("media_player")) {
          playerState = "Card configuration `entity` value " + JSON.stringify(playerEntityId) + " is not a media_player instance; please specify a media_player entity.";
          break;
        }
        return player;
      }

      // at this point, then card configuration `entity` value could not be resolved
      // to an HA media_player instance; we will just return a null player object.
      playerState = "Card configuration `entity` value " + JSON.stringify(playerEntityId) + " was not found in the HA state machine; is it disabled?";
      break;

    } while (true);

    // trace.
    if (debuglog.enabled) {
      debuglog("%cgetMediaPlayerObject - media player not resolved:\n%s",
        "color:red",
        playerState
      );
    }

    // if player could not be resolved then create an empty one so that the
    // card still renders; the `stp_config_state` attribute value will contain
    // the reason that the card did not render properly.
    player = new MediaPlayer({
      entity_id: "",
      state: "",
      last_changed: "",
      last_updated: "",
      attributes: { "sp_config_state": playerState },
      context: {
        id: "",
        user_id: "",
        parent_id: "",
      }
    });

    return player;
  }

}
