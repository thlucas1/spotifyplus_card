// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import {
  mdiAlbum,
  mdiBookOpenVariant,
  mdiMicrophone,
  mdiMenuDown,
  mdiMusic,
  mdiAccountMusic,
  mdiPlaylistPlay,
  mdiPodcast,
} from '@mdi/js';

// our imports.
import '../components/media-browser-list';
import '../components/media-browser-icons';
import '../components/album-actions';
import '../components/artist-actions';
import '../components/audiobook-actions';
import '../components/episode-actions';
import '../components/playlist-actions';
import '../components/show-actions';
import '../components/track-actions';
import { sharedStylesFavBrowser } from '../styles/shared-styles-fav-browser.js';
import { FavBrowserBase } from './fav-browser-base';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { formatTitleInfo } from '../utils/media-browser-utils';
import { storageService } from '../decorators/storage';
import { SearchMediaTypes } from '../types/search-media-types';

// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":search-media-browser");

/** Keys used to access cached storage items. */
const CACHE_KEY_SEARCH_MEDIA_TYPE = "_searchmediatype";

const SEARCH_FOR_PREFIX = "Search for ";


@customElement("spc-search-media-browser")
export class SearchBrowser extends FavBrowserBase {

  // private state properties.
  @state() private searchMediaType?: string;
  @state() private searchMediaTypeTitle?: string;

