import { IEpisodePageSimplified } from './episode-page-simplified';
import { IShowSimplified } from './show-simplified';

/**
 * Spotify Web API Show object.
 */
export interface IShow extends IShowSimplified {


  /**
   * The episodes of the show.
   * 
   * This is a `IEpisodePageSimplified` object.
   */
  episodes: IEpisodePageSimplified;

}
