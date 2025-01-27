// lovelace card imports.
import { HassService } from './hass-service';
import { ServiceCallRequest } from '../types/home-assistant-frontend/service-call-request';

// our imports.
import { MediaPlayerItem } from '../types';
import { MediaPlayer } from '../model/media-player';
import { ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED, DOMAIN_MEDIA_PLAYER } from '../constants';

// media player services.
export const SERVICE_TURN_ON = "turn_on";
export const SERVICE_TURN_OFF = "turn_off";
//const SERVICE_VOLUME_UP = "volume_up";
//const SERVICE_VOLUME_DOWN = "volume_down";
export const SERVICE_VOLUME_MUTE = "volume_mute";
export const SERVICE_VOLUME_SET = "volume_set";
export const SERVICE_MEDIA_PLAY_PAUSE = "media_play_pause";
export const SERVICE_MEDIA_PLAY = "media_play";
export const SERVICE_MEDIA_PAUSE = "media_pause";
export const SERVICE_MEDIA_STOP = "media_stop";
export const SERVICE_MEDIA_NEXT_TRACK = "media_next_track";
export const SERVICE_MEDIA_PREVIOUS_TRACK = "media_previous_track";
export const SERVICE_MEDIA_SEEK = "media_seek";
export const SERVICE_REPEAT_SET = "repeat_set";
export const SERVICE_SHUFFLE_SET = "shuffle_set";
export const SERVICE_CLEAR_PLAYLIST = "clear_playlist";
export const SERVICE_JOIN = "join";
export const SERVICE_PLAY_MEDIA = "play_media";
export const SERVICE_SELECT_SOUND_MODE = "select_sound_mode";
export const SERVICE_SELECT_SOURCE = "select_source";
export const SERVICE_UNJOIN = "unjoin";


export class MediaControlService {

  private hassService: HassService;


  /**
   * Initializes a new instance of the class.
   * 
   * @param hassService HassService object.
   */
  constructor(hassService: HassService) {
    this.hassService = hassService;
  }


