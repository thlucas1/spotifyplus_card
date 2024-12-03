import { HomeAssistant } from '../types/home-assistant-frontend/home-assistant';
import type { Connection } from "home-assistant-js-websocket";

//import { LovelaceBadgeConfig } from "../../../data/lovelace/config/badge";
//import { LovelaceCardConfig } from "../../../data/lovelace/config/card";
//import {
//  LovelaceSectionRawConfig,
//  isStrategySection,
//} from "../../../data/lovelace/config/section";
//import { LovelaceConfig } from "../../../data/lovelace/config/types";
//import {
//  LovelaceViewRawConfig,
//  isStrategyView,
//} from "../../../data/lovelace/config/view";


//export const addCards = (
//  config: LovelaceConfig,
//  path: LovelaceContainerPath,
//  cardConfigs: LovelaceCardConfig[]
//): LovelaceConfig => {
//  const cards = findLovelaceItems("cards", config, path);
//  const newCards = cards ? [...cards, ...cardConfigs] : [...cardConfigs];
//  const newConfig = updateLovelaceItems("cards", config, path, newCards);
//  return newConfig;
//};

export const replaceCard = (
  config: LovelaceConfig,
  path: LovelaceCardPath,
  cardConfig: LovelaceCardConfig
): LovelaceConfig => {
  const { cardIndex } = parseLovelaceCardPath(path);
  const containerPath = getLovelaceContainerPath(path);

  const cards = findLovelaceItems("cards", config, containerPath);

  const newCards = (cards ?? []).map((origConf, ind) =>
    ind === cardIndex ? cardConfig : origConf
  );

  const newConfig = updateLovelaceItems(
    "cards",
    config,
    containerPath,
    newCards
  );
  return newConfig;
};






export interface Lovelace {
  config: LovelaceConfig;
  rawConfig: LovelaceRawConfig;
  editMode: boolean;
  urlPath: string | null;
  mode: "generated" | "yaml" | "storage";
  locale: any;
  enableFullEditMode: () => void;
  setEditMode: (editMode: boolean) => void;
  saveConfig: (newConfig: LovelaceRawConfig) => Promise<void>;
  deleteConfig: () => Promise<void>;
  showToast: (params: any) => void;
}

export function getLovelace(): Lovelace | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // dump property keys of HUI-ROOT:
    //for (const key of Object.keys(root)) {
    //  //console.log("root property key: " + key + " = " + root[key]);
    //}
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


export type LovelaceCardPath = [number, number] | [number, number, number];
export type LovelaceContainerPath = [number] | [number, number];

export const parseLovelaceCardPath = (
  path: LovelaceCardPath
): { viewIndex: number; sectionIndex?: number; cardIndex: number } => {
  if (path.length === 2) {
    return {
      viewIndex: path[0],
      cardIndex: path[1],
    };
  }
  return {
    viewIndex: path[0],
    sectionIndex: path[1],
    cardIndex: path[2],
  };
};

export const parseLovelaceContainerPath = (
  path: LovelaceContainerPath
): { viewIndex: number; sectionIndex?: number } => {
  if (path.length === 1) {
    return {
      viewIndex: path[0],
    };
  }
  return {
    viewIndex: path[0],
    sectionIndex: path[1],
  };
};

export const getLovelaceContainerPath = (
  path: LovelaceCardPath
): LovelaceContainerPath => path.slice(0, -1) as LovelaceContainerPath;


type LovelaceItemKeys = {
  cards: LovelaceCardConfig[];
  badges: (Partial<LovelaceBadgeConfig> | string)[];
};

export const updateLovelaceItems = <T extends keyof LovelaceItemKeys>(
  key: T,
  config: LovelaceConfig,
  path: LovelaceContainerPath,
  items: LovelaceItemKeys[T]
): LovelaceConfig => {
  const { viewIndex, sectionIndex } = parseLovelaceContainerPath(path);

  let updated = false;
  const newViews = config.views.map((view, vIndex) => {
    if (vIndex !== viewIndex) return view;
    if (isStrategyView(view)) {
      throw new Error(`Can not update ${key} in a strategy view`);
    }
    if (sectionIndex === undefined) {
      updated = true;
      return {
        ...view,
        [key]: items,
      };
    }

    if (view.sections === undefined) {
      throw new Error("Section does not exist");
    }

    const newSections = view.sections.map((section, sIndex) => {
      if (sIndex !== sectionIndex) return section;
      if (isStrategySection(section)) {
        throw new Error(`Can not update ${key} in a strategy section`);
      }
      updated = true;
      return {
        ...section,
        [key]: items,
      };
    });
    return {
      ...view,
      sections: newSections,
    };
  });

  if (!updated) {
    throw new Error(`Can not update ${key} in a non-existing view/section`);
  }
  return {
    ...config,
    views: newViews,
  };
};

