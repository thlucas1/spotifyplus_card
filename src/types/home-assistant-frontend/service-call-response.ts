/**
 * Home Assistant Service Call Response object.
 * 
 * This interface contains the attributes and subitems that represent a
 * service call response.
 */

export interface ServiceCallResponse {

  /**
   * Context in which the service was called.
   */
  context: ServiceCallResponseContext;

  /**
   * Response data returned by the called service (optional).
   * This is usually a dictionary, but could also be basic types (string, number, etc).
   */
  response?: Record<string, any>;
}


export interface ServiceCallResponseContext {

  /**
   * Context identifier (e.g. "01HW87T1D7C78YEQS2WZ5HNN2X").
   */
  id: string;

  /**
   * Parent identifier (e.g. null).
   */
  parent_id?: string;

  /**
   * User identifier (e.g. "e6f0d061124b4c65abb00fa22e51f5a5").
   */
  user_id?: string | null;
}
