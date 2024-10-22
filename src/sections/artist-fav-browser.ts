// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

// our imports.
import '../components/media-browser-list';
import '../components/media-browser-icons';
import '../components/artist-actions';
import { FavBrowserBase } from './fav-browser-base';
import { sharedStylesFavBrowser } from '../styles/shared-styles-fav-browser.js';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { formatTitleInfo } from '../utils/media-browser-utils';
import { IArtist } from '../types/spotifyplus/artist';


@customElement("spc-artist-fav-browser")
export class ArtistFavBrowser extends FavBrowserBase {

  /** Array of items to display in the media list. */
  protected override mediaList!: Array<IArtist> | undefined;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.ARTIST_FAVORITES);
    this.filterCriteriaPlaceholder = "filter by artist name";

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
    const title = formatTitleInfo(this.config.artistFavBrowserTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList);
    const subtitle = formatTitleInfo(this.config.artistFavBrowserSubTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList);

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
              if (this.config.artistFavBrowserItemsPerRow === 1) {
                return (
                  html`<spc-media-browser-list 
                        class="media-browser-list"
                        .items=${this.mediaList?.filter((item: IArtist) => item.name.toLocaleLowerCase().indexOf(filterName) !== -1)}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-list>`
                )
              } else {
                return (
                  html`<spc-media-browser-icons 
                        class="media-browser-list"
                        .items=${this.mediaList?.filter((item: IArtist) => item.name.toLocaleLowerCase().indexOf(filterName) !== -1)}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-icons>`
                )
              }
            // if actions are visbile, then render the actions display.
            } else {
              return html`<spc-artist-actions class="media-browser-actions" .store=${this.store} .mediaItem=${this.mediaItem}></spc-artist-actions>`;
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
      `
    ];
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

      // we use the `Promise.allSettled` approach here like we do with actions, so
      // that we can easily add promises if more data gathering is needed in the future.
      const promiseRequests = new Array<Promise<unknown>>();

      // create promise - get media list.
      const promiseUpdateMediaList = new Promise((resolve, reject) => {

        // set service parameters.
        const limitTotal = this.LIMIT_TOTAL_MAX;
        const sortResult = this.config.artistFavBrowserItemsSortTitle || false;

        // call the service to retrieve the media list.
        this.spotifyPlusService.GetArtistsFollowed(player.id, 0, 0, limitTotal, sortResult)
          .then(result => {

            // load media list results.
            this.mediaList = result.items;
            this.mediaListLastUpdatedOn = result.lastUpdatedOn || (Date.now() / 1000);

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
            super.updatedMediaListError("Get Artist Followed failed: \n" + (error as Error).message);

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
      super.updatedMediaListError("Artist followed refresh failed: \n" + (error as Error).message);
      return true;

    }
    finally {
    }
  }

}