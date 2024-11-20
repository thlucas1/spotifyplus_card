// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import copyTextToClipboard from 'copy-text-to-clipboard';
import {
  mdiAccountDetailsOutline,
  mdiBookmarkMusicOutline,
  mdiBookOpenVariant,
  mdiClipboardPlusOutline,
  mdiDotsHorizontal,
  mdiHeart,
  mdiHeartOutline,
  mdiPlaylistPlay,
} from '@mdi/js';

// our imports.
import { sharedStylesGrid } from '../styles/shared-styles-grid.js';
import { sharedStylesMediaInfo } from '../styles/shared-styles-media-info.js';
import { sharedStylesFavActions } from '../styles/shared-styles-fav-actions.js';
import { FavActionsBase } from './fav-actions-base';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { SearchMediaTypes } from '../types/search-media-types';
import { SearchMediaEvent } from '../events/search-media';
import { formatDateHHMMSSFromMilliseconds, unescapeHtml } from '../utils/utils';
import { openWindowNewTab } from '../utils/media-browser-utils';
import { ALERT_INFO_PRESET_COPIED_TO_CLIPBOARD } from '../constants';
import { GetCopyrights } from '../types/spotifyplus/copyright';
import { GetResumeInfo } from '../types/spotifyplus/resume-point';
import { GetUserPresetConfigEntry } from '../types/spotifyplus/user-preset';
import { IAudiobookSimplified, GetAudiobookNarrators, GetAudiobookAuthors } from '../types/spotifyplus/audiobook-simplified';
import { IChapterPageSimplified } from '../types/spotifyplus/chapter-page-simplified';

/**
 * Audiobook actions.
 */
enum Actions {
  AudiobookCopyPresetToClipboard = "AudiobookCopyPresetToClipboard",
  AudiobookCopyUriToClipboard = "AudiobookCopyUriToClipboard",
  AudiobookFavoriteAdd = "AudiobookFavoriteAdd",
  AudiobookFavoriteRemove = "AudiobookFavoriteRemove",
  AudiobookFavoriteUpdate = "AudiobookFavoriteUpdate",
  AudiobookChaptersUpdate = "AudiobookChaptersUpdate",
  AudiobookSearchAuthor = "AudiobookSearchAuthor",
  AudiobookSearchNarrator = "AudiobookSearchNarrator",
}


class AudiobookActions extends FavActionsBase {

  // public state properties.
  @property({ attribute: false }) mediaItem!: IAudiobookSimplified;

