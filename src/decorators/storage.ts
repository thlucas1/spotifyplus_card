/*
  Based on the following Github repository:
  https://github.com/gugamm/localstorage-decorator/blob/master/local-storage.ts
*/

/**
 * Local Storage service.
 */
export class LStorageService {

  /** 
   * Dictionary that will hold property values. 
   */
  private _propValues: any = {};


  /**
   * Adds a value from long-term window.localStorage area to the short-term
   * property value storage area.
   * 
   * @storageKey Key used to access the property value.
   */
  public addPropertyValue(storageKey: any): void {
    if (!this._propValues.hasOwnProperty(storageKey)) {
      const storageData = window.localStorage.getItem(storageKey);
      this._propValues[storageKey] = (storageData) ? JSON.parse(storageData) : null;
    }
  }


  /**
   * Gets the value from the short-term property value storage area.
   * Note that the value is not retrieved from long-term window.localStorage.
   * 
   * @storageKey Key used to access the property value.
   */
  public getPropertyValue(storageKey: string): any {
    return this._propValues[storageKey];
  }


  /**
   * Sets the value in short-term property value storage area.
   * Note that the value is not saved to long-term window.localStorage area.
   * 
   * @storageKey Key used to access the property value.
   * @value Property value.
   */
  public setPropertyValue(storageKey: string, value: any): any {
    this._propValues[storageKey] = value;
  }


  /**
   * Saves all values stored in the short-term property value storage area
   * to the long-term window.localStorage area.
   */
  public saveProperties(): void {
    for (const prop in this._propValues)
      if (this._propValues.hasOwnProperty(prop))
        window.localStorage.setItem(prop, JSON.stringify(this._propValues[prop]));
  }


  /**
   * Saves short-term property value storage to the long-term window.localStorage 
   * area.
   * 
   * @storageKey Key used to access the property value.
   */
  public saveProperty(storageKey: string): void {
    if (this._propValues.hasOwnProperty(storageKey))
      window.localStorage.setItem(storageKey, JSON.stringify(this._propValues[storageKey]));
  }


  /**
   * Gets a value from long-term window.localStorage area.
   * 
   * @storageKey Key used to access the storage value.
   * @defaultValue Default value to return if no value was found for specified storageKey.
   */
  public getStorageValue(storageKey: any, defaultValue: any = null): any {
    const storageData = window.localStorage.getItem(storageKey);
    return (storageData) ? JSON.parse(storageData) : defaultValue;
  }


  /**
   * Sets the value in long-term storage area.
   * Note that the value is not saved to short-term property values area.
   * 
   * @storageKey Key used to access the storage value.
   * @value Property value.
   */
  public setStorageValue(storageKey: string, value: any): any {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }


  /**
   * Removes the value in long-term storage area.
   * Note that the value is not removed from the property values area.
   * 
   * @storageKey Key used to access the storage value.
   */
  public clearStorageValue(storageKey: string): any {
    window.localStorage.removeItem(storageKey);
  }


  /**
   * Removes ALL values from the long-term window.localStorage area, and set the short-term 
   * property value storage area value to null for each property.
   * 
   * BE CAREFUL WHEN USING THIS METHOD, as it removes ALL values from the long-term 
   * window.localStorage area that other applications may be using!
   */
  public clearStorage(): void {
    window.localStorage.clear();
    for (const prop in this._propValues)
      if (this._propValues.hasOwnProperty(prop))
        this._propValues[prop] = null;
  }


  /**
   * Removes a value from the long-term window.localStorage area, and set the short-term 
   * property value storage area value to null.
   * 
   * @storageKey Key used to access the property value.
   */
  public clearStorageByKey(storageKey: string): void {
    if (this._propValues.hasOwnProperty(storageKey)) {
      window.localStorage.removeItem(storageKey);
      this._propValues[storageKey] = null;
    }
  }
}

export const storageService = new LStorageService();

