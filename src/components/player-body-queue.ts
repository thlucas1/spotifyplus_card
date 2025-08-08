// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":player-body-queue");

// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import {
  mdiPlay,
} from '@mdi/js';

// our imports.
import {
  ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED,
} from '../constants';
import { sharedStylesGrid } from '../styles/shared-styles-grid.js';
import { sharedStylesMediaInfo } from '../styles/shared-styles-media-info.js';
import { sharedStylesFavActions } from '../styles/shared-styles-fav-actions.js';
import { getMediaListTrackUrisRemaining } from '../utils/media-browser-utils.js';
import { getHomeAssistantErrorMessage } from '../utils/utils';
import { PlayerBodyBase } from './player-body-base';
import { MediaPlayer } from '../model/media-player';
import { IPlayerQueueInfo } from '../types/spotifyplus/player-queue-info';
import { ITrack } from '../types/spotifyplus/track';

/**
 * Track actions.
 */
enum Actions {
  EpisodePlay = "EpisodePlay",
  GetPlayerQueueInfo = "GetPlayerQueueInfo",
  TrackPlay = "TrackPlay",
}


export class PlayerBodyQueue extends PlayerBodyBase {

  // private state properties.
  @state() private queueInfo?: IPlayerQueueInfo;


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // invoke base class method.
    super.render();

    // initialize common elements.
    let queueItems = html`<div class="grid-entry queue-info-grid-no-items">No items found in Queue</div>`;

    // process all queue items.
    if ((this.queueInfo?.queue || []).length > 0) {
      queueItems = html`${this.queueInfo?.queue.map((item, index) => html`
          ${(() => {
            // render based on item type (track, episode).
            if (item.type == 'episode') {
              return (html `
                <ha-icon-button
                  .path=${mdiPlay}
                  .label="Play episode &quot;${item.name || ""}&quot;"
                  @click=${() => this.onClickAction(Actions.EpisodePlay, item)}
                  slot="icon-button"
                >&nbsp;</ha-icon-button>
                <div class="grid-entry">${index + 1}</div>
                <div class="grid-entry">${item.name || ""}</div>
                <div class="grid-entry">${item.show?.name || ""}</div>
              `)
            } else {
              return (html `
                <ha-icon-button
                  .path=${mdiPlay}
                  .label="Play track &quot;${item.name || ""}&quot;"
                  @click=${() => this.onClickAction(Actions.TrackPlay, item)}
                  slot="icon-button"
                >&nbsp;</ha-icon-button>
                <div class="grid-entry">${index + 1}</div>
                <div class="grid-entry">${item.name || ""}</div>
                <div class="grid-entry">${item.artists[0].name || ""}</div>
              `)
            }
        })()}
      `)}`;
    }

