// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  mdiHeart,
  mdiHeartOutline,
  mdiPlay,
  mdiPlaylistPlay,
} from '@mdi/js';

// our imports.
import { sharedStylesGrid } from '../styles/shared-styles-grid.js';
import { sharedStylesMediaInfo } from '../styles/shared-styles-media-info.js';
import { sharedStylesFavActions } from '../styles/shared-styles-fav-actions.js';
import { FavActionsBase } from './fav-actions-base';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { formatDateHHMMSSFromMilliseconds, unescapeHtml } from '../utils/utils';
import { GetPlaylistPagePlaylistTracks } from '../types/spotifyplus/playlist-page.js';
import { IPlaylistSimplified } from '../types/spotifyplus/playlist-simplified.js';
import { IPlaylistTrack } from '../types/spotifyplus/playlist-track.js';
import { openWindowNewTab } from '../utils/media-browser-utils.js';

/**
 * Playlist actions.
 */
enum Actions {
  PlaylistFavoriteAdd = "PlaylistFavoriteAdd",
  PlaylistFavoriteRemove = "PlaylistFavoriteRemove",
  PlaylistFavoriteUpdate = "PlaylistFavoriteUpdate",
  PlaylistItemsUpdate = "PlaylistItemsUpdate",
}


class PlaylistActions extends FavActionsBase {

  // public state properties.
  @property({ attribute: false }) mediaItem!: IPlaylistSimplified;

