// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import copyTextToClipboard from 'copy-text-to-clipboard';
import {
  mdiAccountMusic,
  mdiAlbum,
  mdiClipboardPlusOutline,
  mdiDotsHorizontal,
  mdiHeart,
  mdiHeartOutline,
  mdiMusic,
  mdiPlaylistPlay,
  mdiRadio,
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
import { getIdFromSpotifyUri } from '../services/spotifyplus-service';
import { formatDateHHMMSSFromMilliseconds } from '../utils/utils';
import { openWindowNewTab } from '../utils/media-browser-utils';
import { RADIO_SEARCH_KEY } from '../constants';
import { GetCopyrights } from '../types/spotifyplus/copyright';
import { IAlbum } from '../types/spotifyplus/album';
import { ITrackPageSimplified } from '../types/spotifyplus/track-page-simplified';

/**
 * Album actions.
 */
enum Actions {
  AlbumCopyUriToClipboard = "AlbumCopyUriToClipboard",
  AlbumFavoriteAdd = "AlbumFavoriteAdd",
  AlbumFavoriteRemove = "AlbumFavoriteRemove",
  AlbumFavoriteUpdate = "AlbumFavoriteUpdate",
  AlbumTrackQueueAdd = "AlbumTrackQueueAdd",
  AlbumTracksUpdate = "AlbumTracksUpdate",
  AlbumSearchRadio = "AlbumSearchRadio",
  ArtistCopyUriToClipboard = "ArtistCopyUriToClipboard",
  ArtistFavoriteAdd = "ArtistFavoriteAdd",
  ArtistFavoriteRemove = "ArtistFavoriteRemove",
  ArtistFavoriteUpdate = "ArtistFavoriteUpdate",
  ArtistSearchPlaylists = "ArtistSearchPlaylists",
  ArtistSearchRadio = "ArtistSearchRadio",
  ArtistSearchTracks = "ArtistSearchTracks",
}


class AlbumActions extends FavActionsBase {

  // public state properties.
  @property({ attribute: false }) mediaItem!: IAlbum;

  // private state properties.
  @state() private albumTracks?: ITrackPageSimplified;
  @state() private isAlbumFavorite?: boolean;
  @state() private isArtistFavorite?: boolean;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.ALBUM_FAVORITES);

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
    const actionArtistFavoriteAdd = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiHeartOutline}
          label="Add Artist &quot;${this.mediaItem.artists[0].name}&quot; to Favorites"
          @click=${() => this.onClickAction(Actions.ArtistFavoriteAdd)}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const actionArtistFavoriteRemove = html`
      <div class="display-inline">
        <ha-icon-button 
          .path=${mdiHeart}
          label="Remove Artist &quot;${this.mediaItem.artists[0].name}&quot; from Favorites"
          @click=${() => this.onClickAction(Actions.ArtistFavoriteRemove)}
          slot="icon-button-small-selected"
        ></ha-icon-button>
      </div>
     `;

    const actionAlbumFavoriteAdd = html`
      <div class="display-inline">
        <ha-icon-button 
          .path=${mdiHeartOutline}
          label="Add Album &quot;${this.mediaItem.name}&quot; to Favorites"
          @click=${() => this.onClickAction(Actions.AlbumFavoriteAdd)}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const actionAlbumFavoriteRemove = html`
      <div class="display-inline">
        <ha-icon-button 
          .path=${mdiHeart}
          label="Remove Album &quot;${this.mediaItem.name}&quot; from Favorites"
          @click=${() => this.onClickAction(Actions.AlbumFavoriteRemove)}
          slot="icon-button-small-selected"
        ></ha-icon-button>
      </div>
     `;

    // define supporting icons.
    const iconArtist = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiAccountMusic}
          .label="View Artist &quot;${this.mediaItem.artists[0].name}&quot; info on Spotify.com"
          @click=${() => openWindowNewTab(this.mediaItem.artists[0].external_urls.spotify || "")}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const iconAlbum = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiAlbum}
          .label="View Album &quot;${this.mediaItem.name}&quot; info on Spotify.com"
          @click=${() => openWindowNewTab(this.mediaItem.external_urls.spotify || "")}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    // define dropdown menu actions - album.
    const actionsAlbumHtml = html`
      <ha-md-button-menu slot="selection-bar" positioning="popover">
        <ha-assist-chip slot="trigger">
          <ha-svg-icon slot="icon" .path=${mdiDotsHorizontal}></ha-svg-icon>
        </ha-assist-chip>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.AlbumSearchRadio)} hide=${this.hideSearchType(SearchMediaTypes.PLAYLISTS)}>
          <ha-svg-icon slot="start" .path=${mdiRadio}></ha-svg-icon>
          <div slot="headline">Search for Album Radio</div>
        </ha-md-menu-item>
        <ha-md-divider role="separator" tabindex="-1"></ha-md-divider>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.AlbumCopyUriToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiClipboardPlusOutline}></ha-svg-icon>
          <div slot="headline">Copy Album URI to Clipboard</div>
        </ha-md-menu-item>
      </ha-md-button-menu>
      `;

    // define dropdown menu actions - artist.
    const actionsArtistHtml = html`
      <ha-md-button-menu slot="selection-bar" positioning="popover">
        <ha-assist-chip slot="trigger">
          <ha-svg-icon slot="icon" .path=${mdiDotsHorizontal}></ha-svg-icon>
        </ha-assist-chip>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistSearchPlaylists)} hide=${this.hideSearchType(SearchMediaTypes.PLAYLISTS)}>
          <ha-svg-icon slot="start" .path=${mdiPlaylistPlay}></ha-svg-icon>
          <div slot="headline">Search Playlists for Artist</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistSearchTracks)} hide=${this.hideSearchType(SearchMediaTypes.TRACKS)}>
          <ha-svg-icon slot="start" .path=${mdiMusic}></ha-svg-icon>
          <div slot="headline">Search Tracks for Artist</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistSearchRadio)} hide=${this.hideSearchType(SearchMediaTypes.PLAYLISTS)}>
          <ha-svg-icon slot="start" .path=${mdiRadio}></ha-svg-icon>
          <div slot="headline">Search for Artist Radio</div>
        </ha-md-menu-item>
        <ha-md-divider role="separator" tabindex="-1"></ha-md-divider>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistCopyUriToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiClipboardPlusOutline}></ha-svg-icon>
          <div slot="headline">Copy Artist URI to Clipboard</div>
        </ha-md-menu-item>
      </ha-md-button-menu>
      `;

    // render html.
    // mediaItem will be an IAlbum object when displaying favorites.
    // mediaItem will be an IAlbumSimplified object when displaying search results,
    // and the label and copyright attributes will not exist.
    return html` 
      <div class="album-actions-container">
        ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
        <div class="media-info-content">
          <div class="img" style="background:url(${this.mediaItem.image_url});"></div>
          <div class="media-info-details">
            <div class="media-info-text-ms-c">
              ${iconAlbum}
              ${this.mediaItem.name}
              ${(this.isAlbumFavorite ? actionAlbumFavoriteRemove : actionAlbumFavoriteAdd)}
              <span class="actions-dropdown-menu">
                ${actionsAlbumHtml}
              </span>
            </div>
            <div class="media-info-text-ms">
              ${iconArtist}
              ${this.mediaItem.artists[0].name}
              ${(this.isArtistFavorite ? actionArtistFavoriteRemove : actionArtistFavoriteAdd)}
              <span class="actions-dropdown-menu">
                ${actionsArtistHtml}
              </span>
            </div>
            <div class="grid album-info-grid">
              <div class="grid-action-info-hdr-s">Released</div>
              <div class="grid-action-info-text-s">${this.mediaItem.release_date}</div>

              <div class="grid-action-info-hdr-s"># Tracks</div>
              <div class="grid-action-info-text-s">${this.mediaItem.total_tracks}</div>

              ${("label" in this.mediaItem) ? html`
                <div class="grid-action-info-hdr-s">Label</div>
                <div class="grid-action-info-text-s">${this.mediaItem.label}</div>
                ` : ""}

              ${("copyrights" in this.mediaItem) ? html`
                <div class="grid-action-info-hdr-s">Copyright</div>
                <div class="grid-action-info-text-s">${GetCopyrights(this.mediaItem, "; ")}</div>
                ` : ""}
            </div>
          </div>
        </div>
        <div class="grid-container-scrollable">
          <div class="grid tracks-grid">
            <div class="grid-header">&nbsp;</div>
            <div class="grid-header">#</div>
            <div class="grid-header">Title</div>
            <div class="grid-header">Artist</div>
            <div class="grid-header grid-header-last">Duration</div>
            ${this.albumTracks?.items.map((item) => html`
              <ha-icon-button
                .path=${mdiPlaylistPlay}
                .label="Add track &quot;${item.name}&quot; to Play Queue"
                @click=${() => this.AddPlayerQueueItem(item)}
                slot="icon-button"
              >&nbsp;</ha-icon-button>
              <div class="grid-entry">${item.track_number}</div>
              <div class="grid-entry">${item.name}</div>
              <div class="grid-entry">${item.artists[0].name}</div>
              <div class="grid-entry">${formatDateHHMMSSFromMilliseconds(item.duration_ms)}</div>
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

      .album-info-grid {
        grid-template-columns: auto auto;
        justify-content: left;
      }

      .album-actions-container {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;  
      }

      /* style tracks container and grid */
      .tracks-grid {
        grid-template-columns: 40px 30px auto auto 60px;
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

    try {

      // process actions that don't require a progress indicator.
      if (action == Actions.AlbumCopyUriToClipboard) {

        copyTextToClipboard(this.mediaItem.uri);
        return true;

      } else if (action == Actions.AlbumSearchRadio) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.PLAYLISTS, this.mediaItem.name + RADIO_SEARCH_KEY + this.mediaItem.artists[0].name));
        return true;

      } else if (action == Actions.ArtistCopyUriToClipboard) {

        copyTextToClipboard(this.mediaItem.artists[0].uri);
        return true;

      } else if (action == Actions.ArtistSearchPlaylists) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.PLAYLISTS, this.mediaItem.artists[0].name));
        return true;

      } else if (action == Actions.ArtistSearchRadio) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.PLAYLISTS, this.mediaItem.artists[0].name + RADIO_SEARCH_KEY));
        return true;

      } else if (action == Actions.ArtistSearchTracks) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.TRACKS, this.mediaItem.artists[0].name));
        return true;

      }

      // show progress indicator.
      this.progressShow();

      // get Spotify Id values for currently selected content.
      const uriIdArtist = getIdFromSpotifyUri(this.mediaItem.artists[0].uri);

      // call service based on requested action, and refresh affected action component.
      if (action == Actions.AlbumFavoriteAdd) {

        await this.spotifyPlusService.SaveAlbumFavorites(this.player.id, this.mediaItem.id);
        this.updateActions(this.player, [Actions.AlbumFavoriteUpdate]);

      } else if (action == Actions.AlbumFavoriteRemove) {

        await this.spotifyPlusService.RemoveAlbumFavorites(this.player.id, this.mediaItem.id);
        this.updateActions(this.player, [Actions.AlbumFavoriteUpdate]);

      } else if (action == Actions.ArtistFavoriteAdd) {

        await this.spotifyPlusService.FollowArtists(this.player.id, uriIdArtist);
        this.updateActions(this.player, [Actions.ArtistFavoriteUpdate]);

      } else if (action == Actions.ArtistFavoriteRemove) {

        await this.spotifyPlusService.UnfollowArtists(this.player.id, uriIdArtist);
        this.updateActions(this.player, [Actions.ArtistFavoriteUpdate]);

      } else {

        // no action selected - hide progress indicator.
        this.progressHide();

      }

      return true;
    }
    catch (error) {

      // clear the progress indicator and set alert error message.
      this.progressHide();
      this.alertErrorSet("Action failed: \n" + (error as Error).message);
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
      if ((updateActions.indexOf(Actions.AlbumTracksUpdate) != -1) || (updateActions.length == 0)) {

        // create promise - get action list data.
        const promiseGetPlaylistItems = new Promise((resolve, reject) => {

          const limit_total = this.mediaItem.total_tracks;

          // call service to retrieve album tracks.
          this.spotifyPlusService.GetAlbumTracks(player.id, this.mediaItem.id, 0, 0, null, limit_total)
            .then(tracks => {

              // stash the result into state, and resolve the promise.
              this.albumTracks = tracks;
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.albumTracks = undefined;
              this.alertErrorSet("Get Album Tracks failed: \n" + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseGetPlaylistItems);
      }

      // was this action chosen to be updated?
      if ((updateActions.indexOf(Actions.AlbumFavoriteUpdate) != -1) || (updateActions.length == 0)) {

        // create promise - check favorite status.
        const promiseCheckAlbumFavorites = new Promise((resolve, reject) => {

          // call service to retrieve favorite setting.
          this.spotifyPlusService.CheckAlbumFavorites(player.id, this.mediaItem.id)
            .then(result => {

              // load results, and resolve the promise.
              // only 1 result is returned, so just take the first key value.
              this.isAlbumFavorite = result[Object.keys(result)[0]];
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.isAlbumFavorite = undefined;
              this.alertErrorSet("Check Album Favorite failed: \n" + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseCheckAlbumFavorites);
      }

      // was this action chosen to be updated?
      if ((updateActions.indexOf(Actions.ArtistFavoriteUpdate) != -1) || (updateActions.length == 0)) {

        // create promise - check favorite status.
        const promiseCheckArtistFavorites = new Promise((resolve, reject) => {

          // call service to retrieve favorite setting.
          this.spotifyPlusService.CheckArtistsFollowing(player.id, this.mediaItem.artists[0].id)
            .then(result => {

              // load results, and resolve the promise.
              // only 1 result is returned, so just take the first key value.
              this.isArtistFavorite = result[Object.keys(result)[0]];
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.isArtistFavorite = undefined;
              this.alertErrorSet("Check Artist Following failed: \n" + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseCheckArtistFavorites);
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
      this.alertErrorSet("Album actions refresh failed: \n" + (error as Error).message);
      return true;

    }
    finally {
    }
  }

}

customElements.define('spc-album-actions', AlbumActions);
