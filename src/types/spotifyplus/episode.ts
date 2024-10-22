import { IEpisodeSimplified } from './episode-simplified';
import { IShowSimplified } from './show-simplified';

/**
 * Spotify Web API Episode object.
 */
export interface IEpisode extends IEpisodeSimplified {


  /**
   * The show on which the episode belongs.
   * 
   * This is a `IShowSimplified` object.
   */
  show: IShowSimplified;

}



/**
 * Returns True if an object implements the `show` property of the IEpisode interface.
 * 
 * @param obj Object to check.
 * @returns True if `obj` object implements the `show` property of the IEpisode interface.
 */
export function isEpisodeObject(obj: any): obj is IEpisode {

  if (typeof obj !== 'object' || obj === null || !('show' in obj)) {
    //console.log("%c Object is NOT an IEpisode!", "color:yellow");
    return false;  // object does not implement interface IEpisode
  }

  //console.log("%c Object is an IEpisode!", "color:yellow");
  return true;

}
