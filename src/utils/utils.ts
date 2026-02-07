// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":utils");

// our imports.
import { CardConfig } from '../types/card-config';
import { ConfigArea } from '../types/config-area';
import { Section } from '../types/section';
import copy from 'copy-text-to-clipboard';


export function cardDoesNotContainAllSections(config: CardConfig) {
  return config.sections && config.sections.length < Object.keys(Section).length;
}


/**
 * Defines a custom event type and it's details.
 */
export function customEvent(type: string, detail?: unknown) {
  return new CustomEvent(type, {
    bubbles: true,
    composed: true,
    detail,
  });
}


export function dispatch(type: string, detail?: unknown) {
  const event = customEvent(type, detail);
  document.dispatchEvent(event);
}


/**
 * Unescapes html that has been stored in an escaped format.
 * 
 * @param escapedHtml Escaped html value.
 * @returns A string with the unescaped html.
 */
export function unescapeHtml(escapedHtml: string): string {

  if (escapedHtml) {
    return escapedHtml.replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'");
  } else {
    return "";
  }

}


/**
 * Return POSIX utc timestamp (e.g. the number of seconds since the utc epoch date).
 * 
 * This is the equivalent of the Python `datetime.utcnow().timestamp()` function.
 * 
 * @returns number of milliseconds between current UTC time and midnight of January 1, 1970.
 */
export function getUtcNowTimestamp(): number {

  const tmLoc = new Date();
  const tmDiffMS = tmLoc.getTime() + (tmLoc.getTimezoneOffset() * 60000);  // offset is in minutes; convert it to milliseconds.
  return (tmDiffMS / 1000);   // convert milliseconds to seconds.

}


/**
 * Converts a UTC datetime object to local datetime object.
 * 
 * @param date A UTC datetime object to convert.
 * @returns A local datetime object.
 */
export function convertUTCDateToLocalDate(date): Date {

  const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  const offset = date.getTimezoneOffset() / 60;
  const hours = date.getHours();
  newDate.setHours(hours - offset);
  return newDate;
}


/**
 * Formats an epoch date to a date locale string.
 * 
 * The date is converted by a call to the `Date.toLocaleString()` method.
 * 
 * @param epochSeconds Epoch date to format (e.g. number of seconds since 01/01/1970.
 * @returns A string with the formatted date.
 */
export function formatDateEpochSecondsToLocaleString(epochSeconds: number | undefined): string | undefined {

  // if epoch date not specified then don't bother.
  if (!epochSeconds)
    return undefined

  // convert epoch number of seconds to epoch number of milliseconds (for JavaScript Date function).
  const epochMS = (epochSeconds || 0) * 1000;
  const epochMSDate = new Date(epochMS);
  const localeDate = convertUTCDateToLocalDate(epochMSDate);
  const localeDateString = localeDate.toLocaleString();
  //const localeDateString = epochMSDate.toLocaleString();
  return localeDateString
}


/**
 * Formats a milliseconds value to "HH:MM:SS" value.
 * 
 * @param ms Milliseconds to format.
 * @returns Minutes and seconds portion of the timestamp if hours is "00:"; otherwise, return the hours, minutes, and seconds portion of the timestamp.
 */
export function formatDateHHMMSSFromMilliseconds(ms: number) {

  // create a timestamp from specified milliseconds value.
  const date = new Date(ms).toISOString().substring(11, 19);

  // return the minutes and seconds portion of the timestamp if hours is "00:";
  // otherwise, return the hours, minutes, and seconds portion of the timestamp.
  return date.startsWith('00:') ? date.substring(3) : date;

}


/**
* Converts a string value to proper case.
* 
* @param str String to convert to propercase (e.g. "hello world").
* @returns A properly cased string value (e.g. "Hello World").
*/
export function formatStringProperCase(str: string): string {

  let upper = true;
  let newStr = "";
  if (!str)
    return newStr;

  for (let i = 0, l = str.length; i < l; i++) {
    if (str[i] == " ") {
      upper = true;
      newStr += " ";
      continue;
    }
    newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase();
    upper = false;
  }

  return newStr;
}


/**
  * Returns a Section value for the supplied ConfigArea.
  * 
  * @param configArea ConfigArea to retrieve the corresponding section value for.
  */
