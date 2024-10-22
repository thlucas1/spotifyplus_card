// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  mdiHeart,
  mdiHeartOutline,
  mdiPlay,
  mdiPodcast,
} from '@mdi/js';

// our imports.
import { sharedStylesGrid } from '../styles/shared-styles-grid.js';
import { sharedStylesMediaInfo } from '../styles/shared-styles-media-info.js';
import { sharedStylesFavActions } from '../styles/shared-styles-fav-actions.js';
import { FavActionsBase } from './fav-actions-base';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { GetResumeInfo } from '../types/spotifyplus/resume-point';
import { GetCopyrights } from '../types/spotifyplus/copyright';
import { IShowSimplified } from '../types/spotifyplus/show-simplified';
import { formatDateHHMMSSFromMilliseconds, unescapeHtml } from '../utils/utils';
import { IEpisodePageSimplified } from '../types/spotifyplus/episode-page-simplified';
import { openWindowNewTab } from '../utils/media-browser-utils';

/**
 * Show actions.
 */
enum Actions {
  ShowFavoriteAdd = "ShowFavoriteAdd",
  ShowFavoriteRemove = "ShowFavoriteRemove",
  ShowFavoriteUpdate = "ShowFavoriteUpdate",
  ShowEpisodesUpdate = "ShowEpisodesUpdate",
}


class ShowActions extends FavActionsBase {

  // public state properties.
  @property({ attribute: false }) mediaItem!: IShowSimplified;

