// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import copyTextToClipboard from 'copy-text-to-clipboard';
import {
  mdiAccountMusic,
  mdiAlbum,
  mdiClipboardPlusOutline,
  mdiHeart,
  mdiHeartOutline,
  mdiDotsHorizontal,
  mdiMusic,
  mdiPlay,
  mdiPlaylistPlay,
  mdiRadio,
} from '@mdi/js';

// our imports.
import { sharedStylesGrid } from '../styles/shared-styles-grid';
import { sharedStylesMediaInfo } from '../styles/shared-styles-media-info';
import { sharedStylesFavActions } from '../styles/shared-styles-fav-actions';
import { FavActionsBase } from './fav-actions-base';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { IAlbumPageSimplified } from '../types/spotifyplus/album-page-simplified';
import { IArtist, GetGenres } from '../types/spotifyplus/artist';
import { openWindowNewTab } from '../utils/media-browser-utils';
import { SearchMediaTypes } from '../types/search-media-types';
import { SearchMediaEvent } from '../events/search-media';

/**
 * Artist actions.
 */
enum Actions {
  ArtistAlbumsUpdate = "ArtistAlbumsUpdate",
  ArtistCopyUriToClipboard = "ArtistCopyUriToClipboard",
  ArtistFavoriteAdd = "ArtistFavoriteAdd",
  ArtistFavoriteRemove = "ArtistFavoriteRemove",
  ArtistFavoriteUpdate = "ArtistFavoriteUpdate",
  ArtistSearchAlbums = "ArtistSearchAlbums",
  ArtistSearchPlaylists = "ArtistSearchPlaylists",
  ArtistSearchRadio = "ArtistSearchRadio",
  ArtistSearchTracks = "ArtistSearchTracks",
}


class ArtistActions extends FavActionsBase {

  // public state properties.
  @property({ attribute: false }) mediaItem!: IArtist;

