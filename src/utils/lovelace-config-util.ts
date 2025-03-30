/* eslint-disable @typescript-eslint/no-explicit-any */

// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":lovelace-config-utils");

// lovelace card imports.
import deepClone from "deep-clone-simple";

// our imports.
import { getConfigAreaForSection, getHomeAssistantErrorMessage } from './utils';
import { Store } from '../model/store';
import { Section } from '../types/section';


// ****************************************************************************************************
// HA types.ts (/src/panels/lovelace)
// ****************************************************************************************************
export interface Lovelace {
  config: any; // LovelaceConfig;
  rawConfig: any; // LovelaceRawConfig;
  editMode: boolean;
  urlPath: string | null;
  mode: "generated" | "yaml" | "storage";
  locale: any;
  enableFullEditMode: () => void;
  setEditMode: (editMode: boolean) => void;
  saveConfig: (newConfig: any) => Promise<void>; // LovelaceRawConfig) => Promise<void>;
  deleteConfig: () => Promise<void>;
  showToast: (params: any) => void;
}

// ****************************************************************************************************
// HA card.ts (/src/data/lovelace/config)
// ****************************************************************************************************
export interface LovelaceCardConfig {
  index?: number;
  view_index?: number;
  view_layout?: any;
  layout_options?: any; // LovelaceLayoutOptions;
  type: string;
  [key: string]: any;
  visibility?: any[]; // Condition[];
}


export function getLovelace(): Lovelace | null {
  let root: any = document.querySelector('home-assistant');
  root = root && root.shadowRoot;
  root = root && root.querySelector('home-assistant-main');
  root = root && root.shadowRoot;
  root = root && root.querySelector('app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver');
  root = (root && root.shadowRoot) || root;
  root = root && root.querySelector('ha-panel-lovelace');
  root = root && root.shadowRoot;
  root = root && root.querySelector('hui-root');
  if (root) {
    const ll = root.lovelace;
    //if (!ll) {
    //  //console.log("%cLL root.lovelace not found - getting root.__lovelace", "color:red");
    //  ll = root.__lovelace;
    //}
    //if (!ll) {
    //  //console.log("%cLL root.lovelace not found - getting root[__lovelace]", "color:red");
    //  ll = root["__lovelace"];
    //}
    //console.log("%cLL 06 = %s", "color:red", ll)
    ll.current_view = root.___curView;
    return ll;
  }
  return null;
}


//export const getLovelace = () => {
//  // eslint-disable-next-line @typescript-eslint/no-explicit-any
//  let root: any = document.querySelector('home-assistant');
//  root = root && root.shadowRoot;
//  root = root && root.querySelector('home-assistant-main');
//  root = root && root.shadowRoot;
//  root = root && root.querySelector('app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver');
//  root = (root && root.shadowRoot) || root;
//  root = root && root.querySelector('ha-panel-lovelace');
//  root = root && root.shadowRoot;
//  root = root && root.querySelector('hui-root');
//  if (root) {
//    const ll = root.lovelace;
//    ll.current_view = root.___curView;
//    return ll;
//  }
//  return null;
//}


/**
 * Searches for a uniquely identified LovelaceCardConfig object contained within a 
 * LovelaceRawConfig object and (if found) replaces the LovelaceCardConfig object
 * with a specified LovelaceCardConfig object.
 * 
 * @param obj LovelaceRawConfig object that will be updated.
 * @param key Key name to search for in the LovelaceRawConfig object (usually "cardUniqueId").
 * @param targetValue Key value to search for in the LovelaceRawConfig object that identifies the specific card configuration to update.
 * @param newConfig LovelaceCardConfig object that will replace the found card configuration with.
 * @returns A LovelaceRawConfig object that can be passed to a lovelace.saveConfig method.
 * 
 */