export function getSectionForConfigArea(configArea: ConfigArea) {

  // get section value for supplied ConfigArea value.
  let section = Section.UNDEFINED;
  if (configArea == ConfigArea.ALBUM_FAVORITES) {
    section = Section.ALBUM_FAVORITES;
  } else if (configArea == ConfigArea.ARTIST_FAVORITES) {
    section = Section.ARTIST_FAVORITES;
  } else if (configArea == ConfigArea.AUDIOBOOK_FAVORITES) {
    section = Section.AUDIOBOOK_FAVORITES;
  } else if (configArea == ConfigArea.CATEGORY_BROWSER) {
    section = Section.CATEGORYS;
  } else if (configArea == ConfigArea.DEVICE_BROWSER) {
    section = Section.DEVICES;
  } else if (configArea == ConfigArea.EPISODE_FAVORITES) {
    section = Section.EPISODE_FAVORITES;
  } else if (configArea == ConfigArea.GENERAL) {
    section = Section.PLAYER;
  } else if (configArea == ConfigArea.PLAYER) {
    section = Section.PLAYER;
  } else if (configArea == ConfigArea.PLAYLIST_FAVORITES) {
    section = Section.PLAYLIST_FAVORITES;
  } else if (configArea == ConfigArea.RECENT_BROWSER) {
    section = Section.RECENTS;
  } else if (configArea == ConfigArea.SEARCH_MEDIA_BROWSER) {
    section = Section.SEARCH_MEDIA;
  } else if (configArea == ConfigArea.SHOW_FAVORITES) {
    section = Section.SHOW_FAVORITES;
  } else if (configArea == ConfigArea.TRACK_FAVORITES) {
    section = Section.TRACK_FAVORITES;
  } else if (configArea == ConfigArea.USERPRESET_BROWSER) {
    section = Section.USERPRESETS;
  }

  return section;
}


/**
  * Returns a ConfigArea value for the supplied Section value.
  * 
  * @param configArea Section value to retrieve the corresponding ConfigArea value for.
  */
export function getConfigAreaForSection(section: Section) {

  // get section value for supplied ConfigArea value.
  let configArea = ConfigArea.GENERAL;
  if (section == Section.ALBUM_FAVORITES) {
    configArea = ConfigArea.ALBUM_FAVORITES;
  } else if (section == Section.ARTIST_FAVORITES) {
    configArea = ConfigArea.ARTIST_FAVORITES;
  } else if (section == Section.AUDIOBOOK_FAVORITES) {
    configArea = ConfigArea.AUDIOBOOK_FAVORITES;
  } else if (section == Section.CATEGORYS) {
    configArea = ConfigArea.CATEGORY_BROWSER;
  } else if (section == Section.DEVICES) {
    configArea = ConfigArea.DEVICE_BROWSER;
  } else if (section == Section.EPISODE_FAVORITES) {
    configArea = ConfigArea.EPISODE_FAVORITES;
  } else if (section == Section.PLAYER) {
    configArea = ConfigArea.PLAYER;
  } else if (section == Section.PLAYLIST_FAVORITES) {
    configArea = ConfigArea.PLAYLIST_FAVORITES;
  } else if (section == Section.RECENTS) {
    configArea = ConfigArea.RECENT_BROWSER;
  } else if (section == Section.SEARCH_MEDIA) {
    configArea = ConfigArea.SEARCH_MEDIA_BROWSER;
  } else if (section == Section.SHOW_FAVORITES) {
    configArea = ConfigArea.SHOW_FAVORITES;
  } else if (section == Section.TRACK_FAVORITES) {
    configArea = ConfigArea.TRACK_FAVORITES;
  } else if (section == Section.USERPRESETS) {
    configArea = ConfigArea.USERPRESET_BROWSER;
  }

  return configArea;
}


/**
  * Returns true if the dashboard editor is active;
  * otherwise, false.
  * 
  * HA uses "?edit=1" querystring to denote dashboard is in edit mode.
  */
export function isCardInDashboardEditor() {

  // get current url querystring.
  const queryString = window.location.search;
  const urlParms = new URLSearchParams(queryString);

  // is `edit=1` parameter present?  if so, then the dashboard is in edit mode.
  const urlParmEdit = urlParms.get('edit');
  let result = false;
  if (urlParmEdit == '1') {
    result = true;
  }

  return result;

}


