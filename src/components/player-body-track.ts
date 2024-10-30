// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import {
  mdiAccountMusic,
  mdiAlbum,
  mdiHeart,
  mdiHeartOutline,
  mdiMusic,
} from '@mdi/js';

// our imports.
import { sharedStylesGrid } from '../styles/shared-styles-grid.js';
import { sharedStylesMediaInfo } from '../styles/shared-styles-media-info.js';
import { sharedStylesFavActions } from '../styles/shared-styles-fav-actions.js';
import { PlayerBodyBase } from './player-body-base';
import { MediaPlayer } from '../model/media-player';
import { getIdFromSpotifyUri } from '../services/spotifyplus-service';
import { ITrack } from '../types/spotifyplus/track';
import { openWindowNewTab } from '../utils/media-browser-utils.js';
import { formatDateHHMMSSFromMilliseconds } from '../utils/utils.js';

/**
 * Track actions.
 */
enum Actions {
  GetPlayingItem = "GetPlayingItem",
  AlbumFavoriteAdd = "AlbumFavoriteAdd",
  AlbumFavoriteRemove = "AlbumFavoriteRemove",
  AlbumFavoriteUpdate = "AlbumFavoriteUpdate",
  ArtistFavoriteAdd = "ArtistFavoriteAdd",
  ArtistFavoriteRemove = "ArtistFavoriteRemove",
  ArtistFavoriteUpdate = "ArtistFavoriteUpdate",
  TrackFavoriteAdd = "TrackFavoriteAdd",
  TrackFavoriteRemove = "TrackFavoriteRemove",
  TrackFavoriteUpdate = "TrackFavoriteUpdate",
}


class PlayerBodyTrack extends PlayerBodyBase {

  // private state properties.
  @state() private isAlbumFavorite?: boolean;
  @state() private isArtistFavorite?: boolean;
  @state() private isTrackFavorite?: boolean;
  @state() private track?: ITrack;


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // invoke base class method.
    super.render();