export function replaceCardConfigByUniqueId(
  obj: any,
  key: keyof any,
  targetValue: any,
  newConfig: LovelaceCardConfig
): any {

  // is this an object? if not, then just return it as-is.
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // does object have the key we are looking for?
  // if so, then just return the object that will replace it.
  if (obj.hasOwnProperty("type") && obj["type"] === newConfig.type) {
    if (obj.hasOwnProperty(key) && obj[key] === targetValue) {
      return newConfig;
    }
  }

  // if not, then deep clone the object so that we don't modify any existing references.
  const clonedObj = deepClone(obj);

  // check for replacement in any child objects.
  for (const k in obj) {
    if (obj.hasOwnProperty(k)) {
      clonedObj[k] = replaceCardConfigByUniqueId(obj[k], key, targetValue, newConfig);
    }
  }

  // return the new configuration object.
  return clonedObj;
}


/**
 * Saves an updated LovelaceCardConfig object to permanent storage.
 * 
 * The specified config object must have a `cardUniqueId` key that contains a value that
 * uniquely identifies the card in the LovelaceRawConfig object.  An error is raised if
 * the config object does not contain a `cardUniqueId` key.
 * 
 * @param config LovelaceCardConfig object that will be updated.
 */
export async function updateCardConfigurationStorage(
  config: LovelaceCardConfig,
): Promise<void> {

  try {

    if (debuglog.enabled) {
      debuglog("%cupdateCardConfigurationStorage - updating Lovelace Card Configuration storage\n- cardUniqueId = %s\n- card configuration object:\n%s",
        "color: white",
        JSON.stringify(config.cardUniqueId),
        JSON.stringify(config, null, 2),
      );
    }

    // ensure cardUniqueId option is set; if not, then don't bother!
    if (!config.cardUniqueId) {
      throw new Error("Card Configuration does not have a cardUniqueId option value; this value is required in order to update the card programatically outside of the card editor UI.");
    }

    // get the HA lovelace object reference; if we can't then don't bother!
    const lovelace = getLovelace();
    if (!lovelace) {
      throw new Error("Could not get HA lovelace object reference; please notify the card developer of this error.");
    }

    //console.log("%cupdateCardConfigurationStorage - getLovelace returned Lovelace object:\n- editMode = %s\n- mode = %s\n- locale = %s\n- urlPath = %s",
    //  "color: gold",
    //  JSON.stringify(lovelace.editMode),
    //  JSON.stringify(lovelace.mode),
    //  JSON.stringify(lovelace.locale),
    //  JSON.stringify(lovelace.urlPath),
    //);

    if (debuglog.enabled) {
      debuglog("%cupdateCardConfigurationStorage - Lovelace.rawConfig object BEFORE replace:\n%s",
        "color: orange",
        JSON.stringify(lovelace.rawConfig, null, 2),
      );
      debuglog("%cupdateCardConfigurationStorage - card configuration that contains cardUniqueId = %s will be replaced",
        "color: gold",
        JSON.stringify(config.cardUniqueId),
      );
    }

    // replace card configuration (by UniqueId) embedded in the lovelace rawConfig object.
    const rawConfigUpdated = replaceCardConfigByUniqueId(lovelace.rawConfig, "cardUniqueId", config.cardUniqueId, config);

    if (debuglog.enabled) {
      debuglog("%cupdateCardConfigurationStorage - Lovelace.rawConfig object AFTER replace:\n%s",
        "color: gold",
        JSON.stringify(rawConfigUpdated, null, 2),
      );
      debuglog("%cupdateCardConfigurationStorage - Saving Lovelace raw configuration to storage",
        "color: white",
      );
    }

    // save Lovelace raw configuration to storage.
    lovelace.saveConfig(rawConfigUpdated);

    if (debuglog.enabled) {
      debuglog("%cupdateCardConfigurationStorage - Lovelace raw configuration saved to storage",
        "color: white",
      );
    }

    // select user presets browser.
    Store.selectedConfigArea = getConfigAreaForSection(Section.USERPRESETS);

    // note - it appears that the lovelace.saveConfig does the following for us:
    // build config-changed event arguments and dispatch the event.
    //console.log("playlist-actions - building config-changed event arguments");
    //const configChangedArgs = new CustomEvent("config-changed", {
    //  detail: this.store.config,
    //  bubbles: true,
    //  composed: true,
    //});
    //console.log("playlist-actions - firing config-changed event");
    //this.store.card.dispatchEvent(configChangedArgs);
    //console.log("playlist-actions - config-changed event fired ok");

  }
  catch (error) {

    // get error message.
    const errMsg = getHomeAssistantErrorMessage(error)

    if (debuglog.enabled) {
      debuglog("%cupdateCardConfigurationStorage - Configuration update failed:\n%s",
        "color: red",
        JSON.stringify(errMsg)
      );
    }

    // raise formatted exception.
    throw new Error("Configuration update failed: " + errMsg);

  }

}