  // private state properties.
  @state() private audiobookChapters?: IChapterPageSimplified;
  @state() private isAudiobookFavorite?: boolean;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.AUDIOBOOK_FAVORITES);

  }


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected override render(): TemplateResult | void {

    // invoke base class method.
    super.render();

    // define actions.
    const actionAudiobookFavoriteAdd = html`
      <div class="display-inline">
        <ha-icon-button 
          .path=${mdiHeartOutline}
          label="Add Audiobook &quot;${this.mediaItem.name}&quot; to Favorites"
          @click=${() => this.onClickAction(Actions.AudiobookFavoriteAdd)}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const actionAudiobookFavoriteRemove = html`
      <div class="display-inline">
        <ha-icon-button 
          .path=${mdiHeart}
          label="Remove Audiobook &quot;${this.mediaItem.name}&quot; from Favorites"
          @click=${() => this.onClickAction(Actions.AudiobookFavoriteRemove)}
          slot="icon-button-small-selected"
        ></ha-icon-button>
      </div>
     `;

    // define supporting icons.
    const iconAudiobook = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiBookOpenVariant}
          .label="View Audiobook &quot;${this.mediaItem.name}&quot; info on Spotify.com"
          @click=${() => openWindowNewTab(this.mediaItem.external_urls.spotify || "")}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    // define dropdown menu actions - audiobook.
    const actionsAudiobookHtml = html`
      <ha-md-button-menu slot="selection-bar" positioning="popover">
        <ha-assist-chip slot="trigger">
          <ha-svg-icon slot="icon" .path=${mdiDotsHorizontal}></ha-svg-icon>
        </ha-assist-chip>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.AudiobookSearchAuthor)} hide=${this.hideSearchType(SearchMediaTypes.AUDIOBOOKS)}>
          <ha-svg-icon slot="start" .path=${mdiAccountDetailsOutline}></ha-svg-icon>
          <div slot="headline">Other Audiobooks by same Author</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.AudiobookSearchNarrator)} hide=${this.hideSearchType(SearchMediaTypes.AUDIOBOOKS)}>
          <ha-svg-icon slot="start" .path=${mdiAccountDetailsOutline}></ha-svg-icon>
          <div slot="headline">Other Audiobooks by same Narrator</div>
        </ha-md-menu-item>
        <ha-md-divider role="separator" tabindex="-1"></ha-md-divider>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.AudiobookCopyUriToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiClipboardPlusOutline}></ha-svg-icon>
          <div slot="headline">Copy Audiobook URI to Clipboard</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.AudiobookCopyPresetToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiBookmarkMusicOutline}></ha-svg-icon>
          <div slot="headline">Copy Audiobook Preset Info to Clipboard</div>
        </ha-md-menu-item>
      </ha-md-button-menu>
      `;

    // render html.
    // mediaItem will be an IAudiobook object when displaying favorites.
    // mediaItem will be an IAudiobookSimplified object when displaying search results,
    // and the copyright attribute will not exist.
    return html`
      <div class="audiobook-actions-container">
        ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
        ${this.alertInfo ? html`<ha-alert alert-type="info" dismissable @alert-dismissed-clicked=${this.alertInfoClear}>${this.alertInfo}</ha-alert>` : ""}
        <div class="media-info-content">
          <div class="img" style="background:url(${this.mediaItem.image_url});"></div>
          <div class="media-info-details">
            <div class="media-info-text-ms-c">
              ${iconAudiobook}
              ${this.mediaItem.name}
              ${(this.isAudiobookFavorite ? actionAudiobookFavoriteRemove : actionAudiobookFavoriteAdd)}
              <span class="actions-dropdown-menu">
                ${actionsAudiobookHtml}
              </span>
            </div>
            <div class="grid audiobook-info-grid">

              <div class="grid-action-info-hdr-s">Authors</div>
              <div class="grid-action-info-text-s">${GetAudiobookAuthors(this.mediaItem, ", ")}</div>

              <div class="grid-action-info-hdr-s">Narrators</div>
              <div class="grid-action-info-text-s">${GetAudiobookNarrators(this.mediaItem, ", ")}</div>

              <div class="grid-action-info-hdr-s">Publisher</div>
              <div class="grid-action-info-text-s">${this.mediaItem.publisher || "unknown"}</div>

              ${("copyrights" in this.mediaItem) ? html`
                <div class="grid-action-info-hdr-s">Copyright</div>
                <div class="grid-action-info-text-s">${GetCopyrights(this.mediaItem, "; ")}</div>
                ` : ""}

              <div class="grid-action-info-hdr-s">Edition</div>
              <div class="grid-action-info-text-s">${this.mediaItem.edition || "unknown"}</div>

              <div class="grid-action-info-hdr-s">Released</div>
              <div class="grid-action-info-text-s">${this.audiobookChapters?.items[0].release_date || "unknown"}</div>

            </div>
          </div>
        </div>
        <div class="grid-container-scrollable">
          <div class="media-info-text-s" .innerHTML="${unescapeHtml(this.mediaItem.html_description)}"></div>
          <div class="grid chapters-grid">
            <div class="grid-header">&nbsp;</div>
            <div class="grid-header">Title</div>
            <div class="grid-header">Status</div>
            <div class="grid-header grid-header-last">Duration</div>
            ${this.audiobookChapters?.items.map((item) => html`
              <ha-icon-button
                .path=${mdiPlaylistPlay}
                .label="Add chapter &quot;${item.name}&quot; to Play Queue"
                @click=${() => this.AddPlayerQueueItem(item)}
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

      .audiobook-info-grid {
        grid-template-columns: auto auto;
        justify-content: left;
      }

      .audiobook-actions-container {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;  
      }

      /* style chapters container and grid */
      .chapters-grid {
        grid-template-columns: 40px auto auto auto;
        margin-top: 1.0rem;
      }

      /* style ha-icon-button controls in tracks grid: icon size, title text */
      .chapters-grid > ha-icon-button[slot="icon-button"] {
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

    try {

      // process actions that don't require a progress indicator.
      if (action == Actions.AudiobookCopyPresetToClipboard) {

        copyTextToClipboard(GetUserPresetConfigEntry(this.mediaItem, GetAudiobookAuthors(this.mediaItem, ", ")));
        this.alertInfoSet(ALERT_INFO_PRESET_COPIED_TO_CLIPBOARD);
        return true;

      } else if (action == Actions.AudiobookCopyUriToClipboard) {

        copyTextToClipboard(this.mediaItem.uri || "");
        return true;

      } else if (action == Actions.AudiobookSearchAuthor) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.AUDIOBOOKS, GetAudiobookAuthors(this.mediaItem, " ")));
        return true;

      } else if (action == Actions.AudiobookSearchNarrator) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.AUDIOBOOKS, GetAudiobookNarrators(this.mediaItem, " ")));
        return true;

      }

      // show progress indicator.
      this.progressShow();

      // call service based on requested action, and refresh affected action component.
      if (action == Actions.AudiobookFavoriteAdd) {

        await this.spotifyPlusService.SaveAudiobookFavorites(this.player.id, this.mediaItem.id);
        this.updateActions(this.player, [Actions.AudiobookFavoriteUpdate]);

      } else if (action == Actions.AudiobookFavoriteRemove) {

        await this.spotifyPlusService.RemoveAudiobookFavorites(this.player.id, this.mediaItem.id);
        this.updateActions(this.player, [Actions.AudiobookFavoriteUpdate]);

      } else {

        // no action selected - hide progress indicator.
        this.progressHide();

      }

      return true;
    }
    catch (error) {

      // clear the progress indicator and set alert error message.
      this.progressHide();
      this.alertErrorSet("Action failed: " + (error as Error).message);
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
      if ((updateActions.indexOf(Actions.AudiobookChaptersUpdate) != -1) || (updateActions.length == 0)) {

        // create promise - get action list data.
        const promiseGetAudiobookChapters = new Promise((resolve, reject) => {

          const market = null;
          const limit_total = 200;

          // call service to retrieve audiobook chapters.
          this.spotifyPlusService.GetAudiobookChapters(player.id, this.mediaItem.id, 0, 0, market, limit_total)
            .then(chapters => {

              // stash the result into state, and resolve the promise.
              this.audiobookChapters = chapters;
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.audiobookChapters = undefined;
              this.alertErrorSet("Get Audiobook Chapters failed: " + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseGetAudiobookChapters);
      }

      // was this action chosen to be updated?
      if ((updateActions.indexOf(Actions.AudiobookFavoriteUpdate) != -1) || (updateActions.length == 0)) {

        // create promise - check favorite status.
        const promiseCheckAudiobookFavorites = new Promise((resolve, reject) => {

          // call service to retrieve favorite setting.
          this.spotifyPlusService.CheckAudiobookFavorites(player.id, this.mediaItem.id)
            .then(result => {

              // load results, and resolve the promise.
              // only 1 result is returned, so just take the first key value.
              this.isAudiobookFavorite = result[Object.keys(result)[0]];
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.isAudiobookFavorite = undefined;
              this.alertErrorSet("Check Audiobook Favorites failed: " + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseCheckAudiobookFavorites);
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
      this.alertErrorSet("Audiobook actions refresh failed: " + (error as Error).message);
      return true;

    }
    finally {
    }
  }

}

customElements.define('spc-audiobook-actions', AudiobookActions);
