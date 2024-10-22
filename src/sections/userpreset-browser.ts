// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

// our imports.
import '../components/media-browser-list';
import '../components/media-browser-icons';
import '../components/userpreset-actions';
import { FavBrowserBase } from './fav-browser-base';
import { sharedStylesFavBrowser } from '../styles/shared-styles-fav-browser.js';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { formatTitleInfo } from '../utils/media-browser-utils';
import { IUserPreset } from '../types/spotifyplus/user-preset';


@customElement("spc-userpreset-browser")
export class UserPresetBrowser extends FavBrowserBase {

  /** Array of items to display in the media list. */
  protected override mediaList!: Array<IUserPreset> | undefined;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.USERPRESETS);
    this.filterCriteriaPlaceholder = "filter by preset name";

  }


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // invoke base class method.
    super.render();

    // format title and sub-title details.
    const title = formatTitleInfo(this.config.userPresetBrowserTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList);
    const subtitle = formatTitleInfo(this.config.userPresetBrowserSubTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList);

    // render html.
    return html`
      <div class="media-browser-section">
        ${title ? html`<div class="media-browser-section-title">${title}</div>` : html``}
        ${subtitle ? html`<div class="media-browser-section-subtitle">${subtitle}</div>` : html``}
        <div class="media-browser-controls">
          ${!(this.isActionsVisible || false) ? html`` : html`${this.btnHideActionsHtml}`}
          ${this.filterCriteriaHtml}${this.refreshMediaListHtml}
        </div>
        <div id="mediaBrowserContentElement" class="media-browser-content">
          ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
          ${this.alertInfo ? html`<ha-alert alert-type="info" dismissable @alert-dismissed-clicked=${this.alertInfoClear}>${this.alertInfo}</ha-alert>` : ""}
          ${(() => {
            // if actions are not visbile, then render the media list.
            if (!this.isActionsVisible) {
              const filterName = (this.filterCriteria || "").toLocaleLowerCase();
              if (this.config.userPresetBrowserItemsPerRow === 1) {
                return (
                  html`<spc-media-browser-list 
                        class="media-browser-list"
                        .items=${this.mediaList?.filter((item: IUserPreset) => item.name?.toLocaleLowerCase().indexOf(filterName) !== -1)}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-list>`
                )
              } else {
                return (
                  html`<spc-media-browser-icons 
                        class="media-browser-list"
                        .items=${this.mediaList?.filter((item: IUserPreset) => item.name?.toLocaleLowerCase().indexOf(filterName) !== -1)}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-icons>`
                )
              }
            // if actions are visbile, then render the actions display.
            } else {
              return html`<spc-userpreset-actions class="media-browser-actions" .store=${this.store} .mediaItem=${this.mediaItem}></spc-userpreset-actions>`;
            }
          })()}  
        </div>
      </div>
    `;
  }


  /** 
   * style definitions used by this component.
   * */
  static get styles() {

    return [
      sharedStylesFavBrowser,
      css`

      /* extra styles not defined in sharedStylesFavBrowser would go here. */
      `
    ];
  }




  /**
   * Updates the mediaList display.
   */
  protected override updateMediaList(player: MediaPlayer): boolean {

    // invoke base class method; if it returns false, then we should not update the media list.
    if (!super.updateMediaList(player)) {
      return false;
    }

    try {

      // initialize the media list, as we are loading it from multiple sources.
      this.mediaListLastUpdatedOn = (Date.now() / 1000);
      this.mediaList = new Array<IUserPreset>();

      // we use the `Promise.allSettled` approach here like we do with actions, so
      // that we can easily add promises if more data gathering is needed in the future.
      const promiseRequests = new Array<Promise<unknown>>();

      // create promise - get media list from config settings.
      const promiseUpdateMediaListConfig = new Promise((resolve, reject) => {

        try {

          // load settings, append to the media list, and resolve the promise.
          const result = JSON.parse(JSON.stringify(this.config.userPresets || [])) as IUserPreset[];
          if (result) {

            // set where the configuration items were loaded from.
            result.forEach(item => {
              item.origin = "card config";
            });

            // append results to media list.
            (this.mediaList || []).push(...result);
          }
          resolve(true);
        }
        catch (error) {

          // reject the promise.
          super.updatedMediaListError("Load User Presets from config failed: \n" + (error as Error).message);
          reject(error);

        }
      });

      promiseRequests.push(promiseUpdateMediaListConfig);

      // was a user presets url specified?
      if (this.config.userPresetsFile || '' != '') {

        // create promise - get media list from user presets url.
        const promiseUpdateMediaListUrl = new Promise((resolve, reject) => {

          // call fetch api to get media list content from the url.
          // note that "nocache=" will force refresh, if url content is cached.
          fetch(this.config.userPresetsFile + '?nocache=' + Date.now())
            .then(response => {
              // if bad response then raise an exception with error details.
              if (!response.ok) {
                throw new Error("server response: " + response.status + " " + response.statusText);
              }
              // otherwise, return json response data.
              return response.json();
            })
            .then(response => {
              // append to the media list, and resolve the promise.
              const responseObj = response as IUserPreset[]
              if (responseObj) {

                // set where the configuration items were loaded from.
                responseObj.forEach(item => {
                  item.origin = this.config.userPresetsFile as string;
                });

                // append results to media list.
                (this.mediaList || []).push(...responseObj);
              }
              resolve(true);
            })
            .catch(error => {
              // process error result and reject the promise.
              super.updatedMediaListError("Could not fetch data from configuration `userPresetsFile` (" + this.config.userPresetsFile + "); " + (error as Error).message);
              reject(error);
            });
        });

        promiseRequests.push(promiseUpdateMediaListUrl);
      }

      // show visual progress indicator.
      this.progressShow();

      // execute all promises, and wait for all of them to settle.
      // we use `finally` logic so we can clear the progress indicator.
      // any exceptions raised should have already been handled in the 
      // individual promise definitions; nothing else to do at this point.
      Promise.allSettled(promiseRequests).finally(() => {

        // clear the progress indicator.
        this.progressHide();

      });

      return true;

    }
    catch (error) {

      // clear the progress indicator.
      this.progressHide();

      // set alert error message.
      super.updatedMediaListError("User Presets favorites refresh failed: \n" + (error as Error).message);
      return true;

    }
    finally {
    }
  }

}