//export type LovelaceCardPath = [number, number] | [number, number, number];
//export type LovelaceContainerPath = [number] | [number, number];

//export const parseLovelaceCardPath = (
//  path: LovelaceCardPath
//): { viewIndex: number; sectionIndex?: number; cardIndex: number } => {
//  if (path.length === 2) {
//    return {
//      viewIndex: path[0],
//      cardIndex: path[1],
//    };
//  }
//  return {
//    viewIndex: path[0],
//    sectionIndex: path[1],
//    cardIndex: path[2],
//  };
//};

//export const parseLovelaceContainerPath = (
//  path: LovelaceContainerPath
//): { viewIndex: number; sectionIndex?: number } => {
//  if (path.length === 1) {
//    return {
//      viewIndex: path[0],
//    };
//  }
//  return {
//    viewIndex: path[0],
//    sectionIndex: path[1],
//  };
//};

//export const getLovelaceContainerPath = (
//  path: LovelaceCardPath
//): LovelaceContainerPath => path.slice(0, -1) as LovelaceContainerPath;


//type LovelaceItemKeys = {
//  cards: LovelaceCardConfig[];
//  badges: (Partial<LovelaceBadgeConfig> | string)[];
//};

//export const updateLovelaceItems = <T extends keyof LovelaceItemKeys>(
//  key: T,
//  config: LovelaceConfig,
//  path: LovelaceContainerPath,
//  items: LovelaceItemKeys[T]
//): LovelaceConfig => {
//  const { viewIndex, sectionIndex } = parseLovelaceContainerPath(path);

//  let updated = false;
//  const newViews = config.views.map((view, vIndex) => {
//    if (vIndex !== viewIndex) return view;
//    if (isStrategyView(view)) {
//      throw new Error(`Can not update ${key} in a strategy view`);
//    }
//    if (sectionIndex === undefined) {
//      updated = true;
//      return {
//        ...view,
//        [key]: items,
//      };
//    }

//    if (view.sections === undefined) {
//      throw new Error("Section does not exist");
//    }

//    const newSections = view.sections.map((section, sIndex) => {
//      if (sIndex !== sectionIndex) return section;
//      if (isStrategySection(section)) {
//        throw new Error(`Can not update ${key} in a strategy section`);
//      }
//      updated = true;
//      return {
//        ...section,
//        [key]: items,
//      };
//    });
//    return {
//      ...view,
//      sections: newSections,
//    };
//  });

//  if (!updated) {
//    throw new Error(`Can not update ${key} in a non-existing view/section`);
//  }
//  return {
//    ...config,
//    views: newViews,
//  };
//};

//export const findLovelaceItems = <T extends keyof LovelaceItemKeys>(
//  key: T,
//  config: LovelaceConfig,
//  path: LovelaceContainerPath
//): LovelaceItemKeys[T] | undefined => {
//  const { viewIndex, sectionIndex } = parseLovelaceContainerPath(path);

//  const view = config.views[viewIndex];

//  if (!view) {
//    throw new Error("View does not exist");
//  }
//  if (isStrategyView(view)) {
//    throw new Error("Can not find cards in a strategy view");
//  }
//  if (sectionIndex === undefined) {
//    return view[key] as LovelaceItemKeys[T] | undefined;
//  }

//  const section = view.sections?.[sectionIndex];