  // private state properties.
  @state() private showEpisodes?: IEpisodePageSimplified;
  @state() private isShowFavorite?: boolean;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.SHOW_FAVORITES);

  }


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // invoke base class method.
    super.render();

    // define actions.
    const actionShowFavoriteAdd = html`
      <div class="display-inline">
        <ha-icon-button 
          .path=${mdiHeartOutline}
          label="Add Show &quot;${this.mediaItem.name}&quot; to Favorites"
          @click=${() => this.onClickAction(Actions.ShowFavoriteAdd)}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const actionShowFavoriteRemove = html`
      <div class="display-inline">
        <ha-icon-button 
          .path=${mdiHeart}
          label="Remove Show &quot;${this.mediaItem.name}&quot; from Favorites"
          @click=${() => this.onClickAction(Actions.ShowFavoriteRemove)}
          slot="icon-button-small-selected"
        ></ha-icon-button>
      </div>
     `;

    // define supporting icons.
    const iconShow = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiPodcast}
          .label="View Show &quot;${this.mediaItem.name}&quot; info on Spotify.com"
          @click=${() => openWindowNewTab(this.mediaItem.external_urls.spotify || "")}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    // render html.
    // mediaItem will be an IShow object when displaying favorites.
    // mediaItem will be an IShowSimplified object when displaying search results,
    // and the copyright attribute will not exist.
    return html`
      <div class="show-actions-container">
        ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
        <div class="media-info-content">
          <div class="img" style="background:url(${this.mediaItem.image_url});"></div>
          <div class="media-info-details">
            <div class="media-info-text-ms-c">
              ${iconShow}
              ${this.mediaItem.name}
              ${(this.isShowFavorite ? actionShowFavoriteRemove : actionShowFavoriteAdd)}
            </div>
            <div class="grid show-info-grid">
              <div class="grid-action-info-hdr-s"># Episodes</div>
              <div class="grid-action-info-text-s">${this.mediaItem.total_episodes || "unknown"}</div>
              
              <div class="grid-action-info-hdr-s">Explicit?</div>
              <div class="grid-action-info-text-s">${this.mediaItem.explicit || false}</div>
              
              <div class="grid-action-info-hdr-s">Publisher</div>
              <div class="grid-action-info-text-s">${this.mediaItem.publisher || "unknown"}</div>

              ${("copyrights" in this.mediaItem) ? html`
                <div class="grid-action-info-hdr-s">Copyright</div>
                <div class="grid-action-info-text-s">${GetCopyrights(this.mediaItem, "; ")}</div>
                ` : ""}

            </div>
          </div>
        </div>
        <div class="grid-container-scrollable">
          <div class="media-info-text-s" .innerHTML="${unescapeHtml(this.mediaItem.html_description)}"></div>
          <div class="grid episodes-grid">
            <div class="grid-header">&nbsp;</div>
            <div class="grid-header">Title</div>
            <div class="grid-header">Status</div>
            <div class="grid-header grid-header-last">Duration</div>
            ${this.showEpisodes?.items.map((item) => html`
              <ha-icon-button
                .path=${mdiPlay}
                .label="Play chapter &quot;${item.name}&quot;"
                @click=${() => this.onClickMediaItem(item)}
                slot="icon-button"
              >&nbsp;</ha-icon-button>
              <div class="grid-entry">${item.name}</div>
              <div class="grid-entry">${GetResumeInfo(item.resume_point)}</div>
              <div class="grid-entry">${formatDateHHMMSSFromMilliseconds(item.duration_ms || 0)}</div>
            `)}
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

      .show-info-grid {
        grid-template-columns: auto auto;
        justify-content: left;
      }

      .show-actions-container {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;  
      }

      /* style episodes container and grid */
      .episodes-grid {
        grid-template-columns: 40px auto auto auto;
        margin-top: 1.0rem;
      }

      /* style ha-icon-button controls in tracks grid: icon size, title text */
      .episodes-grid > ha-icon-button[slot="icon-button"] {
        --mdc-icon-button-size: 24px;
        --mdc-icon-size: 20px;
        vertical-align: top;
        padding: 0px;
      }

    `
    ];
  }


  /**
   * Handles the `click` event fired when a control icon is clicked.
   * 
   * @param action Action to execute.
   * @param args Action arguments.
   */
  protected override async onClickAction(action: Actions): Promise<boolean> {

    // if card is being edited, then don't bother.
    if (this.isCardInEditPreview) {
      return true;
    }

    // show progress indicator.
    this.progressShow();

    // call service based on requested action, and refresh affected action component.
    if (action == Actions.ShowFavoriteAdd) {

      await this.spotifyPlusService.SaveShowFavorites(this.player.id, this.mediaItem.id);
      this.updateActions(this.player, [Actions.ShowFavoriteUpdate]);

    } else if (action == Actions.ShowFavoriteRemove) {

      await this.spotifyPlusService.RemoveShowFavorites(this.player.id, this.mediaItem.id);
      this.updateActions(this.player, [Actions.ShowFavoriteUpdate]);

    } else {

      // no action selected - hide progress indicator.
      this.progressHide();

    }

    return true;
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
      if ((updateActions.indexOf(Actions.ShowEpisodesUpdate) != -1) || (updateActions.length == 0)) {

        // create promise - get action list data.
        const promiseGetShowEpisodes = new Promise((resolve, reject) => {

          const market = null;
          const limit_total = 200;

          // call service to retrieve show episodes.
          this.spotifyPlusService.GetShowEpisodes(player.id, this.mediaItem.id, 0, 0, market, limit_total)
            .then(episodes => {

              // stash the result into state, and resolve the promise.
              this.showEpisodes = episodes
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.showEpisodes = undefined;
              this.alertErrorSet("Get Show Episodes failed: \n" + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseGetShowEpisodes);
      }

      // was this action chosen to be updated?
      if ((updateActions.indexOf(Actions.ShowFavoriteUpdate) != -1) || (updateActions.length == 0)) {

        // create promise - check favorite status.
        const promiseCheckShowFavorites = new Promise((resolve, reject) => {

          // call service to retrieve favorite setting.
          this.spotifyPlusService.CheckShowFavorites(player.id, this.mediaItem.id)
            .then(result => {

              // load results, and resolve the promise.
              // only 1 result is returned, so just take the first key value.
              this.isShowFavorite = result[Object.keys(result)[0]];
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.isShowFavorite = undefined;
              this.alertErrorSet("Check Show Favorites failed: \n" + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseCheckShowFavorites);
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

      // clear the progress indicator and set alert error message.
      this.progressHide();
      this.alertErrorSet("Show actions refresh failed: \n" + (error as Error).message);
      return true;

    }
    finally {
    }
  }

}

customElements.define('spc-show-actions', ShowActions);