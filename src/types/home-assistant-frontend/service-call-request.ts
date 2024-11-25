/**
 * Home Assistant Service Call Request object.
 * 
 * This interface contains the attributes and subitems that represent a
 * service call request.
 */
export declare type ServiceCallRequest = {
  domain: string;
  service: string;
  serviceData?: Record<string, any>;
  target?: HassServiceTarget;
}


export declare type HassServiceTarget = {
  entity_id?: string | string[];
  device_id?: string | string[];
  area_id?: string | string[];
};
