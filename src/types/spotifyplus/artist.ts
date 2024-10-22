import { IArtistSimplified } from './artist-simplified';
import { IFollowers } from './followers';
import { IImageObject } from './image-object';

/**
 * Spotify Web API Artist object.
 */
export interface IArtist extends IArtistSimplified {


  /** 
   * Information about the followers of the artist.
   */
  followers: IFollowers;


  /** 
   * A list of the genres the artist is associated with; if not yet classified, the array is empty.
   * Example: `["Prog rock","Grunge"]`
   */
  genres: Array<string>;


  /** 
   * Images of the artist in various sizes, widest first.
   */
  images: Array<IImageObject>;


  /**
   * Image to use for media browser displays.
   * 
   * This will default to the first image in the `images` collection if not set, courtesy of
   * the `media_browser_utils.getContentItemImageUrl()` method.
   */
  image_url?: string | undefined;


  /** 
   * The popularity of the artist.
   * 
   * The value will be between 0 and 100, with 100 being the most popular.
   * The artist's popularity is calculated from the popularity of all the artist's tracks.
   */
  popularity: number;

}
