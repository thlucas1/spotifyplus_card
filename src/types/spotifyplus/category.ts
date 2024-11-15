import { IImageObject } from './image-object';

/**
 * Spotify Web API Category object.
 */
export interface ICategory {

  /**
   * A link to the Web API endpoint returning full details of the category.
   */
  href: string;


  /** 
   * The Spotify category ID of the category.  
   * Some ID's are read-able text, while most are a unique id format.
   * 
   * Example: `toplists`  
   * Example: `0JQ5DAqbMKFDXXwE9BDJAr`  (e.g. unique id for `Rock`)
   */
  id: string;


  /** 
   * The category icon in various sizes, widest first.
   */
  icons: Array<IImageObject>;


  /**
   * First icon url in the `Icons` list, if images are defined;
   * otherwise, null.
   * 
   * This will default to the first image in the `images` collection if not set, courtesy of
   * the `media_browser_utils.getContentItemImageUrl()` method.
   */
  image_url?: string | undefined;


  /** 
   * Name of the category.
   */
  name: string;


  /**
   * The object type: `category`.
   * 
   * This is a helper property - no value with this name is returned from the
   * Spotify Web API.
   */
  type: string;


  /** 
   * A simulated Spotify URI value for the category.
   * 
   * This is a helper property - no value with this name is returned from the
   * Spotify Web API.
   * 
   * Example: `spotify:category:0JQ5DAqbMKFDXXwE9BDJAr`
   */
  uri: string;

}
