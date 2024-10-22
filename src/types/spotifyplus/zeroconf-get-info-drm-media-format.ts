/**
 * Spotify Zeroconf API GetInfo DRM Media Format object.
 */
export interface IZeroconfGetInfoDrmMediaFormat {


  /** 
   * DRM format which the integration supports (SpDrmFormat).
   * 
   * kSpDrmFormatUnknown      Unknown DRM.
   * kSpDrmFormatUnencrypted  No DRM, unencrypted.
   * kSpDrmFormatFairPlay	    FairPlay.
   * kSpDrmFormatWidevine	    Widevine.
   * kSpDrmFormatPlayReady	  PlayReady.       
   */
  Drm: number;


  /** 
   * Supported media formats for a DRM.
   */
  Formats: number;

}
