/**
 * Media Browser item information.
 */

export interface IMediaBrowserInfo {

  /**
   * Image url that will be displayed as the background image.
   */
  image_url: string;


  /**
   * Title value.
   */
  title: string | null;


  /**
   * Sub-Title value.
   */
  subtitle: string | null;


  /**
   * Indicates if the item is the active item (true) or not (false).
   */
  is_active: boolean | null;

}


export interface IMediaBrowserItem {

  /**
   * An IMediaBrowserItem that contains media browser item details.
   */
  mbi_item: IMediaBrowserInfo;

}