export const findLovelaceItems = <T extends keyof LovelaceItemKeys>(
  key: T,
  config: LovelaceConfig,
  path: LovelaceContainerPath
): LovelaceItemKeys[T] | undefined => {
  const { viewIndex, sectionIndex } = parseLovelaceContainerPath(path);

  const view = config.views[viewIndex];

  if (!view) {
    throw new Error("View does not exist");
  }
  if (isStrategyView(view)) {
    throw new Error("Can not find cards in a strategy view");
  }
  if (sectionIndex === undefined) {
    return view[key] as LovelaceItemKeys[T] | undefined;
  }

  const section = view.sections?.[sectionIndex];

  if (!section) {
    throw new Error("Section does not exist");
  }
  if (isStrategySection(section)) {
    throw new Error("Can not find cards in a strategy section");
  }
  if (key === "cards") {
    return section[key as "cards"] as LovelaceItemKeys[T] | undefined;
  }
  throw new Error(`${key} is not supported in section`);
};


// ****************************************************************************************************
// HA view.ts
// ****************************************************************************************************
export interface ShowViewConfig {
  user?: string;
}

interface LovelaceViewBackgroundConfig {
  image?: string;
}

export interface LovelaceBaseViewConfig {
  index?: number;
  title?: string;
  path?: string;
  icon?: string;
  theme?: string;
  panel?: boolean;
  background?: string | LovelaceViewBackgroundConfig;
  visible?: boolean | ShowViewConfig[];
  subview?: boolean;
  back_path?: string;
  // Only used for section view, it should move to a section view config type when the views will have dedicated editor.
  max_columns?: number;
  dense_section_placement?: boolean;
}

export interface LovelaceViewConfig extends LovelaceBaseViewConfig {
  type?: string;
  badges?: (string | Partial<LovelaceBadgeConfig>)[]; // Badge can be just an entity_id or without type
  cards?: LovelaceCardConfig[];
  sections?: LovelaceSectionRawConfig[];
}

export interface LovelaceStrategyViewConfig extends LovelaceBaseViewConfig {
  strategy: LovelaceStrategyConfig;
}

export type LovelaceViewRawConfig =
  | LovelaceViewConfig
  | LovelaceStrategyViewConfig;

export function isStrategyView(
  view: LovelaceViewRawConfig
): view is LovelaceStrategyViewConfig {
  return "strategy" in view;
}


// ****************************************************************************************************
// HA section.ts exports.
// ****************************************************************************************************
export interface LovelaceBaseSectionConfig {
  visibility?: Condition[];
  column_span?: number;
  row_span?: number;
  /**
   * @deprecated Use heading card instead.
   */
  title?: string;
}

export interface LovelaceSectionConfig extends LovelaceBaseSectionConfig {
  type?: string;
  cards?: LovelaceCardConfig[];
}

export interface LovelaceStrategySectionConfig
  extends LovelaceBaseSectionConfig {
  strategy: LovelaceStrategyConfig;
}

export type LovelaceSectionRawConfig =
  | LovelaceSectionConfig
  | LovelaceStrategySectionConfig;

export function isStrategySection(
  section: LovelaceSectionRawConfig
): section is LovelaceStrategySectionConfig {
  return "strategy" in section;
}


// ****************************************************************************************************
// HA strategy.ts
// ****************************************************************************************************
export interface LovelaceStrategyConfig {
  type: string;
  [key: string]: any;
}


// ****************************************************************************************************
// HA types.ts
// ****************************************************************************************************
export interface LovelaceDashboardBaseConfig { }

export interface LovelaceConfig extends LovelaceDashboardBaseConfig {
  background?: string;
  views: LovelaceViewRawConfig[];
}

export interface LovelaceDashboardStrategyConfig
  extends LovelaceDashboardBaseConfig {
  strategy: LovelaceStrategyConfig;
}

export interface LegacyLovelaceConfig extends LovelaceConfig {
  resources?: LovelaceResource[];
}