  // private state properties.
  @state() private playlistTracks?: Array<IPlaylistTrack>;
  @state() private isPlaylistFavorite?: boolean;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.PLAYLIST_FAVORITES);

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
    const actionPlaylistFavoriteAdd = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiHeartOutline}
          label="Add Playlist &quot;${this.mediaItem.name}&quot; to Favorites"
          @click=${() => this.onClickAction(Actions.PlaylistFavoriteAdd)}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const actionPlaylistFavoriteRemove = html`
      <div class="display-inline">
        <ha-icon-button 
          .path=${mdiHeart}
          label="Remove Playlist &quot;${this.mediaItem.name}&quot; from Favorites"
          @click=${() => this.onClickAction(Actions.PlaylistFavoriteRemove)}
          slot="icon-button-small-selected"
        ></ha-icon-button>
      </div>
     `;

    // define supporting icons.
    const iconPlaylist = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiPlaylistPlay}
          .label="View Playlist &quot;${this.mediaItem.name}&quot; info on Spotify.com"
          @click=${() => openWindowNewTab(this.mediaItem.external_urls.spotify || "")}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    // render html.
    return html` 
      <div class="playlist-actions-container">
        ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
        <div class="media-info-content">
          <div class="img" style="background:url(${this.mediaItem.image_url});"></div>
          <div class="media-info-details">

            <div class="media-info-text-ms-c">
              ${iconPlaylist}
              ${this.mediaItem.name}
              ${(this.isPlaylistFavorite ? actionPlaylistFavoriteRemove : actionPlaylistFavoriteAdd)}
            </div>
            <div class="grid playlist-info-grid">

              <div class="grid-action-info-hdr-s"># Tracks</div>
              <div class="grid-action-info-text-s">${this.mediaItem.tracks.total}</div>
              <div class="grid-action-info-text-s">&nbsp;</div>
              <div class="grid-action-info-hdr-s">Collaborative?</div>
              <div class="grid-action-info-text-s">${String(this.mediaItem.collaborative || false)}</div>

              <div class="grid-action-info-hdr-s"># Followers</div>
              <div class="grid-action-info-text-s">${this.mediaItem.owner.followers.total || 0}</div>
              <div class="grid-action-info-text-s">&nbsp;</div>
              <div class="grid-action-info-hdr-s">Public?</div>
              <div class="grid-action-info-text-s">${String(this.mediaItem.public || false)}</div>

              <div class="grid-action-info-hdr-s">Snapshot ID</div>
              <div class="grid-action-info-text-s colspan-r3-c2">${this.mediaItem.snapshotId}</div>

              <div class="grid-action-info-hdr-s">Owned By</div>
              ${this.mediaItem.owner ? html`
                <div class="grid-action-info-text-s colspan-r4-c2"><a href="${this.mediaItem.owner.external_urls.spotify}" target="_blank">${this.mediaItem.owner.display_name}</a></div>
              ` : html`<div class="colspan-r4-c2">unknown</div>`}

            </div>
          </div>
        </div>
        <div class="grid-container-scrollable">
          <div class="media-info-text-s" .innerHTML="${unescapeHtml(this.mediaItem.description)}"></div>
          <div class="grid tracks-grid">
            <div class="grid-header">&nbsp;</div>
            <div class="grid-header">#</div>
            <div class="grid-header">Title</div>
            <div class="grid-header">Artist</div>
            <div class="grid-header">Album</div>
            <div class="grid-header grid-header-last">Duration</div>
            ${this.playlistTracks?.map((item, index) => html`
              <ha-icon-button
                .path=${mdiPlay}
                .label="Play track &quot;${item.track.name || ""}&quot;"
                @click=${() => this.onClickMediaItem(item.track)}
                slot="icon-button"
              >&nbsp;</ha-icon-button>
              <div class="grid-entry">${index + 1}</div>
              <div class="grid-entry">${item.track.name || ""}</div>
              <div class="grid-entry">${item.track?.artists[0].name || ""}</div>
              <div class="grid-entry">${item.track?.album.name || ""}</div>
              <div class="grid-entry">${formatDateHHMMSSFromMilliseconds(item.track.duration_ms || 0)}</div>
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

      .playlist-info-grid {
        grid-template-columns: 80px auto 10px auto auto;
        justify-content: left;
        margin: 0.5rem;
        max-width: 21rem;
      }

      .playlist-actions-container {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;  
      }

      .colspan-r3-c2 {
        grid-row: 3 / 3;    /* grid row 3 */
        grid-column: 2 / 6; /* grid columns 2 thru 5 */
      }

      .colspan-r4-c2 {
        grid-row: 4 / 4;    /* grid row 4 */
        grid-column: 2 / 6; /* grid columns 2 thru 5 */
      }

      /* style tracks container and grid */
      .tracks-grid {
        grid-template-columns: 30px 45px auto auto auto 60px;
        margin-top: 1.0rem;
      }

      /* style ha-icon-button controls in tracks grid: icon size, title text */
      .tracks-grid > ha-icon-button[slot="icon-button"] {
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
    if (action == Actions.PlaylistFavoriteAdd) {

      await this.spotifyPlusService.FollowPlaylist(this.player.id, this.mediaItem.id);
      this.updateActions(this.player, [Actions.PlaylistFavoriteUpdate]);

    } else if (action == Actions.PlaylistFavoriteRemove) {

      await this.spotifyPlusService.UnfollowPlaylist(this.player.id, this.mediaItem.id);
      this.updateActions(this.player, [Actions.PlaylistFavoriteUpdate]);

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
      if ((updateActions.indexOf(Actions.PlaylistItemsUpdate) != -1) || (updateActions.length == 0)) {

        // create promise - get action list data.
        const promiseGetPlaylistItems = new Promise((resolve, reject) => {

          const limit_total = this.mediaItem.tracks.total;
          const market = null;
          const fields = null;
          const additional_types = null;

          // I would like to only return the necessary fields to populate the playlist items
          // grid here, but cannot due to an issue with the Spotify web api.  it has been found that the
          // spotify web api will only return a value of 50 (maximum) or less in the page `total` value if
          // the`fields` argument is supplied.  the API will return the total number of playlist items in
          // the page `total` value if the`fields` argument is NOT supplied. A good playlist id to test this
          // on is`1XhVM7jWPrGLTiNiAy97Za`, which is the largest playlist on spotify (4700+ items).

          //const fields = null; // "items(track(name,id,uri,type,duration_ms,album(name,uri),artists(name,uri)))";

          // call service to retrieve playlist items.
          this.spotifyPlusService.GetPlaylistItems(player.id, this.mediaItem.id, 0, 0, market, fields, additional_types, limit_total)
            .then(page => {

              // stash the result into state, and resolve the promise.
              this.playlistTracks = GetPlaylistPagePlaylistTracks(page);
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.playlistTracks = undefined;
              this.alertErrorSet("Get Playlist Items failed: \n" + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseGetPlaylistItems);
      }

      // was this action chosen to be updated?
      if ((updateActions.indexOf(Actions.PlaylistFavoriteUpdate) != -1) || (updateActions.length == 0)) {

        // create promise - check favorite status.
        const promiseCheckPlaylistFavorites = new Promise((resolve, reject) => {

          // call service to retrieve favorite setting.
          this.spotifyPlusService.CheckPlaylistFollowers(player.id, this.mediaItem.id)
            .then(result => {

              // load results, and resolve the promise.
              // only 1 result is returned, so just take the first key value.
              this.isPlaylistFavorite = result[Object.keys(result)[0]];
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.isPlaylistFavorite = undefined;
              this.alertErrorSet("Check Playlist Followers failed: \n" + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseCheckPlaylistFavorites);
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
      this.alertErrorSet("Playlist actions refresh failed: \n" + (error as Error).message);
      return true;

    }
    finally {
    }
  }

}

customElements.define('spc-playlist-actions', PlaylistActions);