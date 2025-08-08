import { IArtistSimplified } from './artist-simplified';
import { IExternalUrls } from './external-urls';
import { ILinkedFrom } from './linked-from';
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
   * The origin Spotify ID for the track.
   * The `LinkedFrom.Id` value is returned if present; 
   * otherwise, the `Id` value is returned.
   * 
   * This is a helper property, and is not part of the Spotify Web API specification.
   * 
   * Example: `spotify:track:1301WleyT98MSxVHPZCA6M`
   */
  id_origin: string;


  /**
   * Always returns null, as tracks currently do not support images.
   * 
   * Added for compatibility with other objects.
   */
  image_url?: string | undefined;


  /** 
   * Whether or not the track is linked from another track.
   * 
   * If True, the `LinkedFrom` property contains track origin data;
   * If False, the `LinkedFrom` property is an empty dictionary.
   * 
   * This is a helper property, and is not part of the Spotify Web API specification.
   */
  is_linked_from: boolean;


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
  linked_from: ILinkedFrom;


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


  /** 
   * The origin Spotify URI for the track.
   * The `LinkedFrom.Uri` value is returned if present; 
   * otherwise, the `Uri` value is returned.
   * 
   * This is a helper property, and is not part of the Spotify Web API specification.
   * 
   * Example: `spotify:track:1301WleyT98MSxVHPZCA6M`
   */
  uri_origin: string;

}