/**
  * Returns true if the card is currently being previewed in the card editor; 
  * otherwise, false.
  * 
  * 2025/03/31 - changed to use the `closestElement` function, which looks for the 
  * the "<HUI-CARD>", with a parent of "<DIV CLASS='element-preview'>"; the older
  * method did not detect the card in edit mode when it was a child card (e.g. part 
  * of a vertical-stack or horizontal-stack card type).
  * 
  * Pre 2025/03/31 detection method:
  * The parentElement structure will look like the following when the MAIN card
  * is in edit preview mode (in the card configuration editor preview pane):
  * 
  * (HA 2024.08.1 release):
  * - parentElement1.tagName='HUI-CARD',   className=undefined
  * - parentElement2.tagName='DIV',        className='element-preview'
  * - parentElement3.tagName='DIV',        className='content'
  * - parentElement4.tagName='HA-DIALOG',  className=undefined
  * 
  * The parentElement structure will look like the following when the EDITOR card
  * is in edit preview mode (in the card configuration editor preview pane):
  * 
  * (HA 2024.08.1 release):
  * - parentElement1.tagName='DIV',        className='gui-editor'
  * - parentElement2.tagName='DIV',        className='wrapper'
  */
export function isCardInEditPreview(cardElement: Element) {

  // get parent element data.
  if (cardElement) {

    // check for "<hui-card>" tag reference;
    const cardHuiObj = closestElement("hui-card", cardElement) as Element;
    if (cardHuiObj) {
      //console.log("isCardInEditPreview - closestElement found \"<hui-card>\" tag; checking for \".element-preview\" class parent");

      // check for "element-preview" class reference;
      // if found, then the card is being edited.
      const cardPreviewObj = closestElement(".element-preview", cardHuiObj) as Element;
      if (cardPreviewObj) {
        //console.log("isCardInEditPreview - closestElement found \".element-preview\" class; card is in edit mode");
        return true;
      } else {
        //console.log("isCardInEditPreview - closestElement did NOT find \".element-preview\" class; card is NOT in edit mode");
        return false;
      }
    } else {
      return false;
    }

  } else {

    //console.log("isCardInEditPreview - cardElement object not supplied; card is NOT in edit mode");
    return false;

  }

  //let parent1Cls: string | undefined = undefined;
  //let parent2Cls: string | undefined = undefined;

    // get parent element data.
    //console.log("isCardInEditPreview - ParentElement tagName info:\n parentElement1: %s = %s\n parentElement2: %s = %s\n parentElement3: %s = %s\n parentElement4: %s = %s\n parentElement5: %s = %s\n parentElement6: %s = %s\n parentElement7: %s = %s",
    //  cardElement.parentElement?.tagName, cardElement.parentElement?.className,
    //  cardElement.parentElement?.parentElement?.tagName, cardElement.parentElement?.parentElement?.className,
    //  cardElement.parentElement?.parentElement?.parentElement?.tagName, cardElement.parentElement?.parentElement?.parentElement?.className,
    //  cardElement.parentElement?.parentElement?.parentElement?.parentElement?.tagName, cardElement.parentElement?.parentElement?.parentElement?.parentElement?.className,
    //  cardElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.tagName, cardElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.className,
    //  cardElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.tagName, cardElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.className,
    //  cardElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.tagName, cardElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.className,
    //);

//    const parent1Elm = cardElement.parentElement;
//    if (parent1Elm) {
//      parent1Cls = (parent1Elm.className || '').trim();
//      const parent2Elm = parent1Elm.parentElement;
//      if (parent2Elm) {
//        parent2Cls = (parent2Elm.className || '').trim();
//      }
//    }
//  } else {
//    // cardElement was undefined.
//  }

//  // check if the main or editor cards are in the configuration editor preview pane.
//  let result = false;
//  if (parent2Cls === 'element-preview') {
//    // MAIN card is in the configuration editor preview pane.
//    result = true;
//  } else if (parent1Cls === 'gui-editor') {
//    // EDITOR card is in the configuration editor preview pane.
//    result = true;
//  }

//  return result;
}


/**
  * Returns true if the card is currently being previewed in the card picker
  * dialog, which is used when adding a card to a UI dashboard;
  * otherwise, false.
  * 
  * The parentElement structure will look like the following when the MAIN card
  * is in card picker preview mode (in the card picker preview pane):
  * 
  * (HA 2024.08.1 release):
  * - parentElement1.tagName='DIV',   className='preview   '
  * - parentElement2.tagName='DIV',   className='card'
  * - parentElement3.tagName='DIV',   className='cards-container'
  * - parentElement4.tagName='DIV',   className=undefined
  */
