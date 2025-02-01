// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import copyTextToClipboard from 'copy-text-to-clipboard';
import {
  mdiAccountDetailsOutline,
  mdiBookmarkMusicOutline,
  mdiBookOpenVariant,
  mdiClipboardPlusOutline,
  mdiDotsHorizontal,
  mdiHeart,
  mdiHeartOutline,
  mdiMicrophone,
} from '@mdi/js';

// our imports.
import { sharedStylesGrid } from '../styles/shared-styles-grid.js';
import { sharedStylesMediaInfo } from '../styles/shared-styles-media-info.js';
import { sharedStylesFavActions } from '../styles/shared-styles-fav-actions.js';
import { PlayerBodyBase } from './player-body-base';
import { MediaPlayer } from '../model/media-player';
import { SearchMediaTypes } from '../types/search-media-types';
import { SearchMediaEvent } from '../events/search-media';
import { getIdFromSpotifyUri } from '../services/spotifyplus-service';
import { formatDateHHMMSSFromMilliseconds, getHomeAssistantErrorMessage, unescapeHtml } from '../utils/utils';
import { openWindowNewTab } from '../utils/media-browser-utils';
import { ALERT_INFO_PRESET_COPIED_TO_CLIPBOARD, ALERT_INFO_PRESET_JSON_COPIED_TO_CLIPBOARD } from '../constants';
import { GetAudiobookAuthors, GetAudiobookNarrators } from '../types/spotifyplus/audiobook-simplified';
import { GetUserPresetConfigEntry, GetUserPresetConfigEntryJson } from '../types/spotifyplus/user-preset';
import { IChapter } from '../types/spotifyplus/chapter';

/**
 * Audiobook actions.
 */
enum Actions {
  AudiobookCopyPresetToClipboard = "AudiobookCopyPresetToClipboard",
  AudiobookCopyPresetJsonToClipboard = "AudiobookCopyPresetJsonToClipboard",
  AudiobookCopyUriToClipboard = "AudiobookCopyUriToClipboard",
  AudiobookFavoriteAdd = "AudiobookFavoriteAdd",
  AudiobookFavoriteRemove = "AudiobookFavoriteRemove",
  AudiobookFavoriteUpdate = "AudiobookFavoriteUpdate",
  AudiobookSearchAuthor = "AudiobookSearchAuthor",
  AudiobookSearchNarrator = "AudiobookSearchNarrator",
  ChapterCopyPresetToClipboard = "ChapterCopyPresetToClipboard",
  ChapterCopyPresetJsonToClipboard = "ChapterCopyPresetJsonToClipboard",
  ChapterCopyUriToClipboard = "ChapterCopyUriToClipboard",
  ChapterFavoriteAdd = "ChapterFavoriteAdd",
  ChapterFavoriteRemove = "ChapterFavoriteRemove",
  ChapterFavoriteUpdate = "ChapterFavoriteUpdate",
  GetPlayingItem = "GetPlayingItem",
}


export class PlayerBodyAudiobook extends PlayerBodyBase {

  // private state properties.
  @state() public isAudiobookFavorite?: boolean;
  @state() private isChapterFavorite?: boolean;
  @state() private chapter?: IChapter;

  // private properties.
  public actionAudiobookFavoriteAdd?: any;
  public actionAudiobookFavoriteRemove?: any;


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // invoke base class method.
    super.render();

