// debug logging.
//import Debug from 'debug/src/browser.js';
//import { DEBUG_APP_NAME } from '../../constants';
//const debuglog = Debug(DEBUG_APP_NAME + ":ha-utils");

// our imports.
import { EntityRegistryDisplayEntry } from './entity-registry-entry';
import { HomeAssistant } from './home-assistant';
import { HassEntity } from 'home-assistant-js-websocket/dist/types';


/**
 * Searches `hass.entities` for matching entries by `entity_id` value.
 * 
 * @param hass HomeAssistant object.
 * @param entity_id Entity id to search for (e.g. "media_player.office").
 * @returns Matching EntityRegistryDisplayEntry entry if match was found; otherwise, null.
 */
export function getEntityRegistryDisplayEntry_ByEntityId(
  hass: HomeAssistant,
  entity_id: string,
): EntityRegistryDisplayEntry | null {

  let result: EntityRegistryDisplayEntry | null = null;

  // does entity id exist in hass entities data?
  const hassEntitys = Object.values(hass.entities)
    .filter((ent) => ent.entity_id.match(entity_id));

  //if (debuglog.enabled) {
  //  debuglog("%cgetEntityRegistryDisplayEntry_ByEntityId - entity matches for entity_id %s:\n%s",
  //    "color:gold",
  //    JSON.stringify(entity_id),
  //    JSON.stringify(hassEntitys, null, 2),
  //  );
  //}

  // if no matches, then return null.
  if (!hassEntitys) {
    return result;
  }

  // if found, then return first EXACT match; if no EXACT matches, then return null.
  const entity_id_compare = entity_id.toLowerCase();
  hassEntitys.forEach(item => {
    const haEntity = item as EntityRegistryDisplayEntry;
    if (haEntity.entity_id.toLowerCase() == entity_id_compare) {
      result = haEntity;
    }
  });

  //if (debuglog.enabled) {
  //  debuglog("%cgetEntityRegistryDisplayEntry_ByEntityId - entity EXACT matches for entity_id %s:\n%s",
  //    "color:gold",
  //    JSON.stringify(entity_id),
  //    JSON.stringify(result, null, 2),
  //  );
  //}

  return result;

}


/**
 * Searches `hass.entities` for matching entries by `platform` value.
 * 
 * @param hass HomeAssistant object.
 * @param platform Platform id to search for (e.g. "soundtouchplus").
 * @returns Matching EntityRegistryDisplayEntry entrys if matches were found; otherwise, null.
 */
export function getEntityRegistryDisplayEntry_ByPlatform(
  hass: HomeAssistant,
  platform: string,
): EntityRegistryDisplayEntry | null {

  let result: EntityRegistryDisplayEntry | null = null;

  // does platform exist in hass entities data?
  const hassEntitys = Object.values(hass.entities)
    .filter((ent) => ent.platform?.match(platform));

  //if (debuglog.enabled) {
  //  debuglog("%cgetEntityRegistryDisplayEntry_ByPlatform - entity matches for platform = %s:\n%s",
  //    "color:gold",
  //    JSON.stringify(platform),
  //    JSON.stringify(hassEntitys, null, 2),
  //  );
  //}

  // if no matches, then return null.
  if (!hassEntitys) {
    return result;
  }

  // if found, then return first EXACT match; if no EXACT matches, then return null.
  const platform_compare = platform.toLowerCase();
  hassEntitys.forEach(item => {
    const haEntity = item as EntityRegistryDisplayEntry;
    if (haEntity.platform?.toLowerCase() == platform_compare) {
      result = haEntity;
    }
  });

  //if (debuglog.enabled) {
  //  debuglog("%cgetEntityRegistryDisplayEntry_ByPlatform - entity EXACT matches for platform %s:\n%s",
  //    "color:gold",
  //    JSON.stringify(platform),
  //    JSON.stringify(result, null, 2),
  //  );
  //}

  return result;

}


/**
 * Searches `hass.states` for matching entries by `entity_id` value.
 * 
 * @param hass HomeAssistant object.
 * @param entity_id Entity id to search for (e.g. "media_player.office").
 * @returns Matching HassEntity object if match was found; otherwise, null.
 */
export function getHassEntityState_ByEntityId(
  hass: HomeAssistant,
  entity_id: string,
): HassEntity | null {

  let result: HassEntity | null = null;

  // does entity id exist in hass states data?
  const hassStates = Object.values(hass.states)
    .filter((ent) => ent.entity_id.match(entity_id));

  //if (debuglog.enabled) {
  //  debuglog("%cgetHassEntityState_ByEntityId - state matches for entity_id %s:\n%s",
  //    "color:gold",
  //    JSON.stringify(entity_id),
  //    JSON.stringify(hassStates, null, 2),
  //  );
  //}

  // if no matches, then return null.
  if (!hassStates) {
    return result;
  }

  // if found, then return first EXACT match; if no EXACT matches, then return null.
  const entity_id_compare = entity_id.toLowerCase();
  hassStates.forEach(item => {
    const haEntity = item as HassEntity;
    if (haEntity.entity_id.toLowerCase() == entity_id_compare) {
      result = haEntity;
    }
  });

  //if (debuglog.enabled) {
  //  debuglog("%cgetHassEntityState_ByEntityId - state EXACT match for entity_id %s:\n%s",
  //    "color:gold",
  //    JSON.stringify(entity_id),
  //    JSON.stringify(result, null, 2),
  //  );
  //}

  return result;

}