//  if (!section) {
//    throw new Error("Section does not exist");
//  }
//  if (isStrategySection(section)) {
//    throw new Error("Can not find cards in a strategy section");
//  }
//  if (key === "cards") {
//    return section[key as "cards"] as LovelaceItemKeys[T] | undefined;
//  }
//  throw new Error(`${key} is not supported in section`);
//};


// ****************************************************************************************************
// HA view.ts
// ****************************************************************************************************
//export interface ShowViewConfig {
//  user?: string;
//}

//interface LovelaceViewBackgroundConfig {
//  image?: string;
//}

//export interface LovelaceBaseViewConfig {
//  index?: number;
//  title?: string;
//  path?: string;
//  icon?: string;
//  theme?: string;
//  panel?: boolean;
//  background?: string | LovelaceViewBackgroundConfig;
//  visible?: boolean | ShowViewConfig[];
//  subview?: boolean;
//  back_path?: string;
//  // Only used for section view, it should move to a section view config type when the views will have dedicated editor.
//  max_columns?: number;
//  dense_section_placement?: boolean;
//}

//export interface LovelaceViewConfig extends LovelaceBaseViewConfig {
//  type?: string;
//  badges?: (string | Partial<LovelaceBadgeConfig>)[]; // Badge can be just an entity_id or without type
//  cards?: LovelaceCardConfig[];
//  sections?: LovelaceSectionRawConfig[];
//}

//export interface LovelaceStrategyViewConfig extends LovelaceBaseViewConfig {
//  strategy: LovelaceStrategyConfig;
//}

//export type LovelaceViewRawConfig =
//  | LovelaceViewConfig
//  | LovelaceStrategyViewConfig;

//export function isStrategyView(
//  view: LovelaceViewRawConfig
//): view is LovelaceStrategyViewConfig {
//  return "strategy" in view;
//}


// ****************************************************************************************************
// HA section.ts exports.
// ****************************************************************************************************
//export interface LovelaceBaseSectionConfig {
//  visibility?: Condition[];
//  column_span?: number;
//  row_span?: number;
//  /**
//   * @deprecated Use heading card instead.
//   */
//  title?: string;
//}

//export interface LovelaceSectionConfig extends LovelaceBaseSectionConfig {
//  type?: string;
//  cards?: LovelaceCardConfig[];
//}

//export interface LovelaceStrategySectionConfig
//  extends LovelaceBaseSectionConfig {
//  strategy: LovelaceStrategyConfig;
//}

//export type LovelaceSectionRawConfig =
//  | LovelaceSectionConfig
//  | LovelaceStrategySectionConfig;

//export function isStrategySection(
//  section: LovelaceSectionRawConfig
//): section is LovelaceStrategySectionConfig {
//  return "strategy" in section;
//}


// ****************************************************************************************************
// HA strategy.ts
// ****************************************************************************************************
//export interface LovelaceStrategyConfig {
//  type: string;
//  [key: string]: any;
//}


// ****************************************************************************************************
// HA types.ts
// ****************************************************************************************************
//export interface LovelaceDashboardBaseConfig { }

//export interface LovelaceConfig extends LovelaceDashboardBaseConfig {
//  background?: string;
//  views: LovelaceViewRawConfig[];
//}

//export interface LovelaceDashboardStrategyConfig
//  extends LovelaceDashboardBaseConfig {
//  strategy: LovelaceStrategyConfig;
//}

//export interface LegacyLovelaceConfig extends LovelaceConfig {
//  resources?: LovelaceResource[];
//}

//export type LovelaceRawConfig =
//  | LovelaceConfig
//  | LovelaceDashboardStrategyConfig;

//export function isStrategyDashboard(
//  config: LovelaceRawConfig
//): config is LovelaceDashboardStrategyConfig {
//  return "strategy" in config;
//}

//export const fetchConfig = (
//  conn: Connection,
//  urlPath: string | null,
//  force: boolean
//): Promise<LovelaceRawConfig> =>
//  conn.sendMessagePromise({
//    type: "lovelace/config",
//    url_path: urlPath,
//    force,
//  });

