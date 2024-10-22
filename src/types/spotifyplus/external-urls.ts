/**
 * Spotify Web API ExternalUrls object.
 * 
 * Contains known external URLs for various object types: artist, track, etc.
 */
export interface IExternalUrls {


  /** 
   * International Article Number.
   * */
  ean?: string;


  /** 
   * International Standard Recording Code.
   * */
  isrc?: string;


  /** 
   * The Spotify URL for the object.
   * */
  spotify?: string;


  /** 
   * Universal Product Code.
   * */
  upc?: string;

}