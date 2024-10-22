/**
 * Spotify Web API Device object.
 */
export interface IDevice {

  /** 
   * The device ID.  
   * 
   * This ID is unique and persistent to some extent. However, this is not guaranteed 
   * and any cached device_id should periodically be cleared out and refetched as necessary.
   */
  id: string;


  /**
   * Image to use for media browser displays.
   * 
   * This will default to the first image in the `images` collection if not set, courtesy of
   * the `media_browser_utils.getContentItemImageUrl()` method.
   */
  image_url?: string | undefined;


  /**
   * If this device is the currently active device.
   */
  is_active: boolean;


  /** 
   * True if the player device volume is zero (muted); 
   * otherwise, false.
   */
  is_muted: string;


  /** 
   * If this device is currently in a private session.
   */
  is_private_session: boolean;


  /** 
   * Whether controlling this device is restricted.  
   * 
   * At present if this is "true" then no Web API commands will be accepted by this device.
   */
  is_restricted: boolean;


  /** 
   * A human-readable name for the device. 
   * 
   * Some devices have a name that the user can configure (e.g. "Loudest speaker") and some 
   * devices have a generic name associated with the manufacturer or device model.
   * 
   * Example: `Kitchen Speaker`
   */
  name: string;


  /** 
   * Returns a string that can be used in a selection list in the
   * form of "Name (Id)".
   */
  select_item_name_and_id: string;


  /** 
   * If this device can be used to set the volume.
   */
  supports_volume: boolean;


  /** 
   * Device type, such as `computer`, `smartphone` or `speaker`.
   * 
   * Example: `computer`
   */
  type: string;


  /** 
   * The current volume in percent.
   * 
   * Range: `0 - 100`
   * Example: 59
   */
  volume_percent: number;


  /**
   * Returns the Id portion of a `SelectItemNameAndId` property value.
   * 
   * @value A `SelectItemNameAndId` property value.
   * @returns The Id portion of a `SelectItemNameAndId` property value, or None if the Id portion could not be determined.
   */
  GetIdFromSelectItem(value: string): string;


  /**
   * Returns the Name portion of a `SelectItemNameAndId` property value.
   * 
   * @value A `SelectItemNameAndId` property value.
   * @returns The Name portion of a `SelectItemNameAndId` property value, or None if the Name portion could not be determined.
   */
  GetNameFromSelectItem(value: string): string;

}