  // html form element objects.
  @query("#searchMediaType", false) private searchMediaTypeElement!: HTMLElement;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.SEARCH_MEDIA);
    this.filterCriteriaPlaceholder = "search by name";

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
    const title = formatTitleInfo(this.config.searchMediaBrowserTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList);
    const subtitle = formatTitleInfo(this.config.searchMediaBrowserSubTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList);

    // get items per row based on configuration settings.
    // if not using search settings, then use individual media type settings.
    const searchType = this.searchMediaType;
    let itemsPerRow = this.config.searchMediaBrowserItemsPerRow || 4;
    if (!(this.config.searchMediaBrowserUseDisplaySettings || false)) {
      if (searchType == SearchMediaTypes.ALBUMS) {
        itemsPerRow = this.config.albumFavBrowserItemsPerRow || 4;
      } else if (searchType == SearchMediaTypes.ARTISTS) {
        itemsPerRow = this.config.artistFavBrowserItemsPerRow || 4;
      } else if (searchType == SearchMediaTypes.AUDIOBOOKS) {
        itemsPerRow = this.config.audiobookFavBrowserItemsPerRow || 4;
      } else if (searchType == SearchMediaTypes.EPISODES) {
        itemsPerRow = this.config.episodeFavBrowserItemsPerRow || 4;
      } else if (searchType == SearchMediaTypes.PLAYLISTS) {
        itemsPerRow = this.config.playlistFavBrowserItemsPerRow || 4;
      } else if (searchType == SearchMediaTypes.SHOWS) {
        itemsPerRow = this.config.showFavBrowserItemsPerRow || 4;
      } else if (searchType == SearchMediaTypes.TRACKS) {
        itemsPerRow = this.config.trackFavBrowserItemsPerRow || 4;
      }
    }

    // update search media type if configuration options changed.
    //if (this.isCardInEditPreview) {
    if ((this.config.searchMediaBrowserSearchTypes) && (this.config.searchMediaBrowserSearchTypes.length > 0)) {
      if (!(this.config.searchMediaBrowserSearchTypes?.includes(this.searchMediaType as SearchMediaTypes))) {

        // hidden type is currently selected - reset current selection to first enabled.
        this.searchMediaType = this.config.searchMediaBrowserSearchTypes[0];
        this.searchMediaTypeTitle = SEARCH_FOR_PREFIX + this.searchMediaType;

        // clear the media list, as the items no longer match the search media type.
        this.mediaList = undefined;
        this.mediaListLastUpdatedOn = 0;
        this.scrollTopSaved = 0;
      }
    }
    //}

    // define control to render - search media type.
    const searchMediaTypeHtml = html`
      <ha-md-button-menu id="searchMediaType" slot="selection-bar" style="padding-right: 0.5rem;">
        <ha-assist-chip id="searchMediaTypeTitle" slot="trigger" .label=${this.searchMediaTypeTitle || SEARCH_FOR_PREFIX + " ..."}>
          <ha-svg-icon slot="trailing-icon" .path=${mdiMenuDown}></ha-svg-icon>
        </ha-assist-chip>
        <ha-md-menu-item .value=${SearchMediaTypes.ALBUMS} @click=${this.onSearchMediaTypeChanged} hide=${this.hideSearchType(SearchMediaTypes.ALBUMS)}>
          <ha-svg-icon slot="start" .path=${mdiAlbum}></ha-svg-icon>
          <div slot="headline">${SearchMediaTypes.ALBUMS}</div>
        </ha-md-menu-item>
        <ha-md-menu-item .value=${SearchMediaTypes.ARTISTS} @click=${this.onSearchMediaTypeChanged} hide=${this.hideSearchType(SearchMediaTypes.ARTISTS)}>
          <ha-svg-icon slot="start" .path=${mdiAccountMusic}></ha-svg-icon>
          <div slot="headline">${SearchMediaTypes.ARTISTS}</div>
        </ha-md-menu-item>
        <ha-md-menu-item .value=${SearchMediaTypes.AUDIOBOOKS} @click=${this.onSearchMediaTypeChanged} hide=${this.hideSearchType(SearchMediaTypes.AUDIOBOOKS)}>
          <ha-svg-icon slot="start" .path=${mdiBookOpenVariant}></ha-svg-icon>
          <div slot="headline">${SearchMediaTypes.AUDIOBOOKS}</div>
        </ha-md-menu-item>
        <ha-md-menu-item .value=${SearchMediaTypes.EPISODES} @click=${this.onSearchMediaTypeChanged} hide=${this.hideSearchType(SearchMediaTypes.EPISODES)}>
          <ha-svg-icon slot="start" .path=${mdiMicrophone}></ha-svg-icon>
          <div slot="headline">${SearchMediaTypes.EPISODES}</div>
        </ha-md-menu-item>
        <ha-md-menu-item .value=${SearchMediaTypes.PLAYLISTS} @click=${this.onSearchMediaTypeChanged} hide=${this.hideSearchType(SearchMediaTypes.PLAYLISTS)}>
          <ha-svg-icon slot="start" .path=${mdiPlaylistPlay}></ha-svg-icon>
          <div slot="headline">${SearchMediaTypes.PLAYLISTS}</div>
        </ha-md-menu-item>
        <ha-md-menu-item .value=${SearchMediaTypes.SHOWS} @click=${this.onSearchMediaTypeChanged} hide=${this.hideSearchType(SearchMediaTypes.SHOWS)}>
          <ha-svg-icon slot="start" .path=${mdiPodcast}></ha-svg-icon>
          <div slot="headline">${SearchMediaTypes.SHOWS}</div>
        </ha-md-menu-item>
        <ha-md-menu-item .value=${SearchMediaTypes.TRACKS} @click=${this.onSearchMediaTypeChanged} hide=${this.hideSearchType(SearchMediaTypes.TRACKS)}>
          <ha-svg-icon slot="start" .path=${mdiMusic}></ha-svg-icon>
          <div slot="headline">${SearchMediaTypes.TRACKS}</div>
        </ha-md-menu-item>
      </ha-md-button-menu>
      `;

    // set scroll position (if needed).
    this.setScrollPosition();

    // render html.
    return html`

      <div class="media-browser-section">
        ${title ? html`<div class="media-browser-section-title">${title}</div>` : html``}
        ${subtitle ? html`<div class="media-browser-section-subtitle">${subtitle}</div>` : html``}
        <div class="search-media-browser-controls">
          ${!(this.isActionsVisible || false) ? html`` : html`${this.btnHideActionsHtml}`}
          ${searchMediaTypeHtml}${this.filterCriteriaHtml}${this.refreshMediaListHtml}
        </div>
        <div id="mediaBrowserContentElement" class="media-browser-content">
          ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
          ${this.alertInfo ? html`<ha-alert alert-type="info" dismissable @alert-dismissed-clicked=${this.alertInfoClear}>${this.alertInfo}</ha-alert>` : ""}
          ${(() => {
            // if actions are not visbile, then render the media list.
            if (!this.isActionsVisible) {
              if (itemsPerRow === 1) {
                return (
                  html`<spc-media-browser-list class="media-browser-list"
                        .items=${this.mediaList}
                        .store=${this.store}
                        .mediaType=${this.searchMediaType}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                      ></spc-media-browser-list>`
                )
              } else {
                return (
                  html`<spc-media-browser-icons class="media-browser-list"
                        .items=${this.mediaList}
                        .store=${this.store}
                        .mediaType=${this.searchMediaType}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                      ></spc-media-browser-icons>`
                )
              }
            // if actions are visbile, then render the actions display.
            } else if (this.searchMediaType == SearchMediaTypes.ALBUMS) {
              return (html`<spc-album-actions class="search-media-browser-actions" .store=${this.store} .mediaItem=${this.mediaItem}></spc-album-actions>`);
            } else if (this.searchMediaType == SearchMediaTypes.ARTISTS) {
              return (html`<spc-artist-actions class="search-media-browser-actions" .store=${this.store} .mediaItem=${this.mediaItem}></spc-artist-actions>`);
            } else if (this.searchMediaType == SearchMediaTypes.AUDIOBOOKS) {
              return (html`<spc-audiobook-actions class="search-media-browser-actions" .store=${this.store} .mediaItem=${this.mediaItem}></spc-audiobook-actions>`);
            } else if (this.searchMediaType == SearchMediaTypes.EPISODES) {
              return (html`<spc-episode-actions class="search-media-browser-actions" .store=${this.store} .mediaItem=${this.mediaItem}></spc-episode-actions>`);
            } else if (this.searchMediaType == SearchMediaTypes.PLAYLISTS) {
              return (html`<spc-playlist-actions class="search-media-browser-actions" .store=${this.store} .mediaItem=${this.mediaItem}></spc-playlist-actions>`);
            } else if (this.searchMediaType == SearchMediaTypes.SHOWS) {
              return (html`<spc-show-actions class="search-media-browser-actions" .store=${this.store} .mediaItem=${this.mediaItem}></spc-show-actions>`);
            } else if (this.searchMediaType == SearchMediaTypes.TRACKS) {
              return (html`<spc-track-actions class="search-media-browser-actions" .store=${this.store} .mediaItem=${this.mediaItem}></spc-track-actions>`);
            } else {
              return (html``);
            }
          })()}
        </div>
      </div>
    `;
  }


  /** 
   * style definitions used by this component.
   * */
  static get styles() {

    return [
      sharedStylesFavBrowser,
      css`

      /* extra styles not defined in sharedStylesFavBrowser would go here. */

      .search-media-browser-controls {
        margin-top: 0.5rem;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        margin-bottom: 0rem;
        white-space: nowrap;
        align-items: left;
        --ha-select-height: 2.5rem;           /* ha dropdown control height */
        --mdc-menu-item-height: 2.5rem;       /* mdc dropdown list item height */
        --mdc-icon-button-size: 2.5rem;       /* mdc icon button size */
        --md-menu-item-top-space: 0.5rem;     /* top spacing between items */
        --md-menu-item-bottom-space: 0.5rem;  /* bottom spacing between items */
        --md-menu-item-one-line-container-height: 2.0rem;  /* menu item height */
        display: inline-flex;
        flex-direction: row;
        justify-content: left;
      }

      .search-media-browser-actions {
        height: 100%;
      }

      /* <ha-md-button-menu> related styles */
      ha-assist-chip {
        --ha-assist-chip-container-shape: 10px;
        --ha-assist-chip-container-color: var(--card-background-color);
      }

      .selection-bar {
        background: rgba(var(--rgb-primary-color), 0.1);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        box-sizing: border-box;
        font-size: 14px;
        --ha-assist-chip-container-color: var(--card-background-color);
      }

      .selection-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .selection-controls p {
        margin-left: 8px;
        margin-inline-start: 8px;
        margin-inline-end: initial;
      }

      .center-vertical {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .relative {
        position: relative;
      }

      *[hide="true"] {
        display: none;
      }

      *[hide="false"] {
        display: block;
      }
    `
    ];
  }


  /**
   * Returns false if the specified feature is to be SHOWN; otherwise, returns true
   * if the specified feature is to be HIDDEN (via CSS).
   * 
   * @param searchType Search type to check.
   */
  private hideSearchType(searchType: SearchMediaTypes) {

    if ((this.config.searchMediaBrowserSearchTypes) && (this.config.searchMediaBrowserSearchTypes.length > 0)) {
      if (this.config.searchMediaBrowserSearchTypes?.includes(searchType)) {
        return false;  // show searchType
      } else {
        return true;   // hide searchType.
      }
    }

    // if features not configured, then show search type.
    return false;
  }


  /**
   * Loads values from persistant storage.
   */
  protected override storageValuesLoad() {

    // invoke base class method.
    super.storageValuesLoad();

    // get default search type, based on enabled status.
    // if none enabled, then use playlists; if playlists not enabled, then use first enabled.
    let searchType = SearchMediaTypes.PLAYLISTS;
    if ((this.config.searchMediaBrowserSearchTypes) && (this.config.searchMediaBrowserSearchTypes.length > 0)) {
      if (!(this.config.searchMediaBrowserSearchTypes.includes(searchType))) {
        searchType = ((this.config?.searchMediaBrowserSearchTypes[0] || "") as SearchMediaTypes);
      }
    }

    // load search-related values from the cache.
    this.searchMediaType = storageService.getStorageValue(this.cacheKeyBase + this.mediaType + CACHE_KEY_SEARCH_MEDIA_TYPE, searchType);
    this.searchMediaTypeTitle = SEARCH_FOR_PREFIX + this.searchMediaType;

    if (debuglog.enabled) {
      debuglog("storageValuesLoad - parameters loaded from cache: searchMediaType");
    }

  }


  /**
   * Saves values to persistant storage.
   */
  protected override storageValuesSave() {

    // invoke base class method.
    super.storageValuesSave();

    // save search-related values to the cache.
    storageService.setStorageValue(this.cacheKeyBase + this.mediaType + CACHE_KEY_SEARCH_MEDIA_TYPE, this.searchMediaType);

    if (debuglog.enabled) {
      debuglog("storageValuesSave - parameters saved to cache: searchMediaType");
    }

  }


  private onSearchMediaTypeChanged(ev) {

    // if value did not change then don't bother.
    if (this.searchMediaType == ev.currentTarget.value) {
      return;
    }

    // store changed value.
    this.searchMediaType = ev.currentTarget.value;
    this.searchMediaTypeTitle = SEARCH_FOR_PREFIX + this.searchMediaType;

    // clear the media list, as the items no longer match the search media type.
    this.mediaList = undefined;
    this.mediaListLastUpdatedOn = 0;
    this.scrollTopSaved = 0;

    // clear alerts.
    this.alertClear();

    // hide actions container (if visible).
    if (this.isActionsVisible) {
      this.isActionsVisible = false;
    }

  }


  /**
   * Updates the mediaList display.
   */
  protected override updateMediaList(player: MediaPlayer): boolean {

    if (debuglog.enabled) {
      debuglog("%c updateMediaList - updating medialist",
        "color: yellow;",
      );
    }

    // validations.
    if (!this.filterCriteria) {
      this.alertErrorSet("Please enter criteria to search for");
      this.filterCriteriaElement.focus();
      return false;
    }
    if (!this.searchMediaType) {
      this.alertErrorSet("Please select the type of content to search for");
      this.searchMediaTypeElement.focus();
      return false;
    }

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

        // update status.
        this.alertInfo = "Searching Spotify " + this.searchMediaType + " catalog for \"" + this.filterCriteria + "\" ...";

        // set service parameters.
        const limitTotal = this.config.searchMediaBrowserSearchLimit || 50;
        const market: string | undefined = undefined;            // market code.
        const includeExternal: string | undefined = undefined;   // include_exclude code.

        // call the service to retrieve the media list.
        this.spotifyPlusService.Search(this.searchMediaType as SearchMediaTypes, player.id, this.filterCriteria || "", 0, 0, market, includeExternal, limitTotal)
          .then(result => {

            // load media list results.
            this.mediaList = result.items as [any];
            this.mediaListLastUpdatedOn = result.lastUpdatedOn || (Date.now() / 1000);

            // clear certain info messsages if they are temporary.
            if (this.alertInfo?.startsWith("Searching Spotify")) {
              this.alertInfoClear();
            }

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
            super.updatedMediaListError("Spotify " + this.searchMediaType + " search failed: \n" + (error as Error).message);

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
      super.updatedMediaListError("Spotify " + this.searchMediaType + " search failed: \n" + (error as Error).message);
      return true;

    }
    finally {
    }

  }

}
