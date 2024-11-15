/**
 * Spotify Web API Content RecommendationSeed object.
 * 
 * Contains information about recommended tracks.
 */
export interface IRecommendationSeed {

  /**
   * The number of tracks available after min_* and max_* filters have been applied.
   */
  after_filtering_size: number;


  /**
   * The number of tracks available after relinking for regional availability.
   */
  after_relinking_size: number;


  /**
   * A link to the full track or artist data for this seed.  
   * 
   * For tracks this will be a link to a Track Object.  
   * For artists a link to an Artist Object.  
   * For genre seeds, this value will be null.
   */
  href?: string;


  /** 
   * The id used to select this seed.  
   * 
   * This will be the same as the string used in the seedArtists, seedTracks or seedGenres parameter.
   */
  id?: string;


  /** 
   * The number of recommended tracks available for this seed.
   */
  initial_pool_size: number;


  /**
   * The entity type of this seed.  
   * 
   * One of `artist`, `track` or `genre`.
   */
  type?: string;

}
