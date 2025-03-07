// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":fav-actions-base");

// lovelace card imports.
import { PropertyValues, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

// our imports.
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { SpotifyPlusService } from '../services/spotifyplus-service';
import { getHomeAssistantErrorMessage } from '../utils/utils';
import { SearchMediaTypes } from '../types/search-media-types';
import { AlertUpdatesBase } from '../sections/alert-updates-base';


export class FavActionsBase extends AlertUpdatesBase {

  // public state properties.
  @property({ attribute: false }) protected mediaItem!: any;

  /** MediaPlayer instance created from the configuration entity id. */
  protected player!: MediaPlayer;

  /** SpotifyPlus services instance. */
  protected spotifyPlusService!: SpotifyPlusService;

  /** Type of media being accessed. */
  protected section!: Section;


  /**
   * Initializes a new instance of the class.
   * 
   * @param section Section that is currently selected.
   */
  constructor(section: Section) {

    // invoke base class method.
    super();

    // initialize storage.
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
