// lovelace card imports.
import { HassEntity } from 'home-assistant-js-websocket';
import { HomeAssistant } from '../types/home-assistant-frontend/home-assistant';
import { ServiceCallRequest } from '../types/home-assistant-frontend/service-call-request';

// our imports.
import { MediaPlayer } from '../model/media-player';
import { MediaPlayerItem, TemplateResult } from '../types';

// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":hass-service");


export class HassService {

  /** Home Assistant instance. */
  private readonly hass: HomeAssistant;


  /**
   * Initializes a new instance of the class.
   * 
   * @param hass Home Assistant instance.
   * @param card Custom card instance.
   */
  constructor(hass: HomeAssistant) {
    this.hass = hass;
  }


  /**
   * Calls the specified MediaPlayer service, passing it the specified parameters.
   * 
   * @param serviceRequest Service request instance that contains the service to call and its parameters.
  */
  public async CallService(serviceRequest: ServiceCallRequest): Promise<void> {

    try {

      if (debuglog.enabled) {
        debuglog("%cCallService - Calling service %s (no response)\n%s",
          "color: orange;",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(serviceRequest, null, 2),
        );
      }

      // call the service.
      await this.hass.callService(
        serviceRequest.domain,
        serviceRequest.service,
        serviceRequest.serviceData,
        serviceRequest.target,
      )

    }
    finally {
    }
  }


  async browseMedia(mediaPlayer: MediaPlayer, media_content_type?: string, media_content_id?: string) {
    const mediaPlayerItem = await this.hass.callWS<MediaPlayerItem>({
      type: 'media_player/browse_media',
      entity_id: mediaPlayer.id,
      media_content_id,
      media_content_type,
    });
    //if (this.config.imageUrlsReplaceHttpWithHttps) {
    //  mediaPlayerItem.children = mediaPlayerItem.children?.map((child) => ({
    //    ...child,
    //    thumbnail: child.thumbnail?.replace('http://', 'https://'),
    //  }));
    //}
    return mediaPlayerItem;
  }


  async getRelatedEntities(player: MediaPlayer, ...entityTypes: string[]) {
    return new Promise<HassEntity[]>(async (resolve, reject) => {
      const subscribeMessage = {
        type: 'render_template',
        template: "{{ device_entities(device_id('" + player.id + "')) }}",
      };
      try {
        const unsubscribe = await this.hass.connection.subscribeMessage<TemplateResult>((response) => {
          unsubscribe();
          resolve(
            response.result
              .filter((item: string) => entityTypes.some((type) => item.includes(type)))
              .map((item) => this.hass.states[item]),
          );
        }, subscribeMessage);
      }
      catch (e) {
        reject(e);
      }
    });
  }
}