export function isCardInPickerPreview(cardElement: Element) {

  let parent1Cls: string | undefined = undefined;
  let parent2Cls: string | undefined = undefined;
  let parent3Cls: string | undefined = undefined;

  // get parent element data.
  if (cardElement) {

    //console.log("isCardInEditPreview - ParentElement tagName info:\n parentElement1: %s = %s\n parentElement2: %s = %s\n parentElement3: %s = %s\n parentElement4: %s = %s\n parentElement5: %s = %s\n parentElement6: %s = %s\n parentElement7: %s = %s",
    //  cardElement.parentElement?.tagName, cardElement.parentElement?.className,
    //  cardElement.parentElement?.parentElement?.tagName, cardElement.parentElement?.parentElement?.className,
    //  cardElement.parentElement?.parentElement?.parentElement?.tagName, cardElement.parentElement?.parentElement?.parentElement?.className,
    //  cardElement.parentElement?.parentElement?.parentElement?.parentElement?.tagName, cardElement.parentElement?.parentElement?.parentElement?.parentElement?.className,
    //  cardElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.tagName, cardElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.className,
    //  cardElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.tagName, cardElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.className,
    //  cardElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.tagName, cardElement.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.className,
    //);

    const parent1Elm = cardElement.parentElement;
    if (parent1Elm) {
      parent1Cls = (parent1Elm.className || '').trim();
      const parent2Elm = parent1Elm.parentElement;
      if (parent2Elm) {
        parent2Cls = (parent2Elm.className || '').trim();
        const parent3Elm = parent2Elm.parentElement;
        if (parent3Elm) {
          parent3Cls = (parent3Elm.className || '').trim();
        }
      }
    }
  } else {
    // cardElement was undefined.
  }

  // check if the card is in the card picker preview pane.
  let result = false;
  if ((parent1Cls === 'preview') && (parent2Cls === 'card') && (parent3Cls === 'cards-container')) {
    result = true;
  }

  return result;
}


/**
 * Check if a string is a numeric value or not.
 * 
 * @param numStr String to check for a numeric value.
 * @returns true if the specified string can be converted to a number; otherwise, false.
 */
export function isNumber(numStr: string): boolean {
  return !isNaN(parseFloat(numStr)) && !isNaN(+numStr)
}


export function getObjectDifferences(obj1: any, obj2: any): any {

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return obj1 !== obj2 ? [obj1, obj2] : undefined;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const uniqueKeys = new Set([...keys1, ...keys2]);

  const differences: any = {};

  for (const key of uniqueKeys) {
    const value1 = obj1[key] || '';
    const value2 = obj2[key] || '';

    if (typeof value1 === 'object' && typeof value2 === 'object') {
      const nestedDifferences = getObjectDifferences(value1, value2);
      if (nestedDifferences) {
        differences[key] = nestedDifferences;
      }
    } else if (value1 !== value2) {
      differences[key] = [value1, value2];
    }
  }

  return Object.keys(differences).length === 0 ? undefined : differences;
}


/**
 * Find the closest matching element in a chain of nested, slotted custom elements.
 * 
 * @param selector selector used to find the element; values are case-sensitive.
 * @param base element to start searching from; specify `this` to start searching from the current element.
 * @returns a matching element if found; otherwise, null.
 * 
 * examples:
 * - find element by it's `id=` value:
 *   const container = this.closestElement('#spcPlayer', this);
 * - find element by it's html tag name (e.g. `<spc-player>`):
 *   const container = this.closestElement('spc-player', this);
 */
export function closestElement(selector: string, base: Element) {

  function __closestFrom(el: Element | Window | Document | null): Element | null {
    if (!el || el === document || el === window) return null;
    if ((el as Slottable).assignedSlot) el = (el as Slottable).assignedSlot;

    const found = (el as Element).closest(selector);
    return found
      ? found
      : __closestFrom(((el as Element).getRootNode() as ShadowRoot).host);
  }
  return __closestFrom(base);
}


/**
 * Determine if the current device supports touch events.
 * 
 * @returns true if touch events are supported; otherwise, false.
 */
