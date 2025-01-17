// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":recent-browser");

// lovelace card imports.
import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

// our imports.
import '../components/media-browser-list';
import '../components/media-browser-icons';
import '../components/track-actions';
import { FavBrowserBase } from './fav-browser-base';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { formatTitleInfo, getMediaListTrackUrisRemaining } from '../utils/media-browser-utils';
import { getUtcNowTimestamp } from '../utils/utils';
import { GetTracks } from '../types/spotifyplus/track-page-saved';
import { ITrack } from '../types/spotifyplus/track';


@customElement("spc-recent-browser")
export class RecentBrowser extends FavBrowserBase {

  /** Array of items to display in the media list. */
  protected override mediaList!: Array<ITrack> | undefined;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.RECENTS);
    this.filterCriteriaPlaceholder = "filter by name";

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
    const title = formatTitleInfo(this.config.recentBrowserTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList);
    const subtitle = formatTitleInfo(this.config.recentBrowserSubTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList);

    // render html.
    return html`
      <div class="media-browser-section" style=${this.styleMediaBrowser()}>
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
              if (this.config.recentBrowserItemsPerRow === 1) {
                return (
                  html`<spc-media-browser-list
                        class="media-browser-list"
                        .items=${this.mediaList?.filter((item: ITrack) => item.name.toLocaleLowerCase().indexOf(filterName) !== -1)}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-list>`
                )
              } else {
                return (
                  html`<spc-media-browser-icons
                        class="media-browser-list"
                        .items=${this.mediaList?.filter((item: ITrack) => item.name.toLocaleLowerCase().indexOf(filterName) !== -1)}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-icons>`
                )
              }
            // if actions are visbile, then render the actions display.
            } else {
              return html`<spc-track-actions class="media-browser-actions" .store=${this.store} .mediaItem=${this.mediaItem}></spc-track-actions>`;
            }
          })()}  
        </div>
      </div>
    `;
  }




  /**
   * Handles the `item-selected` event fired when a media browser item is clicked.
   * 
   * @param evArgs Event arguments that contain the media item that was clicked on.
   */
  protected override onItemSelected(evArgs: CustomEvent) {

    if (debuglog.enabled) {
      debuglog("onItemSelected - media item selected:\n%s",
        JSON.stringify(evArgs.detail, null, 2),
      );
    }

    try {

      // show progress indicator.
      this.progressShow();

      // set media item reference.
      const mediaItem = evArgs.detail as ITrack;

      // build track uri list from media list.
      const { uris } = getMediaListTrackUrisRemaining(this.mediaList || [], mediaItem);

      // if shuffle enabled then disable it, as we want to play the selected track first.
      if (this.player.attributes.shuffle == true) {
        this.store.mediaControlService.shuffle_set(this.player, false);
      }

      // give the shuffle disable time to process.
      setTimeout(() => {

        // play the selected track, as well as the remaining tracks.
        this.spotifyPlusService.PlayerMediaPlayTracks(this.player.id, uris.join(","));

        // show player section.
        this.store.card.SetSection(Section.PLAYER);

      }, 250);

    }
    catch (error) {

      // set error message and reset scroll position to zero so the message is displayed.
      this.alertErrorSet("Could not play media item.  " + (error as Error).message);
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
        const limitTotal = this.LIMIT_TOTAL_MAX;

        // call the service to retrieve the media list.
        this.spotifyPlusService.GetPlayerRecentTracks(player.id, 0, 0, 0, limitTotal)
          .then(result => {

            // load media list results.
            this.mediaList = GetTracks(result);
            this.mediaListLastUpdatedOn = result.date_last_refreshed || getUtcNowTimestamp();

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
            super.updatedMediaListError("Get Player Recent Tracks failed: " + (error as Error).message);

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
      super.updatedMediaListError("Recently Played items refresh failed: " + (error as Error).message);
      return true;

    }
    finally {
    }
  }

}