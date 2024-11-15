/**
 * Properties used in the IUserPreset object for call to the GetTrackRecommendations service.
 * 
 * Use the `GetTrackAudioFeatures` method to get an idea of what to specify for some of the
 * minX / maxX / and targetX recommendations values.
 */
export interface ITrackRecommendationsProperties {

  /** 
   * A comma separated list of Spotify IDs for seed artists.  
   * Up to 5 seed values may be provided in any combination of seedArtists, seedTracks and seedGenres.  
   * Note: only required if seedGenres and seedTracks are not set.  
   * Example: `4NHQUGzhtTLFvgF5SZesLK`
   */
  seed_artists?: string;


  /**
   * A comma separated list of any genres in the set of available genre seeds.  
   * Up to 5 seed values may be provided in any combination of seedArtists, seedTracks and seedGenres.  
   * Note: only required if seedArtists and seedTracks are not set.  
   * Example: `classical,country`
   */
  seed_genres?: string;


  /**
   * A comma separated list of Spotify IDs for a seed track.  
   * Up to 5 seed values may be provided in any combination of seedArtists, seedTracks and seedGenres.  
   * Note: only required if seedArtists and seedGenres are not set.  
   * Example: `0c6xIDDpzE81m2q797ordA`  
   */
  seed_tracks?: string;


  /**
   * Restrict results to only those tracks whose acousticness level is greater than the specified value.  
   * Range: `0` - `1`
   */
  min_acousticness?: number;


  /**
   * Restrict results to only those tracks whose acousticness level is less than the specified value.
   * Range: `0` - `1`
   */
  max_acousticness?: number;


  /**
   * Restrict results to only those tracks whose acousticness level is equal to the specified value. 
   * Range: `0` - `1`
   */
  target_acousticness?: number;


  /**
   * Restrict results to only those tracks whose danceability level is greater than the specified value.  
   * Range: `0` - `1` 
   */
  min_danceability?: number;


  /**
   * Restrict results to only those tracks whose danceability level is less than the specified value. 
   * Range: `0` - `1` 
   */
  max_danceability?: number;


  /**
   * Restrict results to only those tracks whose acousticness is equal to the specified value.
   * Range: `0` - `1` 
   */
  target_danceability?: number;


  /**
   * Restrict results to only those tracks whose duration is greater than the specified value in milliseconds.  
   */
  min_duration_ms?: number;


  /**
   * Restrict results to only those tracks whose duration is less than the specified value in milliseconds.  
   */
  max_duration_ms?: number;


  /**
   * Restrict results to only those tracks whose duration is equal to the specified value in milliseconds.  
   */
  target_duration_ms?: number;


  /**
   * Restrict results to only those tracks whose energy level is greater than the specified value.  
   * Range: `0` - `1`  
   */
  min_energy?: number;


  /**
   * Restrict results to only those tracks whose energy level is less than the specified value.  
   * Range: `0` - `1`  
   */
  max_energy?: number;


  /**
   * Restrict results to only those tracks whose energy level is equal to the specified value.  
   * Range: `0` - `1`  
   */
  target_energy?: number;


  /**
   * Restrict results to only those tracks whose instrumentalness level is greater than the specified value.  
   * Range: `0` - `1`  
   */
  min_instrumentalness?: number;


  /**
   * Restrict results to only those tracks whose instrumentalness level is less than the specified value.  
   * Range: `0` - `1`  
   */
  max_instrumentalness?: number;


  /**
   * Restrict results to only those tracks whose instrumentalness level is equal to the specified value.  
   * Range: `0` - `1`  
   */
  target_instrumentalness?: number;


  /**
   * Restrict results to only those tracks whose key level is greater than the specified value.  
   * Range: `0` - `11`  
   */
  min_key?: number;


  /**
   * Restrict results to only those tracks whose key level is less than the specified value.  
   * Range: `0` - `11`  
   */
  max_key?: number;


  /**
   * Restrict results to only those tracks whose key level is equal to the specified value.  
   * Range: `0` - `11`  
   */
  target_key?: number;


  /**
   * Restrict results to only those tracks whose liveness level is greater than the specified value.  
   * Range: `0` - `1`  
   */
  min_liveness?: number;


  /**
   * Restrict results to only those tracks whose liveness level is less than the specified value.  
   * Range: `0` - `1`  
   */
  max_liveness?: number;


  /**
   * Restrict results to only those tracks whose liveness level is equal to the specified value.  
   * Range: `0` - `1`  
   */
  target_liveness?: number;


  /**
   * Restrict results to only those tracks whose loudness level is greater than the specified value.  
   */
  min_loudness?: number;


  /**
   * Restrict results to only those tracks whose loudness level is less than the specified value.  
   */
  max_loudness?: number;


  /**
   * Restrict results to only those tracks whose loudness level is equal to the specified value.  
   */
  target_loudness?: number;


  /**
   * Restrict results to only those tracks whose mode level is greater than the specified value.  
   * Range: `0` - `1`  
   */
  min_mode?: number;


  /**
   * Restrict results to only those tracks whose mode level is less than the specified value.  
   * Range: `0` - `1`  
   */
  max_mode?: number;


  /**
   * Restrict results to only those tracks whose mode level is equal to the specified value.  
   * Range: `0` - `1`  
   */
  target_mode?: number;


  /**
   * Restrict results to only those tracks whose popularity level is greater than the specified value.  
   * Range: `0` - `100`  
   */
  min_popularity?: number;


  /**
   * Restrict results to only those tracks whose popularity level is less than the specified value.  
   * Range: `0` - `100`  
   */
  max_popularity?: number;


  /**
   * Restrict results to only those tracks whose popularity level is equal to the specified value.  
   * Range: `0` - `100`  
   */
  target_popularity?: number;


  /**
   * Restrict results to only those tracks whose speechiness level is greater than the specified value.  
   * Range: `0` - `1`  
   */
  min_speechiness?: number;


  /**
   * Restrict results to only those tracks whose speechiness level is less than the specified value.  
   * Range: `0` - `1`  
   */
  max_speechiness?: number;


  /**
   * Restrict results to only those tracks whose speechiness level is equal to the specified value.  
   * Range: `0` - `1`  
   */
  target_speechiness?: number;


  /**
   * Restrict results to only those tracks with a tempo greater than the specified number of beats per minute.  
   */
  min_tempo?: number;


  /**
   * Restrict results to only those tracks with a tempo less than the specified number of beats per minute.  
   */
  max_tempo?: number;


  /**
   * Restrict results to only those tracks with a tempo equal to the specified number of beats per minute.  
   */
  target_tempo?: number;


  /**
   * Restrict results to only those tracks whose time signature is greater than the specified value.  
   * Maximum value: 11
   */
  min_time_signature?: number;


  /**
   * Restrict results to only those tracks whose time signature is less than the specified value.  
   * Maximum value: 11
   */
  max_time_signature?: number;


  /**
   * Restrict results to only those tracks whose time signature is equal to the specified value.  
   * Maximum value: 11
   */
  target_time_signature?: number;


  /**
   * Restrict results to only those tracks whose valence level is greater than the specified value.  
   * Range: `0` - `1`  
   */
  min_valence?: number;


  /**
   * Restrict results to only those tracks whose valence level is less than the specified value.  
   * Range: `0` - `1`  
   */
  max_valence?: number;


  /**
   * Restrict results to only those tracks whose valence level is equal to the specified value.  
   * Range: `0` - `1`  
   */
  target_valence?: number;

}