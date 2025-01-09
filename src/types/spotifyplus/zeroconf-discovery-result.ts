import { IZeroconfProperty } from './zeroconf-property';

/**
 * Zeroconf Discovery Result object.
 * 
 * Information about the Zeroconf entry for a SpotifyConnect device as found by Zeroconf (mDNS).
 */
export interface IZeroconfDiscoveryResult {


  /** 
   * Device name (e.g. "Bose-ST10-1").
   */
  DeviceName: string;


  /** 
   * Domain on which the service is located, which should match the one passed in during the query (e.g. "local.").
   */
  Domain: string;


  /** 
   * IP address at which the host can be reached (e.g. "192.168.1.81").
   * 
   * This value may also contain a DNS alias, if no IP addresses were discovered
   * for the device.  This is very rare, but possible.
   */
  HostIpAddress: string;


  /** 
   * IP address(es) at which the host can be reached (e.g. ["192.168.1.81", "172.30.32.1"]).
   * 
   * Note that this value can contain multiple addresses.
   */
  HostIpAddresses: Array<string>;


  /** 
   * Port number (as an integer) for the service on the host (e.g. 8080).
   */
  HostIpPort: string;


  /** 
   * Host Time-To-Live value (as an integer) for the service on the host (e.g. 1200).
   */
  HostTTL: number;


  /** 
   * Result ID (e.g. "Bose-ST10-1" (192.168.1.81:8200)).
   * 
   * This is a helper property, and not part of the Zeroconf interface.
   */
  Id: string;


  /**
   * True if the device is a Google ChromeCast device; otherwise, False.
   */
  IsChromeCast: boolean;


  /**
   * Returns True if the device is a dynamic device;
   * otherwise, False.
   * 
   * Dynamic devices are Spotify Connect devices that are not found in Zeroconf discovery
   * process, but still exist in the player device list.  These are usually Spotify Connect
   * web or mobile players with temporary device id's.
   */
  IsDynamicDevice: boolean;


  /**
   * Service key (e.g. "bose-st10-2._spotify-connect._tcp.local.").
   */
  Key: string;


  /** 
   * Service name (e.g. "Bose-ST10-2._spotify-connect._tcp.local.").
   */
  Name: string;


  /** 
   * Priority value (as an integer) for the service on the host (e.g. 0).
   */
  Priority: number;


  /** 
   * Other Time-To-Live value (as an integer) for the service on the host (e.g. 5400).
   */
  OtherTTL: number;


  /** 
   * Discovered properties.
   */
  Properties: Array<IZeroconfProperty>;


  /** 
   * Server name (e.g. "Bose-SM2-341513fbeeae.local.").
   */
  Server: string;


  /** 
   * Server key (e.g. "bose-sm2-341513fbeeae.local.").
   */
  ServerKey: string;


  /** 
   * Service type, which should match the one passed in during the query name (e.g. "_spotify-connect._tcp.").
   */
  ServiceType: string;


  /** 
   * Weight value (as an integer) for the service on the host (e.g. 0).
   */
  Weight: number;


  // *****************************************************************************
  // The following are Spotify Connect specific properties.
  // *****************************************************************************

  /**
   * Spotify Connect CPath property value (e.g. "/zc").
   */
  SpotifyConnectCPath: string;


  /** 
   * True if the device is in the Spotify Player active device list; otherwise, False.
   */
  SpotifyConnectIsInDeviceList: boolean;


  /** 
   * Spotify Connect Version property value (e.g. null, "1.0").
   */
  SpotifyConnectVersion: string;


  /** 
   * Zeroconf API endpoint to add a user to a Spotify Connect device (e.g. "http://192.168.1.81:8200/zc?action=addUser&version=2.10.0").
   */
  ZeroconfApiEndpointAddUser: string;


  /** 
   * Zeroconf API endpoint to retrieve device information for a Spotify Connect device (e.g. "http://192.168.1.81:8200/zc?action=getInfo&version=2.10.0").
   */
  ZeroconfApiEndpointGetInformation: string;


  /** 
   * Zeroconf API endpoint to reset users (e.g. Logoff) currently active on a Spotify Connect device (e.g. "http://192.168.1.81:8200/zc?action=resetUsers&version=2.10.0").
   */
  ZeroconfApiEndpointResetUsers: string;


}
