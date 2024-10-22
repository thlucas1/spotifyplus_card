import { IArtistSimplified } from './artist-simplified';
import { IExternalUrls } from './external-urls';
import { IRestrictions } from './restrictions';

/**
 * Spotify Web API SimplifiedTrack object.
 */
export interface ITrackSimplified {

  /** 
   * A list of artists who performed the track.
   */
  artists: Array<IArtistSimplified>;


  /**
   * A list of the countries in which the track can be played, identified by their ISO 3166-1 alpha-2 code.
   */
  available_markets: Array<string>;


  /**
   * The disc number (usually 1 unless the album consists of more than one disc).
   */
  disc_number: number;


  /**
   * The track length in milliseconds.
   */
  duration_ms: number;


  /**
   * Whether or not the track has explicit lyrics (true = yes it does; false = no it does not OR unknown).
   */
  explicit: boolean;


  /** 
   * Known external URLs for this track.
   */
  external_urls: IExternalUrls;


  /**
   * A link to the Web API endpoint providing full details of the track.
   */
  href: string;


  /** 
   * The Spotify ID for the track.
   * Example: `1301WleyT98MSxVHPZCA6M`
   */
  id: string;


  /**
   * Always returns null, as tracks currently do not support images.
   * 
   * Added for compatibility with other objects.
   */
  image_url?: string | undefined;


  /** 
   * Whether or not the track is from a local file.
   */
  is_local: boolean;


  /** 
   * Part of the response when Track Relinking is applied.
   * If true, the track is playable in the given market. Otherwise false.
   */
  is_playable: boolean;


  /** 
   * Part of the response when Track Relinking is applied, and the requested track has been replaced
   * with different track.  The track in the LinkedFrom object contains information about the originally
   * requested track.
   */
  linked_from: object;


  /**
   * The name of the track.
   */
  name: string;


  /**
   * A link to a 30 second preview (MP3 format) of the track. Can be null.
   * 
   * Important policy note:
   * - Spotify Audio preview clips can not be a standalone service.
   */
  preview_url: string;


  /** 
   * Included in the response when a content restriction is applied.
   */
  restrictions: IRestrictions;


  /**
   * The number of the track.
   * 
   * If an album has several discs, the track number is the number on the specified disc.
   */
  track_number: number;


  /**
   * The object type: `track`.
   */
  type: string;


  /** 
   * The Spotify URI for the track.
   * 
   * Example: `spotify:track:1301WleyT98MSxVHPZCA6M`
   */
  uri: string;

}
