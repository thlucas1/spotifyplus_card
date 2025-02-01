// lovelace card imports.
import { LitElement, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';

// our imports.
import { Store } from '../model/store';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { SpotifyPlusService } from '../services/spotifyplus-service';
import { getHomeAssistantErrorMessage, isCardInEditPreview } from '../utils/utils';
import { ProgressStartedEvent } from '../events/progress-started';
import { ProgressEndedEvent } from '../events/progress-ended';
import { SearchMediaTypes } from '../types/search-media-types';

// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":fav-actions-base");


export class FavActionsBase extends LitElement {

  // public state properties.
  @property({ attribute: false }) protected store!: Store;
  @property({ attribute: false }) protected mediaItem!: any;

  // private state properties.
  @state() protected alertError?: string;
  @state() protected alertInfo?: string;

  /** MediaPlayer instance created from the configuration entity id. */
  protected player!: MediaPlayer;

  /** SpotifyPlus services instance. */
  protected spotifyPlusService!: SpotifyPlusService;

  /** Type of media being accessed. */
  protected section!: Section;

  /** Indicates if actions are currently being updated. */
  protected isUpdateInProgress!: boolean;

  /** True if the card is in edit preview mode (e.g. being edited); otherwise, false. */
  protected isCardInEditPreview!: boolean;


  /**
   * Initializes a new instance of the class.
   * 
   * @param section Section that is currently selected.
   */
  constructor(section: Section) {

    // invoke base class method.
    super();

    // initialize storage.
    this.isUpdateInProgress = false;
    this.section = section;

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

    // all html is rendered in the inheriting class.
  }


  ///** 
  // * style definitions used by this component.
  // * */
  //static get styles() {

  //  return [
  //    //sharedStylesFavBrowser,
  //    css`
  //    `
  //  ];
  //}


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

    // refresh the body actions.
    this.updateActions(this.player, []);
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
   * Clears the info alert text.
   */
  protected alertInfoClear() {
    this.alertInfo = undefined;
  }


  /**
   * Sets the alert info message, and clears the informational alert message.
   */
  protected alertInfoSet(message: string): void {
    this.alertInfo = message;
    this.alertError = undefined;
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
   * Handles the `click` event fired when a media item control icon is clicked.
   * 
   * @param control Event arguments.
   */
  protected onClickMediaItem(mediaItem: any) {

    // play the selected media item.
    this.PlayMediaItem(mediaItem);

  }


  /**
   * Calls the SpotifyPlusService AddPlayerQueueItems method to add track / episode 
   * to play queue.
   * 
   * @param mediaItem The medialist item that was selected.
   */
  protected async AddPlayerQueueItem(mediaItem: any) {

    try {

      // show progress indicator.
      this.progressShow();

      // add media item to play queue.
      await this.spotifyPlusService.AddPlayerQueueItems(this.player, mediaItem.uri);

    }
    catch (error) {

      // set error status,
      this.alertErrorSet("Could not add media item to play queue.  " + getHomeAssistantErrorMessage(error));

    }
    finally {

      // hide progress indicator.
      this.progressHide();

    }

  }


  /**
   * Calls the SpotifyPlusService Card_PlayMediaBrowserItem method to play media.
   * 
   * @param mediaItem The medialist item that was selected.
   */
  protected async PlayMediaItem(mediaItem: any) {

    try {

      // show progress indicator.
      this.progressShow();

      // play media item.
      await this.spotifyPlusService.Card_PlayMediaBrowserItem(this.player, mediaItem);

      // show player section.
      this.store.card.SetSection(Section.PLAYER);

    }
    catch (error) {

      // set error status,
      this.alertErrorSet("Could not play media item.  " + getHomeAssistantErrorMessage(error));

    }
    finally {

      // hide progress indicator.
      this.progressHide();

    }

  }


  /**
   * Handles the `click` event fired when a control icon is clicked.
   * This method should be overridden by the inheriting class.
   * 
   * @param action Action to execute.
   */
  protected async onClickAction(action: any): Promise<boolean> {

    throw new Error("onClickAction not implemented for action \"" + action + "\".");

  }


  /**
   * Updates body actions.
   * 
   * @param player Media player instance that will process the update.
   * @param updateActions List of actions that need to be updated, or an empty list to update DEFAULT actions.
   * @returns True if actions update should continue after calling base class method; otherwise, False to abort actions update.
   */
  protected updateActions(
    player: MediaPlayer,
    _updateActions: any[],
  ): boolean {

    if (debuglog.enabled) {
      debuglog("updateActions - updating actions: %s",
        JSON.stringify(Array.from(_updateActions.values())),
      );
    }

    // check if update is already in progress.
    if (!this.isUpdateInProgress) {
      this.isUpdateInProgress = true;
    } else {
      this.alertErrorSet("Previous refresh is still in progress - please wait");
      return false;
    }

    // if card is being edited, then don't bother.
    if (this.isCardInEditPreview) {
      this.isUpdateInProgress = false;
      return false;
    }

    // if player reference not set then we are done;
    // this does not need to be checked for DEVICE section.
    if ((!player) && (this.section != Section.DEVICES)) {
      this.isUpdateInProgress = false;
      this.alertErrorSet("Player reference not set in updateActions");
      return false;
    }

    // if no media item uri, then don't bother;
    // this does not need to be checked for DEVICE section.
    if ((!this.mediaItem.uri) && (this.section != Section.DEVICES)) {
      this.isUpdateInProgress = false;
      this.alertErrorSet("MediaItem not set in updateActions");
      return false;
    }

    // clear alerts.
    this.alertClear();

    // indicate caller can refresh it's actions.
    return true;

  }

}
