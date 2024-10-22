/**
 * Spotify Zeroconf API basic response object.
 */
export interface IZeroconfResponse {

  /** 
   * Response source string (e.g. "").
   */
  ResponseSource: string;


  /** 
   * The last error code returned by a Spotify API call or the SpCallbackError() callback (e.g. 0, -119, etc).
   */
  SpotifyError: number;


  /** 
   * A code indicating the result of the operation (e.g. 101, 402, etc).
   */
  Status: number;


  /** 
   * The string describing the status code (e.g. "OK", "ERROR-SPOTIFY-ERROR", etc).
   */
  StatusString: string;

}
