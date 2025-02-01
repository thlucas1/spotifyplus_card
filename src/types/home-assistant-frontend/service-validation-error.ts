/**
 * Home Assistant service validation error message object.
 * 
 * {
 *   "code": "service_validation_error",
 *   "message": "Validation error: There is no active Spotify player, and a default player device was not configured."
 * }
 * 
 */
export interface ServiceValidationError {


  /** 
   * The error code; will contain `service_validation_error`.
   */
  code: string;


  /** 
   * The error message; will also contain a prefix value of "Validation error: ".
   */
  message: string;

}
