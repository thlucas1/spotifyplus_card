// lovelace card imports.
import { HomeAssistant } from 'custom-card-helpers';
import { css, html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { styleMap } from 'lit-html/directives/style-map.js';
import { customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';

// our imports - card sections and editor.
import './sections/album-fav-browser';          // SECTION.ALBUM_FAVORITES
import './sections/artist-fav-browser';         // SECTION.ARTIST_FAVORITES
import './sections/audiobook-fav-browser';      // SECTION.AUDIOBOOK_FAVORITES
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
import { EDITOR_CONFIG_AREA_SELECTED, EditorConfigAreaSelectedEventArgs } from './events/editor-config-area-selected';
import { PROGRESS_STARTED } from './events/progress-started';
import { PROGRESS_ENDED } from './events/progress-ended';
import { Store } from './model/store';
import { CardConfig } from './types/card-config';
import { CustomImageUrls } from './types/custom-image-urls';
import { ConfigArea } from './types/config-area';
import { Section } from './types/section';
import { formatTitleInfo, removeSpecialChars } from './utils/media-browser-utils';
import { BRAND_LOGO_IMAGE_BASE64, BRAND_LOGO_IMAGE_SIZE } from './constants';
import {
  getConfigAreaForSection,
  getSectionForConfigArea,
  isCardInEditPreview,
  isCardInDashboardEditor,
  isCardInPickerPreview,
  isNumber,
} from './utils/utils';

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
export class Card extends LitElement {

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
  @state() private store!: Store;
  @state() private showLoader!: boolean;
  @state() private loaderTimestamp!: number;
  @state() private cancelLoader!: boolean;
  @state() private playerId!: string;

  /** Indicates if createStore method is executing for the first time (true) or not (false). */
  private isFirstTimeSetup: boolean = true;


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

    //console.log("render (card) - rendering card\n- this.store.section=%s\n- this.section=%s\n- Store.selectedConfigArea=%s\n- playerId=%s\n- config.sections=%s",
    //  JSON.stringify(this.store.section),
    //  JSON.stringify(this.section),
    //  JSON.stringify(Store.selectedConfigArea),
    //  JSON.stringify(this.playerId),
    //  JSON.stringify(this.config.sections),
    //);

    // calculate height of the card, accounting for any extra
    // titles that are shown, footer, etc.
    const sections = this.config.sections;
    const showFooter = !sections || sections.length > 1;
    const title = formatTitleInfo(this.config.title, this.config, this.store.player);

    // render html for the card.
    return html`
      <ha-card class="spc-card" style=${this.styleCard()}>
        <div class="spc-loader" ?hidden=${!this.showLoader}>
          <ha-circular-progress indeterminate></ha-circular-progress>
        </div>
        ${title ? html`<div class="spc-card-header">${title}</div>` : html``}
        <div class="spc-card-content-section">
          ${
              this.playerId
              ? choose(this.section, [
                [Section.ALBUM_FAVORITES, () => html`<spc-album-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected}></spc-album-fav-browser>`],
                [Section.ARTIST_FAVORITES, () => html`<spc-artist-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected}></spc-artist-fav-browser>`],
                [Section.AUDIOBOOK_FAVORITES, () => html`<spc-audiobook-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected}></spc-audiobook-fav-browser>`],
                [Section.DEVICES, () => html`<spc-device-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected}></spc-device-browser>`],
                [Section.EPISODE_FAVORITES, () => html`<spc-episode-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected}></spc-episode-fav-browser>`],
                [Section.PLAYER, () => html`<spc-player id="spcPlayer" .store=${this.store}></spc-player>`],
                [Section.PLAYLIST_FAVORITES, () => html`<spc-playlist-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected}></spc-playlist-fav-browser>`],
                [Section.RECENTS, () => html`<spc-recent-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected}></spc-recents-browser>`],
                [Section.SEARCH_MEDIA, () => html`<spc-search-media-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected}></spc-search-media-browser>`],
                [Section.SHOW_FAVORITES, () => html`<spc-show-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected}></spc-show-fav-browser>`],
                [Section.TRACK_FAVORITES, () => html`<spc-track-fav-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected}></spc-track-fav-browser>`],
                [Section.USERPRESETS, () => html`<spc-userpreset-browser .store=${this.store} @item-selected=${this.onMediaListItemSelected}></spc-userpresets-browser>`],
                [Section.UNDEFINED, () => html`<div class="spc-not-configured">SpotifyPlus card configuration error.<br/>Please configure section(s) to display.</div>`],
              ])
              : html`<div class="spc-initial-config">Welcome to the SpotifyPlus media player card.<br/>Start by configuring a media player entity.</div>`
          //    : choose(this.section, [
          //      [Section.INITIAL_CONFIG, () => html`<div class="spc-initial-config">Welcome to the SpotifyPlus media player card.<br/>Please start by configuring the card.</div>`],
          //      [Section.UNDEFINED, () => html`<div class="spc-not-configured">SpotifyPlus card configuration error.<br/>Please check the card configuration.</div>`],
          //    ])
          }
        </div>
        ${when(showFooter, () =>
          html`<div class="spc-card-footer-container" style=${this.styleCardFooter()}>
            <spc-footer 
              class="spc-card-footer"
              .config=${this.config}
              .section=${this.section}
              @show-section=${this.OnFooterShowSection}
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
        color: var(--secondary-text-color);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 20rem;
        height: calc(100vh - var(--spc-card-footer-height) - var(--spc-card-edit-tab-height) - var(--spc-card-edit-bottom-toolbar-height));
        min-width: 20rem;
        width: calc(100vw - var(--mdc-drawer-width));
      }

      .spc-card-header {
        margin: 0.2rem;
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
      }

      .spc-card-footer {
        margin: 0.2rem;
        display: flex;
        align-self: flex-start;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        --mdc-icon-size: 1.75rem;
        --mdc-icon-button-size: 2.5rem;
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
        --mdc-theme-primary: var(--dark-primary-color);
      }

      .spc-not-configured {
        text-align: center;
        margin-top: 1rem;
      }

      .spc-initial-config {
        text-align: center;
        margin-top: 1rem;
      }

      ha-icon-button {
        padding-left: 1rem;
        padding-right: 1rem;
      }

      ha-circular-progress {
        --md-sys-color-primary: var(--dark-primary-color);
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
    this.store = new Store(this.hass, this.config, this, this.section, this.config.entity);

    // have we set the player id yet?  if not, then make it so.
    if (!this.playerId) {
      this.playerId = this.config.entity;
    }

    // is this the first time executing?
    if ((this.isFirstTimeSetup) && (this.playerId)) {

      // if there are things that you only want to happen one time when the configuration
      // is initially loaded, then do them here.

      //console.log("createStore (card) - isFirstTimeSetup logic invoked");

      // set the initial section reference; if none defined, then default;
      if ((!this.config.sections) || (this.config.sections.length == 0)) {

        this.config.sections = [Section.PLAYER];
        this.section = Section.PLAYER;
        this.store.section = this.section;
        Store.selectedConfigArea = ConfigArea.GENERAL;
        super.requestUpdate();

      } else if (!this.section) {

        // section was not set; set section selected based on selected ConfigArea.
        this.section = getSectionForConfigArea(Store.selectedConfigArea);
        this.store.section = this.section;
        super.requestUpdate();

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

      this.section = section;
      this.store.section = this.section;
      super.requestUpdate();

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

    // add control level event listeners.
    this.addEventListener(PROGRESS_ENDED, this.onProgressEndedEventHandler);
    this.addEventListener(PROGRESS_STARTED, this.onProgressStartedEventHandler);

    // only add the following events if card configuration is being edited.
    if (isCardInEditPreview(this)) {

      // add document level event listeners.
      document.addEventListener(EDITOR_CONFIG_AREA_SELECTED, this.OnEditorConfigAreaSelectedEventHandler);

    }

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

    // remove control level event listeners.
    this.removeEventListener(PROGRESS_ENDED, this.onProgressEndedEventHandler);
    this.removeEventListener(PROGRESS_STARTED, this.onProgressStartedEventHandler);

    // the following event is only added when the card configuration editor is created.
    // always remove the following events, as isCardInEditPreview() can sometimes
    // return a different value than when the event was added in connectedCallback!

    // remove document level event listeners.
    document.removeEventListener(EDITOR_CONFIG_AREA_SELECTED, this.OnEditorConfigAreaSelectedEventHandler);

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

    //console.log("firstUpdated (card) - 1st render complete - changedProperties keys:\n- %s",
    //  JSON.stringify(Array.from(changedProperties.keys())),
    //);

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

    } else if (isCardInEditPreview(this)) {

      // if in edit mode, then refresh display as card size is different.
      super.requestUpdate();
    }

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
   * Handles the card configuration editor `EDITOR_CONFIG_AREA_SELECTED` event.
   * 
   * This will select a section for display / rendering.
   * This event should only be fired from the configuration editor instance.
   * 
   * @param ev Event definition and arguments.
  */
  protected OnEditorConfigAreaSelectedEventHandler = (ev: Event) => {

    // map event arguments.
    const evArgs = (ev as CustomEvent).detail as EditorConfigAreaSelectedEventArgs;

    // is section activated?  if so, then select it.
    if (this.config.sections?.includes(evArgs.section)) {

      this.section = evArgs.section;
      this.store.section = this.section;

    } else {

      // section is not activated.

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
  protected OnFooterShowSection = (args: CustomEvent) => {

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
        // removing empty config value.
        delete newConfig[key];
      }
    }

    // default configration values if not set.
    newConfig.albumFavBrowserItemsPerRow = newConfig.albumFavBrowserItemsPerRow || 4;
    newConfig.albumFavBrowserItemsHideTitle = newConfig.albumFavBrowserItemsHideTitle || false;
    newConfig.albumFavBrowserItemsSortTitle = newConfig.albumFavBrowserItemsSortTitle || false;

    newConfig.artistFavBrowserItemsPerRow = newConfig.artistFavBrowserItemsPerRow || 4;
    newConfig.artistFavBrowserItemsHideTitle = newConfig.artistFavBrowserItemsHideTitle || false;
    newConfig.artistFavBrowserItemsSortTitle = newConfig.artistFavBrowserItemsSortTitle || false;

    newConfig.audiobookFavBrowserItemsPerRow = newConfig.audiobookFavBrowserItemsPerRow || 4;
    newConfig.audiobookFavBrowserItemsHideTitle = newConfig.audiobookFavBrowserItemsHideTitle || false;
    newConfig.audiobookFavBrowserItemsSortTitle = newConfig.audiobookFavBrowserItemsSortTitle || false;

    newConfig.deviceBrowserItemsPerRow = newConfig.deviceBrowserItemsPerRow || 1;
    newConfig.deviceBrowserItemsHideSubTitle = newConfig.deviceBrowserItemsHideSubTitle || false;
    newConfig.deviceBrowserItemsHideTitle = newConfig.deviceBrowserItemsHideTitle || false;

    newConfig.playerHeaderHide = newConfig.playerHeaderHide || false;
    newConfig.playerHeaderHideProgressBar = newConfig.playerHeaderHideProgressBar || false;
    newConfig.playerControlsHideFavorites = newConfig.playerControlsHideFavorites || false;
    newConfig.playerControlsHidePlayPause = newConfig.playerControlsHidePlayPause || false;
    newConfig.playerControlsHideRepeat = newConfig.playerControlsHideRepeat || false;
    newConfig.playerControlsHideShuffle = newConfig.playerControlsHideShuffle || false;
    newConfig.playerControlsHideTrackNext = newConfig.playerControlsHideTrackNext || false;
    newConfig.playerControlsHideTrackPrev = newConfig.playerControlsHideTrackPrev || false;

    newConfig.playlistFavBrowserItemsPerRow = newConfig.playlistFavBrowserItemsPerRow || 4;
    newConfig.playlistFavBrowserItemsHideTitle = newConfig.playlistFavBrowserItemsHideTitle || false;
    newConfig.playlistFavBrowserItemsSortTitle = newConfig.playlistFavBrowserItemsSortTitle || false;

    newConfig.recentBrowserItemsPerRow = newConfig.recentBrowserItemsPerRow || 4;
    newConfig.recentBrowserItemsHideSubTitle = newConfig.recentBrowserItemsHideSubTitle || false;
    newConfig.recentBrowserItemsHideTitle = newConfig.recentBrowserItemsHideTitle || false;

    newConfig.showFavBrowserItemsPerRow = newConfig.showFavBrowserItemsPerRow || 4;
    newConfig.showFavBrowserItemsHideTitle = newConfig.showFavBrowserItemsHideTitle || false;
    newConfig.showFavBrowserItemsSortTitle = newConfig.showFavBrowserItemsSortTitle || false;

    newConfig.trackFavBrowserItemsPerRow = newConfig.trackFavBrowserItemsPerRow || 4;
    newConfig.trackFavBrowserItemsHideTitle = newConfig.trackFavBrowserItemsHideTitle || false;
    newConfig.trackFavBrowserItemsSortTitle = newConfig.trackFavBrowserItemsSortTitle || false;

    newConfig.userPresetBrowserItemsPerRow = newConfig.userPresetBrowserItemsPerRow || 4;
    newConfig.userPresetBrowserItemsHideSubTitle = newConfig.userPresetBrowserItemsHideSubTitle || false;
    newConfig.userPresetBrowserItemsHideTitle = newConfig.userPresetBrowserItemsHideTitle || false;

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

    // store configuration so other card sections can access them.
    this.config = newConfig;

    //console.log("setConfig (card) - configuration changes applied\n- this.section=%s\n- Store.selectedConfigArea=%s",
    //  JSON.stringify(this.section),
    //  JSON.stringify(Store.selectedConfigArea),
    //);

    //console.log("setConfig (card) - updated configuration:\n%s",
    //  JSON.stringify(this.config,null,2),
    //);

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
      sections: [Section.PLAYER, Section.ALBUM_FAVORITES, Section.ARTIST_FAVORITES, Section.PLAYLIST_FAVORITES, Section.RECENTS,
        Section.DEVICES, Section.TRACK_FAVORITES, Section.USERPRESETS, Section.AUDIOBOOK_FAVORITES, Section.SHOW_FAVORITES,
        Section.EPISODE_FAVORITES, Section.SEARCH_MEDIA],
      entity: "",

      playerHeaderTitle: "{player.source}",
      playerHeaderArtistTrack: "{player.media_artist} - {player.media_title}",
      playerHeaderAlbum: "{player.media_album_name}",
      playerHeaderNoMediaPlayingText: "\"{player.name}\" state is \"{player.state}\"",

      albumFavBrowserTitle: "Album Favorites for {player.sp_user_display_name} ({medialist.itemcount} items)",
      albumFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      albumFavBrowserItemsPerRow: 4,
      albumFavBrowserItemsHideTitle: false,
      albumFavBrowserItemsHideSubTitle: false,
      albumFavBrowserItemsSortTitle: true,

      artistFavBrowserTitle: "Artist Favorites for {player.sp_user_display_name} ({medialist.itemcount} items)",
      artistFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      artistFavBrowserItemsPerRow: 4,
      artistFavBrowserItemsHideTitle: false,
      artistFavBrowserItemsHideSubTitle: true,
      artistFavBrowserItemsSortTitle: true,

      audiobookFavBrowserTitle: "Audiobook Favorites for {player.sp_user_display_name} ({medialist.itemcount} items)",
      audiobookFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      audiobookFavBrowserItemsPerRow: 4,
      audiobookFavBrowserItemsHideTitle: false,
      audiobookFavBrowserItemsHideSubTitle: false,
      audiobookFavBrowserItemsSortTitle: true,

      deviceBrowserTitle: "Spotify Connect Devices ({medialist.itemcount} items)",
      deviceBrowserSubTitle: "click an item to select the device; click-hold for device info",
      deviceBrowserItemsPerRow: 1,
      deviceBrowserItemsHideTitle: false,
      deviceBrowserItemsHideSubTitle: true,

      episodeFavBrowserTitle: "Episode Favorites for {player.sp_user_display_name} ({medialist.itemcount} items)",
      episodeFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      episodeFavBrowserItemsPerRow: 4,
      episodeFavBrowserItemsHideTitle: false,
      episodeFavBrowserItemsHideSubTitle: false,
      episodeFavBrowserItemsSortTitle: true,

      playlistFavBrowserTitle: "Playlist Favorites for {player.sp_user_display_name} ({medialist.itemcount} items)",
      playlistFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      playlistFavBrowserItemsPerRow: 4,
      playlistFavBrowserItemsHideTitle: false,
      playlistFavBrowserItemsHideSubTitle: false,
      playlistFavBrowserItemsSortTitle: true,

      recentBrowserTitle: "Recently Played by {player.sp_user_display_name} ({medialist.itemcount} items)",
      recentBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      recentBrowserItemsPerRow: 4,
      recentBrowserItemsHideTitle: false,
      recentBrowserItemsHideSubTitle: false,

      searchMediaBrowserTitle: "Search Media for {player.sp_user_display_name} ({medialist.itemcount} items)",
      searchMediaBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      searchMediaBrowserUseDisplaySettings: false,
      searchMediaBrowserItemsPerRow: 4,
      searchMediaBrowserItemsHideTitle: false,
      searchMediaBrowserItemsHideSubTitle: true,
      searchMediaBrowserItemsSortTitle: false,
      searchMediaBrowserSearchLimit: 50,

      showFavBrowserTitle: "Show Favorites for {player.sp_user_display_name} ({medialist.itemcount} items)",
      showFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      showFavBrowserItemsPerRow: 4,
      showFavBrowserItemsHideTitle: false,
      showFavBrowserItemsHideSubTitle: true,
      showFavBrowserItemsSortTitle: true,

      trackFavBrowserTitle: "Track Favorites for {player.sp_user_display_name} ({medialist.itemcount} items)",
      trackFavBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      trackFavBrowserItemsPerRow: 4,
      trackFavBrowserItemsHideTitle: false,
      trackFavBrowserItemsHideSubTitle: false,
      trackFavBrowserItemsSortTitle: false,

      userPresetBrowserTitle: "User Presets for {player.sp_user_display_name} ({medialist.itemcount} items)",
      userPresetBrowserSubTitle: "click a tile item to play the content; click-hold for actions",
      userPresetBrowserItemsPerRow: 4,
      userPresetBrowserItemsHideTitle: false,
      userPresetBrowserItemsHideSubTitle: false,

      userPresets: [
        {
          "name": "Spotify Playlist Daily Mix 1",
          "subtitle": "Various Artists",
          "image_url": "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebcd3f796bd7ea49ed7615a550/1/en/default",
          "uri": "spotify:playlist:37i9dQZF1E39vTG3GurFPW",
          "type": "playlist"
        }
      ],

      customImageUrls: {
        "X_default": "/local/images/spotifyplus_card_customimages/default.png",
        "X_empty preset": "/local/images/spotifyplus_card_customimages/empty_preset.png",
        "X_Daily Mix 1": "https://brands.home-assistant.io/spotifyplus/icon.png",
        "X_playerOffBackground": "/local/images/spotifyplus_card_customimages/playerOffBackground.png",
        "X_playerBackground": "/local/images/spotifyplus_card_customimages/playerBackground.png",
      }
    }
  }


  /**
   * Style the <ha-card> element.
  */
  private styleCard() {

    let cardWidth: string | undefined = undefined;
    let cardHeight: string | undefined = undefined;
    let editTabHeight = '0px';
    let editBottomToolbarHeight = '0px';

    // are we previewing the card in the card editor?
    // if so, then we will ignore the configuration dimensions and use constants.
    if (isCardInEditPreview(this)) {

      // card is in edit preview.
      cardHeight = CARD_EDIT_PREVIEW_HEIGHT;
      cardWidth = CARD_EDIT_PREVIEW_WIDTH;
      return styleMap({
        '--spc-card-edit-tab-height': `${editTabHeight}`,
        '--spc-card-edit-bottom-toolbar-height': `${editBottomToolbarHeight}`,
        height: `${cardHeight ? cardHeight : undefined}`,
        width: `${cardWidth ? cardWidth : undefined}`,
        'background-repeat': `${!this.playerId ? 'no-repeat' : undefined}`,
        'background-position': `${!this.playerId ? 'center' : undefined}`,
        'background-image': `${!this.playerId ? 'url(' + BRAND_LOGO_IMAGE_BASE64 + ')' : undefined}`,
        'background-size': `${!this.playerId ? BRAND_LOGO_IMAGE_SIZE : undefined}`,
      });

    }

    // set card picker options.
    if (isCardInPickerPreview(this)) {

      // card is in pick preview.
      cardHeight = CARD_PICK_PREVIEW_HEIGHT;
      cardWidth = CARD_PICK_PREVIEW_WIDTH;
      return styleMap({
        '--spc-card-edit-tab-height': `${editTabHeight}`,
        '--spc-card-edit-bottom-toolbar-height': `${editBottomToolbarHeight}`,
        height: `${cardHeight ? cardHeight : undefined}`,
        width: `${cardWidth ? cardWidth : undefined}`,
        'background-repeat': `no-repeat`,
        'background-position': `center`,
        'background-image': `url(${BRAND_LOGO_IMAGE_BASE64})`,
        'background-size': `${BRAND_LOGO_IMAGE_SIZE}`,
      });

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
      cardWidth = '100%';
    } else if (isNumber(String(this.config.width))) {
      cardWidth = String(this.config.width) + 'rem';
    } else {
      cardWidth = CARD_DEFAULT_WIDTH;
    }

    // set card height based on configuration.
    // - if 'fill', then use 100% of the vertical space.
    // - if number value specified, then use as height (in rem units).
    // - if no value specified, then use default.
    if (this.config.height == 'fill') {
      cardHeight = 'calc(100vh - var(--spc-card-footer-height) - var(--spc-card-edit-tab-height) - var(--spc-card-edit-bottom-toolbar-height))';
    } else if (isNumber(String(this.config.height))) {
      cardHeight = String(this.config.height) + 'rem';
    } else {
      cardHeight = CARD_DEFAULT_HEIGHT;
    }

    //console.log("styleCard (card) - calculated dimensions:\n- cardWidth=%s\n- cardHeight=%s\n- editTabHeight=%s\n- editBottomToolbarHeight=%s",
    //  cardWidth,
    //  cardHeight,
    //  editTabHeight,
    //  editBottomToolbarHeight,
    //);

    return styleMap({
      '--spc-card-edit-tab-height': `${editTabHeight}`,
      '--spc-card-edit-bottom-toolbar-height': `${editBottomToolbarHeight}`,
      height: `${cardHeight ? cardHeight : undefined}`,
      width: `${cardWidth ? cardWidth : undefined}`,
    });
  }


  /**
   * Style the <spc-card-background-container> element.
   */
  private styleCardFooter() {

    // is player selected, and a footer background color set?
    if ((this.section == Section.PLAYER) && (this.footerBackgroundColor)) {

      // yes - return vibrant background style.
      return styleMap({
        '--spc-player-footer-bg-color': `${this.footerBackgroundColor || 'transparent'}`,
        'background-color': 'var(--spc-player-footer-bg-color)',
        'background-image': 'linear-gradient(rgba(0, 0, 0, 1.6), rgba(0, 0, 0, 0.6))',
      });

    } else {

      // no - just return an empty style to let it default to the card background.
      return styleMap({
      });

    }
  }

}