export function isTouchDevice(): boolean {
  //return 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  let result = false;
  if (window.PointerEvent && ('maxTouchPoints' in navigator)) {
    // if Pointer Events are supported, just check maxTouchPoints
    if (navigator.maxTouchPoints > 0) {
      result = true;
    }
  } else {
    // no Pointer Events...
    if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
      // check for any-pointer:coarse which mostly means touchscreen
      result = true;
    } else if (window.TouchEvent || ('ontouchstart' in window)) {
      // last resort - check for exposed touch events API / event handler
      result = true;
    }
  }
  return result;
}


/**
 * Determines if the following lazily-loaded controls are defined to customElements, and
 * forces a page load to load the controls if not.  Controls checked for are:
 * - <search-input-outlined>
 * - <ha-dropdown>
 * - <ha-alert>
 * 
 * This can happen when the user presses F5 to refresh the page, and the above controls
 * are not loaded.  If they are used on the form, then they will not render correctly!
 * 
 * To find out what custom elements are available on a dashboard, bring up the console (in 
 * Chrome) and run the following command:
 * > Array.from(customElements.l.keys()).sort().join(", ");
 */
export const loadHaFormLazyControls = async () => {

  // if specified customElements already exist then we are done.
  if (customElements.get("search-input-outlined") && customElements.get("ha-dropdown") && customElements.get("ha-alert")) {
    return;
  }

  if (debuglog.enabled) {
    debuglog("loadHaFormLazyControls - loading lazy controls via partial-panel-resolver");
  }

  // create partial panel resolver element.
  await customElements.whenDefined("partial-panel-resolver");
  const ppr = document.createElement('partial-panel-resolver') as any;
  ppr.hass = {
    panels: [{
      url_path: "tmp",
      component_name: "config",
    }]
  };
  ppr._updateRoutes();
  await ppr.routerOptions.routes.tmp.load();

  await customElements.whenDefined("ha-panel-config");
  const cpr = document.createElement("ha-panel-config") as any;
  await cpr.routerOptions.routes.automation.load();

  if (debuglog.enabled) {
    debuglog("loadHaFormLazyControls - done; lazy controls should now be loaded");
  }

}


/**
 * Copy div.innerText value to clipboard.
 * 
 * @param elm DIV element whose contents are to be copied.
 * @returns true if text was copied to the clipboard successfully; otherwise, false.
 * 
 * example usage:
 * <div @click=${copyToClipboard}>This text will be copied</div>
 */
export function copyToClipboard(ev): boolean {
  const elm = ev.currentTarget as HTMLDivElement;
  const result = copy(elm.innerText);
  if (debuglog.enabled) {
    debuglog("copyToClipboard - text copied to clipboard:\n%s",
      JSON.stringify(elm.innerText),
    );
  }
  window.status = "text copied to clipboard";
  return result;
}


/**
 * Checks if a returned Error message implements the HomeAssistantError interface;
 * and returns the error message text.
 * 
 * @param ex Error object to return the message from.
 * @returns Error message text.
 */
export function getHomeAssistantErrorMessage(ex): string {

  let result = "";
  let msgType = "";

  // parse the error message based on its type.
  do {

    // if nothing passed then just return an empty string.
    if (ex === null) {
      msgType = "no ex argument";
      break;
    }

    // does object implement home assistant error interface?
    if ((typeof ex === 'object') && ('code' in ex) && ('message' in ex)) {

      // get error code and message values.
      const code: string = ex['code'];
      const message: string = ex['message'];

      // for ServiceValidationError messages, drop the "Validation error: " prefix!
      if (code == 'service_validation_error') {
        if (message.startsWith('Validation error: ')) {
          result = message.substring(18);
          msgType = "ServiceValidationError";
          break;
        }
      }

      // for HomeAssistantError messages, just return the message.
      result = message;
      msgType = "HomeAssistantError";
      break;
    }

    // does object implement Error interface?
    if ((typeof ex === 'object') && ('message' in ex)) {
      result = ex['message'];
      msgType = "Error interface";
      break;
    }

    // return message as string.
    if (debuglog.enabled) {
      debuglog("%cgetHomeAssistantErrorMessage - error message (string):\n%s", "color:red", ex + "");
    }
    result = ex + "";
    msgType = "string";
    break;

  } while (true);

  // trace.
  if (debuglog.enabled) {
    debuglog("%cgetHomeAssistantErrorMessage - parsed %s message:\n- %s",
      "color:red",
      msgType,
      JSON.stringify(result),
    );
  }

  // return result to caller.
  return result;
}
