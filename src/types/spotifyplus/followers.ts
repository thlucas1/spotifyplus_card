/**
 * Spotify Web API Followers object.
 * 
 * Contains information about the followers of an artist.
 */
export interface IFollowers {


  /** 
   * This will always be set to null, as the Web API does not support it at the moment.
   * */
  href: string;


  /** 
   * The total number of followers.
   * Example: 31288
   * */
  total: number;

}