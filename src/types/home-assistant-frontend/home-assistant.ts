import { HassEntities, HassConfig, Auth, Connection, MessageBase, HassServices } from "home-assistant-js-websocket";
import { ServiceCallRequest } from './service-call-request';
import { ServiceCallResponse } from './service-call-response';

export interface HomeAssistant {
  auth: Auth & { external?: any }; // ExternalMessaging };
  connection: Connection;
  connected: boolean;
  states: HassEntities;
  entities: { [id: string]: any }; // EntityRegistryDisplayEntry };
  devices: { [id: string]: any }; // DeviceRegistryEntry };
  areas: { [id: string]: any }; // AreaRegistryEntry };
  floors: { [id: string]: any }; // FloorRegistryEntry };
  services: HassServices;
  config: HassConfig;
  themes: any; // Themes;
  selectedTheme: any; // ThemeSettings | null;
  panels: any; // Panels;
  panelUrl: string;
  // i18n
  // current effective language in that order:
  //   - backend saved user selected language
  //   - language in local app storage
  //   - browser language
  //   - english (en)
  language: string;
  // local stored language, keep that name for backward compatibility
  selectedLanguage: string | null;
  locale: any; // FrontendLocaleData;
  resources: any; // Resources;
  localize: any; // LocalizeFunc;
  translationMetadata: any; // TranslationMetadata;
  suspendWhenHidden: boolean;
  enableShortcuts: boolean;
  vibrate: boolean;
  debugConnection: boolean;
  dockedSidebar: "docked" | "always_hidden" | "auto";
  defaultPanel: string;
  moreInfoEntityId: string | null;
  user?: any; // CurrentUser;
  userData?: any; // CoreFrontendUserData | null;
  hassUrl(path?): string;
  callService(
    domain: ServiceCallRequest["domain"],
    service: ServiceCallRequest["service"],
    serviceData?: ServiceCallRequest["serviceData"],
    target?: ServiceCallRequest["target"],
    notifyOnError?: boolean,
    returnResponse?: boolean
  ): Promise<ServiceCallResponse>;
  callApi<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    parameters?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T>;
  callApiRaw( // introduced in 2024.11
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    parameters?: Record<string, any>,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<Response>;
  fetchWithAuth(path: string, init?: Record<string, any>): Promise<Response>;
  sendWS(msg: MessageBase): void;
  callWS<T>(msg: MessageBase): Promise<T>;
//  loadBackendTranslation(
//    category: Parameters<typeof getHassTranslations>[2],
//    integrations?: Parameters<typeof getHassTranslations>[3],
//    configFlow?: Parameters<typeof getHassTranslations>[4]
//  ): Promise<LocalizeFunc>;
//  loadFragmentTranslation(fragment: string): Promise<LocalizeFunc | undefined>;
//  formatEntityState(stateObj: HassEntity, state?: string): string;
//  formatEntityAttributeValue(
//    stateObj: HassEntity,
//    attribute: string,
//    value?: any
//  ): string;
//  formatEntityAttributeName(stateObj: HassEntity, attribute: string): string;
}