    // define actions - track.
    const actionArtistFavoriteAdd = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiHeartOutline}
          label="Add Artist &quot;${this.track?.artists[0].name}&quot; to Favorites"
          @click=${() => this.onClickAction(Actions.ArtistFavoriteAdd)}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const actionArtistFavoriteRemove = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiHeart}
          label="Remove Artist &quot;${this.track?.artists[0].name}&quot; from Favorites"
          @click=${() => this.onClickAction(Actions.ArtistFavoriteRemove)}
          slot="icon-button-small-selected"
        ></ha-icon-button>
      </div>
     `;

    const actionAlbumFavoriteAdd = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiHeartOutline}
          label="Add Album &quot;${this.track?.album.name}&quot; to Favorites"
          @click=${() => this.onClickAction(Actions.AlbumFavoriteAdd)}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const actionAlbumFavoriteRemove = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiHeart}
          label="Remove Album &quot;${this.track?.album.name}&quot; from Favorites"
          @click=${() => this.onClickAction(Actions.AlbumFavoriteRemove)}
          slot="icon-button-small-selected"
        ></ha-icon-button>
      </div>
     `;

    const actionTrackFavoriteAdd = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiHeartOutline}
          label="Add Track &quot;${this.track?.name}&quot; to Favorites"
          @click=${() => this.onClickAction(Actions.TrackFavoriteAdd)}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const actionTrackFavoriteRemove = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiHeart}
          label="Remove Track &quot;${this.track?.name}&quot; from Favorites"
          @click=${() => this.onClickAction(Actions.TrackFavoriteRemove)}
          slot="icon-button-small-selected"
        ></ha-icon-button>
      </div>
     `;

    // define supporting icons.
    const iconArtist = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiAccountMusic}
          .label="View Artist &quot;${this.track?.artists[0].name}&quot; info on Spotify.com"
          @click=${() => openWindowNewTab(this.track?.artists[0].external_urls.spotify || "")}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const iconAlbum = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiAlbum}
          .label="View Album &quot;${this.track?.album.name}&quot; info on Spotify.com"
          @click=${() => openWindowNewTab(this.track?.album.external_urls.spotify || "")}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const iconTrack = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiMusic}
          .label="View Track &quot;${this.track?.name}&quot; info on Spotify.com"
          @click=${() => openWindowNewTab(this.track?.external_urls.spotify || "")}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const actionTrackSummary = html`
      <div class="media-info-content">
        <div class="media-info-details">
          <div class="media-info-text-ms-c">
            ${iconTrack}
            ${this.track?.name}
            ${(this.isTrackFavorite ? actionTrackFavoriteRemove : actionTrackFavoriteAdd)}
          </div>
          <div class="media-info-text-ms">
            ${iconAlbum}
            ${this.track?.album.name}
            ${(this.isAlbumFavorite ? actionAlbumFavoriteRemove : actionAlbumFavoriteAdd)}
          </div>
          <div class="media-info-text-ms">
            ${iconArtist}
            ${this.track?.artists[0].name}
            ${(this.isArtistFavorite ? actionArtistFavoriteRemove : actionArtistFavoriteAdd)}
          </div>
          <div class="grid track-info-grid">
            <div class="grid-action-info-hdr-s">Track #</div>
            <div class="grid-action-info-text-s">${this.track?.track_number || "unknown"}</div>
            <div class="grid-action-info-text-s">&nbsp;</div>
            <div class="grid-action-info-hdr-s">Duration</div>
            <div class="grid-action-info-text-s">${formatDateHHMMSSFromMilliseconds(this.track?.duration_ms || 0)}</div>
            <div class="grid-action-info-text-s">&nbsp;</div>
            <div class="grid-action-info-hdr-s">Released</div>
            <div class="grid-action-info-text-s">${this.track?.album.release_date}</div>

            <div class="grid-action-info-hdr-s">Disc #</div>
            <div class="grid-action-info-text-s">${this.track?.disc_number || "unknown"}</div>
            <div class="grid-action-info-text-s">&nbsp;</div>
            <div class="grid-action-info-hdr-s">Explicit</div>
            <div class="grid-action-info-text-s">${this.track?.explicit || false}</div>
            <div class="grid-action-info-text-s">&nbsp;</div>
            <div class="grid-action-info-hdr-s">Links</div>
            <div class="grid-action-info-text-s">
              <ha-icon-button
                .path=${mdiAccountMusic}
                label="View Artist &quot;${this.track?.artists[0].name}&quot; info on Spotify.com"
                @click=${() => openWindowNewTab(this.track?.artists[0].external_urls.spotify || "")}
                slot="media-info-icon-link-s"
              ></ha-icon-button>
              <ha-icon-button style="padding-left:10px;"
                .path=${mdiAlbum}
                label="View Album &quot;${this.track?.album.name}&quot; info on Spotify.com"
                @click=${() => openWindowNewTab(this.track?.album.external_urls.spotify || "")}
                slot="media-info-icon-link-s"
              ></ha-icon-button>
              <ha-icon-button style="padding-left:10px;"
                .path=${mdiMusic}
                label="View Track &quot;${this.track?.name}&quot; info on Spotify.com"
                @click=${() => openWindowNewTab(this.track?.external_urls.spotify || "")}
                slot="media-info-icon-link-s"
              ></ha-icon-button>
            </div>

          </div>
        </div>
      </div>
     `;

    // render html.
    return html` 
      <div class="player-body-container" hide=${this.isPlayerStopped}>
        <div class="player-body-container-scrollable">
          ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
          ${(() => {
            if (this.player.attributes.sp_item_type == 'track') {
              return (html`${actionTrackSummary}`)
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

      .track-info-grid {
        grid-template-columns: auto auto 30px auto auto 30px auto auto;
        justify-content: left;
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

    //// if card is being edited, then don't bother.
    //if (this.isCardInEditPreview) {
    //  return true;
    //}

    try {
      // show progress indicator.
      this.progressShow();

      // call service based on requested action, and refresh affected action component.
      if (action == Actions.AlbumFavoriteAdd) {

        await this.spotifyPlusService.SaveAlbumFavorites(this.player.id, this.track?.album.id);
        this.updateActions(this.player, [Actions.AlbumFavoriteUpdate]);

      } else if (action == Actions.AlbumFavoriteRemove) {

        await this.spotifyPlusService.RemoveAlbumFavorites(this.player.id, this.track?.album.id);
        this.updateActions(this.player, [Actions.AlbumFavoriteUpdate]);

      } else if (action == Actions.ArtistFavoriteAdd) {

        await this.spotifyPlusService.FollowArtists(this.player.id, this.track?.artists[0].id);
        this.updateActions(this.player, [Actions.ArtistFavoriteUpdate]);

      } else if (action == Actions.ArtistFavoriteRemove) {

        await this.spotifyPlusService.UnfollowArtists(this.player.id, this.track?.artists[0].id);
        this.updateActions(this.player, [Actions.ArtistFavoriteUpdate]);

      } else if (action == Actions.TrackFavoriteAdd) {

        await this.spotifyPlusService.SaveTrackFavorites(this.player.id, this.track?.id);
        this.updateActions(this.player, [Actions.TrackFavoriteUpdate]);

      } else if (action == Actions.TrackFavoriteRemove) {

        await this.spotifyPlusService.RemoveTrackFavorites(this.player.id, this.track?.id);
        this.updateActions(this.player, [Actions.TrackFavoriteUpdate]);

      } else {

        // no action selected - hide progress indicator.
        this.progressHide();

      }
      return true;

    }
    catch (error) {

      // clear the progress indicator and set alert error message.
      this.progressHide();
      this.alertErrorSet("Track action failed: \n" + (error as Error).message);
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
        this.isAlbumFavorite = undefined;
        this.isArtistFavorite = undefined;
        this.isTrackFavorite = undefined;

        // create promise - update currently playing media item.
        const promiseGetPlayingItem = new Promise((resolve, reject) => {

          // get id portion of spotify uri value.
          const uriIdMediaItem = getIdFromSpotifyUri(this.player.attributes.media_content_id);

          // call service to retrieve media item that is currently playing.
          this.spotifyPlusService.GetTrack(player.id, uriIdMediaItem)
            .then(result => {

              // load results, update favorites, and resolve the promise.
              this.track = result;

              // update favorite settings.
              setTimeout(() => {
                this.updateActions(player, [Actions.TrackFavoriteUpdate, Actions.AlbumFavoriteUpdate, Actions.ArtistFavoriteUpdate]);
              }, 50);
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.track = undefined;
              this.alertErrorSet("Get Track call failed: \n" + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseGetPlayingItem);
      }

      // was this action chosen to be updated?
      if (updateActions.indexOf(Actions.AlbumFavoriteUpdate) != -1) {

        // create promise - check favorite status.
        const promiseCheckAlbumFavorites = new Promise((resolve, reject) => {

          // call service to retrieve favorite setting.
          this.spotifyPlusService.CheckAlbumFavorites(player.id, this.track?.album.id)
            .then(result => {

              // load results, and resolve the promise.
              // only 1 result is returned, so just take the first key value.
              this.isAlbumFavorite = result[Object.keys(result)[0]];
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.isAlbumFavorite = undefined;
              this.alertErrorSet("Check Album Favorites failed: \n" + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseCheckAlbumFavorites);
      }

      // was this action chosen to be updated?
      if (updateActions.indexOf(Actions.ArtistFavoriteUpdate) != -1) {

        // create promise - check favorite status.
        const promiseCheckArtistFavorites = new Promise((resolve, reject) => {

          // call service to retrieve favorite setting.
          this.spotifyPlusService.CheckArtistsFollowing(player.id, this.track?.artists[0].id)
            .then(result => {

              // load results, and resolve the promise.
              // only 1 result is returned, so just take the first key value.
              this.isArtistFavorite = result[Object.keys(result)[0]];
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.isArtistFavorite = undefined;
              this.alertErrorSet("Check Artist Favorites failed: \n" + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseCheckArtistFavorites);
      }

      // was this action chosen to be updated?
      if (updateActions.indexOf(Actions.TrackFavoriteUpdate) != -1) {

        // create promise - check favorite status.
        const promiseCheckTrackFavorites = new Promise((resolve, reject) => {

          // call service to retrieve favorite setting.
          this.spotifyPlusService.CheckTrackFavorites(player.id, this.track?.id)
            .then(result => {

              // load results, and resolve the promise.
              // only 1 result is returned, so just take the first key value.
              this.isTrackFavorite = result[Object.keys(result)[0]];
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.isTrackFavorite = undefined;
              this.alertErrorSet("Check Track Favorites failed: \n" + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseCheckTrackFavorites);
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
      this.alertErrorSet("Track actions refresh failed: \n" + (error as Error).message);
      return true;

    }
    finally {
    }
  }

}

customElements.define('spc-player-body-track', PlayerBodyTrack);
