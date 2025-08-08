// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import copyTextToClipboard from 'copy-text-to-clipboard';
import {
  mdiAccountMusic,
  mdiAlbum,
  mdiBookmarkMusicOutline,
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
import { PlayerBodyBase } from './player-body-base';
import { MediaPlayer } from '../model/media-player';
import { SearchMediaTypes } from '../types/search-media-types';
import { SearchMediaEvent } from '../events/search-media';
import { getIdFromSpotifyUri } from '../services/spotifyplus-service';
import { openWindowNewTab } from '../utils/media-browser-utils';
import { copyToClipboard, formatDateHHMMSSFromMilliseconds, getHomeAssistantErrorMessage } from '../utils/utils';
import { ALERT_INFO_PRESET_COPIED_TO_CLIPBOARD, ALERT_INFO_PRESET_JSON_COPIED_TO_CLIPBOARD, RADIO_SEARCH_KEY } from '../constants.js';
import { GetUserPresetConfigEntry, GetUserPresetConfigEntryJson, GetUserPresetObject } from '../types/spotifyplus/user-preset.js';
import { ITrack } from '../types/spotifyplus/track';
import { updateCardConfigurationStorage } from '../utils/lovelace-config-util.js';

/**
 * Track actions.
 */
enum Actions {
  GetPlayingItem = "GetPlayingItem",
  AlbumCopyPresetToClipboard = "AlbumCopyPresetToClipboard",
  AlbumCopyPresetJsonToClipboard = "AlbumCopyPresetJsonToClipboard",
  AlbumCopyUriToClipboard = "AlbumCopyUriToClipboard",
  AlbumFavoriteAdd = "AlbumFavoriteAdd",
  AlbumFavoriteRemove = "AlbumFavoriteRemove",
  AlbumFavoriteUpdate = "AlbumFavoriteUpdate",
  AlbumSearchRadio = "AlbumSearchRadio",
  AlbumShowTracks = "AlbumShowTracks",
  AlbumUserPresetAdd = "AlbumUserPresetAdd",
  ArtistCopyPresetToClipboard = "ArtistCopyPresetToClipboard",
  ArtistCopyPresetJsonToClipboard = "ArtistCopyPresetJsonToClipboard",
  ArtistCopyUriToClipboard = "ArtistCopyUriToClipboard",
  ArtistFavoriteAdd = "ArtistFavoriteAdd",
  ArtistFavoriteRemove = "ArtistFavoriteRemove",
  ArtistFavoriteUpdate = "ArtistFavoriteUpdate",
  ArtistSearchPlaylists = "ArtistSearchPlaylists",
  ArtistSearchRadio = "ArtistSearchRadio",
  ArtistSearchTracks = "ArtistSearchTracks",
  ArtistShowAlbums = "ArtistShowAlbums",
  ArtistShowAlbumsAppearsOn = "ArtistShowAlbumsAppearsOn",
  ArtistShowAlbumsCompilation = "ArtistShowAlbumsCompilation",
  ArtistShowAlbumsSingle = "ArtistShowAlbumsSingle",
  ArtistShowRelatedArtists = "ArtistShowRelatedArtists",
  ArtistShowTopTracks = "ArtistShowTopTracks",
  ArtistUserPresetAdd = "ArtistUserPresetAdd",
  TrackCopyPresetToClipboard = "TrackCopyPresetToClipboard",
  TrackCopyPresetJsonToClipboard = "TrackCopyPresetJsonToClipboard",
  TrackCopyUriToClipboard = "TrackCopyUriToClipboard",
  TrackFavoriteAdd = "TrackFavoriteAdd",
  TrackFavoriteRemove = "TrackFavoriteRemove",
  TrackFavoriteUpdate = "TrackFavoriteUpdate",
  TrackSearchPlaylists = "TrackSearchPlaylists",
  TrackSearchRadio = "TrackSearchRadio",
  TrackUserPresetAdd = "TrackUserPresetAdd",
}


export class PlayerBodyTrack extends PlayerBodyBase {

  // private state properties.
  @state() private isAlbumFavorite?: boolean;
  @state() private isArtistFavorite?: boolean;
  @state() public isTrackFavorite?: boolean;
  @state() private track?: ITrack;

  // public properties.
  public actionTrackFavoriteAdd?: any;
  public actionTrackFavoriteRemove?: any;


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

    this.actionTrackFavoriteAdd = html`
      <div class="display-inline">
        <ha-icon-button
          .path=${mdiHeartOutline}
          label="Add Track &quot;${this.track?.name}&quot; to Favorites"
          @click=${() => this.onClickAction(Actions.TrackFavoriteAdd)}
          slot="icon-button-small"
        ></ha-icon-button>
      </div>
     `;

    this.actionTrackFavoriteRemove = html`
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

    // define dropdown menu actions - track.
    const actionsTrackHtml = html`
      <ha-md-button-menu slot="selection-bar" positioning="popover">
        <ha-assist-chip slot="trigger">
          <ha-svg-icon slot="icon" .path=${mdiDotsHorizontal}></ha-svg-icon>
        </ha-assist-chip>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.TrackSearchPlaylists)} hide=${this.hideSearchType(SearchMediaTypes.PLAYLISTS)}>
          <ha-svg-icon slot="start" .path=${mdiPlaylistPlay}></ha-svg-icon>
          <div slot="headline">Search Playlists for Track</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.TrackSearchRadio)} hide=${this.hideSearchType(SearchMediaTypes.PLAYLISTS)}>
          <ha-svg-icon slot="start" .path=${mdiRadio}></ha-svg-icon>
          <div slot="headline">Search for Track Radio</div>
        </ha-md-menu-item>
        <ha-md-divider role="separator" tabindex="-1"></ha-md-divider>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.TrackUserPresetAdd)}>
          <ha-svg-icon slot="start" .path=${mdiBookmarkMusicOutline}></ha-svg-icon>
          <div slot="headline">Add Track to User Presets</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.TrackCopyPresetToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiBookmarkMusicOutline}></ha-svg-icon>
          <div slot="headline">Copy Track Preset Info to Clipboard</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.TrackCopyPresetJsonToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiBookmarkMusicOutline}></ha-svg-icon>
          <div slot="headline">Copy Track Preset JSON to Clipboard</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.TrackCopyUriToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiClipboardPlusOutline}></ha-svg-icon>
          <div slot="headline">Copy Track URI to Clipboard</div>
        </ha-md-menu-item>
      </ha-md-button-menu>
      `;

    // define dropdown menu actions - album.
    const actionsAlbumHtml = html`
      <ha-md-button-menu slot="selection-bar" positioning="popover">
        <ha-assist-chip slot="trigger">
          <ha-svg-icon slot="icon" .path=${mdiDotsHorizontal}></ha-svg-icon>
        </ha-assist-chip>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.AlbumShowTracks)} hide=${this.hideSearchType(SearchMediaTypes.TRACKS)}>
          <ha-svg-icon slot="start" .path=${mdiMusic}></ha-svg-icon>
          <div slot="headline">Show Album Tracks</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.AlbumSearchRadio)} hide=${this.hideSearchType(SearchMediaTypes.PLAYLISTS)}>
          <ha-svg-icon slot="start" .path=${mdiRadio}></ha-svg-icon>
          <div slot="headline">Search for Album Radio</div>
        </ha-md-menu-item>
        <ha-md-divider role="separator" tabindex="-1"></ha-md-divider>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.AlbumUserPresetAdd)}>
          <ha-svg-icon slot="start" .path=${mdiBookmarkMusicOutline}></ha-svg-icon>
          <div slot="headline">Add Album to User Presets</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.AlbumCopyPresetToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiBookmarkMusicOutline}></ha-svg-icon>
          <div slot="headline">Copy Album Preset Info to Clipboard</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.AlbumCopyPresetJsonToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiBookmarkMusicOutline}></ha-svg-icon>
          <div slot="headline">Copy Album Preset JSON to Clipboard</div>
        </ha-md-menu-item>
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
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistShowTopTracks)} hide=${this.hideSearchType(SearchMediaTypes.TRACKS)}>
          <ha-svg-icon slot="start" .path=${mdiMusic}></ha-svg-icon>
          <div slot="headline">Show Artist Top Tracks</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistShowAlbums)} hide=${this.hideSearchType(SearchMediaTypes.ALBUMS)}>
          <ha-svg-icon slot="start" .path=${mdiAlbum}></ha-svg-icon>
          <div slot="headline">Show Artist Albums</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistShowAlbumsCompilation)} hide=${this.hideSearchType(SearchMediaTypes.ALBUMS)}>
          <ha-svg-icon slot="start" .path=${mdiAlbum}></ha-svg-icon>
          <div slot="headline">Show Artist Albums Compilations</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistShowAlbumsSingle)} hide=${this.hideSearchType(SearchMediaTypes.ALBUMS)}>
          <ha-svg-icon slot="start" .path=${mdiAlbum}></ha-svg-icon>
          <div slot="headline">Show Artist Albums Singles</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistShowAlbumsAppearsOn)} hide=${this.hideSearchType(SearchMediaTypes.ALBUMS)}>
          <ha-svg-icon slot="start" .path=${mdiAlbum}></ha-svg-icon>
          <div slot="headline">Show Artist Albums AppearsOn</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistShowRelatedArtists)} hide=${this.hideSearchType(SearchMediaTypes.ARTISTS)}>
          <ha-svg-icon slot="start" .path=${mdiAccountMusic}></ha-svg-icon>
          <div slot="headline">Show Related Artists</div>
        </ha-md-menu-item>
        <ha-md-divider role="separator" tabindex="-1"></ha-md-divider>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistUserPresetAdd)}>
          <ha-svg-icon slot="start" .path=${mdiBookmarkMusicOutline}></ha-svg-icon>
          <div slot="headline">Add Artist to User Presets</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistCopyPresetToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiBookmarkMusicOutline}></ha-svg-icon>
          <div slot="headline">Copy Artist Preset Info to Clipboard</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistCopyPresetJsonToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiBookmarkMusicOutline}></ha-svg-icon>
          <div slot="headline">Copy Artist Preset JSON to Clipboard</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.ArtistCopyUriToClipboard)}>
          <ha-svg-icon slot="start" .path=${mdiClipboardPlusOutline}></ha-svg-icon>
          <div slot="headline">Copy Artist URI to Clipboard</div>
        </ha-md-menu-item>
      </ha-md-button-menu>
      `;

    const actionTrackSummary = html`
      <div class="media-info-content">
        <div class="media-info-details">
          <div class="media-info-text-ms-c">
            ${iconTrack}
            ${this.track?.name}
            ${(this.isTrackFavorite ? this.actionTrackFavoriteRemove : this.actionTrackFavoriteAdd)}
            <span class="actions-dropdown-menu">
              ${actionsTrackHtml}
            </span>
          </div>
          <div class="media-info-text-ms">
            ${iconAlbum}
            ${this.track?.album.name}
            ${(this.isAlbumFavorite ? actionAlbumFavoriteRemove : actionAlbumFavoriteAdd)}
            <span class="actions-dropdown-menu">
              ${actionsAlbumHtml}
            </span>
          </div>
          <div class="media-info-text-ms">
            ${iconArtist}
            ${this.track?.artists[0].name}
            ${(this.isArtistFavorite ? actionArtistFavoriteRemove : actionArtistFavoriteAdd)}
            <span class="actions-dropdown-menu">
              ${actionsArtistHtml}
            </span>
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

            <div class="grid-action-info-hdr-s">URI</div>
            <div class="grid-action-info-text-s colspan-r3-c2 copy2cb" @click=${copyToClipboard}>${this.track?.uri}</div>

            ${this.track?.is_linked_from ? html`
              <div class="grid-action-info-hdr-s">Origin URI</div>
              <div class="grid-action-info-text-s colspan-r4-c2 copy2cb" @click=${copyToClipboard}>${this.track?.uri_origin}</div>
            ` : ""}

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
   * @param args Action arguments.
   */
  protected override async onClickAction(action: Actions): Promise<boolean> {

    try {

      // if editing the card, then don't bother updating actions as we will not
      // display the actions dialog.
      if (this.isCardInEditPreview) {
        return false;
      }

      // process actions that don't require a progress indicator.
      if (action == Actions.AlbumCopyPresetToClipboard) {

        copyTextToClipboard(GetUserPresetConfigEntry(this.track?.album, this.track?.album.artists[0].name));
        this.alertInfoSet(ALERT_INFO_PRESET_COPIED_TO_CLIPBOARD);
        return true;

      } else if (action == Actions.AlbumCopyPresetJsonToClipboard) {

        copyTextToClipboard(GetUserPresetConfigEntryJson(this.track?.album, this.track?.album.artists[0].name));
        this.alertInfoSet(ALERT_INFO_PRESET_JSON_COPIED_TO_CLIPBOARD);
        return true;

      } else if (action == Actions.AlbumCopyUriToClipboard) {

        copyTextToClipboard(this.track?.album.uri || "");
        return true;

      } else if (action == Actions.AlbumSearchRadio) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.PLAYLISTS, this.track?.album.name + RADIO_SEARCH_KEY + this.track?.artists[0].name));
        return true;

      } else if (action == Actions.AlbumShowTracks) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.ALBUM_TRACKS, this.track?.album.name + "; " + this.track?.artists[0].name, this.track?.album.name, this.track?.album.uri, null, this.track?.album));
        return true;

      } else if (action == Actions.ArtistCopyPresetToClipboard) {

        copyTextToClipboard(GetUserPresetConfigEntry(this.track?.artists[0]));
        this.alertInfoSet(ALERT_INFO_PRESET_COPIED_TO_CLIPBOARD);
        return true;

      } else if (action == Actions.ArtistCopyPresetJsonToClipboard) {

        copyTextToClipboard(GetUserPresetConfigEntryJson(this.track?.artists[0]));
        this.alertInfoSet(ALERT_INFO_PRESET_JSON_COPIED_TO_CLIPBOARD);
        return true;

      } else if (action == Actions.ArtistCopyUriToClipboard) {

        copyTextToClipboard(this.track?.artists[0].uri || "");
        return true;

      } else if (action == Actions.ArtistSearchPlaylists) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.PLAYLISTS, this.track?.artists[0].name));
        return true;

      } else if (action == Actions.ArtistSearchRadio) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.PLAYLISTS, this.track?.artists[0].name + RADIO_SEARCH_KEY));
        return true;

      } else if (action == Actions.ArtistSearchTracks) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.TRACKS, this.track?.artists[0].name));
        return true;

      } else if (action == Actions.ArtistShowAlbums) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.ARTIST_ALBUMS, this.track?.artists[0].name, this.track?.artists[0].name, this.track?.artists[0].uri));
        return true;

      } else if (action == Actions.ArtistShowAlbumsAppearsOn) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.ARTIST_ALBUMS_APPEARSON, this.track?.artists[0].name, this.track?.artists[0].name, this.track?.artists[0].uri));
        return true;

      } else if (action == Actions.ArtistShowAlbumsCompilation) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.ARTIST_ALBUMS_COMPILATION, this.track?.artists[0].name, this.track?.artists[0].name, this.track?.artists[0].uri));
        return true;

      } else if (action == Actions.ArtistShowAlbumsSingle) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.ARTIST_ALBUMS_SINGLE, this.track?.artists[0].name, this.track?.artists[0].name, this.track?.artists[0].uri));
        return true;

      } else if (action == Actions.ArtistShowRelatedArtists) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.ARTIST_RELATED_ARTISTS, this.track?.artists[0].name, this.track?.artists[0].name, this.track?.artists[0].uri));
        return true;

      } else if (action == Actions.ArtistShowTopTracks) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.ARTIST_TOP_TRACKS, this.track?.artists[0].name, this.track?.artists[0].name, this.track?.artists[0].uri));
        return true;

      } else if (action == Actions.TrackCopyPresetToClipboard) {

        copyTextToClipboard(GetUserPresetConfigEntry(this.track, this.track?.artists[0].name));
        this.alertInfoSet(ALERT_INFO_PRESET_COPIED_TO_CLIPBOARD);
        return true;

      } else if (action == Actions.TrackCopyPresetJsonToClipboard) {

        copyTextToClipboard(GetUserPresetConfigEntryJson(this.track, this.track?.artists[0].name));
        this.alertInfoSet(ALERT_INFO_PRESET_JSON_COPIED_TO_CLIPBOARD);
        return true;

      } else if (action == Actions.TrackCopyUriToClipboard) {

        copyTextToClipboard(this.track?.uri || "");
        return true;

      } else if (action == Actions.TrackSearchPlaylists) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.PLAYLISTS, this.track?.name + " " + this.track?.artists[0].name));
        return true;

      } else if (action == Actions.TrackSearchRadio) {

        this.dispatchEvent(SearchMediaEvent(SearchMediaTypes.PLAYLISTS, this.track?.name + RADIO_SEARCH_KEY + this.track?.artists[0].name));
        return true;

      }

      // show progress indicator.
      this.progressShow();

      // call service based on requested action, and refresh affected action component.
      if (action == Actions.AlbumUserPresetAdd) {

        this.store.config.userPresets?.unshift(GetUserPresetObject(this.track?.album));
        await updateCardConfigurationStorage(this.store.config);
        this.progressHide();

      } else if (action == Actions.AlbumFavoriteAdd) {

        await this.spotifyPlusService.SaveAlbumFavorites(this.player, this.track?.album.id);
        this.updateActions(this.player, [Actions.AlbumFavoriteUpdate]);

      } else if (action == Actions.AlbumFavoriteRemove) {

        await this.spotifyPlusService.RemoveAlbumFavorites(this.player, this.track?.album.id);
        this.updateActions(this.player, [Actions.AlbumFavoriteUpdate]);

      } else if (action == Actions.ArtistUserPresetAdd) {

        if (this.track) {
          this.track.artists[0].image_url = this.track?.album.image_url;
          this.store.config.userPresets?.unshift(GetUserPresetObject(this.track?.artists[0]));
          await updateCardConfigurationStorage(this.store.config);
          this.progressHide();
        }

      } else if (action == Actions.ArtistFavoriteAdd) {

        await this.spotifyPlusService.FollowArtists(this.player, this.track?.artists[0].id);
        this.updateActions(this.player, [Actions.ArtistFavoriteUpdate]);

      } else if (action == Actions.ArtistFavoriteRemove) {

        await this.spotifyPlusService.UnfollowArtists(this.player, this.track?.artists[0].id);
        this.updateActions(this.player, [Actions.ArtistFavoriteUpdate]);

      } else if (action == Actions.TrackUserPresetAdd) {

        this.store.config.userPresets?.unshift(GetUserPresetObject(this.track));
        await updateCardConfigurationStorage(this.store.config);
        this.progressHide();

      } else if (action == Actions.TrackFavoriteAdd) {

        await this.spotifyPlusService.SaveTrackFavorites(this.player, this.track?.id);
        this.updateActions(this.player, [Actions.TrackFavoriteUpdate]);

      } else if (action == Actions.TrackFavoriteRemove) {

        await this.spotifyPlusService.RemoveTrackFavorites(this.player, this.track?.id);
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
      this.alertErrorSet("Track action failed: " + getHomeAssistantErrorMessage(error));
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
          this.spotifyPlusService.GetTrack(player, uriIdMediaItem)
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
              this.alertErrorSet("Get Track call failed: " + getHomeAssistantErrorMessage(error));
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
          this.spotifyPlusService.CheckAlbumFavorites(player, this.track?.album.id)
            .then(result => {

              // load results, and resolve the promise.
              // only 1 result is returned, so just take the first key value.
              this.isAlbumFavorite = result[Object.keys(result)[0]];
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.isAlbumFavorite = undefined;
              this.alertErrorSet("Check Album Favorites failed: " + getHomeAssistantErrorMessage(error));
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
          this.spotifyPlusService.CheckArtistsFollowing(player, this.track?.artists[0].id)
            .then(result => {

              // load results, and resolve the promise.
              // only 1 result is returned, so just take the first key value.
              this.isArtistFavorite = result[Object.keys(result)[0]];
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.isArtistFavorite = undefined;
              this.alertErrorSet("Check Artist Favorites failed: " + getHomeAssistantErrorMessage(error));
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
          this.spotifyPlusService.CheckTrackFavorites(player, this.track?.id)
            .then(result => {

              // load results, and resolve the promise.
              // only 1 result is returned, so just take the first key value.
              this.isTrackFavorite = result[Object.keys(result)[0]];
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.isTrackFavorite = undefined;
              this.alertErrorSet("Check Track Favorites failed: " + getHomeAssistantErrorMessage(error));
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
      this.alertErrorSet("Track actions refresh failed: " + getHomeAssistantErrorMessage(error));
      return true;

    }
    finally {
    }
  }

}

customElements.define('spc-player-body-track', PlayerBodyTrack);
