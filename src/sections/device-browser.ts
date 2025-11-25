// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":device-browser");

// lovelace card imports.
import { html, PropertyValues, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

// our imports.
import '../components/media-browser-list';
import '../components/media-browser-icons';
import '../components/device-actions';
import { FavBrowserBase } from './fav-browser-base';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { formatTitleInfo } from '../utils/media-browser-utils';
import { getHomeAssistantErrorMessage, getUtcNowTimestamp } from '../utils/utils';
import { ISpotifyConnectDevice } from '../types/spotifyplus/spotify-connect-device';
import {
  EDITOR_DEFAULT_BROWSER_ITEMS_PER_ROW,
} from '../constants';


@customElement("spc-device-browser")
export class DeviceBrowser extends FavBrowserBase {

  /** Array of items to display in the media list. */
  protected override mediaList!: Array<ISpotifyConnectDevice> | undefined;

  /** True to refresh device list from real-time data; False to refresh from internal cache. */
  private refreshDeviceList?: boolean;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.DEVICES);
    this.filterCriteriaPlaceholder = "filter by device name";

  }


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // invoke base class method.
    super.render();

    // filter items (if actions are not visible).
    let filteredItems: Array<ISpotifyConnectDevice> | undefined;
    if (!this.isActionsVisible) {
      const filterName = (this.filterCriteria || "").toLocaleLowerCase();
      filteredItems = this.mediaList?.filter((item: ISpotifyConnectDevice) => (item.Name.toLocaleLowerCase().indexOf(filterName) !== -1));
      this.filterItemCount = filteredItems?.length;
    }

    // format title and sub-title details.
    const title = formatTitleInfo(this.config.deviceBrowserTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList, filteredItems);
    const subtitle = formatTitleInfo(this.config.deviceBrowserSubTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList, filteredItems);

    // load default # of items per row to display.
    if (!this.favBrowserItemsPerRow) {
      this.favBrowserItemsPerRow = this.config.deviceFavBrowserItemsPerRow || EDITOR_DEFAULT_BROWSER_ITEMS_PER_ROW;
    }

    // render html.
    return html`
      <div class="media-browser-section" style=${this.styleMediaBrowser()}>
        ${title ? html`<div class="media-browser-section-title">${title}</div>` : html``}
        ${subtitle ? html`<div class="media-browser-section-subtitle">${subtitle}</div>` : html``}
        <div class="media-browser-controls">
          ${!(this.isActionsVisible || false) ? html`` : html`${this.btnHideActionsHtml}`}
          ${this.filterCriteriaHtml}${this.formatMediaListHtml}${this.refreshMediaListHtml}
        </div>
        <div id="mediaBrowserContentElement" class="media-browser-content">
          ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
          ${this.alertInfo ? html`<ha-alert alert-type="info" dismissable @alert-dismissed-clicked=${this.alertInfoClear}>${this.alertInfo}</ha-alert>` : ""}
          ${(() => {
            // if actions are not visbile, then render the media list.
            if (!this.isActionsVisible) {
              if ((this.config.deviceBrowserItemsPerRow || 1) === 1) {
                return (
                  html`<spc-media-browser-list
                        class="media-browser-list"
                        .items=${filteredItems}
                        .itemsPerRow=${this.favBrowserItemsPerRow}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-list>`
                )
              } else {
                return (
                  html`<spc-media-browser-icons
                        class="media-browser-list"
                        .items=${filteredItems}
                        .itemsPerRow=${this.favBrowserItemsPerRow}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-icons>`
                )
              }
            // if actions are visbile, then render the actions display.
            } else {
              return html`<spc-device-actions class="media-browser-actions" .store=${this.store} .mediaItem=${this.mediaItem}></spc-device-actions>`;
            }
          })()}  
        </div>
      </div>
    `;
  }


  /**
   * Called when the element has rendered for the first time. Called once in the
   * lifetime of an element. Useful for one-time setup work that requires access to
   * the DOM.
   */
  protected firstUpdated(changedProperties: PropertyValues): void {

    // ** IMPORTANT **
    // if editing the card in the configuration editor ...
    // this method will fire every time the configuration changes!  for example, the
    // method will execute for every keystroke if you are typing something into a 
    // configuration editor field!

    // invoke base class method.
    super.firstUpdated(changedProperties);

    // determine if card configuration is being edited.
    if (!this.isCardInEditPreview) {

      if (debuglog.enabled) {
        debuglog("firstUpdated - updating mediaList on form entry");
      }

      // auto-refresh device list every time we display the section (if not in edit mode).
      this.updateMediaList(this.player);
    }

  }


  protected override onFilterActionsClick(ev: MouseEvent) {

    // get action to perform.
    const action = (ev.currentTarget! as HTMLElement).getAttribute("action")!;

    if (action === "refresh") {

      // indicate we want a real-time list of devices.
      this.refreshDeviceList = true;

    }

    // invoke base class method.
    super.onFilterActionsClick(ev);

  }


  /**
   * Handles the `item-selected` event fired when a media browser item is clicked.
   * 
   * @param args Event arguments that contain the media item that was clicked on.
   */
  protected override onItemSelected(args: CustomEvent) {

    if (debuglog.enabled) {
      debuglog("onItemSelected - device item selected:\n%s",
        JSON.stringify(args.detail, null, 2),
      );
    }

    const mediaItem = args.detail;
    this.SelectSource(mediaItem);

  }


  /**
   * Calls the mediaplayer select_source service to select a source.
   * 
   * @param mediaItem The medialist item that was selected.
   */
  private async SelectSource(mediaItem: ISpotifyConnectDevice): Promise<void> {


    try {

      // show progress indicator.
      this.progressShow();

      // update status.
      this.alertInfo = "Transferring playback to device \"" + mediaItem.Name + "\" ...";

      // transfer by device id by default; for Sonos, always use device name (restricted device).
      let deviceId = '';
      if (mediaItem.IsSonos) {
        deviceId = mediaItem.Name;
      } else if (this.config.deviceControlByName) {
        deviceId = mediaItem.Name || mediaItem.Id || '';
      } else {
        deviceId = mediaItem.Id || mediaItem.Name || '';
      }

      // select the source.
      await this.store.mediaControlService.select_source(this.player, deviceId);

      // show player section.
      this.store.card.SetSection(Section.PLAYER);

    }
    catch (error) {

      // set error message and reset scroll position to zero so the message is displayed.
      this.alertErrorSet("Could not select source.  " + getHomeAssistantErrorMessage(error));
      this.mediaBrowserContentElement.scrollTop = 0;

    }
    finally {

      // hide progress indicator.
      this.progressHide();

    }

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

      // we use the `Promise.allSettled` approach here like we do with actions, so
      // that we can easily add promises if more data gathering is needed in the future.
      const promiseRequests = new Array<Promise<unknown>>();

      // create promise - get media list.
      const promiseUpdateMediaList = new Promise((resolve, reject) => {

        // set service parameters.
        const refresh = this.refreshDeviceList || false;  // refresh device list (defaults to cached list).
        const sortResult = true;  // true to sort returned items; otherwise, false

        // get source items to omit; show / hide based on config setting (hidden by default).
        let sourceListHide = player.attributes.sp_source_list_hide || [];
        if ((this.config.deviceBrowserItemsShowHiddenDevices && true) == true) {
          sourceListHide = [];
        }

        // call the service to retrieve the media list.
        this.spotifyPlusService.GetSpotifyConnectDevices(player, refresh, sortResult, sourceListHide)
          .then(result => {

            // load media list results.
            this.mediaList = result.Items;
            this.mediaListLastUpdatedOn = result.DateLastRefreshed || getUtcNowTimestamp();

            // call base class method, indicating media list update succeeded.
            super.updatedMediaListOk();

            // resolve the promise.
            resolve(true);

          })
          .catch(error => {

            // clear results, and reject the promise.
            this.mediaList = undefined;
            this.mediaListLastUpdatedOn = 0;

            // call base class method, indicating media list update failed.
            super.updatedMediaListError("Get Spotify Connect Devices failed: " + getHomeAssistantErrorMessage(error));

            // reject the promise.
            reject(error);

          })
      });

      promiseRequests.push(promiseUpdateMediaList);

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
      super.updatedMediaListError("Spotify Connect Device refresh failed: " + getHomeAssistantErrorMessage(error));
      return true;

    }
    finally {
    }
  }

}