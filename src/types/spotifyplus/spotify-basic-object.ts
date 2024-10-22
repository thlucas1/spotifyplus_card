/**
 * Spotify Web API basic object.
 */
export interface ISpotifyBasicObject {

  /** 
   * The Spotify ID for the object.
   * Example: `2CIMQHirSU0MQqyYHq0eOx`
   */
  id: string;


  /** 
   * The object type (e.g. `artist`, `album`, etc).
   */
  type: string;


  /** 
   * The Spotify URI for the object.
   * 
   * Example: `spotify:artist:2CIMQHirSU0MQqyYHq0eOx`
   */
  uri: string;

}