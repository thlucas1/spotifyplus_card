/* eslint-disable @typescript-eslint/no-explicit-any */

// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":spotifyplus-service");

// lovelace card imports.
import { HomeAssistant } from '../types/home-assistant-frontend/home-assistant';
import { ServiceCallRequest } from '../types/home-assistant-frontend/service-call-request';
import {
  mdiCastAudio,
  mdiGoogleChrome,
  mdiMicrosoftEdge,
  mdiSpeaker,
  mdiSpeakerMultiple,
  mdiWeb,
} from '@mdi/js';

// our imports.
import {
  ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED,
  DOMAIN_SPOTIFYPLUS,
  DOMAIN_MEDIA_PLAYER
} from '../constants';
import {
  SERVICE_TURN_OFF,
  SERVICE_TURN_ON,
  SERVICE_SELECT_SOURCE,
  SERVICE_VOLUME_MUTE,
  SERVICE_VOLUME_SET,
  SERVICE_VOLUME_DOWN,
  SERVICE_VOLUME_UP
} from '../services/media-control-service'
import { MediaPlayer } from '../model/media-player';
import { getMdiIconImageUrl } from '../utils/media-browser-utils';
import { CardConfig } from '../types/card-config';
import { SearchMediaTypes } from '../types/search-media-types';
import { IAlbum } from '../types/spotifyplus/album';
import { IAlbumPageSaved } from '../types/spotifyplus/album-page-saved';
import { IAlbumPageSimplified } from '../types/spotifyplus/album-page-simplified';
import { IAlbumSimplified } from '../types/spotifyplus/album-simplified';
import { IArtist } from '../types/spotifyplus/artist';
import { IArtistInfo } from '../types/spotifyplus/artist-info';
import { IArtistPage } from '../types/spotifyplus/artist-page';
import { IAudiobook } from '../types/spotifyplus/audiobook';
import { IAudiobookPageSimplified } from '../types/spotifyplus/audiobook-page-simplified';
import { IAudiobookSimplified } from '../types/spotifyplus/audiobook-simplified';
import { ICategoryPage } from '../types/spotifyplus/category-page';
import { IChapter } from '../types/spotifyplus/chapter';
import { IChapterPageSimplified } from '../types/spotifyplus/chapter-page-simplified';
import { IEpisode } from '../types/spotifyplus/episode';
import { IEpisodePageSaved } from '../types/spotifyplus/episode-page-saved';
import { IEpisodePageSimplified } from '../types/spotifyplus/episode-page-simplified';
import { IEpisodeSimplified } from '../types/spotifyplus/episode-simplified';
import { IPlayerQueueInfo } from '../types/spotifyplus/player-queue-info';
import { IPlaylistPage } from '../types/spotifyplus/playlist-page';
import { IPlaylistPageSimplified } from '../types/spotifyplus/playlist-page-simplified';
import { IPlaylistSimplified } from '../types/spotifyplus/playlist-simplified';
import { IPlayHistoryPage } from '../types/spotifyplus/play-history-page';
import { IShowPageSaved } from '../types/spotifyplus/show-page-saved';
import { IShowPageSimplified } from '../types/spotifyplus/show-page-simplified';
import { IShowSimplified } from '../types/spotifyplus/show-simplified';
import { ISpotifyConnectDevice } from '../types/spotifyplus/spotify-connect-device';
import { ISpotifyConnectDevices } from '../types/spotifyplus/spotify-connect-devices';
import { ITrack } from '../types/spotifyplus/track';
import { ITrackPage } from '../types/spotifyplus/track-page';
import { ITrackPageSaved } from '../types/spotifyplus/track-page-saved';
import { ITrackPageSimplified } from '../types/spotifyplus/track-page-simplified';
import { ITrackRecommendations } from '../types/spotifyplus/track-recommendations';
import { ITrackRecommendationsProperties } from '../types/spotifyplus/track-recommendations-properties';
import { IZeroconfResponse } from '../types/spotifyplus/zeroconf-response';


/** SpotifyPlus custom services provider class. */
export class SpotifyPlusService {

  /** Home Assistant instance. */
  private readonly hass: HomeAssistant;

  /** Custom card instance. */
  public readonly card: Element;

  /** Card configuration data. */
  public readonly config: CardConfig;


  /**
   * Initializes a new instance of the class.
   * 
   * @param hass HomeAssistant instance.
   * @param card Parent custom card instance.
   * @param config Card configuration instance.
   */
  constructor(hass: HomeAssistant, card: Element, config: CardConfig) {

    // initialize storage.
    this.hass = hass;
    this.card = card;
    this.config = config;
  }


  /**
   * Resolve a device_id value, if one was not specified.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param device_id The id or name of the Spotify Connect Player device this command is targeting.
   * @returns A device_id value.
  */
  public getDeviceId(
    player: MediaPlayer,
    device_id: string | undefined | null = null,
  ): string | undefined | null {

    // if a specific device id was not passed, then default it.
    // Sonos devices always use the name, since they are restricted and do not have ID's initially;
    // if controlling by device name, then default to the device name;
    // otherwise, default to the device ID.
    if (device_id == null) {
      if (player.attributes.sp_device_is_brand_sonos) {
        device_id = player.attributes.source || null;
      } else if (this.config.deviceControlByName) {
        device_id = player.attributes.source || player.attributes.sp_device_id || null;
      } else {
        device_id = player.attributes.sp_device_id || player.attributes.source || null;
      }
    }

    // if default device configured then override the specified deviceId.
    if (this.config.deviceDefaultId) {
      device_id = this.config.deviceDefaultId;
      debuglog("getDeviceId - overriding device_id with config option deviceDefaultId: \n%s",
        JSON.stringify(this.config.deviceDefaultId),
      );
    }

    return device_id;
  }


  /**
   * Calls the specified SpotifyPlus service, passing it the specified parameters.
   * 
   * @param serviceRequest Service request instance that contains the service to call and its parameters.
  */
  public async CallService(
    serviceRequest: ServiceCallRequest,
  ): Promise<void> {

    try {

      if (debuglog.enabled) {
        debuglog("%cCallService - Calling service %s (no response)\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(serviceRequest, null, 2)
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


  /**
   * Calls the specified SpotifyPlus service and returns response data that is generated by the
   * service.
   * 
   * @param serviceRequest Service request instance that contains the service to call and its parameters.
   * @returns Response data, in the form of a Record<string, any> (e.g. dictionary).
  */
  public async CallServiceWithResponse(
    serviceRequest: ServiceCallRequest,
  ): Promise<Record<string, any>> {

    try {

      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Calling service %s (with response)\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(serviceRequest, null, 2)
        );
      }

      //// ensure user is administrator; left this in here in case we need it in the future.
      //if (!this.hass.user.is_admin) {
      //  throw Error("User account \"" + this.hass.user.name + "\" is not an Administrator; execute_script cannot be called by non-administrator accounts");
      //}

      // call the service.
      const serviceResponse = await this.hass.callService(
        serviceRequest.domain,
        serviceRequest.service,
        serviceRequest.serviceData,
        serviceRequest.target,
        undefined,                  // notify on error
        true,                       // return response data
      )

      //if (debuglog.enabled) {
      //  debuglog("%cCallServiceWithResponse - Service %s response:\n%s",
      //    "color: red",
      //    JSON.stringify(serviceRequest.service),
      //    JSON.stringify(serviceResponse.response, null, 2)
      //  );
      //}

      // return the service response data or an empty dictionary if no response data was generated.
      return serviceResponse.response || {};

    }
    finally {
    }
  }

  /**
   * Add one or more items to the end of the user's current Spotify Player playback queue.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param uris A list of Spotify track or episode URIs to add to the queue (spotify:track:6zd8T1PBe9JFHmuVnurdRp, spotify:track:1kWUud3vY5ij5r62zxpTRy); values can be track or episode URIs.  All URIs must be of the same type - you cannot mix and match tracks and episodes.  An unlimited number of items can be added in one request, but the more items the longer it will take.
   * @param device_id The id or name of the Spotify Connect Player device this command is targeting.  If not supplied, the user's currently active device is the target.  If no device is active (or an '*' is specified), then the SpotifyPlus default device is activated.
   * @param verify_device_id True to verify a device id is active; otherwise, false to assume that a device id is already active. Default is True.
   * @param delay Time delay (in seconds) to wait AFTER issuing the add request (if necessary). This delay will give the spotify web api time to process the change before another command is issued.  Default is 0.15; value range is 0 - 10.
  */
  public async AddPlayerQueueItems(
    player: MediaPlayer,
    uris: string | undefined | null = null,
    device_id: string | undefined | null = null,
    verify_device_id: boolean | undefined | null = true,
    delay: number | null = null,
  ): Promise<void> {

    try {

      // spotify premium account required for this function.
      // not supported by elevated credentials.
      if (!player.isUserProductPremium()) {
        throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
      }

      // resolve a device_id value, if one was not specified.
      device_id = this.getDeviceId(player, device_id);

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        uris: uris,
      };

      // update service data parameters (with optional parameters).
      if (device_id != null)
        serviceData['device_id'] = device_id;
      if (verify_device_id != null)
        serviceData['verify_device_id'] = verify_device_id;
      if (delay != null)
        serviceData['delay'] = delay;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'add_player_queue_items',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Check if one or more albums (or the currently playing album) exists in the current 
   * user's 'Your Library' favorites.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the albums.  If null, the currently playing track album uri id value is used.
   * @returns Response data, in the form of a Record<string, any> (e.g. dictionary).
  */
  public async CheckAlbumFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<Record<string, boolean>> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'check_album_favorites',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);
      return response["result"];

    }
    finally {
    }
  }


