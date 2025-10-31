// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from './constants';
const debuglog = Debug(DEBUG_APP_NAME + ":card");

// lovelace card imports.
import { css, html, PropertyValues, TemplateResult, unsafeCSS } from 'lit';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map.js';
import { customElement, property, query, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';
import { HomeAssistant } from './types/home-assistant-frontend/home-assistant';
import { v4 as uuidv4 } from 'uuid';

// ** IMPORTANT - Vibrant notes:
// ensure that you have "compilerOptions"."lib": [ ... , "WebWorker" ] specified
// in your tsconfig.json!  If not, the Vibrant module will not initialize correctly
// and you will tear your hair out trying to figure out why it doesn't work!!!
import Vibrant from 'node-vibrant/dist/vibrant';
import { Palette } from '@vibrant/color';

// our imports - card sections and editor.
import './sections/album-fav-browser';          // SECTION.ALBUM_FAVORITES
import './sections/artist-fav-browser';         // SECTION.ARTIST_FAVORITES
import './sections/audiobook-fav-browser';      // SECTION.AUDIOBOOK_FAVORITES
import './sections/category-browser';           // SECTION.CATEGORYS
import './sections/device-browser';             // SECTION.DEVICES
import './sections/episode-fav-browser';        // SECTION.EPISODE_FAVORITES
import './sections/player';                     // SECTION.PLAYER
import './sections/playlist-fav-browser';       // SECTION.PLAYLIST_FAVORITES
import './sections/recent-browser';             // SECTION.RECENTS
import './sections/search-media-browser';       // SECTION.SEARCH_MEDIA
import './sections/show-fav-browser';           // SECTION.SHOW_FAVORITES
import './sections/track-fav-browser';          // SECTION.TRACK_FAVORITES
import './sections/userpreset-browser';         // SECTION.USERPRESETS
import './components/footer';
import './editor/editor';

// our imports.
import {
  BRAND_LOGO_IMAGE_BASE64,
  BRAND_LOGO_IMAGE_SIZE,
  FOOTER_ICON_SIZE_DEFAULT,
  PLAYER_CONTROLS_ICON_TOGGLE_COLOR_DEFAULT
} from './constants';
import {
  getConfigAreaForSection,
  getHomeAssistantErrorMessage,
  getSectionForConfigArea,
  isCardInDashboardEditor,
  isCardInEditPreview,
  isCardInPickerPreview,
  isNumber,
} from './utils/utils';
import { EDITOR_CONFIG_AREA_SELECTED, EditorConfigAreaSelectedEventArgs } from './events/editor-config-area-selected';
import { FILTER_SECTION_MEDIA, FilterSectionMediaEventArgs } from './events/filter-section-media';
import { PROGRESS_STARTED } from './events/progress-started';
import { PROGRESS_ENDED } from './events/progress-ended';
import { CATEGORY_DISPLAY, CategoryDisplayEventArgs } from './events/category-display';
import { SEARCH_MEDIA, SearchMediaEventArgs } from './events/search-media';
import { Store } from './model/store';
import { Section } from './types/section';
import { ConfigArea } from './types/config-area';
import { CardConfig } from './types/card-config';
import { CustomImageUrls } from './types/custom-image-urls';
import { SearchMediaTypes } from './types/search-media-types';
import { SearchBrowser } from './sections/search-media-browser';
import { AlertUpdatesBase } from './sections/alert-updates-base';
import { FavBrowserBase } from './sections/fav-browser-base';
import { RecentBrowser } from './sections/recent-browser';
import { UserPresetBrowser } from './sections/userpreset-browser';
import { AlbumFavBrowser } from './sections/album-fav-browser';
import { ArtistFavBrowser } from './sections/artist-fav-browser';
import { AudiobookFavBrowser } from './sections/audiobook-fav-browser';
import { CategoryBrowser } from './sections/category-browser';
import { DeviceBrowser } from './sections/device-browser';
import { EpisodeFavBrowser } from './sections/episode-fav-browser';
import { PlaylistFavBrowser } from './sections/playlist-fav-browser';
import { ShowFavBrowser } from './sections/show-fav-browser';
import { TrackFavBrowser } from './sections/track-fav-browser';
import { formatTitleInfo, removeSpecialChars } from './utils/media-browser-utils';

const HEADER_HEIGHT = 2;
const FOOTER_HEIGHT = 4;
const CARD_DEFAULT_HEIGHT = '35.15rem';
const CARD_DEFAULT_WIDTH = '35.15rem';
const CARD_EDIT_PREVIEW_HEIGHT = '42rem';
const CARD_EDIT_PREVIEW_WIDTH = '100%';
const CARD_PICK_PREVIEW_HEIGHT = '100%';
const CARD_PICK_PREVIEW_WIDTH = '100%';

const EDIT_TAB_HEIGHT = '48px';
const EDIT_BOTTOM_TOOLBAR_HEIGHT = '59px';

// Good source of help documentation on HA custom cards:
// https://gist.github.com/thomasloven/1de8c62d691e754f95b023105fe4b74b


@customElement("spotifyplus-card")
export class Card extends AlertUpdatesBase {

  /** 
   * Home Assistant will update the hass property of the config element on state changes, and 
   * the lovelace config element, which contains information about the dashboard configuration.
   * 
   * Whenever anything updates in Home Assistant, the hass object is updated and passed out
   * to every card. If you want to react to state changes, this is where you do it. If not, 
   * you can just ommit this setter entirely.
   * Note that if you do NOT have a `set hass(hass)` in your class, you can access the hass
   * object through `this.hass`. But if you DO have it, you need to save the hass object
   * manually, like so:
   *  `this._hass = hass;`
   * */

  // public state properties.
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) config!: CardConfig;
  @property({ attribute: false }) footerBackgroundColor?: string;

  // private state properties.
  @state() private section!: Section;
  @state() private showLoader!: boolean;
  @state() private loaderTimestamp!: number;
  @state() private cancelLoader!: boolean;
  @state() private playerId!: string;

  // vibrant processing state properties.
  @state() public playerImage?: string;
  @state() public playerMediaContentId?: string;
  @state() public vibrantImage?: string;
  @state() public vibrantMediaContentId?: string;
  @state() private vibrantColorVibrant?: string;
  @state() private vibrantColorMuted?: string;
  @state() private vibrantColorDarkVibrant?: string;
  @state() private vibrantColorDarkMuted?: string;
  @state() private vibrantColorLightVibrant?: string;
  @state() private vibrantColorLightMuted?: string;

  // card section references.
  @query("#elmSearchMediaBrowserForm", false) private elmSearchMediaBrowserForm!: SearchBrowser;
  @query("#elmCategoryBrowserForm", false) private elmCategoryBrowserForm!: CategoryBrowser;
  @query("#elmAlbumFavBrowserForm", false) private elmAlbumFavBrowserForm!: AlbumFavBrowser;
  @query("#elmArtistFavBrowserForm", false) private elmArtistFavBrowserForm!: ArtistFavBrowser;
  @query("#elmAudiobookFavBrowserForm", false) private elmAudiobookFavBrowserForm!: AudiobookFavBrowser;
  @query("#elmDeviceBrowserForm", false) private elmDeviceBrowserForm!: DeviceBrowser;
  @query("#elmEpisodeFavBrowserForm", false) private elmEpisodeFavBrowserForm!: EpisodeFavBrowser;
  @query("#elmPlaylistFavBrowserForm", false) private elmPlaylistFavBrowserForm!: PlaylistFavBrowser;
  @query("#elmRecentBrowserForm", false) private elmRecentBrowserForm!: RecentBrowser;
  @query("#elmShowFavBrowserForm", false) private elmShowFavBrowserForm!: ShowFavBrowser;
  @query("#elmTrackFavBrowserForm", false) private elmTrackFavBrowserForm!: TrackFavBrowser;
  @query("#elmUserPresetBrowserForm", false) private elmUserPresetBrowserForm!: UserPresetBrowser;

  /** Indicates if createStore method is executing for the first time (true) or not (false). */
  private isFirstTimeSetup: boolean = true;

  /** Indicates if an async update is in progress (true) or not (false). */
  protected isUpdateInProgressAsync!: boolean;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super();

    // initialize storage.
    this.showLoader = false;
    this.cancelLoader = false;
    this.loaderTimestamp = 0;

  }


  /** 
   * Invoked on each update to perform rendering tasks. 
   * 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // just in case hass property has not been set yet.
    if (!this.hass)
      return html``;

    // note that this cannot be called from `setConfig` method, as the `hass` property
    // has not been set set.
    this.createStore();

    // if no sections are configured then configure the default.
    if (!this.config.sections || this.config.sections.length === 0) {
      this.config.sections = [Section.PLAYER];
      Store.selectedConfigArea = ConfigArea.GENERAL;
    }

    //if (debuglog.enabled) {
    //  debuglog("render (card) - rendering card\n- store.section=%s\n- section=%s\n- Store.selectedConfigArea=%s\n- playerId=%s\n- config.sections=%s",
    //    JSON.stringify(this.store.section),
    //    JSON.stringify(this.section),
    //    JSON.stringify(Store.selectedConfigArea),
    //    JSON.stringify(this.playerId),
    //    JSON.stringify(this.config.sections),
    //  );
    //}

    // calculate height of the card, accounting for any extra
    // titles that are shown, footer, etc.
    const sections = this.config.sections;
    const showFooter = !sections || sections.length > 1;
    const title = formatTitleInfo(this.config.title, this.config, this.store.player);

    // check for background image changes.
    this.checkForBackgroundImageChange();

    // render html for the card.
    return html`
      <ha-card class="spc-card" style=${this.styleCard()}>
        <div class="spc-loader" ?hidden=${!this.showLoader}>
          <ha-spinner size="large"></ha-spinner>
        </div>
        ${title ? html`<div class="spc-card-header" style=${this.styleCardHeader()}>${title}</div>` : ""}
        ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
        ${this.alertInfo ? html`<ha-alert alert-type="info" dismissable @alert-dismissed-clicked=${this.alertInfoClear}>${this.alertInfo}</ha-alert>` : ""}
        <div class="spc-card-content-section" style=${this.styleCardContent()}>
          ${this.store.player.id != ""
              ? choose(this.section, [
                [Section.ALBUM_FAVORITES, () => html`<spc-album-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected} id="elmAlbumFavBrowserForm"></spc-album-fav-browser>`],
                [Section.ARTIST_FAVORITES, () => html`<spc-artist-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected} id="elmArtistFavBrowserForm"></spc-artist-fav-browser>`],
                [Section.AUDIOBOOK_FAVORITES, () => html`<spc-audiobook-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected} id="elmAudiobookFavBrowserForm"></spc-audiobook-fav-browser>`],
                [Section.CATEGORYS, () => html`<spc-category-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected} id="elmCategoryBrowserForm"></spc-category-browser>`],
                [Section.DEVICES, () => html`<spc-device-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected} id="elmDeviceBrowserForm"></spc-device-browser>`],
                [Section.EPISODE_FAVORITES, () => html`<spc-episode-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected} id="elmEpisodeFavBrowserForm"></spc-episode-fav-browser>`],
                [Section.PLAYER, () => html`<spc-player id="spcPlayer" .store=${this.store}></spc-player>`],
                [Section.PLAYLIST_FAVORITES, () => html`<spc-playlist-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected} id="elmPlaylistFavBrowserForm"></spc-playlist-fav-browser>`],
                [Section.RECENTS, () => html`<spc-recent-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected} id="elmRecentBrowserForm"></spc-recents-browser>`],
                [Section.SEARCH_MEDIA, () => html`<spc-search-media-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected} id="elmSearchMediaBrowserForm"></spc-search-media-browser>`],
                [Section.SHOW_FAVORITES, () => html`<spc-show-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected} id="elmShowFavBrowserForm"></spc-show-fav-browser>`],
                [Section.TRACK_FAVORITES, () => html`<spc-track-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected} id="elmTrackFavBrowserForm"></spc-track-fav-browser>`],
                [Section.USERPRESETS, () => html`<spc-userpreset-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected} id="elmUserPresetBrowserForm"></spc-userpresets-browser>`],
                [Section.UNDEFINED, () => html`<div class="spc-not-configured">SpotifyPlus card configuration error.<br/>Please configure section(s) to display.</div>`],
              ])
              : html`
                  <div class="spc-initial-config">
                    Welcome to the SpotifyPlus media player card.<br/>
                    Start by editing the card configuration media player "entity" value.<br/>
                    <div class="spc-not-configured">
                      ${this.store.player.attributes.sp_config_state}
                    </div>
                  </div>`
          }
        </div>
        ${when(showFooter, () =>
          html`<div class="spc-card-footer-container" style=${this.styleCardFooter()}>
            <spc-footer 
              class="spc-card-footer"
              .config=${this.config}
              .section=${this.section}
              @show-section=${this.onFooterShowSection}
            ></spc-footer>
          </div>`
        )}
      </ha-card>
    `;
  }


  /**
   * Style definitions used by this card.
   */
  static get styles() {
    return css`
      :host {
        display: block;
        width: 100% !important;
        height: 100% !important;
      }

      * { 
        margin: 0; 
      }

      html,
      body {
        height: 100%;
        margin: 0;
      }

      spotifyplus-card {
        display: block;
        height: 100% !important;
        width: 100% !important;
      }

      hui-card-preview {
        min-height: 10rem;
        height: 40rem;
        min-width: 10rem;
        width: 40rem;
      }

      .spc-card {
        --spc-card-header-height: ${HEADER_HEIGHT}rem;
        --spc-card-footer-height: ${FOOTER_HEIGHT}rem;
        --spc-card-edit-tab-height: 0px;
        --spc-card-edit-bottom-toolbar-height: 0px;
        box-sizing: border-box;
        padding: 0rem;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        height: calc(100vh - var(--spc-card-footer-height) - var(--spc-card-edit-tab-height) - var(--spc-card-edit-bottom-toolbar-height));
        min-width: 20rem;
        width: calc(100vw - var(--mdc-drawer-width));
        color: var(--secondary-text-color);
      }

      .spc-card-header {
        box-sizing: border-box;
        padding: 0.2rem;
        display: flex;
        align-self: flex-start;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        font-weight: bold;
        font-size: 1.2rem;
        color: var(--secondary-text-color);
      }

      .spc-card-content-section {
        margin: 0.0rem;
        flex-grow: 1;
        flex-shrink: 0;
        height: 1vh;
        overflow: hidden;
      }

      .spc-card-footer-container {
        width: 100%;
        display: flex;
        align-items: center;
        background-repeat: no-repeat;
        background-color: var(--spc-footer-background-color, var(--spc-player-footer-bg-color, var(--card-background-color, transparent)));
        background-image: var(--spc-footer-background-image, linear-gradient(rgba(0, 0, 0, 0.6), rgb(0, 0, 0)));
      }

      .spc-card-footer {
        margin: 0.2rem;
        display: flex;
        align-self: flex-start;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;
        width: 100%;
        --mdc-icon-button-size: var(--spc-footer-icon-button-size, 2.5rem);
        --mdc-icon-size: var(--spc-footer-icon-size, 1.75rem);
        --mdc-ripple-top: 0px;
        --mdc-ripple-left: 0px;
        --mdc-ripple-fg-size: 10px;
      }

      .spc-loader {
        position: absolute;
        z-index: 1000;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        --ha-spinner-indicator-color: var(--spc-card-wait-progress-slider-color, var(--dark-primary-color, ${unsafeCSS(PLAYER_CONTROLS_ICON_TOGGLE_COLOR_DEFAULT)}));
      }

      .spc-not-configured {
        text-align: center;
        margin: 1rem;
        color: #fa2643;
      }

      .spc-initial-config {
        text-align: center;
        margin-top: 1rem;
      }

      ha-icon-button {
        padding-left: 1rem;
        padding-right: 1rem;
      }
    `;
  }


  /**
   * Creates the common services and data areas that are used by the various card sections.
   * 
   * Note that this method cannot be called from `setConfig` method, as the `hass` property 
   * has not been set set!
  */
  private createStore() {

    // create the store.
    this.store = new Store(this.hass, this.config, this, this.section);

    // set card editor indicator.
    this.isCardInEditPreview = isCardInEditPreview(this);

    // have we set the player id yet?  if not, then make it so.
    if (!this.playerId) {
      this.playerId = this.config.entity;
    }

    // is this the first time executing?
    if ((this.isFirstTimeSetup) && (this.playerId)) {

      // if there are things that you only want to happen one time when the configuration
      // is initially loaded, then do them here.
      debuglog("createStore - isFirstTimeSetup logic invoked; creating store area");

      // set volume step amount (if configured, and not the default of 10).
      // NOTE - this setting really should be moved to the integration configuration options,
      // as ANY change to the card config (or even a page refresh) will cause it to be reset 
      // to the specified value!
      const volStepLevel = this.store.config.playerVolumeStepValue || 0;
      if (volStepLevel > 0) {
        if (volStepLevel != 10) {
          debuglog("createStore - isFirstTimeSetup is setting media player volume step level");
          this.store.spotifyPlusService.VolumeSetStepLevel(this.store.player, volStepLevel);
        }
      }

      // set the initial section reference;
      if ((!this.config.sections) || (this.config.sections.length == 0)) {

        // no sections are defined, or none were selected.
        debuglog("createStore - isFirstTimeSetup defaulting section to PLAYER");
        this.config.sections = [Section.PLAYER];
        Store.selectedConfigArea = ConfigArea.GENERAL;
        this.SetSection(Section.PLAYER);

      } else if (this.config.sectionDefault) {

        // default section was specified; set section selected based on config option.
        debuglog("createStore - isFirstTimeSetup defaulting section to config.sectionDefault (%s)", JSON.stringify(this.config.sectionDefault));
        this.SetSection(this.config.sectionDefault);

      } else if (!this.section) {

        // section was not set; set section selected based on selected ConfigArea.
        debuglog("createStore - isFirstTimeSetup defaulting section to Store.selectedConfigArea (%s)", JSON.stringify(Store.selectedConfigArea));
        this.SetSection(getSectionForConfigArea(Store.selectedConfigArea));

      }

      // indicate first time setup has completed.
      this.isFirstTimeSetup = false;
    }
  }


  /**
   * Sets the section value and requests an update to show the section.
   * 
   * @param section Section to show.
  */
  public SetSection(section: Section): void {

    // is the session configured for display?
    if (!this.config.sections || this.config.sections.indexOf(section) > -1) {

      if (debuglog.enabled) {
        debuglog("SetSection - set section reference and display the section\n- OLD section=%s\n- NEW section=%s",
          JSON.stringify(this.section),
          JSON.stringify(section)
        );
      }

      // set the active section.
      this.section = section;
      this.store.section = this.section;
      super.requestUpdate();

    } else {

      if (debuglog.enabled) {
        debuglog("SetSection - section is not active: %s",
          JSON.stringify(section)
        );
      }

    }
  }


  /**
   * Invoked when the component is added to the document's DOM.
   *
   * In `connectedCallback()` you should setup tasks that should only occur when
   * the element is connected to the document. The most common of these is
   * adding event listeners to nodes external to the element, like a keydown
   * event handler added to the window.
   *
   * Typically, anything done in `connectedCallback()` should be undone when the
   * element is disconnected, in `disconnectedCallback()`.
   */
  public connectedCallback() {

    // invoke base class method.
    super.connectedCallback();

    // add card level event listeners.
    this.addEventListener(PROGRESS_ENDED, this.onProgressEndedEventHandler);
    this.addEventListener(PROGRESS_STARTED, this.onProgressStartedEventHandler);
    this.addEventListener(SEARCH_MEDIA, this.onSearchMediaEventHandler);
    this.addEventListener(CATEGORY_DISPLAY, this.onCategoryDisplayEventHandler);
    this.addEventListener(FILTER_SECTION_MEDIA, this.onFilterSectionMediaEventHandler);

    // add document level event listeners.
    document.addEventListener(EDITOR_CONFIG_AREA_SELECTED, this.onEditorConfigAreaSelectedEventHandler);
  }


  /**
   * Invoked when the component is removed from the document's DOM.
   *
   * This callback is the main signal to the element that it may no longer be
   * used. `disconnectedCallback()` should ensure that nothing is holding a
   * reference to the element (such as event listeners added to nodes external
   * to the element), so that it is free to be garbage collected.
   *
   * An element may be re-connected after being disconnected.
   */
  public disconnectedCallback() {

    // remove card level event listeners.
    this.removeEventListener(PROGRESS_ENDED, this.onProgressEndedEventHandler);
    this.removeEventListener(PROGRESS_STARTED, this.onProgressStartedEventHandler);
    this.removeEventListener(SEARCH_MEDIA, this.onSearchMediaEventHandler);
    this.removeEventListener(CATEGORY_DISPLAY, this.onCategoryDisplayEventHandler);
    this.removeEventListener(FILTER_SECTION_MEDIA, this.onFilterSectionMediaEventHandler);

    // remove document level event listeners.
    document.removeEventListener(EDITOR_CONFIG_AREA_SELECTED, this.onEditorConfigAreaSelectedEventHandler);

    // invoke base class method.
    super.disconnectedCallback();
  }


  /**
   * Called when the element has rendered for the first time. Called once in the
   * lifetime of an element. Useful for one-time setup work that requires access to
   * the DOM.
   */
  protected firstUpdated(changedProperties: PropertyValues): void {

    // invoke base class method.
    super.firstUpdated(changedProperties);

    if (debuglog.enabled) {
      debuglog("firstUpdated (card) - 1st render complete - changedProperties keys:\n%s",
        JSON.stringify(Array.from(changedProperties.keys())),
      );
    }

    // ensure "<search-input-outlined>" and "<ha-md-button-menu>" HA customElements are
    // loaded so that the controls are rendered properly.
    //(async () => await loadHaFormLazyControls())();

    // if there are things that you only want to happen one time when the configuration
    // is initially loaded, then do them here.

    // at this point, the first render has occurred.
    // ensure that the specified section is configured; if not, find the first available
    // section that IS configured and display it.
    const sectionsConfigured = this.config.sections || []
    if (!sectionsConfigured.includes(this.section)) {

      // find the first active section, as determined by the order listed in the footer.
      let sectionNew: Section = Section.PLAYER;
      if (sectionsConfigured.includes(Section.PLAYER)) {
        sectionNew = Section.PLAYER;
      } else if (sectionsConfigured.includes(Section.DEVICES)) {
        sectionNew = Section.DEVICES;
      } else if (sectionsConfigured.includes(Section.USERPRESETS)) {
        sectionNew = Section.USERPRESETS;
      } else if (sectionsConfigured.includes(Section.RECENTS)) {
        sectionNew = Section.RECENTS;
      } else if (sectionsConfigured.includes(Section.CATEGORYS)) {
        sectionNew = Section.CATEGORYS;
      } else if (sectionsConfigured.includes(Section.PLAYLIST_FAVORITES)) {
        sectionNew = Section.PLAYLIST_FAVORITES;
      } else if (sectionsConfigured.includes(Section.ALBUM_FAVORITES)) {
        sectionNew = Section.ALBUM_FAVORITES;
      } else if (sectionsConfigured.includes(Section.ARTIST_FAVORITES)) {
        sectionNew = Section.ARTIST_FAVORITES;
      } else if (sectionsConfigured.includes(Section.TRACK_FAVORITES)) {
        sectionNew = Section.TRACK_FAVORITES;
      } else if (sectionsConfigured.includes(Section.AUDIOBOOK_FAVORITES)) {
        sectionNew = Section.AUDIOBOOK_FAVORITES;
      } else if (sectionsConfigured.includes(Section.SHOW_FAVORITES)) {
        sectionNew = Section.SHOW_FAVORITES;
      } else if (sectionsConfigured.includes(Section.EPISODE_FAVORITES)) {
        sectionNew = Section.EPISODE_FAVORITES;
      } else if (sectionsConfigured.includes(Section.SEARCH_MEDIA)) {
        sectionNew = Section.SEARCH_MEDIA;
      }

      // set the default editor configarea value, so that if the card is edited
      // it will automatically select the configuration settings for the section.
      Store.selectedConfigArea = getConfigAreaForSection(sectionNew);

      // show the rendered section.
      this.section = sectionNew;
      this.store.section = sectionNew;
      super.requestUpdate();

    } else if (this.isCardInEditPreview) {

      // if in edit mode, then refresh display as card size is different.
      super.requestUpdate();
    }

  }


  /**
   * Handles the card configuration editor `EDITOR_CONFIG_AREA_SELECTED` event.
   * 
   * This will select a section for display / rendering.
   * This event should only be fired from the configuration editor instance.
   * 
   * @param ev Event definition and arguments.
  */
  protected onEditorConfigAreaSelectedEventHandler = (ev: Event) => {

    // map event arguments.
    const evArgs = (ev as CustomEvent).detail as EditorConfigAreaSelectedEventArgs;

    // is section activated?  if so, then select it.
    if (this.config.sections?.includes(evArgs.section)) {

      if (debuglog.enabled) {
        debuglog("onEditorConfigAreaSelectedEventHandler - set section reference for selected ConfigArea and display the section\n- OLD section=%s\n- NEW section=%s",
          JSON.stringify(this.section),
          JSON.stringify(evArgs.section)
        );
      }

      // set section selected based on ConfigArea.
      this.SetSection(evArgs.section);

    } else {

      // section is not activated.
      if (debuglog.enabled) {
        debuglog("onEditorConfigAreaSelectedEventHandler - section is not active: %s",
          JSON.stringify(evArgs.section)
        );
      }

    }
  }


  /**
   * Handles the footer `show-section` event.
   * 
   * This will change the `section` attribute value to the value supplied, which will also force
   * a refresh of the card and display the selected section.
   * 
   * @param args Event arguments that contain the section to show.
  */
  protected onFooterShowSection = (args: CustomEvent) => {

    const section = args.detail;
    if (!this.config.sections || this.config.sections.indexOf(section) > -1) {

      this.section = section;
      this.store.section = this.section;
      super.requestUpdate();

    } else {

      // specified section is not active.

    }
  }


  /**
    * Handles the Media List `item-selected` event.
    * 
    * @param args Event arguments (none passed).
    */
  protected onMediaListItemSelected = () => {

    // don't need to do anything here, as the section will show the player.
    // left this code here though, in case we want to do something else after
    // an item is selected.

    // example: show the card Player section (after a slight delay).
    //setTimeout(() => (this.SetSection(Section.PLAYER)), 1500);

  }


  /**
   * Handles the `PROGRESS_ENDED` event.
   * This will hide the circular progress indicator on the main card display.
   * 
   * This event has no arguments.
  */
  protected onProgressEndedEventHandler = () => {

    this.cancelLoader = true;
    const duration = Date.now() - this.loaderTimestamp;

    // is the progress loader icon visible?
    if (this.showLoader) {

      if (duration < 1000) {
        // progress will hide in less than 1 second.
        setTimeout(() => (this.showLoader = false), 1000 - duration);
      } else {
        this.showLoader = false;
        // progress is hidden.
      }
    }
  }


  /**
   * Handles the `PROGRESS_STARTED` event.
   * This will show the circular progress indicator on the main card display for lengthy operations.
   * 
   * A delay of 250 milliseconds is executed before the progress indicator is shown - if the progress
   * done event is received in this delay period, then the progress indicator is not shown.  This
   * keeps the progress indicator from "flickering" for operations that are quick to respond.
   * 
   * @param ev Event definition and arguments.
  */
  protected onProgressStartedEventHandler = () => {

    // is progress bar currently shown? if not, then make it so.
    if (!this.showLoader) {

      this.cancelLoader = false;

      // wait just a bit before showing the progress indicator; if the progress done event is received
      // in this delay period, then the progress indicator is not shown.
      setTimeout(() => {
        if (!this.cancelLoader) {
          this.showLoader = true;
          this.loaderTimestamp = Date.now();
          // progress is showing.
        } else {
          // progress was cancelled before it had to be shown.
        }
      }, 250);

    }
  }


  /**
   * Handles the `FILTER_SECTION_MEDIA` event.
   * This will show the specified section, and apply the specified filter criteria 
   * passed in the event arguments.
   * 
   * @param ev Event definition and arguments.
  */
  protected onFilterSectionMediaEventHandler = (ev: Event) => {

    // map event arguments.
    const evArgs = (ev as CustomEvent).detail as FilterSectionMediaEventArgs;

    // validate section id.
    const enumValues: string[] = Object.values(Section);
    if (!enumValues.includes(evArgs.section || "")) {
      debuglog("%conFilterSectionMediaEventHandler - Ignoring Filter request; section is not a valid Section enum value:\n%s",
        "color:red",
        JSON.stringify(evArgs, null, 2),
      );
    }

    // is section activated?  if so, then select it.
    if (this.config.sections?.includes(evArgs.section as Section)) {

      // show the search section.
      this.section = evArgs.section as Section;
      this.store.section = this.section;

      // wait just a bit before executing the search.
      setTimeout(() => {

        if (debuglog.enabled) {
          debuglog("onFilterSectionMediaEventHandler - executing filter:\n%s",
            JSON.stringify(evArgs, null, 2),
          );
        }

        // reference the section browser.
        let browserBase: FavBrowserBase;
        if (evArgs.section == Section.ALBUM_FAVORITES) {
          browserBase = this.elmAlbumFavBrowserForm;
        } else if (evArgs.section == Section.ARTIST_FAVORITES) {
          browserBase = this.elmArtistFavBrowserForm;
        } else if (evArgs.section == Section.AUDIOBOOK_FAVORITES) {
          browserBase = this.elmAudiobookFavBrowserForm;
        } else if (evArgs.section == Section.DEVICES) {
          browserBase = this.elmDeviceBrowserForm;
        } else if (evArgs.section == Section.EPISODE_FAVORITES) {
          browserBase = this.elmEpisodeFavBrowserForm;
        } else if (evArgs.section == Section.PLAYLIST_FAVORITES) {
          browserBase = this.elmPlaylistFavBrowserForm;
        } else if (evArgs.section == Section.RECENTS) {
          browserBase = this.elmRecentBrowserForm;
        } else if (evArgs.section == Section.SHOW_FAVORITES) {
          browserBase = this.elmShowFavBrowserForm;
        } else if (evArgs.section == Section.TRACK_FAVORITES) {
          browserBase = this.elmTrackFavBrowserForm;
        } else if (evArgs.section == Section.USERPRESETS) {
          browserBase = this.elmUserPresetBrowserForm;
        } else {
          return;
        }

        // execute the filter.
        browserBase.filterSectionMedia(evArgs);

      }, 50);

    } else {

      // section is not activated; cannot search.
      debuglog("%onFilterSectionMediaEventHandler - Filter section is not enabled; ignoring filter request:\n%s",
        "color:red",
        JSON.stringify(evArgs, null, 2),
      );
    }
  }


  /**
   * Handles the `SEARCH_MEDIA` event.
   * This will execute a search on the specified criteria passed in the event arguments.
   * 
   * @param ev Event definition and arguments.
  */
  protected onSearchMediaEventHandler = (ev: Event) => {

    // map event arguments.
    const evArgs = (ev as CustomEvent).detail as SearchMediaEventArgs;

    // is section activated?  if so, then select it.
    if (this.config.sections?.includes(Section.SEARCH_MEDIA)) {

      // show the search section.
      this.section = Section.SEARCH_MEDIA;
      this.store.section = this.section;

      // wait just a bit before executing the search.
      setTimeout(() => {

        if (debuglog.enabled) {
          debuglog("onSearchMediaEventHandler - executing search:\n%s",
            JSON.stringify(evArgs, null, 2),
          );
        }

        // execute the search.
        this.elmSearchMediaBrowserForm.searchExecute(evArgs);

      }, 250);

    } else {

      // section is not activated; cannot search.
      debuglog("%conSearchMediaEventHandler - Search section is not enabled; ignoring search request:\n%s",
        "color:red",
        JSON.stringify(evArgs, null, 2),
      );

      // show warning dialog.
      this.alertInfoSet("Search section is not enabled; ignoring search request.");
    }
  }


  /**
   * Handles the `CATEGORY_DISPLAY` event.
   * This will display the specified category list in the event arguments.
   * 
   * @param ev Event definition and arguments.
  */
  protected onCategoryDisplayEventHandler = (ev: Event) => {

    // map event arguments.
    const evArgs = (ev as CustomEvent).detail as CategoryDisplayEventArgs;

    // is section activated?  if so, then select it.
    if (this.config.sections?.includes(Section.CATEGORYS)) {

      // show the category section.
      this.section = Section.CATEGORYS;
      this.store.section = this.section;

      // wait just a bit before displaying the category.
      setTimeout(() => {

        if (debuglog.enabled) {
          debuglog("onCategoryDisplayEventHandler - displaying category:\n%s",
            JSON.stringify(evArgs, null, 2),
          );
        }

        // display category.
        this.elmCategoryBrowserForm.displayCategory(evArgs);

      }, 250);

    } else {

      // section is not activated; cannot search.
      debuglog("%conCategoryDisplayEventHandler - Category section is not enabled; ignoring display request:\n%s",
        "color:red",
        JSON.stringify(evArgs, null, 2),
      );

    }
  }


  /**
   * Home Assistant will call setConfig(config) when the configuration changes.  This
   * is most likely to occur when changing the configuration via the UI editor, but
   * can also occur if YAML changes are made (for cards without UI config editor).
   * 
   * If you throw an exception in this method (e.g. invalid configuration, etc), then
   * Home Assistant will render an error card to notify the user.  Note that by doing
   * so will also disable the Card Editor UI, and the card must be configured manually!
   * 
   * The config argument object contains the configuration specified by the user for
   * the card.  It will minimally contain:
   *   `config.type = "custom:my-custom-card"`
   * 
   * The `setConfig` method MUST be defined, and is in fact the only function that must be.
   * It doesn't need to actually DO anything, though.
   * 
   * Note that setConfig will ALWAYS be called at the start of the lifetime of the card
   * BEFORE the `hass` object is first provided.  It MAY be called several times during 
   * the lifetime of the card, e.g. if the configuration of the card is changed.
   * 
   * We use it here to update the internal config property, as well as perform some
   * basic validation and initialization of the config.
   * 
   * @param config Contains the configuration specified by the user for the card.
   */
  public setConfig(config: CardConfig): void {

    //console.log("setConfig (card) - configuration change\n- this.section=%s\n- Store.selectedConfigArea=%s",
    //  JSON.stringify(this.section),
    //  JSON.stringify(Store.selectedConfigArea),
    //);

    // copy the passed configuration object to create a new instance.
    const newConfig: CardConfig = JSON.parse(JSON.stringify(config));

    // remove any configuration properties that do not have a value set.
    for (const [key, value] of Object.entries(newConfig)) {
      if (Array.isArray(value) && value.length === 0) {
        delete newConfig[key];
      }
    }

    // default configration values if required.
    // note that we generally do not want to default any values - if we did, then the values will
    // get stored with the configuration if it is updated programatically (outside of the UI editor).

    // if custom imageUrl's are supplied, then remove special characters from each title
    // to speed up comparison when imageUrl's are loaded later on.  we will also
    // replace any spaces in the imageUrl with "%20" to make it url friendly.
    const customImageUrlsTemp = <CustomImageUrls>{};
    for (const itemTitle in (newConfig.customImageUrls)) {
      const title = removeSpecialChars(itemTitle);
      let imageUrl = newConfig.customImageUrls[itemTitle];
      imageUrl = imageUrl?.replace(' ', '%20');
      customImageUrlsTemp[title] = imageUrl;
    }
    newConfig.customImageUrls = customImageUrlsTemp;

    // if no sections are configured then configure the default.
    if (!newConfig.sections || newConfig.sections.length === 0) {
      newConfig.sections = [Section.PLAYER];
      Store.selectedConfigArea = ConfigArea.GENERAL;
    }

    // set configuration reference so other card sections can access it.
    this.config = newConfig;

    debuglog("%csetConfig - Configuration reference set\n%s",
      "color:orange",
      JSON.stringify(newConfig, null, 2),
    );
  }


  /**
   * Returns the size of the card as a number or a promise that will resolve to a number.
   * A height of 1 is equivalent to 50 pixels.
   * This will help Home Assistant distribute the cards evenly over the columns.
   * A card size of 1 will be assumed if the method is not defined.
  */
  getCardSize() {
    return 3;
  }


  /**
   * Returns a custom element for editing the user configuration. 
   * 
   * Home Assistant will display this element in the card editor in the dashboard, along with 
   * the rendered card (to the right of the editor).
  */
  public static getConfigElement() {

    // initialize what configarea to display on entry - always GENERAL, since this is a static method.
    Store.selectedConfigArea = ConfigArea.GENERAL;

    // clear card editor first render settings.
    Store.hasCardEditLoadedMediaList = {};

    // get the card configuration editor, and return for display.
    return document.createElement('spc-editor');
  }


  /**
   * Returns a default card configuration (without the type: parameter) in json form 
   * for use by the card type picker in the dashboard.
   * 
   * Use this method to generate the initial configuration; assign defaults, omit 
   * parameters that are optional, etc.
   */
  public static getStubConfig(): Record<string, unknown> {

    return {
      cardUniqueId: uuidv4(),

      sections: [Section.PLAYER, Section.ALBUM_FAVORITES, Section.ARTIST_FAVORITES, Section.PLAYLIST_FAVORITES,
        Section.RECENTS, Section.DEVICES, Section.TRACK_FAVORITES, Section.USERPRESETS, Section.AUDIOBOOK_FAVORITES, 
        Section.SHOW_FAVORITES, Section.EPISODE_FAVORITES, Section.SEARCH_MEDIA],
      entity: "",

      playerHeaderTitle: "{player.source}",
      playerHeaderArtistTrack: "{player.media_artist} - {player.media_title}",
      playerHeaderAlbum: "{player.media_album_name} {player.sp_playlist_name_title}",
      playerHeaderNoMediaPlayingText: "\"{player.name}\" state is \"{player.state}\"",

      albumFavBrowserTitle: "Album Favorites for {player.sp_user_display_name} ({medialist.filteritemcount} items)",
      albumFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      albumFavBrowserItemsPerRow: 4,
      albumFavBrowserItemsHideTitle: false,
      albumFavBrowserItemsHideSubTitle: false,
      albumFavBrowserItemsSortTitle: true,

      artistFavBrowserTitle: "Artist Favorites for {player.sp_user_display_name} ({medialist.filteritemcount} items)",
      artistFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      artistFavBrowserItemsPerRow: 4,
      artistFavBrowserItemsHideTitle: false,
      artistFavBrowserItemsHideSubTitle: true,
      artistFavBrowserItemsSortTitle: true,

      audiobookFavBrowserTitle: "Audiobook Favorites for {player.sp_user_display_name} ({medialist.filteritemcount} items)",
      audiobookFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      audiobookFavBrowserItemsPerRow: 4,
      audiobookFavBrowserItemsHideTitle: false,
      audiobookFavBrowserItemsHideSubTitle: false,
      audiobookFavBrowserItemsSortTitle: true,

      categoryBrowserTitle: "Categorys for {player.sp_user_display_name} ({medialist.filteritemcount} items)",
      categoryBrowserSubTitle: "click a tile item to view the content; click-hold for actions",
      categoryBrowserItemsPerRow: 4,
      categoryBrowserItemsHideTitle: false,
      categoryBrowserItemsHideSubTitle: true,
      categoryBrowserItemsSortTitle: true,

      deviceBrowserTitle: "Spotify Connect Devices ({medialist.filteritemcount} items)",
      deviceBrowserSubTitle: "click an item to select the device; click-hold for device info",
      deviceBrowserItemsPerRow: 1,
      deviceBrowserItemsHideTitle: false,
      deviceBrowserItemsHideSubTitle: true,

      episodeFavBrowserTitle: "Episode Favorites for {player.sp_user_display_name} ({medialist.filteritemcount} items)",
      episodeFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      episodeFavBrowserItemsPerRow: 4,
      episodeFavBrowserItemsHideTitle: false,
      episodeFavBrowserItemsHideSubTitle: false,
      episodeFavBrowserItemsSortTitle: true,

      playlistFavBrowserTitle: "Playlist Favorites for {player.sp_user_display_name} ({medialist.filteritemcount} items)",
      playlistFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      playlistFavBrowserItemsPerRow: 4,
      playlistFavBrowserItemsHideTitle: false,
      playlistFavBrowserItemsHideSubTitle: false,
      playlistFavBrowserItemsSortTitle: true,

      recentBrowserTitle: "Recently Played by {player.sp_user_display_name} ({medialist.filteritemcount} items)",
      recentBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      recentBrowserItemsPerRow: 4,
      recentBrowserItemsHideTitle: false,
      recentBrowserItemsHideSubTitle: false,

      searchMediaBrowserTitle: "Search Media for {player.sp_user_display_name} ({medialist.filteritemcount} items)",
      searchMediaBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      searchMediaBrowserUseDisplaySettings: false,
      searchMediaBrowserItemsPerRow: 4,
      searchMediaBrowserItemsHideTitle: false,
      searchMediaBrowserItemsHideSubTitle: true,
      searchMediaBrowserItemsSortTitle: false,
      searchMediaBrowserSearchLimit: 50,
      searchMediaBrowserSearchTypes: [SearchMediaTypes.ALBUMS, SearchMediaTypes.ARTISTS, SearchMediaTypes.PLAYLISTS,
      SearchMediaTypes.TRACKS, SearchMediaTypes.AUDIOBOOKS, SearchMediaTypes.SHOWS, SearchMediaTypes.EPISODES],

      showFavBrowserTitle: "Show Favorites for {player.sp_user_display_name} ({medialist.filteritemcount} items)",
      showFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      showFavBrowserItemsPerRow: 4,
      showFavBrowserItemsHideTitle: false,
      showFavBrowserItemsHideSubTitle: true,
      showFavBrowserItemsSortTitle: true,

      trackFavBrowserTitle: "Track Favorites for {player.sp_user_display_name} ({medialist.filteritemcount} items)",
      trackFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      trackFavBrowserItemsPerRow: 4,
      trackFavBrowserItemsHideTitle: false,
      trackFavBrowserItemsHideSubTitle: false,
      trackFavBrowserItemsSortTitle: false,

      userPresetBrowserTitle: "User Presets for {player.sp_user_display_name} ({medialist.filteritemcount} items)",
      userPresetBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      userPresetBrowserItemsPerRow: 4,
      userPresetBrowserItemsHideTitle: false,
      userPresetBrowserItemsHideSubTitle: false,

      userPresets: [
        {
          "name": "Daily Mix 1",
          "subtitle": "Various Artists",
          "image_url": "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebcd3f796bd7ea49ed7615a550/1/en/default",
          "uri": "spotify:playlist:37i9dQZF1E39vTG3GurFPW",
          "type": "playlist"
        },
        {
          "name": "My Track Favorites",
          "subtitle": "Shuffled",
          "image_url": "https://t.scdn.co/images/728ed47fc1674feb95f7ac20236eb6d7.jpeg",
          "shuffle": true,
          "type": "trackfavorites"
        }
      ],

      customImageUrls: {
        "X_default": "/local/images/spotifyplus_card_customimages/default.png",
        "X_empty preset": "/local/images/spotifyplus_card_customimages/empty_preset.png",
        "X_Daily Mix 1": "https://brands.home-assistant.io/spotifyplus/icon.png",
        "X_playerBackground": "/local/images/spotifyplus_card_customimages/playerBackground.png",
        "X_playerIdleBackground": "/local/images/spotifyplus_card_customimages/playerIdleBackground.png",
        "X_playerOffBackground": "/local/images/spotifyplus_card_customimages/playerOffBackground.png",
      }
    }
  }


  /**
   * Style the <ha-card> element.
  */
  private styleCard() {

    // build style info object.
    const styleInfo: StyleInfo = <StyleInfo>{};

    // load basic layout settings.
    let editTabHeight = '0px';
    let editBottomToolbarHeight = '0px';
    const cardWaitProgressSliderColor = this.config.cardWaitProgressSliderColor;

    // set css variables that affect multiple sections of the card.
    if (cardWaitProgressSliderColor)
      styleInfo['--spc-card-wait-progress-slider-color'] = `${cardWaitProgressSliderColor}`;

    // if config entity not set, then display the brand logo neatly in the card.
    if ((this.playerId || "") == "") {
      styleInfo['background-repeat'] = 'no-repeat';
      styleInfo['background-position'] = 'center';
      styleInfo['background-image'] = `url(${BRAND_LOGO_IMAGE_BASE64})`;
      styleInfo['background-size'] = `${BRAND_LOGO_IMAGE_SIZE}`;
    }

    // are we previewing the card in the card editor?
    // if so, then we will ignore the configuration dimensions and use constants.
    if (this.isCardInEditPreview) {

      // card is in edit preview.
      styleInfo['--spc-card-edit-tab-height'] = `${editTabHeight}`;
      styleInfo['--spc-card-edit-bottom-toolbar-height'] = `${editBottomToolbarHeight}`;
      styleInfo['height'] = `${CARD_EDIT_PREVIEW_HEIGHT}`;
      styleInfo['width'] = `${CARD_EDIT_PREVIEW_WIDTH}`;

      // adjust css styling for minimized player format.
      if (this.config.playerMinimizeOnIdle && (this.section == Section.PLAYER) && this.store.player.isPoweredOffOrIdle()) {
        if (this.config.height != 'fill') {
          styleInfo['height'] = `unset !important`;
          styleInfo['min-height'] = `unset !important`;
        }
      }

      return styleMap(styleInfo);
    }

    // are we selecting the card in the card picker?
    // if so, then we will ignore the configuration dimensions and use constants.
    if (isCardInPickerPreview(this)) {

      // card is in pick preview.
      styleInfo['--spc-card-edit-tab-height'] = `${editTabHeight}`;
      styleInfo['--spc-card-edit-bottom-toolbar-height'] = `${editBottomToolbarHeight}`;
      styleInfo['height'] = `${CARD_PICK_PREVIEW_HEIGHT}`;
      styleInfo['width'] = `${CARD_PICK_PREVIEW_WIDTH}`;
      styleInfo['min-height'] = '22rem';
      styleInfo['min-width'] = `${CARD_PICK_PREVIEW_WIDTH}`;
      return styleMap(styleInfo);
    }

    // set card editor options.
    // we have to account for various editor toolbars in the height calculations when using 'fill' mode.
    // we do not have to worry about width calculations, as the width is the same with or without edit mode.
    if (isCardInDashboardEditor()) {

      // dashboard is in edit mode.
      editTabHeight = EDIT_TAB_HEIGHT;
      editBottomToolbarHeight = EDIT_BOTTOM_TOOLBAR_HEIGHT;

    }

    // set card width based on configuration.
    // - if 'fill', then use 100% of the horizontal space.
    // - if number value specified, then use as width (in rem units).
    // - if no value specified, then use default.
    if (this.config.width == 'fill') {
      styleInfo['width'] = '100%';
    } else if (isNumber(String(this.config.width))) {
      styleInfo['width'] = String(this.config.width) + 'rem';
    } else {
      styleInfo['width'] = CARD_DEFAULT_WIDTH;
    }

    // set card height based on configuration.
    // - if 'fill', then use 100% of the vertical space.
    // - if number value specified, then use as height (in rem units).
    // - if no value specified, then use default.
    if (this.config.height == 'fill') {
      styleInfo['height'] = 'calc(100vh - var(--spc-card-footer-height) - var(--spc-card-edit-tab-height) - var(--spc-card-edit-bottom-toolbar-height))';
    } else if (isNumber(String(this.config.height))) {
      styleInfo['height'] = String(this.config.height) + 'rem';
    } else {
      styleInfo['height'] = CARD_DEFAULT_HEIGHT;
    }

    // adjust css styling for minimized player format.
    if (this.config.playerMinimizeOnIdle && (this.section == Section.PLAYER) && this.store.player.isPoweredOffOrIdle()) {
      if (this.config.height != 'fill') {
        styleInfo['height'] = `unset !important`;
        styleInfo['min-height'] = `unset !important`;
      }
    }

    //console.log("styleCard (card) - calculated dimensions:\n- cardWidth=%s\n- cardHeight=%s\n- editTabHeight=%s\n- editBottomToolbarHeight=%s",
    //  cardWidth,
    //  cardHeight,
    //  editTabHeight,
    //  editBottomToolbarHeight,
    //);

    styleInfo['--spc-card-edit-tab-height'] = `${editTabHeight}`;
    styleInfo['--spc-card-edit-bottom-toolbar-height'] = `${editBottomToolbarHeight}`;
    styleInfo['--spc-player-palette-vibrant'] = `${this.vibrantColorVibrant}`;
    styleInfo['--spc-player-palette-muted'] = `${this.vibrantColorMuted}`;
    styleInfo['--spc-player-palette-darkvibrant'] = `${this.vibrantColorDarkVibrant}`;
    styleInfo['--spc-player-palette-darkmuted'] = `${this.vibrantColorDarkMuted}`;
    styleInfo['--spc-player-palette-lightvibrant'] = `${this.vibrantColorLightVibrant}`;
    styleInfo['--spc-player-palette-lightmuted'] = `${this.vibrantColorLightMuted}`;

    return styleMap(styleInfo);
  }


  /**
   * Style the card header element.
   */
  private styleCardHeader() {

    // build style info object.
    const styleInfo: StyleInfo = <StyleInfo>{};

    // is player selected, and a title set?
    // if so, then return a vibrant background style;
    // otherwise, return an empty style to let it default to the card background.
    if ((this.section == Section.PLAYER) && (this.footerBackgroundColor)) {
      styleInfo['--spc-player-footer-bg-color'] = `${this.footerBackgroundColor || 'transparent'}`;
      styleInfo['background-color'] = `var(--spc-player-footer-bg-color)`;
      styleInfo['background-image'] = `linear-gradient(rgba(0, 0, 0, 1.6), rgba(0, 0, 0, 0.6))`;
    }

    return styleMap(styleInfo);

  }


  /**
   * Style the card content element.
   */
  private styleCardContent() {

    // build style info object.
    const styleInfo: StyleInfo = <StyleInfo>{};

    // adjust css styling for minimized player format.
    if (this.config.playerMinimizeOnIdle && (this.section == Section.PLAYER) && this.store.player.isPoweredOffOrIdle()) {
      if (this.config.height != 'fill') {
        styleInfo['height'] = `unset !important`;
      }
    }

    return styleMap(styleInfo);

  }


  /**
   * Style the card footer element.
   */
  private styleCardFooter() {

    // build style info object.
    const styleInfo: StyleInfo = <StyleInfo>{};

    // if player is idle or off and minimize is enabled, then hide the footer if
    // the Player section is enabled and there are no alerts.
    if (this.config.playerMinimizeOnIdle) {
      if (!this.alertError) {
        if (this.store.player.isPoweredOffOrIdle()) {
          if ((this.config.sections || []).indexOf(Section.PLAYER) > -1) {
            if (this.section == Section.PLAYER) {
              styleInfo['display'] = `none`;
              // make player section the default.
              this.section = Section.PLAYER;
              Store.selectedConfigArea = ConfigArea.PLAYER;
            }
          }
        }
      }
    }

    // load basic layout settings.
    const footerBackgroundColor = this.config.footerBackgroundColor;
    const footerBackgroundImage = this.config.footerBackgroundImage;
    const footerIconColor = this.config.footerIconColor;
    const footerIconColorSelected = this.config.footerIconColorSelected;
    const footerIconSize = this.config.footerIconSize;

    // set css variables that affect the card footer.
    if (footerIconColor)
      styleInfo['--spc-footer-icon-color'] = `${footerIconColor}`;
    if (footerIconColorSelected)
      styleInfo['--spc-footer-icon-color-selected'] = `${footerIconColorSelected}`;
    if (footerIconSize) {
      styleInfo['--spc-footer-icon-size'] = `${footerIconSize}`;
      styleInfo['--spc-footer-icon-button-size'] = `var(--spc-footer-icon-size, ${FOOTER_ICON_SIZE_DEFAULT}) + 0.75rem`;
    }
    if (footerBackgroundImage)
      styleInfo['--spc-footer-background-image'] = `${footerBackgroundImage}`;
    if (footerBackgroundColor) {
      styleInfo['--spc-footer-background-color'] = `${footerBackgroundColor}`;
    } else {
      // is player selected, and a footer background color set?
      // if so, then return vibrant background style;
      // otherwise, let background color default to the card background color.
      if ((this.section == Section.PLAYER) && (this.vibrantColorVibrant)) {
        styleInfo['--spc-player-footer-bg-color'] = `${this.footerBackgroundColor || 'transparent'}`;
      } else {
        styleInfo['background'] = `unset`;
      }
    }

    return styleMap(styleInfo);

  }


  /**
   * We will check for changes in the media player background image.  If a
   * change is being made, then we will analyze the new image for the vibrant
   * color palette.  We will then set some css variables with those values for
   * use by the different player sections (header, progress, volume, etc). 
   * 
   * Extracts color compositions from the background image, which will be used for 
   * rendering controls that are displayed on top of the background image.
   * 
   * Good resource on the Vibrant package parameters, examples, and other info:
   * https://github.com/Vibrant-Colors/node-vibrant
   * https://kiko.io/post/Get-and-use-a-dominant-color-that-matches-the-header-image/
   * https://jariz.github.io/vibrant.js/
   * https://github.com/Vibrant-Colors/node-vibrant/issues/44
   */
  private checkForBackgroundImageChange(): void {

    try {

      // check if vibrant color processing is already in progress;
      // if so, then exit as we need to wait for it to finish.
      if (!this.isUpdateInProgressAsync) {
        this.isUpdateInProgressAsync = true;
      } else {
        return;
      }

      // save variables in case player render changes them while we are processing them;
      // we will reference the saved variables for the remainder of this method!
      const playerImageSaved: string | undefined = this.playerImage;
      const playerMediaContentIdSaved: string | undefined = this.playerMediaContentId;

      // if card is being edited then don't bother, as every keystroke will initiate a
      // complete reload of the card!
      if (this.isCardInEditPreview) {
        this.isUpdateInProgressAsync = false;
        this.footerBackgroundColor = undefined;
        return;
      }

      //console.log("%ccheckForBackgroundImageChange - TEST TODO REMOVEME starting;\n- OLD vibrantMediaContentId = %s\n- NEW playerMediaContentId = %s\n- OLD vibrantImage = %s\n- NEW playerImage = %s\n- isCardInEditPreview = %s\n- footerBackgroundColor = %s",
      //  "color:gold",
      //  JSON.stringify(this.vibrantMediaContentId),
      //  JSON.stringify(playerMediaContentIdSaved),
      //  JSON.stringify(this.vibrantImage),
      //  JSON.stringify(playerImageSaved),
      //  JSON.stringify(this.isCardInEditPreview),
      //  JSON.stringify(this.store.card.footerBackgroundColor),
      //);

      // did the content change? if not, then we are done.
      // note that we cannot compare images here, as it's a cached value and the `cache` portion of
      // image url could change even though it's the same content that's playing!
      if (this.vibrantMediaContentId === playerMediaContentIdSaved) {
        this.isUpdateInProgressAsync = false;
        return;
      }

      // if no player image, or the brand logo image is displayed, then we will
      // reset the vibrant color and exit; this will default the footer and header
      // backgrounds to the card background color.
      if ((playerImageSaved == undefined) || (playerImageSaved == "") || (playerMediaContentIdSaved == "BRAND_LOGO_IMAGE_BASE64")) {
        this.vibrantImage = playerImageSaved;
        this.vibrantMediaContentId = playerMediaContentIdSaved;
        this.vibrantColorVibrant = undefined;
        this.footerBackgroundColor = this.vibrantColorVibrant;
        this.isUpdateInProgressAsync = false;
        return;
      }

      if (debuglog.enabled) {
        debuglog("checkForBackgroundImageChange - player content changed:\n- OLD vibrantMediaContentId = %s\n- NEW playerMediaContentId = %s\n- OLD vibrantImage = %s\n- NEW playerImage = %s\n- isCardInEditPreview = %s\n- footerBackgroundColor = %s",
          JSON.stringify(this.vibrantMediaContentId),
          JSON.stringify(playerMediaContentIdSaved),
          JSON.stringify(this.vibrantImage),
          JSON.stringify(playerImageSaved),
          JSON.stringify(this.isCardInEditPreview),
          JSON.stringify(this.footerBackgroundColor),
        );
      }

      //console.log("%ccheckForBackgroundImageChange - colors before extract:\n- Vibrant      = %s\n- Muted        = %s\n- DarkVibrant  = %s\n- DarkMuted    = %s\n- LightVibrant = %s\n- LightMuted   = %s",
      //  "color:gold",
      //  this.vibrantColorVibrant,
      //  this.vibrantColorMuted,
      //  this.vibrantColorDarkVibrant,
      //  this.vibrantColorDarkMuted,
      //  this.vibrantColorLightVibrant,
      //  this.vibrantColorLightMuted,
      //);

      // we use the `Promise.allSettled` approach here, so that we can
      // easily add promises if more data gathering is needed in the future.
      const promiseRequests = new Array<Promise<unknown>>();

      // create promise - extract vibrant colors.
      const promiseVibrant = new Promise((resolve, reject) => {

        // set options for vibrant call.
        const vibrantOptions = {
          "colorCount": 64, // amount of colors in initial palette from which the swatches will be generated.
          "quality": 3,     // quality. 0 is highest, but takes way more processing.
          //  "quantizer": 'mmcq',
          //  "generators": ['default'],
          //  "filters": ['default'],
        }

        // create image object, and allow cross-origin to avoid CORS errors.
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = playerImageSaved + '?not-from-cache-please';

        // create vibrant instance with our desired options.
        const vibrant: Vibrant = new Vibrant(img, vibrantOptions);

        // get the color palettes for the player background image.
        vibrant.getPalette()
          .then((palette: Palette) => {

            if (debuglog.enabled) {
              debuglog("%ccheckForBackgroundImageChange - colors found by getPalette:\n- Vibrant      = %s\n- Muted        = %s\n- DarkVibrant  = %s\n- DarkMuted    = %s\n- LightVibrant = %s\n- LightMuted   = %s",
                "color:orange",
                (palette['Vibrant']?.hex) || 'undefined',
                (palette['Muted']?.hex) || 'undefined',
                (palette['DarkVibrant']?.hex) || 'undefined',
                (palette['DarkMuted']?.hex) || 'undefined',
                (palette['LightVibrant']?.hex) || 'undefined',
                (palette['LightMuted']?.hex) || 'undefined',
              );
            }

            // set player color palette values.
            this.vibrantColorVibrant = (palette['Vibrant']?.hex) || undefined;
            this.vibrantColorMuted = (palette['Muted']?.hex) || undefined;
            this.vibrantColorDarkVibrant = (palette['DarkVibrant']?.hex) || undefined;
            this.vibrantColorDarkMuted = (palette['DarkMuted']?.hex) || undefined;
            this.vibrantColorLightVibrant = (palette['LightVibrant']?.hex) || undefined;
            this.vibrantColorLightMuted = (palette['LightMuted']?.hex) || undefined;

            // update vibrant processing control state so we don't do this again until
            // something changes.
            this.vibrantImage = playerImageSaved;
            this.vibrantMediaContentId = playerMediaContentIdSaved;

            // set card footer background color.
            this.footerBackgroundColor = this.vibrantColorVibrant;

            // indicate vibrant processing is compete.
            this.isUpdateInProgressAsync = false;

            // resolve the promise.
            resolve(true);

          })
          .catch(error => {

            if (debuglog.enabled) {
              debuglog("%ccheckForBackgroundImageChange - Could not retrieve color palette info for player background image\nreason = %s",
                JSON.stringify(getHomeAssistantErrorMessage(error)),
              );
            }

            // reset player color palette values.
            this.vibrantColorVibrant = undefined;
            this.vibrantColorMuted = undefined;
            this.vibrantColorDarkVibrant = undefined;
            this.vibrantColorDarkMuted = undefined;
            this.vibrantColorLightVibrant = undefined;
            this.vibrantColorLightMuted = undefined;

            // update vibrant processing control state so we don't do this again until
            // something changes.
            this.vibrantImage = playerImageSaved;
            this.vibrantMediaContentId = playerMediaContentIdSaved;

            // set card footer background color.
            this.footerBackgroundColor = this.vibrantColorVibrant;

            // indicate vibrant processing is compete.
            this.isUpdateInProgressAsync = false;

            // call base class method, indicating media list update failed.
            this.checkForBackgroundImageChangeError("Vibrant getPalette method failed: " + getHomeAssistantErrorMessage(error));

            // reject the promise.
            reject(error);

          })
      });

      promiseRequests.push(promiseVibrant);

      // show visual progress indicator.
      //this.progressShow();

      // execute all promises, and wait for all of them to settle.
      // we use `finally` logic so we can clear the progress indicator.
      // any exceptions raised should have already been handled in the 
      // individual promise definitions; nothing else to do at this point.
      Promise.allSettled(promiseRequests).finally(() => {

        // clear the progress indicator.
        this.progressHide();

      });

      return;

    }
    catch (error) {

      // clear the progress indicator.
      //this.progressHide();

      // set alert error message.
      this.checkForBackgroundImageChangeError("Background Image processing error: " + getHomeAssistantErrorMessage(error));
      return;

    }

  }


  /**
   * Should be called if an error occured while trying to extract Vibrant colors.
   */
  private checkForBackgroundImageChangeError(
    alertErrorMessage: string | null = null,
  ): void {

    // clear informational alerts.
    this.alertInfoClear();

    if (debuglog.enabled) {
      debuglog("%ccheckForBackgroundImageChangeError - error processing background image:\n %s",
        "color:red",
        JSON.stringify(alertErrorMessage),
      );
    }

    // set alert status text.
    this.alertErrorSet(alertErrorMessage || "Unknown Error");

  }

}