  /**
   * Clears the internal media player play list.
   * 
   * @param player MediaPlayer object to control.
   */
  public async clear_playlist(player: MediaPlayer) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_CLEAR_PLAYLIST,
      serviceData: {
        entity_id: player.id,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Add players to a master player zone.
   * 
   * @param master Player entity-id of the master zone.
   * @param groupMembers An array of Player entity-id's to add to the master zone.
   */
  public async join(master: string, groupMembers: string[]) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_JOIN,
      serviceData: {
        entity_id: master,
        group_members: groupMembers,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Plays the next available track.
   * 
   * @param player MediaPlayer object to control.
   */
  public async media_next_track(player: MediaPlayer) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_MEDIA_NEXT_TRACK,
      serviceData: {
        entity_id: player.id,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Pauses the playing track.
   * 
   * @param player MediaPlayer object to control.
   */
  public async media_pause(player: MediaPlayer) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_MEDIA_PAUSE,
      serviceData: {
        entity_id: player.id,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Resumes play of the paused track.
   * 
   * @param player MediaPlayer object to control.
   */
  public async media_play(player: MediaPlayer) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_MEDIA_PLAY,
      serviceData: {
        entity_id: player.id,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Toggles between media play and pause states.
   * 
   * @param player MediaPlayer object to control.
   */
  public async media_play_pause(player: MediaPlayer) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_MEDIA_PLAY_PAUSE,
      serviceData: {
        entity_id: player.id,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Plays the previously played track.
   * 
   * @param player MediaPlayer object to control.
   */
  public async media_previous_track(player: MediaPlayer) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_MEDIA_PREVIOUS_TRACK,
      serviceData: {
        entity_id: player.id,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Seeks to the specified position in a playing track.
   * 
   * @param player MediaPlayer object to control.
   * @param position Desired position to seek to.
   */
  public async media_seek(player: MediaPlayer, position: number) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_MEDIA_SEEK,
      serviceData: {
        entity_id: player.id,
        seek_position: position,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Stops currently playing track.
   * 
   * @param player MediaPlayer object to control.
   */
  public async media_stop(player: MediaPlayer) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_MEDIA_STOP,
      serviceData: {
        entity_id: player.id,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Plays the specified media content.
   * 
   * @param player MediaPlayer object to control.
   * @param item MediaPlayerItem object that contains media information to play.
   */
  public async play_media(player: MediaPlayer, item: MediaPlayerItem) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_PLAY_MEDIA,
      serviceData: {
        entity_id: player.id,
        media_content_id: item.media_content_id,
        media_content_type: item.media_content_type,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Set repeat mode.
   * 
   * @param player MediaPlayer object to control.
   * @param repeat Repeat mode to select.
   */
  public async repeat_set(player: MediaPlayer, repeat: RepeatMode) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_REPEAT_SET,
      serviceData: {
        entity_id: player.id,
        repeat: repeat,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Selects a sound mode on the specified media player.
   * 
   * @param player MediaPlayer object to control.
   * @param sound_mode Sound Mode to select.
   */
  public async select_sound_mode(player: MediaPlayer, sound_mode: string) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_SELECT_SOUND_MODE,
      serviceData: {
        entity_id: player.id,
        sound_mode: sound_mode,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Selects a source on the specified media player.
   * 
   * @param player MediaPlayer object to control.
   * @param source Source to select.
   */
  public async select_source(player: MediaPlayer, source: string) {

    // spotify premium required for this function.
    if (!player.isUserProductPremium()) {
      throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
    }

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_SELECT_SOURCE,
      serviceData: {
        entity_id: player.id,
        source: source,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Set shuffle mode.
   * 
   * @param player MediaPlayer object to control.
   * @param shuffle Shuffle mode enabled (true) or disabled (false).
   */
  public async shuffle_set(player: MediaPlayer, shuffle: boolean) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_SHUFFLE_SET,
      serviceData: {
        entity_id: player.id,
        shuffle: shuffle,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Turns off the media player.
   * 
   * @param player MediaPlayer object to control.
   */
  public async turn_off(player: MediaPlayer) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_TURN_OFF,
      serviceData: {
        entity_id: player.id,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Turns on the media player.
   * 
   * @param player MediaPlayer object to control.
   */
  public async turn_on(player: MediaPlayer) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_TURN_ON,
      serviceData: {
        entity_id: player.id,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Remove players from a master player zone.
   * 
   * @param playerIds An array of Player entity-id's to remove from the master zone.
   */
  public async unJoin(playerIds: string[]) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_UNJOIN,
      serviceData: {
        entity_id: playerIds,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Mutes / unmutes the player volume.
   * 
   * @param player MediaPlayer object to control.
   * @param muteVolume True to mute the volume; otherwise, False to unmute the volume.
   */
  public async volume_mute(player: MediaPlayer, muteVolume: boolean) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_VOLUME_MUTE,
      serviceData: {
        entity_id: player.id,
        is_volume_muted: muteVolume,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }


  /**
   * Toggles the volume mute status of the player; 
   * if muted, then it will be unmuted;
   * if unmuted, then it will be muted;
   * 
   * @param player MediaPlayer object to control.
   */
  public async volume_mute_toggle(player: MediaPlayer) {

    const muteVolume = !player.isMuted();
    await this.volume_mute(player, muteVolume);
  }


  /**
   * Sets the player volume.
   * 
   * @param player MediaPlayer object to control.
   * @param volumePercent Volume level to set, expressed as a percentage (e.g. 1 - 100).
   */
  public async volume_set(player: MediaPlayer, volumePercent: number) {

    const volumeLevel = volumePercent / 100;

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_VOLUME_SET,
      serviceData: {
        entity_id: player.id,
        volume_level: volumeLevel,
      }
    };

    // call the service.
    await this.hassService.CallService(serviceRequest);
  }

}


/**
 * Repeat mode for media player entities.
 */
export enum RepeatMode {
  ALL = "all",
  OFF = "off",
  ONE = "one"
}


/**
 * Supported features of the media player entity.
 */
export enum MediaPlayerEntityFeature {
  PAUSE = 1,
  SEEK = 2,
  VOLUME_SET = 4,
  VOLUME_MUTE = 8,
  PREVIOUS_TRACK = 16,
  NEXT_TRACK = 32,

  TURN_ON = 128,
  TURN_OFF = 256,
  PLAY_MEDIA = 512,
  VOLUME_BUTTONS = 1024,
  SELECT_SOURCE = 2048,
  STOP = 4096,
  CLEAR_PLAYLIST = 8192,
  PLAY = 16384,
  SHUFFLE_SET = 32768,
  SELECT_SOUND_MODE = 65536,
  BROWSE_MEDIA = 131072,
  REPEAT_SET = 262144,
  GROUPING = 524288,

}


/**
 * State of media player entities.
 */
export enum MediaPlayerState {
  OFF = "off",
  ON = "on",
  IDLE = "idle",
  PLAYING = "playing",
  PAUSED = "paused",
  STANDBY = "standby",
  BUFFERING = "buffering",
  UNKNOWN = "unknown",
}