    // render html.
    return html` 
      <div class="player-body-container" hide=${this.isPlayerStopped}>
        <div class="player-body-container-scrollable">
          ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
          ${this.alertInfo ? html`<ha-alert alert-type="info" dismissable @alert-dismissed-clicked=${this.alertInfoClear}>${this.alertInfo}</ha-alert>` : ""}
          <div class="media-info-text-ms-c queue-info-grid-container">
            Player Queue Items
          </div>
          <div class="queue-info-grid-container">
            <div class="grid queue-info-grid">
              <div class="grid-header">&nbsp;</div>
              <div class="grid-header">#</div>
              <div class="grid-header">Title</div>
              <div class="grid-header">Artist / Show / Book</div>
              ${queueItems}
            </div>
          </div>
        </div>
      </div>`;
  }


  /**
   * style definitions used by this component.
   * */
  static get styles() {
    return [
      sharedStylesGrid,
      sharedStylesMediaInfo,
      sharedStylesFavActions,
      css`

        /* style grid container */
        .queue-info-grid-container {
          margin: 0.25rem;
        }

        /* style grid container and grid items */
        .queue-info-grid {
          grid-template-columns: 30px 45px auto auto;
        }

        /* style grid container and grid items */
        .queue-info-grid-no-items {
          grid-column-start: 1;
          grid-column-end: 4;
        }

        /* style ha-icon-button controls in grid: icon size, title text */
        .queue-info-grid > ha-icon-button[slot="icon-button"] {
          --mdc-icon-button-size: 24px;
          --mdc-icon-size: 20px;
          vertical-align: top;
          padding: 0px;
        }
      `
    ];
  }


  /**
   * Refreshes the queue items list.  This function can be called when the queue info
   * display is initially opened.
   * 
   * @param action Action to execute.
   * @param item Action arguments.
   */
  public refreshQueueItems(): void {

    this.updateActions(this.player, [Actions.GetPlayerQueueInfo]);

  }


  /**
   * Handles the `click` event fired when a control icon is clicked.
   * 
   * @param action Action to execute.
   * @param item Action arguments.
   */
  protected override async onClickAction(action: Actions, item: any = null): Promise<boolean> {

    try {

      // show progress indicator.
      this.progressShow();

      // call service based on requested action, and refresh affected action component.
      if (action == Actions.GetPlayerQueueInfo) {

        this.updateActions(this.player, [Actions.GetPlayerQueueInfo]);

      } else if (action == Actions.EpisodePlay) {

        await this.spotifyPlusService.Card_PlayMediaBrowserItem(this.player, item);
        this.progressHide();

      } else if (action == Actions.TrackPlay) {

        // build track uri list from media list.
        const { uris } = getMediaListTrackUrisRemaining(this.queueInfo?.queue as ITrack[], item);

        // play the selected track, as well as the remaining tracks.
        // also disable shuffle, as we want to play the selected track first.
        this.spotifyPlusService.PlayerMediaPlayTracks(this.player, uris.join(","), null, null, null, false);

        // hide progress indicator.
        this.progressHide();

      } else {

        // no action selected - hide progress indicator.
        this.progressHide();

      }
      return true;

    }
    catch (error) {

      // clear the progress indicator and set alert error message.
      this.progressHide();
      this.alertErrorSet("Action failed: " + getHomeAssistantErrorMessage(error));
      return true;

    }
    finally {
    }

  }


  /**
   * Updates body actions.
   * 
   * @param player Media player instance that will process the update.
   * @param updateActions List of actions that need to be updated, or an empty list to update DEFAULT actions.
   * @returns True if actions update should continue after calling base class method; otherwise, False to abort actions update.
   */
  protected override updateActions(
    player: MediaPlayer,
    updateActions: any[],
  ): boolean {

    // invoke base class method; if it returns false, then we should not update actions.
    if (!super.updateActions(player, updateActions)) {
      return false;
    }

    try {

      const promiseRequests = new Array<Promise<unknown>>();

      // was this action chosen to be updated?
      // note that we disabled default refresh processing (e.g. "|| (updateActions.length == 0)" since
      // we want to manually force the refresh when the queue body is is displayed.
      if (updateActions.indexOf(Actions.GetPlayerQueueInfo) != -1) {

        // spotify premium account required for this function.
        // not supported by elevated credentials.
        if (!player.isUserProductPremium()) {
          throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
        }

        // create promise - update currently playing media item.
        const promiseGetPlayingItem = new Promise((resolve, reject) => {

          // call service to retrieve media item that is currently playing.
          this.spotifyPlusService.GetPlayerQueueInfo(player)
            .then(result => {

              // load results, update favorites, and resolve the promise.
              this.queueInfo = result;

              //// update the whole player body queue element.
              //const spcPlayerBodyQueue = closestElement('#elmPlayerBodyQueue', this) as PlayerBodyQueue;
              //spcPlayerBodyQueue.requestUpdate();

              ////this.requestUpdate();
              //// update display.
              //setTimeout(() => {
              //  //this.requestUpdate();
              //  const spcPlayerBodyQueue = closestElement('#elmPlayerBodyQueue', this) as PlayerBodyQueue;
              //  spcPlayerBodyQueue.requestUpdate();
              //  debuglog("updateActions - queueInfo refreshed successfully (setTimeout)");
              //}, 2000);

              if (debuglog.enabled) {
                debuglog("updateActions - queueInfo refreshed successfully");
              }

              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.queueInfo = undefined;
              this.alertErrorSet("Get Player Queue Info call failed: " + getHomeAssistantErrorMessage(error));
              reject(error);

            })
        });

        promiseRequests.push(promiseGetPlayingItem);
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

        // call base class method for post actions update processing.
        this.updateActionsComplete(updateActions);

      });
      return true;

    }
    catch (error) {

      // clear the progress indicator and set alert error message.
      this.progressHide();
      this.alertErrorSet("Queue info refresh failed: " + getHomeAssistantErrorMessage(error));
      return true;

    }
    finally {
    }
  }

}

customElements.define('spc-player-body-queue', PlayerBodyQueue);
