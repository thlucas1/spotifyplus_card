// lovelace card imports.
import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

// our imports.
import '../components/media-browser-list';
import '../components/media-browser-icons';
import '../components/userpreset-actions';
import { FavBrowserBase } from './fav-browser-base';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { formatTitleInfo } from '../utils/media-browser-utils';
import { getUtcNowTimestamp } from '../utils/utils';
import { IUserPreset } from '../types/spotifyplus/user-preset';
import { CategoryDisplayEvent } from '../events/category-display';
import { ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED } from '../constants';


@customElement("spc-userpreset-browser")
export class UserPresetBrowser extends FavBrowserBase {

  /** Array of items to display in the media list. */
  protected override mediaList!: Array<IUserPreset> | undefined;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.USERPRESETS);
    this.filterCriteriaPlaceholder = "filter by preset name";

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
    const title = formatTitleInfo(this.config.userPresetBrowserTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList);
    const subtitle = formatTitleInfo(this.config.userPresetBrowserSubTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList);

    // render html.
    return html`
      <div class="media-browser-section">
        ${title ? html`<div class="media-browser-section-title">${title}</div>` : html``}
        ${subtitle ? html`<div class="media-browser-section-subtitle">${subtitle}</div>` : html``}
        <div class="media-browser-controls">
          ${!(this.isActionsVisible || false) ? html`` : html`${this.btnHideActionsHtml}`}
          ${this.filterCriteriaHtml}${this.refreshMediaListHtml}
        </div>
        <div id="mediaBrowserContentElement" class="media-browser-content">
          ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
          ${this.alertInfo ? html`<ha-alert alert-type="info" dismissable @alert-dismissed-clicked=${this.alertInfoClear}>${this.alertInfo}</ha-alert>` : ""}
          ${(() => {
            // if actions are not visbile, then render the media list.
            if (!this.isActionsVisible) {
              const filterName = (this.filterCriteria || "").toLocaleLowerCase();
              if (this.config.userPresetBrowserItemsPerRow === 1) {
                return (
                  html`<spc-media-browser-list 
                        class="media-browser-list"
                        .items=${this.mediaList?.filter((item: IUserPreset) => item.name?.toLocaleLowerCase().indexOf(filterName) !== -1)}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-list>`
                )
              } else {
                return (
                  html`<spc-media-browser-icons 
                        class="media-browser-list"
                        .items=${this.mediaList?.filter((item: IUserPreset) => item.name?.toLocaleLowerCase().indexOf(filterName) !== -1)}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-icons>`
                )
              }
            // if actions are visbile, then render the actions display.
            } else {
              return html`<spc-userpreset-actions class="media-browser-actions" .store=${this.store} .mediaItem=${this.mediaItem}></spc-userpreset-actions>`;
            }
          })()}  
        </div>
      </div>
    `;
  }


  /**
   * Handles the `item-selected` event fired when a media browser item is clicked.
   * 
   * @param evArgs Event arguments that contain the media item that was clicked on.
   */
  protected override onItemSelected(evArgs: CustomEvent) {

    // is this a recommendations type?
    if (evArgs.detail.type == "recommendations") {

      const mediaItem = evArgs.detail as IUserPreset;
      this.PlayTrackRecommendations(mediaItem);

    } else if (evArgs.detail.type == "category") {

      const preset = evArgs.detail as IUserPreset;
      this.dispatchEvent(CategoryDisplayEvent(preset.subtitle, preset.name, preset.uri));

    } else if (evArgs.detail.type == "trackfavorites") {

      const mediaItem = evArgs.detail as IUserPreset;
      this.PlayTrackFavorites(mediaItem);

    } else {

      // call base class method to handle it.
      super.onItemSelected(evArgs);

    }

  }


  /**
   * Handles the `item-selected-with-hold` event fired when a media browser item is clicked and held.
   * 
   * @param args Event arguments that contain the media item that was clicked on.
   */
  protected override onItemSelectedWithHold(args: CustomEvent) {

    // does media item have a uri value (e.g. "recommendations","trackfavorites", etc)?
    if ((args.detail.uri || "") == "") {
      // set the uri value to fool the base class validations.
      // note that uri property is not used by recommendations.
      args.detail.uri = "unknown";
    }

    // call base class method to handle it.
    super.onItemSelectedWithHold(args);

  };


  /**
   * Calls the SpotifyPlusService PlayerMediaPlayTracks method to play all tracks
   * returned by the GetTrackRecommendations service for the desired track attributes.
   * 
   * @param preset The user preset item that was selected.
   */
  protected async PlayTrackRecommendations(preset: IUserPreset): Promise<void> {

    try {

      if (!this.player.isUserProductPremium()) {
        throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
      }

      // show progress indicator.
      this.progressShow();

      // update status.
      this.alertInfo = "Searching for track recommendations ...";
      this.requestUpdate();

      // get track recommendations.
      const limit = 50;
      const result = await this.spotifyPlusService.GetTrackRecommendations(this.player.id, preset.recommendations, limit, null);

      // build track uri list from recommendation results.
      const uris = new Array<string>();
      result.tracks.forEach(item => {
        uris.push(item.uri);
      });

      // check for no matching tracks.
      if (uris.length == 0) {
        this.alertInfo = "No recommended tracks were found for the preset criteria; adjust the preset criteria settings and try again.";
        return;
      }

      // update status.
      this.alertInfo = "Playing recommended tracks ...";
      this.requestUpdate();

      // play recommended tracks.
      const device_id = this.player.attributes.source || null;
      await this.spotifyPlusService.PlayerMediaPlayTracks(this.player.id, uris.join(","), null, device_id);

      // show player section.
      this.store.card.SetSection(Section.PLAYER);

    }
    catch (error) {

      // set error message and reset scroll position to zero so the message is displayed.
      this.alertErrorSet("Could not get track recommendations for user preset.  " + (error as Error).message);
      this.mediaBrowserContentElement.scrollTop = 0;

    }
    finally {

      // hide progress indicator.
      this.progressHide();

    }
  }


  /**
   * Calls the SpotifyPlusService PlayerMediaPlayTrackFavorites method to play all 
   * track favorites.
   * 
   * @param preset The user preset item that was selected.
   */
  protected async PlayTrackFavorites(preset: IUserPreset): Promise<void> {

    try {

      if (!this.player.isUserProductPremium()) {
        throw new Error(ALERT_ERROR_SPOTIFY_PREMIUM_REQUIRED);
      }

      // show progress indicator.
      this.progressShow();

      // update status.
      this.alertInfo = "Playing track favorites ...";
      this.requestUpdate();

      // play favorite tracks.
      const device_id = this.player.attributes.source || null;
      const shuffle = preset.shuffle || ((this.player.attributes.shuffle != null) ? this.player.attributes.shuffle : true);
      await this.spotifyPlusService.PlayerMediaPlayTrackFavorites(this.player.id, device_id, shuffle, null, true, this.config.trackFavBrowserItemsLimit || 200);

      // show player section.
      this.store.card.SetSection(Section.PLAYER);

    }
    catch (error) {

      // set error message and reset scroll position to zero so the message is displayed.
      this.alertErrorSet("Could not play track favorites for user preset.  " + (error as Error).message);
      this.mediaBrowserContentElement.scrollTop = 0;

    }
    finally {

      // hide progress indicator.
      this.progressHide();

    }
  }


  /**
   * Updates the mediaList display.
   */
  protected override updateMediaList(player: MediaPlayer): boolean {

    // invoke base class method; if it returns false, then we should not update the media list.
    if (!super.updateMediaList(player)) {
      return false;
    }

    try {

      // initialize the media list, as we are loading it from multiple sources.
      this.mediaListLastUpdatedOn = getUtcNowTimestamp();
      this.mediaList = new Array<IUserPreset>();

      // we use the `Promise.allSettled` approach here like we do with actions, so
      // that we can easily add promises if more data gathering is needed in the future.
      const promiseRequests = new Array<Promise<unknown>>();

      // create promise - get media list from config settings.
      const promiseUpdateMediaListConfig = new Promise((resolve, reject) => {

        try {

          // load settings, append to the media list, and resolve the promise.
          const result = JSON.parse(JSON.stringify(this.config.userPresets || [])) as IUserPreset[];
          if (result) {

            // set where the configuration items were loaded from, and
            // replace nocache indicator if specified.
            const noCacheKey = "nocache=" + getUtcNowTimestamp();
            result.forEach(item => {
              item.origin = "card config";
              item.image_url = (item.image_url || "").replace("{nocache}", noCacheKey);
            });

            // append results to media list.
            (this.mediaList || []).push(...result);
          }
          resolve(true);
        }
        catch (error) {

          // reject the promise.
          super.updatedMediaListError("Load User Presets from config failed: " + (error as Error).message);
          reject(error);

        }
      });

      promiseRequests.push(promiseUpdateMediaListConfig);

      // was a user presets url specified?
      if (this.config.userPresetsFile || '' != '') {

        // create promise - get media list from user presets url.
        const promiseUpdateMediaListUrl = new Promise((resolve, reject) => {

          // call fetch api to get media list content from the url.
          // note that "nocache=" will force refresh, if url content is cached.
          fetch(this.config.userPresetsFile + '?nocache=' + Date.now())
            .then(response => {
              // if bad response then raise an exception with error details.
              if (!response.ok) {
                throw new Error("server response: " + response.status + " " + response.statusText);
              }
              // otherwise, return json response data.
              return response.json();
            })
            .then(response => {
              // append to the media list, and resolve the promise.
              const responseObj = response as IUserPreset[]
              if (responseObj) {

                // set where the configuration items were loaded from, and 
                // replace nocache indicator if specified.
                const noCacheKey = "nocache=" + getUtcNowTimestamp();
                responseObj.forEach(item => {
                  item.origin = this.config.userPresetsFile as string;
                  item.image_url = (item.image_url || "").replace("{nocache}", noCacheKey);
                });

                // append results to media list.
                (this.mediaList || []).push(...responseObj);
              }
              resolve(true);
            })
            .catch(error => {
              // process error result and reject the promise.
              super.updatedMediaListError("Could not fetch data from configuration `userPresetsFile` (" + this.config.userPresetsFile + "); " + (error as Error).message);
              reject(error);
            });
        });

        promiseRequests.push(promiseUpdateMediaListUrl);
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

      // clear the progress indicator.
      this.progressHide();

      // set alert error message.
      super.updatedMediaListError("User Presets favorites refresh failed: " + (error as Error).message);
      return true;

    }
    finally {
    }
  }

}