  // private state properties.
  @state() private artistAlbums?: IAlbumPageSimplified;
  @state() private isArtistFavorite?: boolean;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.ARTIST_FAVORITES);

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
          label="Add Artist &quot;${this.mediaItem.name}&quot; from Favorites"
          @click=${() => this.onClickAction(Actions.ArtistFavoriteAdd)}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    const actionArtistFavoriteRemove = html`
      <div class="display-inline">
        <ha-icon-button 
          .path=${mdiHeart}
          label="Remove Artist &quot;${this.mediaItem.name}&quot; from Favorites"
          @click=${() => this.onClickAction(Actions.ArtistFavoriteRemove)}
          slot="icon-button-small-selected"
        ></ha-icon-button>
      </div>
     `;

    // define supporting icons.
    const iconArtist = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiAccountMusic}
          .label="View Artist &quot;${this.mediaItem.name}&quot; info on Spotify.com"
          @click=${() => openWindowNewTab(this.mediaItem.external_urls.spotify || "")}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    // define dropdown menu actions - artist.
    const actionsArtistHtml = html`
      <ha-md-button-menu slot="selection-bar" positioning="popover">
        <ha-assist-chip slot="trigger">
          <ha-svg-icon slot="icon" .path=${mdiDotsHorizontal}></ha-svg-icon>
        </ha-assist-chip>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistSearchAlbums)} hide=${this.hideSearchType(SearchMediaTypes.ALBUMS)}>
          <ha-svg-icon slot="start" .path=${mdiAlbum}></ha-svg-icon>
          <div slot="headline">Search for Artist Albums</div>
        </ha-md-menu-item>
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
    return html` 
      <div class="artist-actions-container">
        ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
        <div class="media-info-content">
          <div class="img" style="background:url(${this.mediaItem.image_url});"></div>
          <div class="media-info-details">
            <div class="media-info-text-ms-c">
              ${iconArtist}
              ${this.mediaItem.name}
              ${(this.isArtistFavorite ? actionArtistFavoriteRemove : actionArtistFavoriteAdd)}
              <span class="actions-dropdown-menu">
                ${actionsArtistHtml}
              </span>
            </div>
            <div class="grid artist-info-grid">
              ${this.mediaItem.followers ? html`
                <div class="grid-action-info-hdr-s"># Followers</div>
                <div class="grid-action-info-text-s">${this.mediaItem.followers.total || 0}</div>
              ` : html`<div></div><div></div>`}
              <div class="grid-action-info-text-s"></div>
              ${this.mediaItem.genres.length > 0 ? html`
                <div class="grid-action-info-hdr-s">Genres</div>
                <div class="grid-action-info-text-s">${GetGenres(this.mediaItem)}</div>
              ` : html`<div></div><div></div>`}
            </div>
          </div>
        </div>
        <div class="grid-container-scrollable">
          <div class="grid albums-grid">
            <div class="grid-header">&nbsp;</div>
            <div class="grid-header">#</div>
            <div class="grid-header">Title</div>
            <div class="grid-header">Released</div>
            <div class="grid-header grid-header-last">Type</div>
            ${this.artistAlbums?.items.map((item, index) => html`
              <ha-icon-button
                .path=${mdiPlay}
                .label="Play album &quot;${item.name}&quot;"
                @click=${() => this.onClickMediaItem(item)}
                slot="icon-button"
              >&nbsp;</ha-icon-button>
              <div class="grid-entry">${index + 1}</div>
              <div class="grid-entry">${item.name}</div>
              <div class="grid-entry">${item.release_date}</div>
              <div class="grid-entry">${item.album_type}</div>
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

      .artist-info-grid {
        grid-template-columns: auto auto auto;
        justify-content: left;
      }

      .artist-actions-container {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;  
      }

      /* style albums container and grid */
      .albums-grid {
        grid-template-columns: 40px 30px auto auto auto;
      }

      /* style ha-icon-button controls in tracks grid: icon size, title text */
      .albums-grid > ha-icon-button[slot="icon-button"] {
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
      if (action == Actions.ArtistCopyUriToClipboard) {

        copyTextToClipboard(this.mediaItem.uri);
        return true;

      } else if (action == Actions.ArtistSearchAlbums) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.ALBUMS, this.mediaItem.name));
        return true;

      } else if (action == Actions.ArtistSearchPlaylists) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.PLAYLISTS, this.mediaItem.name));
        return true;

      } else if (action == Actions.ArtistSearchRadio) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.PLAYLISTS, this.mediaItem.name + " Radio"));
        return true;

      } else if (action == Actions.ArtistSearchTracks) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.TRACKS, this.mediaItem.name));
        return true;

      }

      // show progress indicator.
      this.progressShow();

      // call service based on requested action, and refresh affected action component.
      if (action == Actions.ArtistFavoriteAdd) {

        await this.spotifyPlusService.FollowArtists(this.player.id, this.mediaItem.id);
        this.updateActions(this.player, [Actions.ArtistFavoriteUpdate]);

      } else if (action == Actions.ArtistFavoriteRemove) {

        await this.spotifyPlusService.UnfollowArtists(this.player.id, this.mediaItem.id);
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
      if ((updateActions.indexOf(Actions.ArtistAlbumsUpdate) != -1) || (updateActions.length == 0)) {

        // create promise - get action list data.
        const promiseGetArtistAlbums = new Promise((resolve, reject) => {

          const market = null;
          const include_groups = "album,appears_on,compilation";
          const limit_total = 300;
          const sort_result = true;

          // call service to retrieve artist albums.
          this.spotifyPlusService.GetArtistAlbums(player.id, this.mediaItem.id, include_groups, 0, 0, market, limit_total, sort_result)
            .then(albums => {

              // stash the result into state, and resolve the promise.
              this.artistAlbums = albums;
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.artistAlbums = undefined;
              this.alertErrorSet("Get Artist Albums failed: \n" + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseGetArtistAlbums);
      }

      // was this action chosen to be updated?
      if ((updateActions.indexOf(Actions.ArtistFavoriteUpdate) != -1) || (updateActions.length == 0)) {

        // create promise - check favorite status.
        const promiseCheckArtistFavorites = new Promise((resolve, reject) => {

          // call service to retrieve favorite setting.
          this.spotifyPlusService.CheckArtistsFollowing(player.id, this.mediaItem.id)
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
      this.alertErrorSet("Artist actions refresh failed: \n" + (error as Error).message);
      return true;

    }
    finally {
    }
  }

}

customElements.define('spc-artist-actions', ArtistActions);
