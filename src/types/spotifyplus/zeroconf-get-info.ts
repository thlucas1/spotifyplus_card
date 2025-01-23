import { IZeroconfGetInfoAlias } from './zeroconf-get-info-alias';
import { IZeroconfGetInfoDrmMediaFormat } from './zeroconf-get-info-drm-media-format';
import { IZeroconfResponse } from './zeroconf-response';

/**
 * Spotify Zeroconf API GetInfo response object.
 */
export interface IZeroconfGetInfo extends IZeroconfResponse {


  /** 
   * ? (e.g. "DONTCARE").
   */
  AccountReq: string;


  /** 
   * Canonical username of the logged in user (e.g. "31l77y2123456789012345678901").  
   * 
   * This value will be an empty string if there is no user logged into the device.
   */
  ActiveUser: string;


  /** 
   * Device alias information, IF the device supports aliases.  
   * 
   * Using ZeroConf, it is possible to announce multiple "virtual devices" from a device. 
   * This allows the eSDK device to expose, for instance, multiroom zones as ZeroConf devices.  
   * 
   * Device aliases will show up as separate devices in the Spotify app.  
   * 
   * A maximum of 8 aliases are supported (SP_MAX_DEVICE_ALIASES).
   * 
   * Please refer to the `RemoteName` property for more information.   
   */
  Aliases: Array<IZeroconfGetInfoAlias>;


  /** 
   *  The SpZeroConfVars availability field returned by SpZeroConfGetVars.  
   * 
   * The following are values that I have encountered thus far:  
   * - ""            - Device is available and ready for use.
   * - "UNAVAILABLE" - Device is unavailable, and should probably be rebooted.
   * - "NOT-LOADED"  - Spotify SDK / API is not loaded.
   * 
   * The maximum length of the availability string (SP_MAX_AVAILABILITY_LENGTH) 
   * is 15 characters (not counting terminating NULL).
   */
  Availability: string;


  /** 
   * A UTF-8-encoded brand name of the hardware device, for hardware integrations (e.g. "Bose", "Onkyo", etc).
   * 
   * The maximum length of the brand display name (SP_MAX_BRAND_NAME_LENGTH) 
   * is 32 characters (not counting terminating NULL).  
   */
  BrandDisplayName: string;


  /** 
   * Client id of the application (e.g. "79ebcb219e8e4e123456789000123456").
   * 
   * The maximum length of the client ID value (SP_MAX_CLIENT_ID_LENGTH) 
   * is 32 characters (not counting terminating NULL).
   */
  ClientId: string;


  /** 
   * Unique device ID used for ZeroConf logins (e.g. "30fbc80e35598f3c242f2120413c943dfd9715fe").
   * 
   * The maximum length of the device ID value used for ZeroConf logins (SP_MAX_DEVICE_ID_LENGTH) 
   * is 64 characters (not counting terminating NULL).
   */
  DeviceId: string;


  /** 
   * Type of the device (e.g. "SPEAKER", "AVR", etc).
   * 
   * Can be any of the following `SpDeviceType` devices:
   * - Computer	    Laptop or desktop computer device.
   * - Tablet	    Tablet PC device.
   * - Smartphone	Smartphone device.
   * - Speaker	    Speaker device.
   * - TV	        Television device.
   * - AVR	        Audio/Video receiver device.
   * - STB	        Set-Top Box device.
   * - AudioDongle	Audio dongle device.
   * - GameConsole	Game console device.
   * - CastVideo	    Chromecast Video.
   * - CastAudio	    Chromecast Audio.
   * - Automobile	Automobile.
   * - Smartwatch	Smartwatch.
   * - Chromebook	Chromebook.        
   * 
   * The maximum length of the device type string (SP_MAX_DEVICE_TYPE_LENGTH) 
   * is 15 characters (not counting terminating NULL).
   */
  DeviceType: string;


  /** 
   * The SpZeroConfVars group_status field returned by SpZeroConfGetVars (e.g. "NONE").
   * 
   * The maximum length of the group status string (SP_MAX_GROUP_STATUS_LENGTH)
   * is 15 characters (not counting terminating NULL).
   */
  GroupStatus: string;


  /** 
   * Returns True if the device has an active user account specified;
   * otherwise, False.
   */
  HasActiveUser: boolean;


  /** 
   * Returns True if the device has alias entries defined;
   * otherwise, False.
   */
  HasAliases: boolean;


  /** 
   * Returns True if the device is available; otherwise, False.
   * 
   * Determination is made based upon the `Availability` property value.
   */
  IsAvailable: boolean;


  /** 
   * Returns True if the device is a 'Sonos' branded device; otherwise, False.
   * 
   * Determination is made based upon the `BrandDisplayName` property value.
   */
  IsBrandSonos: boolean;


  /** 
   * Client library version that processed the Zeroconf action (e.g. "3.88.29-gc4d4bb01").
   */
  LibraryVersion: string;


  /** 
   * A UTF-8-encoded model name of the hardware device, for hardware integrations (e.g. "Soundtouch").
   * 
   * The maximum length of the model display name (SP_MAX_MODEL_NAME_LENGTH)
   * is 30 characters (not counting terminating NULL).
   */
  ModelDisplayName: string;


  /** 
   * An integer enumerating the product for this partner (e.g. 12345).
   */
  ProductId: string;


  /** 
   * Public key used in ZeroConf logins (e.g. "G+ZM4irhc...").
   * 
   * The maximum length of the public key used in ZeroConf logins (SP_MAX_PUBLIC_KEY_LENGTH)
   * is 149 characters (not counting terminating NULL).
   */
  PublicKey: string;


  /** 
   * Name to be displayed for the device (e.g. "BOSE-ST10-1").
   * 
   * This value will be null if the response is from a device using device aliases,
   * as the displayed name for respective alias is defined in the aliases field.
   * 
   * Please refer to the `Aliases` property for more information.
   */
  RemoteName: string;


  /** 
   * The SpZeroConfVars resolver_version field returned by SpZeroConfGetVars (e.g. "0").
   */
  ResolverVersion: string;


  /** 
   * OAuth scope requested when authenticating with the Spotify backend (e.g. "streaming").
   * 
   * The maximum length of the token type string (SP_MAX_SCOPE_LENGTH)
   * is 64 characters (not counting terminating NULL).
   */
  Scope: string;


  /** 
   * Bitmasked integer representing list of device capabilities (e.g. 0).
   */
  SupportedCapabilities: number;


  /** 
   * The SpZeroConfVars supported_drm_media_formats field returned by SpZeroConfGetVars (e.g. []).
   * 
   * A maximum of 8 formats are supported (SP_MAX_SUPPORTED_FORMATS).
   */
  SupportedDrmMediaFormats: Array<IZeroconfGetInfoDrmMediaFormat>;


  /** 
   * Authorization Token type provided by the client:
   * - "accesstoken"         Access token.
   * - "authorization_code"  OAuth Authorization Code token.
   * - "default"             Default access token.
   * 
   * The maximum length of the token type string (SP_MAX_TOKEN_TYPE_LENGTH)
   * is 30 characters (not counting terminating NULL).
   */
  TokenType: string;


  /** 
   * ZeroConf API version number (e.g. "2.10.0").
   * 
   * The maximum length of the library version string (SP_MAX_VERSION_LENGTH)
   * is 30 characters (not counting terminating NULL).
   */
  Version: string;


  /** 
   * Indicates if the device supports voice commands (e.g. "YES").
   */
  VoiceSupport: string;

}