export type LovelaceRawConfig =
  | LovelaceConfig
  | LovelaceDashboardStrategyConfig;

export function isStrategyDashboard(
  config: LovelaceRawConfig
): config is LovelaceDashboardStrategyConfig {
  return "strategy" in config;
}

export const fetchConfig = (
  conn: Connection,
  urlPath: string | null,
  force: boolean
): Promise<LovelaceRawConfig> =>
  conn.sendMessagePromise({
    type: "lovelace/config",
    url_path: urlPath,
    force,
  });

export const saveConfig = (
  hass: HomeAssistant,
  urlPath: string | null,
  config: LovelaceRawConfig
): Promise<void> =>
  hass.callWS({
    type: "lovelace/config/save",
    url_path: urlPath,
    config,
  });

export const deleteConfig = (
  hass: HomeAssistant,
  urlPath: string | null
): Promise<void> =>
  hass.callWS({
    type: "lovelace/config/delete",
    url_path: urlPath,
  });


// ****************************************************************************************************
// HA card.ts
// ****************************************************************************************************
export interface LovelaceCardConfig {
  index?: number;
  view_index?: number;
  view_layout?: any;
  layout_options?: LovelaceLayoutOptions;
  type: string;
  [key: string]: any;
  visibility?: Condition[];
}


// ****************************************************************************************************
// HA types.ts
// ****************************************************************************************************
export type LovelaceLayoutOptions = {
  grid_columns?: number | "full";
  grid_rows?: number | "auto";
  grid_max_columns?: number;
  grid_min_columns?: number;
  grid_min_rows?: number;
  grid_max_rows?: number;
};


// ****************************************************************************************************
// HA badge.ts
// ****************************************************************************************************
export interface LovelaceBadgeConfig {
  type: string;
  [key: string]: any;
  visibility?: Condition[];
}

export const ensureBadgeConfig = (
  config: Partial<LovelaceBadgeConfig> | string
): LovelaceBadgeConfig => {
  if (typeof config === "string") {
    return {
      type: "entity",
      entity: config,
      show_name: true,
    };
  }
  if ("type" in config && config.type) {
    return config as LovelaceBadgeConfig;
  }
  return {
    type: "entity",
    ...config,
  };
};


// ****************************************************************************************************
// HA validate-condition.ts
// ****************************************************************************************************
export type Condition =
  | NumericStateCondition
  | StateCondition
  | ScreenCondition
  | UserCondition
  | OrCondition
  | AndCondition;

// Legacy conditional card condition
export interface LegacyCondition {
  entity?: string;
  state?: string | string[];
  state_not?: string | string[];
}

interface BaseCondition {
  condition: string;
}

export interface NumericStateCondition extends BaseCondition {
  condition: "numeric_state";
  entity?: string;
  below?: string | number;
  above?: string | number;
}

export interface StateCondition extends BaseCondition {
  condition: "state";
  entity?: string;
  state?: string | string[];
  state_not?: string | string[];
}

export interface ScreenCondition extends BaseCondition {
  condition: "screen";
  media_query?: string;
}

export interface UserCondition extends BaseCondition {
  condition: "user";
  users?: string[];
}

export interface OrCondition extends BaseCondition {
  condition: "or";
  conditions?: Condition[];
}

export interface AndCondition extends BaseCondition {
  condition: "and";
  conditions?: Condition[];
}


// ****************************************************************************************************
// HA resource.ts
// ****************************************************************************************************
export type LovelaceResource = {
  id: string;
  type: "css" | "js" | "module" | "html";
  url: string;
};

export type LovelaceResourcesMutableParams = {
  res_type: LovelaceResource["type"];
  url: string;
};

export const fetchResources = (conn: Connection): Promise<LovelaceResource[]> =>
  conn.sendMessagePromise({
    type: "lovelace/resources",
  });

export const createResource = (
  hass: HomeAssistant,
  values: LovelaceResourcesMutableParams
) =>
  hass.callWS<LovelaceResource>({
    type: "lovelace/resources/create",
    ...values,
  });

export const updateResource = (
  hass: HomeAssistant,
  id: string,
  updates: Partial<LovelaceResourcesMutableParams>
) =>
  hass.callWS<LovelaceResource>({
    type: "lovelace/resources/update",
    resource_id: id,
    ...updates,
  });

export const deleteResource = (hass: HomeAssistant, id: string) =>
  hass.callWS({
    type: "lovelace/resources/delete",
    resource_id: id,
});
