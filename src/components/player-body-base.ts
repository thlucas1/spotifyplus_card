// lovelace card imports.
import { css, LitElement, PropertyValues, TemplateResult, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';

// our imports.
import { sharedStylesFavActions } from '../styles/shared-styles-fav-actions.js';
import { Store } from '../model/store';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { MediaPlayerState } from '../services/media-control-service';
import { SpotifyPlusService } from '../services/spotifyplus-service';
import { SearchMediaTypes } from '../types/search-media-types';
import { isCardInEditPreview, loadHaFormLazyControls } from '../utils/utils';
import { ProgressEndedEvent } from '../events/progress-ended';
import { ProgressStartedEvent } from '../events/progress-started';

// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":player-body-base");


export class PlayerBodyBase extends LitElement {

  // public state properties.
  @property({ attribute: false }) protected store!: Store;
  @property({ attribute: false }) protected mediaContentId!: string;

  // private state properties.
  @state() protected alertError?: string;
  @state() protected alertInfo?: string;

  /** MediaPlayer instance created from the configuration entity id. */
  protected player!: MediaPlayer;

  /** SpotifyPlus services instance. */
  protected spotifyPlusService!: SpotifyPlusService;

  /** Indicates if actions are currently being updated. */
  protected isUpdateInProgress!: boolean;

  /** True if the card is in edit preview mode (e.g. being edited); otherwise, false. */
  protected isCardInEditPreview!: boolean;

  /** Indicates if the player is stopped (e.g. not playing anything). */
  protected isPlayerStopped!: boolean | typeof nothing;

  /** Type of media being accessed. */
  protected mediaType!: Section;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super();

    // initialize storage.
    this.isUpdateInProgress = false;
    this.mediaType = Section.PLAYER;

  }


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // set common references from application common storage area.
    this.player = this.store.player;
    this.spotifyPlusService = this.store.spotifyPlusService;
    this.isPlayerStopped = [MediaPlayerState.PLAYING, MediaPlayerState.PAUSED, MediaPlayerState.BUFFERING].includes(this.player.state) && nothing;

    // all html is rendered in the inheriting class.
  }


  /**
   * style definitions used by this component.
   * */
  static get styles() {
    return [
      sharedStylesFavActions,
      css`

        /* extra styles not defined in shared stylesheets would go here. */

        .title {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 1.15rem;
          font-weight: 400;
          text-shadow: 0 0 2px var(--spc-player-palette-vibrant);
          //color: var(--dark-primary-color);
          //color: var(--spc-player-palette-vibrant);
          color: var(--spc-player-header-color);
          mix-blend-mode: screen;
        }
      `
    ];
  }


  /**
   * Invoked when the component is added to the document's DOM.
   *
   * In `connectedCallback()` you should setup tasks that should only occur when
   * the element is connected to the document. The most common of these is
   * adding event listeners to nodes external to the element, like a keydown
   * event handler added to the window.
   */
  public connectedCallback() {

    // invoke base class method.
    super.connectedCallback();

    // determine if card configuration is being edited.
    this.isCardInEditPreview = isCardInEditPreview(this.store.card);

  }


  /**
   * Called when the element has rendered for the first time. Called once in the
   * lifetime of an element. Useful for one-time setup work that requires access to
   * the DOM.
   */
  protected firstUpdated(changedProperties: PropertyValues): void {

    // invoke base class method.
    super.firstUpdated(changedProperties);

    // ensure "<search-input-outlined>" and "<ha-md-button-menu>" HA customElements are
    // loaded so that the controls are rendered properly.
    (async () => await loadHaFormLazyControls())();

    // if we are editing the card configuration, then don't bother updating actions as
    // the user cannot display the actions dialog while editing the card configuration.
    if (this.isCardInEditPreview) {
      return;
    }

    // refresh body actions, using default actions (e.g. []).
    this.updateActions(this.store.player, []);

  }


  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * @param changedProperties Map of changed properties with old values
   * @category updates
   */
  protected update(changedProperties: PropertyValues): void {

    // invoke base class method.
    super.update(changedProperties);

    // get list of changed property keys.
    const changedPropKeys = Array.from(changedProperties.keys())

    // if first render has not happened yet then we will wait for it first.
    if (!this.hasUpdated) {
      return;
    }

    // if card is being edited, then we are done since actions cannot be displayed
    // while editing the card configuration.
    if (this.isCardInEditPreview) {
      return;
    }

    // if media content id changed, then update actions.
    if (changedPropKeys.includes('mediaContentId')) {

      if (debuglog.enabled) {
        debuglog("%c update - player content changed:\n- NEW CONTENT ID = %s\n- isCardInEditPreview = %s",
          "color: gold;",
          JSON.stringify(this.player.attributes.media_content_id),
          JSON.stringify(isCardInEditPreview(this.store.card)),
        );
      }

      // refresh all body actions.
      setTimeout(() => {
        this.updateActions(this.store.player, []);
      }, 100);

      return;
    }

  }


  /**
   * Clears the error and informational alert text.
   */
  protected alertClear() {
    this.alertError = undefined;
    this.alertInfo = undefined;
  }


  /**
   * Clears the error alert text.
   */
  protected alertErrorClear() {
    this.alertError = undefined;
  }


  /**
   * Sets the alert error message, and clears the informational alert message.
   */
  protected alertErrorSet(message: string): void {
    this.alertError = message;
    this.alertInfo = undefined;
  }


  /**
   * Hide visual progress indicator.
   */
  protected progressHide(): void {
    this.isUpdateInProgress = false;
    this.store.card.dispatchEvent(ProgressEndedEvent());
  }


  /**
   * Show visual progress indicator.
   */
  protected progressShow(): void {
    this.store.card.dispatchEvent(ProgressStartedEvent());
  }


  /**
   * Returns false if the specified feature is to be SHOWN; otherwise, returns true
   * if the specified feature is to be HIDDEN (via CSS).
   * 
   * @param searchType Search type to check.
   */
  protected hideSearchType(searchType: SearchMediaTypes) {

    if ((this.store.config.searchMediaBrowserSearchTypes) && (this.store.config.searchMediaBrowserSearchTypes.length > 0)) {
      if (this.store.config.searchMediaBrowserSearchTypes?.includes(searchType)) {
        return false;  // show searchType
      } else {
        return true;   // hide searchType.
      }
    }

    // if features not configured, then show search type.
    return false;
  }


  /**
   * Handles the `click` event fired when a control icon is clicked.
   * This method should be overridden by the inheriting class.
   * 
   * @param action Action to execute.
   */
  protected async onClickAction(action: any, args: any = null): Promise<boolean> {

    if (args) {  // keep the compiler happy
    }

    throw new Error("onClickAction not implemented for action \"" + action + "\".");

  }


  /**
   * Updates body actions.
   * 
   * @param player Media player instance that will process the update.
   * @param updateActions List of actions that need to be updated, or an empty list to update default actions.
   * @returns True if actions update should continue after calling base class method; otherwise, False to abort actions update.
   */
  protected updateActions(
    player: MediaPlayer,
    updateActions: any[],
  ): boolean {

    if (debuglog.enabled) {
      debuglog("updateActions - updating actions: %s\n- this.isCardInEditPreview = %s\n- isCardInEditPreview(card) = %s\n- hasCardEditLoadedMediaList:\n%s",
        JSON.stringify(Array.from(updateActions.values())),
        JSON.stringify(this.isCardInEditPreview),
        JSON.stringify(isCardInEditPreview(this.store.card)),
        JSON.stringify(Store.hasCardEditLoadedMediaList,null,2),
      );
    }

    // check if update is already in progress.
    if (!this.isUpdateInProgress) {
      this.isUpdateInProgress = true;
    } else {
      if (debuglog.enabled) {
        debuglog("updateActions - update in progress; ignoring updateActions request");
      }
      return false;
    }

    // if editing the card, then don't bother updating actions as we will not
    // display the actions dialog.
    if (this.isCardInEditPreview) {
      this.isUpdateInProgress = false;
      if (debuglog.enabled) {
        debuglog("updateActions - card is in editpreview; ignoring updateActions request");
      }
      return false;
    }

    // if player reference not set then we are done.
    if (!player) {
      this.isUpdateInProgress = false;
      if (debuglog.enabled) {
        debuglog("updateActions - player reference not set; ignoring updateActions request");
      }
      return false;
    }

    // if no media content id, then don't bother.
    if (!this.player.attributes.media_content_id) {
      this.isUpdateInProgress = false;
      if (debuglog.enabled) {
        debuglog("updateActions - player media_content_id reference not set; ignoring updateActions request");
      }
      return false;
    }

    // clear alerts.
    this.alertClear();

    // indicate caller can refresh it's actions.
    return true;

  }


  /**
   * Should be called when all action updates are complete (e.g. after `Promise.allSettled`).
   * 
   * @param updateActions List of actions that were updated, or an empty list for default actions.
   */
  protected updateActionsComplete(updateActions: any[]): void {

    // if editing the card AND the default update actions were requested, then indicate 
    // the actions have been updated.
    // we will only allow the actions to be updated the initial time, as a render will 
    // occur for every keypress in the editor!
    if ((this.isCardInEditPreview) && (updateActions.length == 0)) {

      // update DEFAULT actions complete while in card edit mode; 
      // update ALL actions will not occur again until track change is detected.
      Store.hasCardEditLoadedMediaList[this.mediaType] = true;

    }

  }

}