/**
 * Local Storage property decorator.
 * 
 * Args:
 * @key Key that will represent its value in local storage. 
 *      If two classes have two properties with same key, they will have the same value.
 * @autoSave If true, the property value will be saved immediately when the value is changed;
 *           If false, you must issue a separate call to `storageService.` to store the value(s).
 *              
 * If autosave is on, every change in a property will trigger a JSON.stringfy call.  If this is a 
 * performance issue for you, turn autosave off, and save data wherever you want with storageService.
 */
export function storage(
  options: {
    key?: string;
    autoSave?: boolean;
  }
  ) {

  return function (target: Object, propName: string) {

    // validations.
    if (!options.autoSave)
      options.autoSave = true;

    // set property key id; defaults to property name if not supplied.
    const propNameId: string = (options.key) ? options.key : propName;

    storageService.addPropertyValue(propNameId);

    function getValue(): any {
      return storageService.getPropertyValue(propNameId);
    }

    function setValueAuto(val: any) {
      storageService.setPropertyValue(propNameId, val);
      storageService.saveProperty(propNameId);
    }

    function setValue(val: any) {
      storageService.setPropertyValue(propNameId, val);
    }

    Object.defineProperty(target, propName, {
      configurable: true,
      enumerable: true,
      get: getValue,
      set: (options.autoSave) ? setValueAuto : setValue
    });
  }
}


/*

* -----------------------------------------------------------------------------------------------------------------
* storage decorator can be used with property.
* It will initialize the property value with null if no localStorage has been found. 
* You can provide a default value (see example below).
*
* Args:
*   autoSave : if true storage will save property value at any attribution.
*              If autosave is on, every change in a property will trigger a JSON.stringfy call. 
*              If this is a performance issue for you, turn autosave off, and save data wherever you want with storageService.
*   key      : key that will represent its value in local storage. 
*              If two classes have two properties with same key, they will have the same value.
* -----------------------------------------------------------------------------------------------------------------
@storage(autoSave : boolean, key ?: string)


* -----------------------------------------------------------------------------------------------------------------
* storageService methods can also be called / used directly.
* -----------------------------------------------------------------------------------------------------------------
// create a storage for a key and initialize with localStorage value. 
// if no value is found, then initialize with null.
storageService.addPropertyValue(key : string) : void

// return the storage value.
storageService.getPropertyValue(key : string) : void

// set the storage value.
storageService.setPropertyValue(key : string, value : any) : void

// save all storages.
storageService.saveProperties() : void

// save a storage by key.
storageService.saveProperty(key : string) : void

// clear browser localStorage and set all storage values to null.
storageService.clearStorage() : void

// clear localStorage for that key and set its value to null.
storageService.clearStorageByKey(key : string) : void


* -----------------------------------------------------------------------------------------------------------------
* Development examples.
* -----------------------------------------------------------------------------------------------------------------
import {storage, LStorageService, storageService} from 'localstorage-decorator';

**** use in class with decorators.

//auto-save
class Student {
    @storage("STUDENT_NAME", true)
    public name : string;
}

//no auto-save
class Student {
    @storage("STUDENT_NAME", false)
    public name : string;
}

//using default value
class Student {
    @storage("STUDENT_NAME", false)
    public name : string = this.name || "my default value";
}

//default key
class Student {
    @storage() //key will be equal to property name. In this case, "name"
    public name : string;
}

**** use in class without decorators.

class Student {
    public name : string;
    
    constructor() {
      storageService.addPropertyValue("STUDENT_NAME");
      this.name = storageService.getPropertyValue("STUDENT_NAME");
    }
}

**** saving values.

// WITH DECORATOR
// if autoSave is on, it will automatically save. Otherwise, use storageService
var student : Student = new Student();
student.name = "Banana";

// WITHOUT DECORATOR
student.name = "Banana";
storageService.setPropertyValue("STUDENT_NAME", student.name);
storageService.saveProperty("STUDENT_NAME");

// or
storageService.saveProperties();

**** clearing storage.

// clear storage for specified key.
storageService.clearStorageByKey("STUDENT_NAME");

// clear all storage.
storageService.clearStorage();

(storageService.getPropertyValue("STUDENT_NAME") === null) // this is true now

*/
