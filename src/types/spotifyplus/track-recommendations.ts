import { IRecommendationSeed } from './recommendation-seed';
import { ITrack } from './track';

/**
 * Spotify Web API TrackRecommendations object.
 */
export interface ITrackRecommendations {

  /**
   * A list of recommendation seed objects. 
   */
  seeds: Array<IRecommendationSeed>;


  /**
   * A list of Track objects, ordered according to the parameters supplied
   * to the `GetTrackRecommendations` method.
   */
  tracks: Array<ITrack>;

}