//export const saveConfig = (
//  hass: HomeAssistant,
//  urlPath: string | null,
//  config: LovelaceRawConfig
//): Promise<void> =>
//  hass.callWS({
//    type: "lovelace/config/save",
//    url_path: urlPath,
//    config,
//  });

//export const deleteConfig = (
//  hass: HomeAssistant,
//  urlPath: string | null
//): Promise<void> =>
//  hass.callWS({
//    type: "lovelace/config/delete",
//    url_path: urlPath,
//  });


// ****************************************************************************************************
// HA types.ts
// ****************************************************************************************************
//export type LovelaceLayoutOptions = {
//  grid_columns?: number | "full";
//  grid_rows?: number | "auto";
//  grid_max_columns?: number;
//  grid_min_columns?: number;
//  grid_min_rows?: number;
//  grid_max_rows?: number;
//};


// ****************************************************************************************************
// HA badge.ts
// ****************************************************************************************************
//export interface LovelaceBadgeConfig {
//  type: string;
//  [key: string]: any;
//  visibility?: Condition[];
//}

//export const ensureBadgeConfig = (
//  config: Partial<LovelaceBadgeConfig> | string
//): LovelaceBadgeConfig => {
//  if (typeof config === "string") {
//    return {
//      type: "entity",
//      entity: config,
//      show_name: true,
//    };
//  }
//  if ("type" in config && config.type) {
//    return config as LovelaceBadgeConfig;
//  }
//  return {
//    type: "entity",
//    ...config,
//  };
//};


// ****************************************************************************************************
// HA validate-condition.ts
// ****************************************************************************************************
//export type Condition =
//  | NumericStateCondition
//  | StateCondition
//  | ScreenCondition
//  | UserCondition
//  | OrCondition
//  | AndCondition;

//// Legacy conditional card condition
//export interface LegacyCondition {
//  entity?: string;
//  state?: string | string[];
//  state_not?: string | string[];
//}

//interface BaseCondition {
//  condition: string;
//}

//export interface NumericStateCondition extends BaseCondition {
//  condition: "numeric_state";
//  entity?: string;
//  below?: string | number;
//  above?: string | number;
//}

//export interface StateCondition extends BaseCondition {
//  condition: "state";
//  entity?: string;
//  state?: string | string[];
//  state_not?: string | string[];
//}

//export interface ScreenCondition extends BaseCondition {
//  condition: "screen";
//  media_query?: string;
//}

//export interface UserCondition extends BaseCondition {
//  condition: "user";
//  users?: string[];
//}

//export interface OrCondition extends BaseCondition {
//  condition: "or";
//  conditions?: Condition[];
//}

//export interface AndCondition extends BaseCondition {
//  condition: "and";
//  conditions?: Condition[];
//}


//// ****************************************************************************************************
//// HA resource.ts
//// ****************************************************************************************************
//export type LovelaceResource = {
//  id: string;
//  type: "css" | "js" | "module" | "html";
//  url: string;
//};

//export type LovelaceResourcesMutableParams = {
//  res_type: LovelaceResource["type"];
//  url: string;
//};

//export const fetchResources = (conn: Connection): Promise<LovelaceResource[]> =>
//  conn.sendMessagePromise({
//    type: "lovelace/resources",
//  });

//export const createResource = (
//  hass: HomeAssistant,
//  values: LovelaceResourcesMutableParams
//) =>
//  hass.callWS<LovelaceResource>({
//    type: "lovelace/resources/create",
//    ...values,
//  });

//export const updateResource = (
//  hass: HomeAssistant,
//  id: string,
//  updates: Partial<LovelaceResourcesMutableParams>
//) =>
//  hass.callWS<LovelaceResource>({
//    type: "lovelace/resources/update",
//    resource_id: id,
//    ...updates,
//  });

//export const deleteResource = (hass: HomeAssistant, id: string) =>
//  hass.callWS({
//    type: "lovelace/resources/delete",
//    resource_id: id,
//});