    // define actions - audiobook.
    this.actionAudiobookFavoriteAdd = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiHeartOutline}
          label="Add Audiobook &quot;${this.chapter?.audiobook.name}&quot; to Favorites"
          @click=${() => this.onClickAction(Actions.AudiobookFavoriteAdd)}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    this.actionAudiobookFavoriteRemove = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiHeart}
          label="Remove Audiobook &quot;${this.chapter?.audiobook.name}&quot; from Favorites"
          @click=${() => this.onClickAction(Actions.AudiobookFavoriteRemove)}
          slot="icon-button-small-selected"
        ></ha-icon-button>
      </div>
     `;

    const actionChapterFavoriteAdd = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiHeartOutline}
          label="Add Chapter &quot;${this.chapter?.name}&quot; to Favorites"
          @click=${() => this.onClickAction(Actions.ChapterFavoriteAdd)}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const actionChapterFavoriteRemove = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiHeart}
          label="Remove Chapter &quot;${this.chapter?.name}&quot; from Favorites"
          @click=${() => this.onClickAction(Actions.ChapterFavoriteRemove)}
          slot="icon-button-small-selected"
        ></ha-icon-button>
      </div>
     `;

    // define supporting icons.
    const iconAudiobook = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiBookOpenVariant}
          .label="View Audiobook &quot;${this.chapter?.audiobook.name}&quot; info on Spotify.com"
          @click=${() => openWindowNewTab(this.chapter?.audiobook.external_urls.spotify || "")}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const iconChapter = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiMicrophone}
          .label="View Chapter &quot;${this.chapter?.name}&quot; info on Spotify.com"
          @click=${() => openWindowNewTab(this.chapter?.external_urls.spotify || "")}
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
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.AudiobookCopyPresetJsonToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiBookmarkMusicOutline}></ha-svg-icon>
          <div slot="headline">Copy Audiobook Preset JSON to Clipboard</div>
        </ha-md-menu-item>
      </ha-md-button-menu>
      `;

    // define dropdown menu actions - audiobook.
    const actionsChapterHtml = html`
      <ha-md-button-menu slot="selection-bar" positioning="popover">
        <ha-assist-chip slot="trigger">
          <ha-svg-icon slot="icon" .path=${mdiDotsHorizontal}></ha-svg-icon>
        </ha-assist-chip>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ChapterCopyUriToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiClipboardPlusOutline}></ha-svg-icon>
          <div slot="headline">Copy Chapter URI to Clipboard</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ChapterCopyPresetToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiBookmarkMusicOutline}></ha-svg-icon>
          <div slot="headline">Copy Chapter Preset Info to Clipboard</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ChapterCopyPresetJsonToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiBookmarkMusicOutline}></ha-svg-icon>
          <div slot="headline">Copy Chapter Preset JSON to Clipboard</div>
        </ha-md-menu-item>
      </ha-md-button-menu>
      `;

    const actionEpisodeSummary = html`
      <div class="media-info-content">
        <div class="media-info-details">
          <div class="media-info-text-ms-c">
            ${iconAudiobook}
            ${this.chapter?.audiobook.name}
            ${(this.isAudiobookFavorite ? this.actionAudiobookFavoriteRemove : this.actionAudiobookFavoriteAdd)}
            <span class="actions-dropdown-menu">
              ${actionsAudiobookHtml}
            </span>
          </div>
          <div class="media-info-text-ms">
            ${iconChapter}
            ${this.chapter?.name}
            ${(this.isChapterFavorite ? actionChapterFavoriteRemove : actionChapterFavoriteAdd)}
            <span class="actions-dropdown-menu">
              ${actionsChapterHtml}
            </span>
          </div>
          <div class="grid audiobook-info-grid">

            <div class="grid-action-info-hdr-s">Released</div>
            <div class="grid-action-info-text-s">${this.chapter?.release_date || "unknown"}</div>
            <div class="grid-action-info-text-s">&nbsp;</div>
            <div class="grid-action-info-hdr-s">Duration</div>
            <div class="grid-action-info-text-s">${formatDateHHMMSSFromMilliseconds(this.chapter?.duration_ms || 0)}</div>
            <div class="grid-action-info-text-s">&nbsp;</div>
            <div class="grid-action-info-hdr-s">Links</div>
            <div class="grid-action-info-text-s">
              <ha-icon-button
                .path=${mdiBookOpenVariant}
                label="View Audiobook &quot;${this.chapter?.audiobook.name}&quot; info on Spotify.com"
                @click=${() => openWindowNewTab(this.chapter?.audiobook.external_urls.spotify || "")}
                slot="media-info-icon-link-s"
              ></ha-icon-button>
              <ha-icon-button style="padding-left:10px;"
                .path=${mdiMicrophone}
                label="View Chapter &quot;${this.chapter?.name}&quot; info on Spotify.com"
                @click=${() => openWindowNewTab(this.chapter?.external_urls.spotify || "")}
                slot="media-info-icon-link-s"
              ></ha-icon-button>
            </div>

            <div class="grid-action-info-hdr-s">Edition</div>
            <div class="grid-action-info-text-s">${this.chapter?.audiobook.edition || "unknown"}</div>
            <div class="grid-action-info-text-s">&nbsp;</div>
            <div class="grid-action-info-hdr-s">Publisher</div>
            <div class="grid-action-info-text-s colspan-r2-c5">${this.chapter?.audiobook.publisher || "unknown"}</div>

            <div class="grid-action-info-hdr-s">Authors</div>
            <div class="grid-action-info-text-s colspan-r3-c2">${GetAudiobookAuthors(this.chapter?.audiobook, "; ")}</div>

            <div class="grid-action-info-hdr-s">Narrators</div>
            <div class="grid-action-info-text-s colspan-r4-c2">${GetAudiobookNarrators(this.chapter?.audiobook, "; ")}</div>

          </div>

          <div style="padding-top: 10px;">
            <div class="media-info-text-s" .innerHTML="${unescapeHtml(this.chapter?.html_description || "")}"></div>
          </div>

        </div>
      </div>
     `;

    // render html.
    return html` 
      <div class="player-body-container" hide=${this.isPlayerStopped}>
        <div class="player-body-container-scrollable">
          ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
          ${this.alertInfo ? html`<ha-alert alert-type="info" dismissable @alert-dismissed-clicked=${this.alertInfoClear}>${this.alertInfo}</ha-alert>` : ""}
          ${(() => {
            if (this.player.attributes.sp_item_type == 'audiobook') {
              return (html`${actionEpisodeSummary}`)
            } else {
              return (html``)
            }
          })()}
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
        grid-template-columns: auto auto 30px auto auto 30px auto auto;
        justify-content: left;
      }

      .colspan-r2-c5 {
        grid-row: 2 / 2;    /* grid row 2 */
        grid-column: 5 / 9; /* grid columns 5 thru 8 */
      }

      .colspan-r3-c2 {
        grid-row: 3 / 3;    /* grid row 3 */
        grid-column: 2 / 9; /* grid columns 2 thru 8 */
      }

      .colspan-r4-c2 {
        grid-row: 4 / 4;    /* grid row 4 */
        grid-column: 2 / 9; /* grid columns 2 thru 8 */
      }

    `
    ];
  }


  /**
   * Handles the `click` event fired when a control icon is clicked.
   * 
   * @param action Action to execute.
   */
  protected override async onClickAction(action: Actions): Promise<boolean> {

    try {

      // process actions that don't require a progress indicator.
      if (action == Actions.AudiobookCopyPresetToClipboard) {

        copyTextToClipboard(GetUserPresetConfigEntry(this.chapter?.audiobook, GetAudiobookAuthors(this.chapter?.audiobook, ", ")));
        this.alertInfoSet(ALERT_INFO_PRESET_COPIED_TO_CLIPBOARD);
        return true;

      } else if (action == Actions.AudiobookCopyPresetJsonToClipboard) {

        copyTextToClipboard(GetUserPresetConfigEntryJson(this.chapter?.audiobook, GetAudiobookAuthors(this.chapter?.audiobook, ", ")));
        this.alertInfoSet(ALERT_INFO_PRESET_JSON_COPIED_TO_CLIPBOARD);
        return true;

      } else if (action == Actions.AudiobookCopyUriToClipboard) {

        copyTextToClipboard(this.chapter?.audiobook.uri || "");
        return true;

      } else if (action == Actions.AudiobookSearchAuthor) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.AUDIOBOOKS, GetAudiobookAuthors(this.chapter?.audiobook, " ")));
        return true;

      } else if (action == Actions.AudiobookSearchNarrator) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.AUDIOBOOKS, GetAudiobookNarrators(this.chapter?.audiobook, " ")));
        return true;

      } else if (action == Actions.ChapterCopyPresetToClipboard) {

        copyTextToClipboard(GetUserPresetConfigEntry(this.chapter, this.chapter?.audiobook.name));
        this.alertInfoSet(ALERT_INFO_PRESET_COPIED_TO_CLIPBOARD);
        return true;

      } else if (action == Actions.ChapterCopyPresetJsonToClipboard) {

        copyTextToClipboard(GetUserPresetConfigEntryJson(this.chapter, this.chapter?.audiobook.name));
        this.alertInfoSet(ALERT_INFO_PRESET_JSON_COPIED_TO_CLIPBOARD);
        return true;

      } else if (action == Actions.ChapterCopyUriToClipboard) {

        copyTextToClipboard(this.chapter?.uri || "");
        return true;

      }

      // show progress indicator.
      this.progressShow();

      // call service based on requested action, and refresh affected action component.
      if (action == Actions.AudiobookFavoriteAdd) {

        await this.spotifyPlusService.SaveAudiobookFavorites(this.player, this.chapter?.audiobook.id);
        this.updateActions(this.player, [Actions.AudiobookFavoriteUpdate]);

      } else if (action == Actions.AudiobookFavoriteRemove) {

        await this.spotifyPlusService.RemoveAudiobookFavorites(this.player, this.chapter?.audiobook.id);
        this.updateActions(this.player, [Actions.AudiobookFavoriteUpdate]);

      } else if (action == Actions.ChapterFavoriteAdd) {

        await this.spotifyPlusService.SaveEpisodeFavorites(this.player, this.chapter?.id);
        this.updateActions(this.player, [Actions.ChapterFavoriteUpdate]);

      } else if (action == Actions.ChapterFavoriteRemove) {

        await this.spotifyPlusService.RemoveEpisodeFavorites(this.player, this.chapter?.id);
        this.updateActions(this.player, [Actions.ChapterFavoriteUpdate]);

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
      if ((updateActions.indexOf(Actions.GetPlayingItem) != -1) || (updateActions.length == 0)) {

        // reset favorite indicators.
        this.isAudiobookFavorite = undefined;
        this.isChapterFavorite = undefined;

        // create promise - update currently playing media item.
        const promiseGetPlayingItem = new Promise((resolve, reject) => {

          // get id portion of spotify uri value.
          const uriIdMediaItem = getIdFromSpotifyUri(this.player.attributes.media_content_id);

          // call service to retrieve media item that is currently playing.
          this.spotifyPlusService.GetChapter(player, uriIdMediaItem)
            .then(result => {

              // load results, update favorites, and resolve the promise.
              this.chapter = result;

              // update favorite settings.
              setTimeout(() => {
                this.updateActions(player, [Actions.AudiobookFavoriteUpdate, Actions.ChapterFavoriteUpdate]);
              }, 50);
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.chapter = undefined;
              this.alertErrorSet("Get Episode call failed: " + getHomeAssistantErrorMessage(error));
              reject(error);

            })
        });

        promiseRequests.push(promiseGetPlayingItem);
      }

      // was this action chosen to be updated?
      if (updateActions.indexOf(Actions.AudiobookFavoriteUpdate) != -1) {

        // create promise - check favorite status.
        const promiseCheckAudiobookFavorites = new Promise((resolve, reject) => {

          // call service to retrieve favorite setting.
          this.spotifyPlusService.CheckAudiobookFavorites(player, this.chapter?.audiobook.id)
            .then(result => {

              // load results, and resolve the promise.
              // only 1 result is returned, so just take the first key value.
              this.isAudiobookFavorite = result[Object.keys(result)[0]];
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.isAudiobookFavorite = undefined;
              this.alertErrorSet("Check Audiobook Favorites failed: " + getHomeAssistantErrorMessage(error));
              reject(error);

            })
        });

        promiseRequests.push(promiseCheckAudiobookFavorites);
      }

      // was this action chosen to be updated?
      if (updateActions.indexOf(Actions.ChapterFavoriteUpdate) != -1) {

        // create promise - check favorite status.
        const promiseCheckEpisodeFavorites = new Promise((resolve, reject) => {

          // call service to retrieve favorite setting.
          this.spotifyPlusService.CheckEpisodeFavorites(player, this.chapter?.id)
            .then(result => {

              // load results, and resolve the promise.
              // only 1 result is returned, so just take the first key value.
              this.isChapterFavorite = result[Object.keys(result)[0]];
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.isChapterFavorite = undefined;
              this.alertErrorSet("Check Episode Favorites failed: " + getHomeAssistantErrorMessage(error));
              reject(error);

            })
        });

        promiseRequests.push(promiseCheckEpisodeFavorites);
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
      this.alertErrorSet("Audiobook actions refresh failed: " + getHomeAssistantErrorMessage(error));
      return true;

    }
    finally {
    }
  }

}

customElements.define('spc-player-body-audiobook', PlayerBodyAudiobook);