  /**
   * Check if one or more artists (or the currently playing artist) exists in the current 
   * user's 'Your Library' favorites.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the artists.  If null, the currently playing track artist uri id value is used.
   * @returns Response data, in the form of a Record<string, any> (e.g. dictionary).
  */
  public async CheckArtistsFollowing(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<Record<string, boolean>> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'check_artists_following',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);
      return response["result"];

    }
    finally {
    }
  }


  /**
   * Check if one or more audiobooks (or the currently playing audiobook) exists in the current 
   * user's 'Your Library' favorites.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the audiobooks.  If null, the currently playing audiobook uri id value is used.
   * @returns Response data, in the form of a Record<string, any> (e.g. dictionary).
  */
  public async CheckAudiobookFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<Record<string, boolean>> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'check_audiobook_favorites',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);
      return response["result"];

    }
    finally {
    }
  }


  /**
   * Check if one or more episodes (or the currently playing episode) exists in the current 
   * user's 'Your Library' favorites.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the episodes.  If null, the currently playing episode uri id value is used.
   * @returns Response data, in the form of a Record<string, any> (e.g. dictionary).
  */
  public async CheckEpisodeFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<Record<string, boolean>> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'check_episode_favorites',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);
      return response["result"];

    }
    finally {
    }
  }


  /**
   * Check to see if the current user is following a specified playlist.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param playlist_id The Spotify ID of the playlist (e.g. `3cEYpjA9oz9GiPac4AsH4n`).
   * @returns Response data, in the form of a Record<string, any> (e.g. dictionary).
  */
  public async CheckPlaylistFollowers(
    player: MediaPlayer,
    playlist_id: string,
    user_ids: string | undefined | null = null,
  ): Promise<Record<string, boolean>> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        playlist_id: playlist_id,
      };

      // update service data parameters (with optional parameters).
      if (user_ids != null)
        serviceData['user_ids'] = user_ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'check_playlist_followers',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);
      return response["result"];

    }
    finally {
    }
  }


  /**
   * Check if one or more shows (or the currently playing show) exists in the current 
   * user's 'Your Library' favorites.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the shows.  If null, the currently playing show uri id value is used.
   * @returns Response data, in the form of a Record<string, any> (e.g. dictionary).
  */
  public async CheckShowFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<Record<string, boolean>> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'check_show_favorites',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);
      return response["result"];

    }
    finally {
    }
  }


  /**
   * Check if one or more tracks (or the currently playing track) exists in the current 
   * user's 'Your Library' favorites.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the tracks.  If null, the currently playing track uri id value is used.
   * @returns Response data, in the form of a Record<string, any> (e.g. dictionary).
  */
  public async CheckTrackFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<Record<string, boolean>> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'check_track_favorites',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);
      return response["result"];

    }
    finally {
    }
  }


  /**
   * Add the current user as a follower of one or more artists.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the artists.  If null, the currently playing track artist uri id value is used.
  */
  public async FollowArtists(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'follow_artists',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Add the current user as a follower of a playlist.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param playlist_id The Spotify ID of the playlist (e.g. `3cEYpjA9oz9GiPac4AsH4n`). If null, the currently playing playlist uri id value is used.
   * @param public If true the playlist will be included in user's public playlists, if false it will remain private. Default is True. 
  */
  public async FollowPlaylist(
    player: MediaPlayer,
    playlist_id: string | undefined | null = null,
    is_public: boolean | undefined | null = true,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (playlist_id != null)
        serviceData['playlist_id'] = playlist_id;
      if (is_public != null)
        serviceData['public'] = is_public;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'follow_playlist',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information for a single album identified by its unique Spotify ID.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param album_id The Spotify ID of the album.  If null, the currently playing album uri id value is used. Example `1kWUud3vY5ij5r62zxpTRy`.
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A `IAlbum` object that contains the album details.
  */
  public async GetAlbum(
    player: MediaPlayer,
    album_id: string | undefined | null = null,
    market: string | undefined | null = null,
    trimResults: boolean = true,
  ): Promise<IAlbum> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (album_id != null)
        serviceData['album_id'] = album_id;
      if (market != null)
        serviceData['market'] = market;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_album',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IAlbum;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.tracks != null)) {
          responseObj.available_markets = [];
          responseObj.images = [];
          responseObj.tracks.items.forEach(item => {
            item.available_markets = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get a list of the albums saved in the current Spotify user's 'Your Library'.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param sort_result True to sort the items by name; otherwise, False to leave the items in the same order they were returned in by the Spotify Web API.  Default is true.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A AlbumPageSaved object.
  */
  public async GetAlbumFavorites(
    player: MediaPlayer,
    limit: number | null = null,
    offset: number | null = null,
    market: string | undefined | null = null,
    limit_total: number | null = null,
    sort_result: boolean | null = null,
    trimResults: boolean = true,
  ): Promise<IAlbumPageSaved> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;
      if (sort_result != null)
        serviceData['sort_result'] = sort_result;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_album_favorites',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IAlbumPageSaved;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.album.images = [];
            item.album.available_markets = [];
            if (item.album.tracks) {
              item.album.tracks = JSON.parse("{ }") as ITrackPageSimplified;
            }
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about an album's tracks.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param album_id The Spotify ID of the album (e.g. `6vc9OTcyd3hyzabCmsdnwE`). If null, the currently playing album uri id value is used; a Spotify Free or Premium account is required to correctly read the currently playing context.
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A TrackPageSimplified object.
  */
  public async GetAlbumTracks(
    player: MediaPlayer,
    album_id: string | null = null,
    limit: number | null = null,
    offset: number | null = null,
    market: string | undefined | null = null,
    limit_total: number | null = null,
    trimResults: boolean = true,
  ): Promise<ITrackPageSimplified> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (album_id != null)
        serviceData['album_id'] = album_id;
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_album_tracks',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as ITrackPageSimplified;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.available_markets = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about an artist's albums.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param artist_id The Spotify ID of the artist.  If omitted, the currently playing artist uri id value is used.
   * @param include_groups A comma-separated list of keywords that will be used to filter the response.  If not supplied, only `album` types will be returned. Valid values are `album`, `single`, `appears_on`, `compilation`.
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param sort_result True to sort the items by name; otherwise, False to leave the items in the same order they were returned in by the Spotify Web API.  Default is true.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A AlbumPageSimplified object.
  */
  public async GetArtistAlbums(
    player: MediaPlayer,
    artist_id: string | undefined | null = null,
    include_groups: string | undefined | null = null,
    limit: number | null = null,
    offset: number | null = null,
    market: string | undefined | null = null,
    limit_total: number | null = null,
    sort_result: boolean | null = null,
    trimResults: boolean = true,
  ): Promise<IAlbumPageSimplified> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (artist_id != null)
        serviceData['artist_id'] = artist_id;
      if (include_groups != null)
        serviceData['include_groups'] = include_groups;
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;
      if (sort_result != null)
        serviceData['sort_result'] = sort_result;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_artist_albums',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IAlbumPageSimplified;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.images = [];
            item.available_markets = []
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get artist about information from the Spotify Artist Biography page for the specified Spotify artist ID.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param artist_id The Spotify ID of the artist.  If omitted, the currently playing artist uri id value is used.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns An IArtistInfo object.
  */
  public async GetArtistInfo(
    player: MediaPlayer,
    artist_id: string | undefined | null = null,
    trimResults: boolean = true,
  ): Promise<IArtistInfo> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (artist_id != null)
        serviceData['artist_id'] = artist_id;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_artist_info',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IArtistInfo;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if (responseObj != null) {
          // nothing to trim at this point.
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about artists similar to a given artist.  
   * Similarity is based on analysis of the Spotify community's listening history.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param artist_id The Spotify ID of the artist (e.g. 6APm8EjxOHSYM5B4i3vT3q).  If omitted, the currently playing artist uri id value is used.
   * @param sort_result True to sort the items by name; otherwise, False to leave the items in the same order they were returned in by the Spotify Web API.  Default is true.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A list of `IArtist` objects.
  */
  public async GetArtistRelatedArtists(
    player: MediaPlayer,
    artist_id: string | undefined | null = null,
    sort_result: boolean | null = null,
    trimResults: boolean = true,
  ): Promise<Array<IArtist>> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (artist_id != null)
        serviceData['artist_id'] = artist_id;
      if (sort_result != null)
        serviceData['sort_result'] = sort_result;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_artist_related_artists',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as Array<IArtist>;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if (responseObj != null) {
          responseObj.forEach(item => {
            item.images = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about an artist's top tracks by country.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param artist_id The Spotify ID of the artist (e.g. 6APm8EjxOHSYM5B4i3vT3q).  If omitted, the currently playing artist uri id value is used.
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param sort_result True to sort the items by name; otherwise, False to leave the items in the same order they were returned in by the Spotify Web API.  Default is true.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A list of `ITrack` objects.
  */
  public async GetArtistTopTracks(
    player: MediaPlayer,
    artist_id: string | undefined | null = null,
    market: string | null = null,
    sort_result: boolean | null = null,
    trimResults: boolean = true,
  ): Promise<Array<ITrack>> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (artist_id != null)
        serviceData['artist_id'] = artist_id;
      if (market != null)
        serviceData['market'] = market;
      if (sort_result != null)
        serviceData['sort_result'] = sort_result;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_artist_top_tracks',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as Array<ITrack>;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if (responseObj != null) {
          responseObj.forEach(item => {
            item.available_markets = [];
            item.album.available_markets = []
            item.album.images = []
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get the current user's followed artists.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param after The last artist ID retrieved from the previous request, or null for the first request.  Example: `6APm8EjxOHSYM5B4i3vT3q`.
   * @param limit The maximum number of items to return in a page of items when manual paging is used.  Default: 20, Range: 1 to 50.  See the `limit_total` argument for automatic paging option.  
   * @param limit_total The maximum number of items to return for the request.  If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum number specified.  Default: None (disabled).
   * @param sort_result True to sort the items by name; otherwise, False to leave the items in the same order they were returned in by the Spotify Web API.  Default is true.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A ArtistPage object.
  */
  public async GetArtistsFollowed(
    player: MediaPlayer,
    after: number | null = null, 
    limit: number | null = null,
    limit_total: number | null = null,
    sort_result: boolean | null = null,
    trimResults: boolean = true,
  ): Promise<IArtistPage> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (after != null)
        serviceData['after'] = after;
      if (limit != null)
        serviceData['limit'] = limit;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;
      if (sort_result != null)
        serviceData['sort_result'] = sort_result;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_artists_followed',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IArtistPage;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.images = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information for a single audiobook.  
   * Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param audiobook_id The Spotify ID for the audiobook (e.g. `74aydHJKgYz3AIq3jjBSv1`). If null, the currently playing audiobook uri id value is used.
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A `IAudiobook` object that contains the audiobook details.
  */
  public async GetAudiobook(
    player: MediaPlayer,
    audiobook_id: string | undefined | null = null,
    market: string | null = null,
    trimResults: boolean = true,
  ): Promise<IAudiobook> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (audiobook_id != null)
        serviceData['audiobook_id'] = audiobook_id;
      if (market != null)
        serviceData['market'] = market;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_audiobook',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IAudiobook;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if (responseObj != null) {
          responseObj.available_markets = [];
          responseObj.images = []
          responseObj.chapters?.forEach(item => {
            item.items?.forEach(chapter => {
              chapter.available_markets = [];
              chapter.description = 'see html_description';
              chapter.images = [];
            })
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about an audiobook's chapters.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param audiobook_id The Spotify ID for the audiobook (e.g. `74aydHJKgYz3AIq3jjBSv1`). If null, the currently playing audiobook uri id value is used.
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A ChapterPageSimplified object.
  */
  public async GetAudiobookChapters(
    player: MediaPlayer,
    audiobook_id: string | null = null,
    limit: number | null = null,
    offset: number | null = null,
    market: string | null = null,
    limit_total: number | null = null,
    trimResults: boolean = true,
  ): Promise<IChapterPageSimplified> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (audiobook_id != null)
        serviceData['audiobook_id'] = audiobook_id;
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_audiobook_chapters',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IChapterPageSimplified;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.available_markets = [];
            item.description = 'see html_description';
            item.images = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get a list of the audiobooks owned or followed by the current Spotify user.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param sort_result True to sort the items by name; otherwise, False to leave the items in the same order they were returned in by the Spotify Web API.  Default is true.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A AudiobookPageSimplified object.
  */
  public async GetAudiobookFavorites(
    player: MediaPlayer,
    limit: number | null = null,
    offset: number | null = null,
    limit_total: number | null = null,
    sort_result: boolean | null = null,
    trimResults: boolean = true,
  ): Promise<IAudiobookPageSimplified> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;
      if (sort_result != null)
        serviceData['sort_result'] = sort_result;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_audiobook_favorites',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IAudiobookPageSimplified;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.available_markets = [];
            item.description = 'see html_description';
            item.images = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get a sorted list of ALL categories used to tag items in Spotify.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param country An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  The country associated with the user account will take priority over this parameter.
   * @param locale The desired language, consisting of a lowercase ISO 639-1 language code and an uppercase ISO 3166-1 alpha-2 country code, joined by an underscore.  For example `es_MX`, meaning `Spanish (Mexico)`.  Provide this parameter if you want the results returned in a particular language (where available).  Note that if locale is not supplied, or if the specified language is not available, all strings will be returned in the Spotify default language (American English).
   * @param refresh True to return real-time information from the spotify web api and update the cache; otherwise, False to just return the cached value.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A ICategoryPage object.
  */
  public async GetBrowseCategorysList(
    player: MediaPlayer,
    country: string | undefined | null = null,
    locale: string | undefined | null = null,
    refresh: boolean | null = null,
    trimResults: boolean = true,
  ): Promise<ICategoryPage> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (country != null)
        serviceData['country'] = country;
      if (locale != null)
        serviceData['locale'] = locale;
      if (refresh != null)
        serviceData['refresh'] = refresh;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_browse_categorys_list',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as ICategoryPage;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.icons = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get a list of Spotify playlists tagged with a particular category.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param category_id Spotify category ID (not name) for the category. 
   * @param limit The maximum number of items to return in a page of items when manual paging is used.  Default is 20, Range is 1 to 50.  See the limit_total argument for automatic paging option.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param country An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param sort_result True to sort the items by name; otherwise, False to leave the items in the same order they were returned in by the Spotify Web API.  Default is true.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns An IPlaylistPageSimplified object.
  */
  public async GetCategoryPlaylists(
    player: MediaPlayer,
    category_id: string | undefined | null = null,
    limit: number | null = null,
    offset: number | null = null,
    country: string | undefined | null = null,
    limit_total: number | null = null,
    sort_result: boolean | null = null,
    trimResults: boolean = true,
  ): Promise<IPlaylistPageSimplified> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        category_id: category_id,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (country != null)
        serviceData['country'] = country;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;
      if (sort_result != null)
        serviceData['sort_result'] = sort_result;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_category_playlists',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IPlaylistPageSimplified;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.images = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information for a single audiobook chapter identified by its unique Spotify ID.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param chapter_id The Spotify ID of the chapter.  If null, the currently playing episode uri id value is used. Example `3V0yw9UDrYAfkhAvTrvt9Y`.
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A `IChapter` object that contains the chapter details.
  */
  public async GetChapter(
    player: MediaPlayer,
    chapter_id: string | undefined | null = null,
    market: string | undefined | null = null,
    trimResults: boolean = true,
  ): Promise<IChapter> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (chapter_id != null)
        serviceData['chapter_id'] = chapter_id;
      if (market != null)
        serviceData['market'] = market;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_chapter',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IChapter;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if (responseObj != null) {
          responseObj.available_markets = [];
          responseObj.description = 'see html_description';
          responseObj.images = [];
          if (responseObj.audiobook) {
            responseObj.audiobook.available_markets = []
            responseObj.audiobook.images = []
            responseObj.audiobook.description = 'see html_description';
          }
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information for a single episode identified by its unique Spotify ID.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param episode_id The Spotify ID of the episode.  If null, the currently playing episode uri id value is used. Example `1kWUud3vY5ij5r62zxpTRy`.
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A `IEpisode` object that contains the episode details.
  */
  public async GetEpisode(
    player: MediaPlayer,
    episode_id: string | undefined | null = null,
    market: string | undefined | null = null,
    trimResults: boolean = true,
  ): Promise<IEpisode> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (episode_id != null)
        serviceData['episode_id'] = episode_id;
      if (market != null)
        serviceData['market'] = market;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_episode',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IEpisode;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if (responseObj != null) {
          responseObj.description = 'see html_description';
          responseObj.images = [];
          if (responseObj.show) {
            responseObj.show.available_markets = []
            responseObj.show.images = []
            responseObj.show.description = 'see html_description';
          }
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get a list of the episodes saved in the current Spotify user's 'Your Library'.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param sort_result True to sort the items by name; otherwise, False to leave the items in the same order they were returned in by the Spotify Web API.  Default is true.
   * @param exclude_audiobooks True to exclude audiobook shows from the returned list, leaving only podcast shows; otherwise, False to include all results returned by the Spotify Web API. Default: True  
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns An IEpisodePageSaved object.
  */
  public async GetEpisodeFavorites(
    player: MediaPlayer,
    limit: number | null = null,
    offset: number | null = null,
    limit_total: number | null = null,
    sort_result: boolean | null = null,
    trimResults: boolean = true,
  ): Promise<IEpisodePageSaved> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;
      if (sort_result != null)
        serviceData['sort_result'] = sort_result;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_episode_favorites',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IEpisodePageSaved;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.episode.description = 'see html_description';
            item.episode.images = [];
            item.episode.show.available_markets = [];
            item.episode.show.description = 'see html_description';
            item.episode.show.images = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get the list of objects that make up the user's playback queue.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @returns A `PlayerQueueInfo` object.
  */
  public async GetPlayerQueueInfo(
    player: MediaPlayer,
    trimResults: boolean = true,
  ): Promise<IPlayerQueueInfo> {

    try {

      // spotify premium account required for this function.
      // not supported by elevated credentials.
      if (!player.isUserProductPremium()) {
        throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
      }

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_player_queue_info',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IPlayerQueueInfo;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.queue != null)) {
          if (responseObj.currently_playing != null) {
            if (responseObj.currently_playing_type == 'track') {
              const track = responseObj.currently_playing as ITrack;
              track.available_markets = [];
              if (track.album) {
                track.album.available_markets = []
                track.album.images = []
              }
            } else if (responseObj.currently_playing_type == 'episode') {
              const episode = responseObj.currently_playing as IEpisode;
              episode.description = "see html_description";
              if (episode.show) {
                episode.show.available_markets = []
                episode.show.description = "see html_description";
                episode.show.images = []
              }
            }
          }
          responseObj.queue.forEach((item: ITrack | IEpisode) => {
            if (item.type == 'track') {
              const track = item as ITrack;
              track.available_markets = [];
              if (track.album) {
                track.album.available_markets = []
                track.album.images = []
              }
            } else if (item.type == 'episode') {
              const episode = item as IEpisode;
              episode.description = "see html_description";
              if (episode.show) {
                episode.show.available_markets = []
                episode.show.description = "see html_description";
                episode.show.images = []
              }
            }
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get tracks from the current user's recently played tracks.
   * Note: Currently doesn't support podcast episodes.
   * 
   * The `after` and `before` arguments are based upon local time (not UTC time).  Recently
   * played item history uses a local timestamp, and NOT a UTC timestamp.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param after Returns all items after (but not including) this cursor position, which is a Unix timestamp in milliseconds.  If `after` is specified, `before` must not be specified.  Use with limit to get the next set of items.  Default: `0` (the first item).  
   * @param before Returns all items before (but not including) this cursor position, which is a Unix timestamp in milliseconds.  If `before` is specified, `after` must not be specified.  Use with limit to get the next set of items.  Default: `0` (the first item).  
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A PlayHistoryPage object.
  */
  public async GetPlayerRecentTracks(
    player: MediaPlayer,
    limit: number | null = null,
    after: number | null = null,
    before: number | null = null,
    limit_total: number | null = null,
    trimResults: boolean = true,
  ): Promise<IPlayHistoryPage> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (after != null)
        serviceData['after'] = after;
      if (before != null)
        serviceData['before'] = before;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_player_recent_tracks',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IPlayHistoryPage;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.track.available_markets = [];
            item.track.album.images = [];
            item.track.album.available_markets = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get a list of the playlists owned or followed by the current Spotify user.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param sort_result True to sort the items by name; otherwise, False to leave the items in the same order they were returned in by the Spotify Web API.  Default is true.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A PlaylistPageSimplified object.
  */
  public async GetPlaylistFavorites(
    player: MediaPlayer,
    limit: number | null = null,
    offset: number | null = null,
    limit_total: number | null = null,
    sort_result: boolean | null = null,
    trimResults: boolean = true,
  ): Promise<IPlaylistPageSimplified> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;
      if (sort_result != null)
        serviceData['sort_result'] = sort_result;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_playlist_favorites',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IPlaylistPageSimplified;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.images = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get a list of the playlists owned or followed by the current Spotify user.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param playlist_id The Spotify ID of the playlist (e.g. 5v5ETK9WFXAnGQ3MRubKuE).  If null, the currently playing playlist uri id value is used.
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param fields Filters for the query; a comma-separated list of the fields to return. If omitted, all fields are returned. For example, specify 'items(track(name,uri))' to get just the playlist's track names and URIs.
   * @param additional_types A comma-separated list of item types that your client supports besides the default track type.  Valid types are 'track' and 'episode'.
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param sort_result True to sort the items by name; otherwise, False to leave the items in the same order they were returned in by the Spotify Web API.  Default is true.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A PlaylistPageSimplified object.
  */
  public async GetPlaylistItems(
    player: MediaPlayer,
    playlist_id: string | undefined | null = null,
    limit: number | null = null,
    offset: number | null = null,
    market: string | undefined | null = null,
    fields: string | undefined | null = null,
    additional_types: string | undefined | null = null,
    limit_total: number | null = null,
    trimResults: boolean = true,
  ): Promise<IPlaylistPage> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (playlist_id != null)
        serviceData['playlist_id'] = playlist_id;
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (fields != null)
        serviceData['fields'] = fields;
      if (additional_types != null)
        serviceData['additional_types'] = additional_types;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_playlist_items',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IPlaylistPage;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(playlistTrack => {
            if (playlistTrack.track) {
              if (playlistTrack.track.available_markets) {
                playlistTrack.track.available_markets = [];
              }
              if (playlistTrack.track.album) {
                playlistTrack.track.album.images = []
                if (playlistTrack.track.album.available_markets) {
                  playlistTrack.track.album.available_markets = [];
                }
              }
            }
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get information about a single Spotify Connect player device.
   * 
   * @param device_value The id (e.g. '30fbc80e35598f3c242f2120413c943dfd9715fe') or name (e.g. 'Office') of the Spotify Connect Player device this command is targeting.  If an '*' is specified, then the SpotifyPlus default device is used.
   * @param verify_user_context If True, the active user context of the resolved device is checked to ensure it matches the Spotify Connect user context specified in the SpotifyPlus configuration options.  If False, the user context will not be checked.  Default is True.
   * @param verify_timeout Maximum time to wait (in seconds) for the device to become active in the Spotify Connect device list.  This value is only used if a Connect command has to be issued to activate the device. Default is 5; value range is 0 - 10.
   * @param refresh_device_list True to refresh the Spotify Connect device list; otherwise, False to use the Spotify Connect device list cache.  Default is True.
   * @param activate_device True to activate the device if necessary; otherwise, False.
   * @param delay Time delay (in seconds) to wait AFTER issuing any command to the device.  This delay will give the spotify zeroconf api time to process the change before another command is issued.  Default is 0.25; value range is 0 - 10.
   * @returns An ISpotifyConnectDevice object.
  */
  public async GetSpotifyConnectDevice(
    player: MediaPlayer,
    device_value: string,
    verify_user_context: boolean | null = null,
    verify_timeout: number | null = null,
    refresh_device_list: boolean | null = null,
    activate_device: boolean | null = null,
    delay: number | null = null,
  ): Promise<ISpotifyConnectDevice> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        device_value: device_value,
      };

      // update service data parameters (with optional parameters).
      if (verify_user_context != null)
        serviceData['verify_user_context'] = verify_user_context;
      if (verify_timeout != null)
        serviceData['verify_timeout'] = verify_timeout;
      if (refresh_device_list != null)
        serviceData['refresh_device_list'] = refresh_device_list;
      if (activate_device != null)
        serviceData['activate_device'] = activate_device;
      if (delay != null)
        serviceData['delay'] = delay;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_spotify_connect_device',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as ISpotifyConnectDevice;

      // set image_url property based on device type.
      if (responseObj != null) {
        // set image_url path using mdi icons for common sources.
        const sourceCompare = (responseObj.Name || "").toLocaleLowerCase();
        const groupStatusCompare = (responseObj.DeviceInfo.GroupStatus || "").toLocaleLowerCase();
        if (groupStatusCompare == "group") {
          responseObj.image_url = getMdiIconImageUrl(mdiSpeakerMultiple);
        } else if (sourceCompare.includes('web player (chrome)')) {
          responseObj.image_url = getMdiIconImageUrl(mdiGoogleChrome);
        } else if (sourceCompare.includes('web player (microsoft edge)')) {
          responseObj.image_url = getMdiIconImageUrl(mdiMicrosoftEdge);
        } else if (sourceCompare.includes('web player')) {
          responseObj.image_url = getMdiIconImageUrl(mdiWeb);
        } else if (responseObj.IsChromeCast == true) {
          responseObj.image_url = getMdiIconImageUrl(mdiCastAudio);
        } else {
          responseObj.image_url = getMdiIconImageUrl(mdiSpeaker);
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get information about all available Spotify Connect player devices.
   * 
   * @param refresh True to return real-time information from the spotify zeroconf api and update the cache; otherwise, False to just return the cached value.
   * @param sort_result True to sort the items by name; otherwise, False to leave the items in the same order they were returned in by the Spotify Zeroconf API.  Default is true.
   * @param source_list_hide List of device names to hide from the source list (colon delimited).
   * @returns A SpotifyConnectDevices object.
  */
  public async GetSpotifyConnectDevices(
    player: MediaPlayer,
    refresh: boolean | null = null,
    sort_result: boolean | null = null,
    source_list_hide: Array<string> | null = null,
  ): Promise<ISpotifyConnectDevices> {

    try {

      if (debuglog.enabled) {
        debuglog("%cGetSpotifyConnectDevices - retrieving device list from %s",
          "color: orange;",
          (refresh) ? "real-time query" : "internal device cache",
        );
      }

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (refresh != null)
        serviceData['refresh'] = refresh;
      if (sort_result != null)
        serviceData['sort_result'] = sort_result;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_spotify_connect_devices',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as ISpotifyConnectDevices;

      // process all items returned.
      if ((responseObj != null) && (responseObj.Items != null)) {

        // remove source items that are hidden (based on SpotifyPlus config options);
        // we have to do this in reverse order, due to iteration of the array.
        for (let i = responseObj.Items.length - 1; i >= 0; i--) {

          // sometimes device names have unprintable characters in them (CRLF, etc).
          let deviceNameNoSpecialChars = responseObj.Items[i].Name.toLowerCase();
          deviceNameNoSpecialChars = deviceNameNoSpecialChars.replaceAll("\n", "");
          deviceNameNoSpecialChars = deviceNameNoSpecialChars.replaceAll("\r", "");

          if (source_list_hide?.includes(deviceNameNoSpecialChars)) {
            responseObj.Items.splice(i, 1);
          } else if (source_list_hide?.includes(responseObj.Items[i].Id.toLowerCase())) {
            responseObj.Items.splice(i, 1);
          }
        }

        // set image_url property based on device type.
        responseObj.Items.forEach(item => {
          // set image_url path using mdi icons for common sources.
          const sourceCompare = (item.Name || "").toLocaleLowerCase();
          const groupStatusCompare = (item.DeviceInfo.GroupStatus || "").toLocaleLowerCase();
          if (groupStatusCompare == "group") {
            item.image_url = getMdiIconImageUrl(mdiSpeakerMultiple);
          } else if (sourceCompare.includes('web player (chrome)')) {
            item.image_url = getMdiIconImageUrl(mdiGoogleChrome);
          } else if (sourceCompare.includes('web player (microsoft edge)')) {
            item.image_url = getMdiIconImageUrl(mdiMicrosoftEdge);
          } else if (sourceCompare.includes('web player')) {
            item.image_url = getMdiIconImageUrl(mdiWeb);
          } else if (item.IsChromeCast == true) {
            item.image_url = getMdiIconImageUrl(mdiCastAudio);
          } else {
            item.image_url = getMdiIconImageUrl(mdiSpeaker);
          }
        })
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about a show's episodes.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param show_id The Spotify ID for the show (e.g. `6kAsbP8pxwaU2kPibKTuHE`). If null, the currently playing show uri id value is used.  
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A IEpisodePageSimplified object.
  */
  public async GetShowEpisodes(
    player: MediaPlayer,
    show_id: string | null = null,
    limit: number | null = null,
    offset: number | null = null,
    market: string | null = null,
    limit_total: number | null = null,
    trimResults: boolean = true,
  ): Promise<IEpisodePageSimplified> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (show_id != null)
        serviceData['show_id'] = show_id;
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_show_episodes',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IEpisodePageSimplified;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.description = 'see html_description';
            item.images = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get a list of the shows owned or followed by the current Spotify user.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param sort_result True to sort the items by name; otherwise, False to leave the items in the same order they were returned in by the Spotify Web API.  Default is true.
   * @param exclude_audiobooks True to exclude audiobook shows from the returned list, leaving only podcast shows; otherwise, False to include all results returned by the Spotify Web API. Default: True  
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A IShowPageSaved object.
  */
  public async GetShowFavorites(
    player: MediaPlayer,
    limit: number | null = null,
    offset: number | null = null,
    limit_total: number | null = null,
    sort_result: boolean | null = null,
    exclude_audiobooks: boolean | null = true,
    trimResults: boolean = true,
  ): Promise<IShowPageSaved> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;
      if (sort_result != null)
        serviceData['sort_result'] = sort_result;
      if (exclude_audiobooks != null)
        serviceData['exclude_audiobooks'] = exclude_audiobooks;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_show_favorites',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IShowPageSaved;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.show.available_markets = [];
            item.show.description = 'see html_description';
            item.show.images = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information for a single track identified by its unique Spotify ID.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param track_id The Spotify ID of the track.  If null, the currently playing track uri id value is used. Example `1kWUud3vY5ij5r62zxpTRy`.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A `ITrack` object that contains the track details.
  */
  public async GetTrack(
    player: MediaPlayer,
    track_id: string | undefined | null = null,
    trimResults: boolean = true,
  ): Promise<ITrack> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (track_id != null)
        serviceData['track_id'] = track_id;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_track',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as ITrack;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if (responseObj != null) {
          responseObj.available_markets = [];
          responseObj.album.available_markets = []
          responseObj.album.images = []
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get a list of the tracks saved in the current Spotify user's 'Your Library'.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.  See the `limit_total` argument for automatic paging option.  
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param sort_result True to sort the items by name; otherwise, False to leave the items in the same order they were returned in by the Spotify Web API.  Default is true.
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A TrackPageSaved object.
  */
  public async GetTrackFavorites(
    player: MediaPlayer,
    limit: number | null = null,
    offset: number | null = null,
    market: string | undefined | null = null,
    limit_total: number | null = null,
    sort_result: boolean | null = null,
    trimResults: boolean = true,
  ): Promise<ITrackPageSaved> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;
      if (sort_result != null)
        serviceData['sort_result'] = sort_result;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_track_favorites',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as ITrackPageSaved;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          responseObj.items.forEach(item => {
            item.track.available_markets = [];
            item.track.album.available_markets = [];
            item.track.album.images = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get track recommendations for specified criteria.
   * 
   * Use the `GetTrackAudioFeatures` method to get an idea of what to specify for some of the
   * minX / maxX / and targetX recommendations values.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param recommendations 
   * @param limit 
   * @param market 
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A `ITrackRecommendations` object that contains the track details.
  */
  public async GetTrackRecommendations(
    player: MediaPlayer,
    recommendations: ITrackRecommendationsProperties | undefined | null = null,
    limit: number | undefined | null = null,
    market: string | undefined | null = null,
    trimResults: boolean = true,
  ): Promise<ITrackRecommendations> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (market != null)
        serviceData['market'] = market;

      if (recommendations) {

        if (recommendations.seed_artists)
          serviceData['seed_artists'] = recommendations.seed_artists;
        if (recommendations.seed_genres)
          serviceData['seed_genres'] = recommendations.seed_genres;
        if (recommendations.seed_tracks)
          serviceData['seed_tracks'] = recommendations.seed_tracks;

        if (recommendations.max_acousticness)
          serviceData['max_acousticness'] = recommendations.max_acousticness;
        if (recommendations.min_acousticness)
          serviceData['min_acousticness'] = recommendations.min_acousticness;
        if (recommendations.target_acousticness)
          serviceData['target_acousticness'] = recommendations.target_acousticness;

        if (recommendations.max_danceability)
          serviceData['max_danceability'] = recommendations.max_danceability;
        if (recommendations.min_danceability)
          serviceData['min_danceability'] = recommendations.min_danceability;
        if (recommendations.target_danceability)
          serviceData['target_danceability'] = recommendations.target_danceability;

        if (recommendations.max_duration_ms)
          serviceData['max_duration_ms'] = recommendations.max_duration_ms;
        if (recommendations.min_duration_ms)
          serviceData['min_duration_ms'] = recommendations.min_duration_ms;
        if (recommendations.target_duration_ms)
          serviceData['target_duration_ms'] = recommendations.target_duration_ms;

        if (recommendations.max_energy)
          serviceData['max_energy'] = recommendations.max_energy;
        if (recommendations.min_energy)
          serviceData['min_energy'] = recommendations.min_energy;
        if (recommendations.target_energy)
          serviceData['target_energy'] = recommendations.target_energy;

        if (recommendations.max_instrumentalness)
          serviceData['max_instrumentalness'] = recommendations.max_instrumentalness;
        if (recommendations.min_instrumentalness)
          serviceData['min_instrumentalness'] = recommendations.min_instrumentalness;
        if (recommendations.target_instrumentalness)
          serviceData['target_instrumentalness'] = recommendations.target_instrumentalness;

        if (recommendations.max_key)
          serviceData['max_key'] = recommendations.max_key;
        if (recommendations.min_key)
          serviceData['min_key'] = recommendations.min_key;
        if (recommendations.target_key)
          serviceData['target_key'] = recommendations.target_key;

        if (recommendations.max_liveness)
          serviceData['max_liveness'] = recommendations.max_liveness;
        if (recommendations.min_liveness)
          serviceData['min_liveness'] = recommendations.min_liveness;
        if (recommendations.target_liveness)
          serviceData['target_liveness'] = recommendations.target_liveness;

        if (recommendations.max_loudness)
          serviceData['max_loudness'] = recommendations.max_loudness;
        if (recommendations.min_loudness)
          serviceData['min_loudness'] = recommendations.min_loudness;
        if (recommendations.target_loudness)
          serviceData['target_loudness'] = recommendations.target_loudness;

        if (recommendations.max_mode)
          serviceData['max_mode'] = recommendations.max_mode;
        if (recommendations.min_mode)
          serviceData['min_mode'] = recommendations.min_mode;
        if (recommendations.target_mode)
          serviceData['target_mode'] = recommendations.target_mode;

        if (recommendations.max_popularity)
          serviceData['max_popularity'] = recommendations.max_popularity;
        if (recommendations.min_popularity)
          serviceData['min_popularity'] = recommendations.min_popularity;
        if (recommendations.target_popularity)
          serviceData['target_popularity'] = recommendations.target_popularity;

        if (recommendations.max_speechiness)
          serviceData['max_speechiness'] = recommendations.max_speechiness;
        if (recommendations.min_speechiness)
          serviceData['min_speechiness'] = recommendations.min_speechiness;
        if (recommendations.target_speechiness)
          serviceData['target_speechiness'] = recommendations.target_speechiness;

        if (recommendations.max_tempo)
          serviceData['max_tempo'] = recommendations.max_tempo;
        if (recommendations.min_tempo)
          serviceData['min_tempo'] = recommendations.min_tempo;
        if (recommendations.target_tempo)
          serviceData['target_tempo'] = recommendations.target_tempo;

        if (recommendations.max_time_signature)
          serviceData['max_time_signature'] = recommendations.max_time_signature;
        if (recommendations.min_time_signature)
          serviceData['min_time_signature'] = recommendations.min_time_signature;
        if (recommendations.target_time_signature)
          serviceData['target_time_signature'] = recommendations.target_time_signature;

        if (recommendations.max_valence)
          serviceData['max_valence'] = recommendations.max_valence;
        if (recommendations.min_valence)
          serviceData['min_valence'] = recommendations.min_valence;
        if (recommendations.target_valence)
          serviceData['target_valence'] = recommendations.target_valence;

      }

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'get_track_recommendations',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as ITrackRecommendations;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if (responseObj != null) {
          responseObj.tracks.forEach(track => {
            track.available_markets = [];
            track.album.available_markets = [];
            track.album.images = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Start playing one or more tracks of the specified context on a Spotify Connect device.
   * 
   * @param player 
   *    MediaPlayer instance that will process the request.
   * @param context_uri 
   *    Spotify URI of the context to play.  
   *    Valid contexts are albums, artists & playlists.  
   *    Example: `spotify:album:6vc9OTcyd3hyzabCmsdnwE`. 
   * @param offset_uri 
   *    Indicates from what Uri in the context playback should start.  
   *    Only available when context_uri corresponds to an artist, album or playlist.  
   *    The offset_position argument will be used if this value is null.  
   *    For Sonos devices, this argument is ignored.  
   *    Default is null.  
   *    Example: `spotify:track:1301WleyT98MSxVHPZCA6M` start playing at the specified track Uri.  
   * @param offset_position
   *    Indicates from what position in the context playback should start.  
   *    The value is zero-based, and must be a positive number, or -1 to disable positioning.  
   *    Only available when context_uri corresponds to an album or playlist.  
   *    Default is `0`.  
   *    Example: `3`  start playing at track number 4.
   * @param position_ms
   *    The position in milliseconds to seek to; must be a positive number, or -1 to disable positioning.  
   *    Passing in a position that is greater than the length of the track will cause the 
   *    player to start playing the next track.  
   *    Default is `0`.  
   *    Example: `25000`  
   * @param device_id
   *    The name or id of the device this command is targeting.  
   *    If not supplied, the user's currently active device is the target.  
   *    Example: `0d1841b0976bae2a3a310dd74c0f3df354899bc8`
   * @param delay
   *    Time delay (in seconds) to wait AFTER issuing the command to the player.  
   *    This delay will give the spotify web api time to process the change before 
   *    another command is issued.  
   *    Default is 0.50; value range is 0 - 10.
   * @param shuffle
   *    True to enable player shuffle mode;  
   *    False to disable player shuffle mode; 
   *    None to use current player shuffle mode. 
   *    Default is None.
  */
  public async PlayerMediaPlayContext(
    player: MediaPlayer,
    context_uri: string,
    offset_uri: string | undefined | null = null,
    offset_position: number | null = null,
    position_ms: number | null = null,
    device_id: string | undefined | null = null,
    delay: number | null = null,
    shuffle: boolean | null = null,
  ): Promise<void> {

    try {

      // spotify premium account (or elevated credentials) required for this function.
      if (!player.isUserProductPremium() && (!player.attributes.sp_user_has_web_player_credentials)) {
        throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
      }

      // validations.
      if (!context_uri)
        throw new Error("STPC0005 context_uri argument was not supplied to the PlayerMediaPlayContext service.")

      // resolve a device_id value, if one was not specified.
      device_id = this.getDeviceId(player, device_id);

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        context_uri: context_uri
      };

      // update service data parameters (with optional parameters).
      if (offset_uri != null)
        serviceData['offset_uri'] = offset_uri;
      if (offset_position != null)
        serviceData['offset_position'] = offset_position;
      if (position_ms != null)
        serviceData['position_ms'] = position_ms;
      if (device_id != null)
        serviceData['device_id'] = device_id;
      if (delay != null)
        serviceData['delay'] = delay;
      if (shuffle != null)
        serviceData['shuffle'] = shuffle;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'player_media_play_context',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Get a list of the tracks saved in the current Spotify user's 'Your Library'
   * and starts playing them.
   * 
   * @param player 
   *    MediaPlayer instance that will process the request.
   * @param device_id
   *    The name or id of the device this command is targeting.  
   *    If not supplied, the user's currently active device is the target.  
   *    Example: `Office`, `0d1841b0976bae2a3a310dd74c0f3df354899bc8`
   * @param shuffle
   *    True to set player shuffle mode to on; otherwise, False for no shuffle.
   * @param delay
   *    Time delay (in seconds) to wait AFTER issuing the command to the player.  
   *    This delay will give the spotify web api time to process the change before 
   *    another command is issued.  
   *    Default is 0.50; value range is 0 - 10.
   * @param resolve_device_id
   *    True to resolve the supplied `deviceId` value; otherwise, False not resolve the `deviceId`
   *    value as it has already been resolved.  
   *    Default is True.  
   * @param limit_total
   *    The maximum number of items to retrieve from favorites.  
   *    Default: 200.
  */
  public async PlayerMediaPlayTrackFavorites(
    player: MediaPlayer,
    device_id: string | undefined | null = null,
    shuffle: boolean | undefined | null = null,
    delay: number | null = null,
    resolve_device_id: boolean | undefined | null = null,
    limit_total: number | null = null,
  ): Promise<void> {

    try {

      // spotify premium account (or elevated credentials) required for this function.
      if (!player.isUserProductPremium() && (!player.attributes.sp_user_has_web_player_credentials)) {
        throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
      }

      // resolve a device_id value, if one was not specified.
      device_id = this.getDeviceId(player, device_id);

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (device_id != null)
        serviceData['device_id'] = device_id;
      if (shuffle != null)
        serviceData['shuffle'] = shuffle;
      if (delay != null)
        serviceData['delay'] = delay;
      if (resolve_device_id != null)
        serviceData['resolve_device_id'] = resolve_device_id;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'player_media_play_track_favorites',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Start playing one or more tracks of the specified context on a Spotify Connect device.
   * 
   * @param player 
   *    MediaPlayer instance that will process the request.
   * @param uris 
   *    A comma-delimited string of Spotify URIs to play; can be track or episode URIs.  
   *    Example: `spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:episode:512ojhOuo1ktJprKbVcKyQ`.  
   *    A maximum of 50 items can be added in one request.
   * @param position_ms
   *    The position in milliseconds to seek to; must be a positive number, or -1 to disable positioning.  
   *    Passing in a position that is greater than the length of the track will cause the 
   *    player to start playing the next track.  
   *    Default is `0`.  
   *    Example: `25000`  
   * @param device_id
   *    The name or id of the device this command is targeting.  
   *    If not supplied, the user's currently active device is the target.  
   *    Example: `Office`, `0d1841b0976bae2a3a310dd74c0f3df354899bc8`
   * @param delay
   *    Time delay (in seconds) to wait AFTER issuing the command to the player.  
   *    This delay will give the spotify web api time to process the change before 
   *    another command is issued.  
   *    Default is 0.50; value range is 0 - 10.
   * @param shuffle
   *    True to enable player shuffle mode;  
   *    False to disable player shuffle mode; 
   *    None to use current player shuffle mode. 
   *    Default is None.
  */
  public async PlayerMediaPlayTracks(
    player: MediaPlayer,
    uris: string,
    position_ms: number | null = null,
    device_id: string | undefined | null = null,
    delay: number | null = null,
    shuffle: boolean | null = null,
  ): Promise<void> {

    try {

      // spotify premium account (or elevated credentials) required for this function.
      if (!player.isUserProductPremium() && (!player.attributes.sp_user_has_web_player_credentials)) {
        throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
      }

      // validations.
      if (!uris)
        throw new Error("STPC0005 uris argument was not supplied to the PlayerMediaPlayTracks service.")
      if (position_ms == null)
        position_ms = 0;

      // resolve a device_id value, if one was not specified.
      device_id = this.getDeviceId(player, device_id);

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        uris: uris
      };

      // update service data parameters (with optional parameters).
      if (position_ms != null)
        serviceData['position_ms'] = position_ms;
      if (device_id != null)
        serviceData['device_id'] = device_id;
      if (delay != null)
        serviceData['delay'] = delay;
      if (shuffle != null)
        serviceData['shuffle'] = shuffle;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'player_media_play_tracks',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Set shuffle mode for the specified Spotify Connect device.
   * 
   * @param player 
   *    MediaPlayer instance that will process the request.
   * @param device_id
   *    The name or id of the device this command is targeting.  
   *    If not supplied, the user's currently active device is the target.  
   *    Example: `Office`, `0d1841b0976bae2a3a310dd74c0f3df354899bc8`
   * @param shuffle
   *    True to set player shuffle mode to on; otherwise, False for no shuffle.
   * @param delay
   *    Time delay (in seconds) to wait AFTER issuing the command to the player.  
   *    This delay will give the spotify web api time to process the change before 
   *    another command is issued.  
   *    Default is 0.50; value range is 0 - 10.
  */
  public async PlayerSetShuffleMode(
    player: MediaPlayer,
    device_id: string | undefined | null = null,
    shuffle: boolean | undefined | null = null,
    delay: number | null = null,
  ): Promise<void> {

    try {

      // spotify premium account (or elevated credentials) required for this function.
      if (!player.isUserProductPremium() && (!player.attributes.sp_user_has_web_player_credentials)) {
        throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
      }

      // resolve a device_id value, if one was not specified.
      device_id = this.getDeviceId(player, device_id);

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (shuffle != null)
        serviceData['state'] = shuffle;
      if (device_id != null)
        serviceData['device_id'] = device_id;
      if (delay != null)
        serviceData['delay'] = delay;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'player_set_shuffle_mode',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Start playing one or more tracks of the specified context on a Spotify Connect device.
   * 
   * @param player 
   *    MediaPlayer instance that will process the request.
   * @param device_id 
   *    The target player device identifier.
   *    This could be an id, name, a default device indicator (e.g. "*"), a 
   *    SpotifyConnectDevice object, or null to utilize the active player device.
   *    A device is considered resolved if a SpotifyConnectDevice object is passed
   *    for this argument.  An exception will be raised if the argument value could 
   *    not be resolved or activated.
   *    Examples are `0d1841b0976bae2a3a310dd74c0f3df354899bc8`, `Office`, `*`, None.  
   * @param play
   *    The transfer method:  
   *    - `True`  - ensure playback happens on new device.   
   *    - `False` - keep the current playback state.  
   *    Default: `True`  
   * @param delay
   *    Time delay (in seconds) to wait AFTER issuing the command to the player.  
   *    This delay will give the spotify web api time to process the change before 
   *    another command is issued.  
   *    Default is 0.50; value range is 0 - 10.
   * @param refresh_device_list
   *    True to refresh the Spotify Connect device list; otherwise, False to use the 
   *    Spotify Connect device list cache.  
   *    Default is True.  
   * @param force_activate_device
   *    True to issue a Spotify Connect Disconnect call prior to transfer, which will
   *    force the device to reconnect to Spotify Connect; otherwise, False to not
   *    disconnect.
   *    Default is True.  
   * @param device_id_from
   *    The player device identifier where play is being transferred from.
   *    This could be an id, name, a default device indicator (e.g. "*"), a 
   *    SpotifyConnectDevice object, or null.
   *    A device is considered resolved if a SpotifyConnectDevice object is passed
   *    for this argument.  
   *    Examples are `0d1841b0976bae2a3a310dd74c0f3df354899bc8`, `Office`, `*`, None.  
  */
  public async PlayerTransferPlayback(
    player: MediaPlayer,
    device_id: string | undefined | null = null,
    play: boolean | null = true,
    delay: number | null = null,
    refresh_device_list: boolean | null = true,
    force_activate_device: boolean | null = true,
    device_id_from: string | undefined | null = null,
  ): Promise<void> {

    try {

      // spotify premium account (or elevated credentials) required for this function.
      if (!player.isUserProductPremium() && (!player.attributes.sp_user_has_web_player_credentials)) {
        throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
      }

      // validations.
      if (play == null)
        play = true;

      // resolve a device_id value, if one was not specified.
      device_id = this.getDeviceId(player, device_id);

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (device_id != null)
        serviceData['device_id'] = device_id;
      if (play != null)
        serviceData['play'] = play;
      if (delay != null)
        serviceData['delay'] = delay;
      if (refresh_device_list != null)
        serviceData['refresh_device_list'] = refresh_device_list;
      if (force_activate_device != null)
        serviceData['force_activate_device'] = force_activate_device;
      if (device_id_from != null)
        serviceData['device_id_from'] = device_id_from;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'player_transfer_playback',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Remove one or more albums from the current user's 'Your Library'.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the albums.  If null, the currently playing track album uri id value is used.
  */
  public async RemoveAlbumFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'remove_album_favorites',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Remove one or more audiobooks from the current user's 'Your Library'.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the audiobooks.  If null, the currently playing audiobook uri id value is used.
  */
  public async RemoveAudiobookFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'remove_audiobook_favorites',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Remove one or more episodes from the current user's 'Your Library'.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the episodes.  If null, the currently playing episode uri id value is used.
  */
  public async RemoveEpisodeFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'remove_episode_favorites',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Remove one or more shows from the current user's 'Your Library'.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the shows.  If null, the currently playing show uri id value is used.
  */
  public async RemoveShowFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'remove_show_favorites',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Remove one or more tracks from the current user's 'Your Library'.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the tracks.  If null, the currently playing track uri id value is used.
  */
  public async RemoveTrackFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'remove_track_favorites',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Save one or more albums to the current user's 'Your Library'.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the albums.  If null, the currently playing track album uri id value is used.
  */
  public async SaveAlbumFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'save_album_favorites',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Save one or more audiobooks to the current user's 'Your Library'.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the audiobooks.  If null, the currently playing audiobook uri id value is used.
  */
  public async SaveAudiobookFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'save_audiobook_favorites',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Save one or more episodes to the current user's 'Your Library'.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the episodes.  If null, the currently playing episode uri id value is used.
  */
  public async SaveEpisodeFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'save_episode_favorites',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Save one or more shows to the current user's 'Your Library'.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the shows.  If null, the currently playing show uri id value is used.
  */
  public async SaveShowFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'save_show_favorites',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Save one or more tracks to the current user's 'Your Library'.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the tracks.  If null, the currently playing track uri id value is used.
  */
  public async SaveTrackFavorites(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'save_track_favorites',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about matching context criteria.
   * 
   * @param context Contexts to search for.
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param criteria Your search query. 
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param include_external If "audio" is specified it signals that the client can play externally hosted audio content, and marks the content as playable in the response. By default externally hosted audio content is marked as unplayable in the response.  Allowed values: "audio"
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @returns A AlbumPageSaved object.
  */
  public async Search(
    searchMediaType: SearchMediaTypes.ALBUMS | SearchMediaTypes.ARTISTS | SearchMediaTypes.AUDIOBOOKS | SearchMediaTypes.EPISODES |
      SearchMediaTypes.PLAYLISTS | SearchMediaTypes.SHOWS | SearchMediaTypes.TRACKS | string,
    player: MediaPlayer,
    criteria: string,
    limit: number | null = null,
    offset: number | null = null,
    market: string | undefined | null = null,
    include_external: string | undefined | null = null,
    limit_total: number | null = null,
  ): Promise<IAlbumPageSimplified | IArtistPage | IAudiobookPageSimplified | IEpisodePageSimplified | IPlaylistPageSimplified | IShowPageSimplified | ITrackPage> {

    try {

      // execute based on search media type.
      if (searchMediaType == SearchMediaTypes.ALBUMS) {
        return await this.SearchAlbums(player, criteria, limit, offset, market, include_external, limit_total)
      } else if (searchMediaType == SearchMediaTypes.ARTISTS) {
        return await this.SearchArtists(player, criteria, limit, offset, market, include_external, limit_total)
      } else if (searchMediaType == SearchMediaTypes.AUDIOBOOKS) {
        return await this.SearchAudiobooks(player, criteria, limit, offset, market, include_external, limit_total)
      } else if (searchMediaType == SearchMediaTypes.EPISODES) {
        return await this.SearchEpisodes(player, criteria, limit, offset, market, include_external, limit_total)
      } else if (searchMediaType == SearchMediaTypes.PLAYLISTS) {
        return await this.SearchPlaylists(player, criteria, limit, offset, market, include_external, limit_total)
      } else if (searchMediaType == SearchMediaTypes.SHOWS) {
        return await this.SearchShows(player, criteria, limit, offset, market, include_external, limit_total)
      } else if (searchMediaType == SearchMediaTypes.TRACKS) {
        return await this.SearchTracks(player, criteria, limit, offset, market, include_external, limit_total)
      } else {
        throw new Error("searchMediaType was not recognized: \"" + searchMediaType + "\".");
      }

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about albums that match a keyword string.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param criteria Your search query. 
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param include_external If "audio" is specified it signals that the client can play externally hosted audio content, and marks the content as playable in the response. By default externally hosted audio content is marked as unplayable in the response.  Allowed values: "audio"
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns A AlbumPageSaved object.
  */
  public async SearchAlbums(
    player: MediaPlayer,
    criteria: string,
    limit: number | null = null,
    offset: number | null = null,
    market: string | undefined | null = null,
    include_external: string | undefined | null = null,
    limit_total: number | null = null,
    trimResults: boolean = true,
  ): Promise<IAlbumPageSimplified> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        criteria: criteria,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (include_external != null)
        serviceData['include_external'] = include_external;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'search_albums',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IAlbumPageSimplified;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          (responseObj.items as IAlbumSimplified[]).forEach(item => {
            item.images = [];
            item.available_markets = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about artists that match a keyword string.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param criteria Your search query. 
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param include_external If "audio" is specified it signals that the client can play externally hosted audio content, and marks the content as playable in the response. By default externally hosted audio content is marked as unplayable in the response.  Allowed values: "audio"
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns An IArtistPage object.
  */
  public async SearchArtists(
    player: MediaPlayer,
    criteria: string,
    limit: number | null = null,
    offset: number | null = null,
    market: string | undefined | null = null,
    include_external: string | undefined | null = null,
    limit_total: number | null = null,
    trimResults: boolean = true,
  ): Promise<IArtistPage> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        criteria: criteria,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (include_external != null)
        serviceData['include_external'] = include_external;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'search_artists',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IArtistPage;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          (responseObj.items as IArtist[]).forEach(item => {
            item.images = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about audiobooks that match a keyword string.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param criteria Your search query. 
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param include_external If "audio" is specified it signals that the client can play externally hosted audio content, and marks the content as playable in the response. By default externally hosted audio content is marked as unplayable in the response.  Allowed values: "audio"
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns An IAudiobookPageSimplified object.
  */
  public async SearchAudiobooks(
    player: MediaPlayer,
    criteria: string,
    limit: number | null = null,
    offset: number | null = null,
    market: string | undefined | null = null,
    include_external: string | undefined | null = null,
    limit_total: number | null = null,
    trimResults: boolean = true,
  ): Promise<IAudiobookPageSimplified> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        criteria: criteria,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (include_external != null)
        serviceData['include_external'] = include_external;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'search_audiobooks',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IAudiobookPageSimplified;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          (responseObj.items as IAudiobookSimplified[]).forEach(item => {
            item.images = [];
            item.available_markets = [];
            item.description = "see html_description";
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about episodes that match a keyword string.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param criteria Your search query. 
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param include_external If "audio" is specified it signals that the client can play externally hosted audio content, and marks the content as playable in the response. By default externally hosted audio content is marked as unplayable in the response.  Allowed values: "audio"
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns An IEpisodePageSimplified object.
  */
  public async SearchEpisodes(
    player: MediaPlayer,
    criteria: string,
    limit: number | null = null,
    offset: number | null = null,
    market: string | undefined | null = null,
    include_external: string | undefined | null = null,
    limit_total: number | null = null,
    trimResults: boolean = true,
  ): Promise<IEpisodePageSimplified> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        criteria: criteria,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (include_external != null)
        serviceData['include_external'] = include_external;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'search_episodes',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IEpisodePageSimplified;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          (responseObj.items as IEpisodeSimplified[]).forEach(item => {
            item.images = [];
            item.description = "see html_description";
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about playlists that match a keyword string.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param criteria Your search query. 
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param include_external If "audio" is specified it signals that the client can play externally hosted audio content, and marks the content as playable in the response. By default externally hosted audio content is marked as unplayable in the response.  Allowed values: "audio"
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns An IArtistPage object.
  */
  public async SearchPlaylists(
    player: MediaPlayer,
    criteria: string,
    limit: number | null = null,
    offset: number | null = null,
    market: string | undefined | null = null,
    include_external: string | undefined | null = null,
    limit_total: number | null = null,
    trimResults: boolean = true,
  ): Promise<IPlaylistPageSimplified> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        criteria: criteria,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (include_external != null)
        serviceData['include_external'] = include_external;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'search_playlists',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IPlaylistPageSimplified;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          (responseObj.items as IPlaylistSimplified[]).forEach(item => {
            item.images = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about shows that match a keyword string.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param criteria Your search query. 
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param include_external If "audio" is specified it signals that the client can play externally hosted audio content, and marks the content as playable in the response. By default externally hosted audio content is marked as unplayable in the response.  Allowed values: "audio"
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns An IShowPageSimplified object.
  */
  public async SearchShows(
    player: MediaPlayer,
    criteria: string,
    limit: number | null = null,
    offset: number | null = null,
    market: string | undefined | null = null,
    include_external: string | undefined | null = null,
    limit_total: number | null = null,
    trimResults: boolean = true,
  ): Promise<IShowPageSimplified> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        criteria: criteria,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (include_external != null)
        serviceData['include_external'] = include_external;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'search_shows',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as IShowPageSimplified;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          (responseObj.items as IShowSimplified[]).forEach(item => {
            item.images = [];
            item.available_markets = [];
            item.description = "see html_description";
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Get Spotify catalog information about tracks that match a keyword string.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param criteria Your search query. 
   * @param limit The maximum number of items to return in a page of items.  Default: 20, Range: 1 to 50.
   * @param offset The index of the first item to return.  Use with limit to get the next set of items.  Default: 0(the first item).
   * @param market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.  If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.  Example = 'ES'.
   * @param include_external If "audio" is specified it signals that the client can play externally hosted audio content, and marks the content as playable in the response. By default externally hosted audio content is marked as unplayable in the response.  Allowed values: "audio"
   * @param limit_total If specified, this argument overrides the limit and offset argument values and paging is automatically used to retrieve all available items up to the maximum count specified.  Default: None(disabled)
   * @param trimResults True to trim certain fields of the output results that are not required and to conserve memory; otherwise, False to return all fields that were returned in by the Spotify Web API.
   * @returns An IArtistPage object.
  */
  public async SearchTracks(
    player: MediaPlayer,
    criteria: string,
    limit: number | null = null,
    offset: number | null = null,
    market: string | undefined | null = null,
    include_external: string | undefined | null = null,
    limit_total: number | null = null,
    trimResults: boolean = true,
  ): Promise<ITrackPage> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        criteria: criteria,
      };

      // update service data parameters (with optional parameters).
      if (limit != null)
        serviceData['limit'] = limit;
      if (offset != null)
        serviceData['offset'] = offset;
      if (market != null)
        serviceData['market'] = market;
      if (include_external != null)
        serviceData['include_external'] = include_external;
      if (limit_total != null)
        serviceData['limit_total'] = limit_total;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'search_tracks',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);

      // get the "result" portion of the response, and convert it to a type.
      const responseObj = response["result"] as ITrackPage;

      // omit some data from the results, as it's not necessary and conserves memory.
      if (trimResults) {
        if ((responseObj != null) && (responseObj.items != null)) {
          (responseObj.items as ITrack[]).forEach(item => {
            if (item.album) {
              item.album.images = [];
              item.album.available_markets = [];
            }
            item.available_markets = [];
          })
        }
      }

      // trace.
      if (debuglog.enabled) {
        debuglog("%cCallServiceWithResponse - Service %s response (trimmed):\n%s",
          "color: orange",
          JSON.stringify(serviceRequest.service),
          JSON.stringify(responseObj, null, 2)
        );
      }

      // return results to caller.
      return responseObj;

    }
    finally {
    }
  }


  /**
   * Remove the current user as a follower of one or more artists.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param ids A comma-separated list (50 max) of the Spotify IDs for the artists.  If null, the currently playing track artist uri id value is used.
  */
  public async UnfollowArtists(
    player: MediaPlayer,
    ids: string | undefined | null = null,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (ids != null)
        serviceData['ids'] = ids;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'unfollow_artists',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Remove the current user as a follower of one or more playlists.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param playlist_id The Spotify ID of the playlist (e.g. `3cEYpjA9oz9GiPac4AsH4n`). If null, the currently playing playlist uri id value is used.
  */
  public async UnfollowPlaylist(
    player: MediaPlayer,
    playlist_id: string | undefined | null = null,
  ): Promise<void> {

    try {

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
      };

      // update service data parameters (with optional parameters).
      if (playlist_id != null)
        serviceData['playlist_id'] = playlist_id;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'unfollow_playlist',
        serviceData: serviceData
      };

      // call the service (no response).
      await this.CallService(serviceRequest);

    }
    finally {
    }
  }


  /**
   * Set level used for volume step services.
   * 
   * @param player MediaPlayer instance that will process the request.
   * @param level Volume level to set, expressed as a percentage (e.g. 1 - 100).
   */
  public async VolumeSetStepLevel(
    player: MediaPlayer,
    level: number
  ) {

    // convert volume level to HA float value.
    const level_pct = level / 100;

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_SPOTIFYPLUS,
      service: 'volume_set_step',
      serviceData: {
        entity_id: player.id,
        level: level_pct,
      }
    };

    // call the service.
    await this.CallService(serviceRequest);

  }


  /**
   * Calls the `addUser` Spotify Zeroconf API endpoint to issue a call to SpConnectionLoginBlob.  If successful,
   * the associated device id is added to the Spotify Connect active device list for the specified user account.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param device A ISpotifyConnectDevice object that contains Spotify Connect details for the device.
   * @param username (optional) Spotify Connect user name to login with (e.g. "yourspotifyusername").  If null, the SpotifyPlus integration options username value will be used.
   * @param password (optional) Spotify Connect user password to login with.  If null, the SpotifyPlus integration options password value will be used.
   * @param loginid (optional) Spotify Connect login id to login with (e.g. '31l77fd87g8h9j00k89f07jf87ge'). This is also known as the canonical user id value. This MUST be the value that relates to the `username` argument.
   * @param pre_disconnect (optional) True if a Disconnect should be made prior to the Connect call.  This will ensure that the active user is logged out, which must be done if switching user accounts; otherwise, False to not issue a Disconnect call.  Default is False.
   * @param verify_device_list_entry (optional) True to ensure that the device id is present in the Spotify Connect device list before issuing a call to Connect; Connect will not be called if the device id is already in the list; otherwise, False to always call Connect to add the device.  Default is False.
   * @param delay (optional) (optional) Time delay (in seconds) to wait AFTER issuing a command to the device. This delay will give the spotify zeroconf api time to process the change before another command is issued. Default is 0.50; value range is 0 - 10.
   * @returns Response data, in the form of a Record<string, any> (e.g. dictionary).
  */
  public async ZeroconfDeviceConnect(
    player: MediaPlayer,
    device: ISpotifyConnectDevice,
    username: string | undefined | null = null,
    password: string | undefined | null = null,
    loginid: string | undefined | null = null,
    pre_disconnect: boolean | undefined | null = true,
    verify_device_list_entry: boolean | undefined | null = true,
    delay: number | undefined | null = null,
  ): Promise<IZeroconfResponse> {

    try {

      if (debuglog.enabled) {
        debuglog("ZeroconfDeviceDisconnect - device item:\n%s",
          JSON.stringify(device, null, 2),
        );
      }

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        host_ipv4_address: device.DiscoveryResult.HostIpAddress,
        host_ip_port: device.DiscoveryResult.HostIpPort,
        cpath: device.DiscoveryResult.SpotifyConnectCPath,
        version: device.DiscoveryResult.SpotifyConnectVersion,
        use_ssl: (device.DiscoveryResult.ZeroconfApiEndpointAddUser.startsWith("https:")),
      };

      // update service data parameters (with optional parameters).
      if (username != null)
        serviceData['username'] = username;
      if (password != null)
        serviceData['password'] = password;
      if (loginid != null)
        serviceData['loginid'] = loginid;
      if (pre_disconnect != null)
        serviceData['pre_disconnect'] = pre_disconnect;
      if (verify_device_list_entry != null)
        serviceData['verify_device_list_entry'] = verify_device_list_entry;
      if (delay != null)
        serviceData['delay'] = delay;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'zeroconf_device_connect',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);
      return response["result"];

    }
    finally {
    }
  }


  /**
   * Calls the `resetUsers` Spotify Zeroconf API endpoint to issue a call to SpConnectionLogout.
   * The currently logged in user (if any) will be logged out of Spotify Connect, and the 
   * device id removed from the active Spotify Connect device list.      
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param device A ISpotifyConnectDevice object that contains Spotify Connect details for the device.
   * @param delay (optional) (optional) Time delay (in seconds) to wait AFTER issuing a command to the device. This delay will give the spotify zeroconf api time to process the change before another command is issued. Default is 0.50; value range is 0 - 10.
   * @returns Response data, in the form of a Record<string, any> (e.g. dictionary).
  */
  public async ZeroconfDeviceDisconnect(
    player: MediaPlayer,
    device: ISpotifyConnectDevice,
    delay: number | undefined | null = null,
  ): Promise<IZeroconfResponse> {

    try {

      if (debuglog.enabled) {
        debuglog("ZeroconfDeviceDisconnect - device item:\n%s",
          JSON.stringify(device, null, 2),
        );
      }

      // create service data (with required parameters).
      const serviceData: { [key: string]: any } = {
        entity_id: player.id,
        host_ipv4_address: device.DiscoveryResult.HostIpAddress,
        host_ip_port: device.DiscoveryResult.HostIpPort,
        cpath: device.DiscoveryResult.SpotifyConnectCPath,
        version: device.DiscoveryResult.SpotifyConnectVersion,
        use_ssl: (device.DiscoveryResult.ZeroconfApiEndpointAddUser.startsWith("https:")),
      };

      // update service data parameters (with optional parameters).
      if (delay != null)
        serviceData['delay'] = delay;

      // create service request.
      const serviceRequest: ServiceCallRequest = {
        domain: DOMAIN_SPOTIFYPLUS,
        service: 'zeroconf_device_disconnect',
        serviceData: serviceData
      };

      // call the service, and return the response.
      const response = await this.CallServiceWithResponse(serviceRequest);
      return response["result"];

    }
    finally {
    }
  }


  /** ======================================================================================
   * The following are base MediaPlayerEntity methods.
   * ====================================================================================== 
  */

  /**
   * Selects the given source device.
   * 
   * @param player MediaPlayer instance that will process the request.
   * @param source Source to select.
  */
  public async select_source(
    player: MediaPlayer,
    source: string | undefined | null = null,
  ): Promise<void> {

    // spotify premium account (or elevated credentials) required for this function.
    if (!player.isUserProductPremium() && (!player.attributes.sp_user_has_web_player_credentials)) {
      throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
    }

    // create service data (with required parameters).
    const serviceData: { [key: string]: any } = {
      entity_id: player.id,
    };

    if (source)
      serviceData['source'] = source;

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_SELECT_SOURCE,
      serviceData: serviceData
    }

    // call the service (no response).
    await this.CallService(serviceRequest);

  }


  /**
   * Turns off the player.
   * 
   * @param player MediaPlayer instance that will process the request.
  */
  public async turn_off(
    player: MediaPlayer,
  ): Promise<void> {

    // create service data (with required parameters).
    const serviceData: { [key: string]: any } = {
      entity_id: player.id,
    };

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_TURN_OFF,
      serviceData: serviceData
    }

    // call the service (no response).
    await this.CallService(serviceRequest);

  }


  /**
   * Turns on the player.
   * 
   * @param player MediaPlayer instance that will process the request.
  */
  public async turn_on(
    player: MediaPlayer,
  ): Promise<void> {

    // create service data (with required parameters).
    const serviceData: { [key: string]: any } = {
      entity_id: player.id,
    };

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_TURN_ON,
      serviceData: serviceData
    }

    // call the service (no response).
    await this.CallService(serviceRequest);

    // if default device configured then issue transfer playback to the device.
    if (this.config.deviceDefaultId) {

      // spotify premium account (or elevated credentials) required for device default function.
      // we still want to honor the turn_on call portion though.
      if (player.isUserProductPremium() || player.attributes.sp_user_has_web_player_credentials) {
        await this.PlayerTransferPlayback(player, this.config.deviceDefaultId, true);
      }
    }

  }


  /**
   * Mutes / unmutes the player volume.
   * 
   * @param player MediaPlayer instance that will process the request.
   * @param muteVolume True to mute the volume; otherwise, False to unmute the volume.
   */
  public async volume_mute(player: MediaPlayer, muteVolume: boolean) {

    // spotify premium account (or elevated credentials) required for this function.
    if (!player.isUserProductPremium() && (!player.attributes.sp_user_has_web_player_credentials)) {
      throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
    }

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
    await this.CallService(serviceRequest);
  }


  /**
   * Toggles the volume mute status of the player; 
   * if muted, then it will be unmuted;
   * if unmuted, then it will be muted;
   * 
   * @param player MediaPlayer instance that will process the request.
   */
  public async volume_mute_toggle(player: MediaPlayer) {

    const muteVolume = !player.isMuted();
    await this.volume_mute(player, muteVolume);
  }


  /**
   * Sets the player volume.
   * 
   * @param player MediaPlayer instance that will process the request.
   * @param volumePercent Volume level to set, expressed as a percentage (e.g. 1 - 100).
   */
  public async volume_set(player: MediaPlayer, volumePercent: number) {

    // spotify premium account (or elevated credentials) required for this function.
    if (!player.isUserProductPremium() && (!player.attributes.sp_user_has_web_player_credentials)) {
      throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
    }

    // convert volume level to HA float value.
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
    await this.CallService(serviceRequest);

  }


  /**
   * Turn volume down for media player.
   * 
   * @param player MediaPlayer object to control.
   */
  public async volume_down(player: MediaPlayer) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_VOLUME_DOWN,
      serviceData: {
        entity_id: player.id,
      }
    };

    // call the service.
    await this.CallService(serviceRequest);
  }


  /**
   * Turn volume up for media player.
   * 
   * @param player MediaPlayer object to control.
   */
  public async volume_up(player: MediaPlayer) {

    // create service request.
    const serviceRequest: ServiceCallRequest = {
      domain: DOMAIN_MEDIA_PLAYER,
      service: SERVICE_VOLUME_UP,
      serviceData: {
        entity_id: player.id,
      }
    };

    // call the service.
    await this.CallService(serviceRequest);
  }


  /** ======================================================================================
   * The following are common helper methods for SpotifyPlus Card support.
   * ====================================================================================== **/

  /**
   * Calls the SpotifyPlusService PlayerMediaPlayX method to play media.
   * 
   * @param player SpotifyPlus MediaPlayer instance that will process the request.
   * @param mediaItem Media Browser item that contains media content details to play.
   */
  public async Card_PlayMediaBrowserItem(
    player: MediaPlayer,
    mediaItem: any,
  ): Promise<void> {

    // spotify premium account (or elevated credentials) required for this function.
    if (!player.isUserProductPremium() && (!player.attributes.sp_user_has_web_player_credentials)) {
      throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
    }

    // validations.
    if (!player) {
      throw new Error("Media player argument was not supplied to the PlayMediaBrowserItem service.")
    }
    if (!mediaItem) {
      throw new Error("Media browser item argument was not supplied to the PlayMediaBrowserItem service.");
    }

    try {

      // get item type from uri; we cannot use `mediaItem.type` here, as the value
      // will not be the same as the uri type for some media items (e.g. chapter).
      const uriType = getTypeFromSpotifyUri(mediaItem.uri) || "";

      if (debuglog.enabled) {
        debuglog("Card_PlayMediaBrowserItem - play media item\n- player.id = %s\n- mediaItem.uri = %s\n- uriType = %s",
          JSON.stringify(player.id),
          JSON.stringify(mediaItem.uri),
          JSON.stringify(uriType),
        );
      }

      if (['album', 'artist', 'playlist', 'show', 'audiobook', 'podcast'].indexOf(uriType) > -1) {

        // play context.
        await this.PlayerMediaPlayContext(player, mediaItem.uri || '');

      } else if (['track', 'episode', 'chapter'].indexOf(uriType) > -1) {

        // play track / episode / chapter.
        await this.PlayerMediaPlayTracks(player, mediaItem.uri || '');

      } else {

        throw new Error("unknown media type \"" + uriType + "\".");
      }
    }
    finally {
    }
  }
}


/**
* Gets the Id portion (e.g. "26c0zVyOv1lzfYpBXdh1zC") of a valid Spotify URI 
* value (e.g. "spotify:episode:26c0zVyOv1lzfYpBXdh1zC").
* 
* @param uri String value that contains a Spotify URI value (e.g. "spotify:episode:26c0zVyOv1lzfYpBXdh1zC").
* @returns Id portion of the URI value (e.g. "26c0zVyOv1lzfYpBXdh1zC") if found; otherwise, undefined.
*/
export function getIdFromSpotifyUri(uri: string | undefined | null): string | undefined | null {
  let result = uri;
  if (uri) {
    const idx = uri.lastIndexOf(':');
    if (idx > -1) {
      result = uri.substring(idx + 1)
    }
  }
  return result;
}


/**
* Gets the Type portion (e.g. "episode") of a valid Spotify URI 
* value (e.g. "spotify:episode:26c0zVyOv1lzfYpBXdh1zC").
* 
* @param uri String value that contains a Spotify URI value (e.g. "spotify:episode:26c0zVyOv1lzfYpBXdh1zC").
* @returns Type portion of the URI value (e.g. "episode") if found; otherwise, undefined.
*/
export function getTypeFromSpotifyUri(uri: string | undefined | null): string | undefined | null {
  let result = uri;
  if (uri) {
    const idx = uri.indexOf(':');
    if (idx > -1) {
      const idxe = uri.lastIndexOf(':');
      if (idxe > -1) {
        result = uri.substring(idx + 1, idxe)
      }
    }
  }
  return result;
}
