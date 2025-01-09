import { IZeroconfDiscoveryResult } from './zeroconf-discovery-result';
import { IZeroconfGetInfo } from './zeroconf-get-info';

/**
 * Spotify Connect Device object.
 * 
 * Information about the Spotify Connect device, which is a combination of the
 * `IZeroconfDiscoveryResult` and `IZeroconfGetInfo` classes.
 */
export interface ISpotifyConnectDevice {

  /** 
   * Information about the Zeroconf entry for a SpotifyConnect device as found by Zeroconf (mDNS).
   */
  DiscoveryResult: IZeroconfDiscoveryResult;


  /** 
   * Spotify Zeroconf API GetInfo response object.
   */
  DeviceInfo: IZeroconfGetInfo;


  /** 
   * Spotify Connect device id value (e.g. "30fbc80e35598f3c242f2120413c943dfd9715fe").
   */
  Id: string;


  /**
   * True if the device is a Google ChromeCast device; otherwise, False.
   */
  IsChromeCast: boolean;


  /**
   * Image to use for media browser displays.
   * 
   * This will default to the first image in the `images` collection if not set, courtesy of
   * the `media_browser_utils.getContentItemImageUrl()` method.
   */
  image_url?: string | undefined;


  /**
   * Spotify Connect device name value (e.g. "Bose-ST10-1").
   */
  Name: string;


  /** 
   * Spotify Connect device name and id value (e.g. '"Bose-ST10-1" (30fbc80e35598f3c242f2120413c943dfd9715fe)').
   */
  Title: string;


  /**
   * True if the device was re-connected, after being inactive or disconnected.
   */
  WasReConnected: boolean;

}
