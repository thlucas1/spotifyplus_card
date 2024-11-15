// lovelace card imports.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

// our imports.
import '../components/media-browser-list';
import '../components/media-browser-icons';
import '../components/playlist-actions';
import { FavBrowserBase } from './fav-browser-base';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { formatTitleInfo } from '../utils/media-browser-utils';
import { getUtcNowTimestamp } from '../utils/utils';
import { ICategory } from '../types/spotifyplus/category';
import { IPlaylistSimplified } from '../types/spotifyplus/playlist-simplified';

// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":category-browser");


@customElement("spc-category-browser")
export class CategoryBrowser extends FavBrowserBase {

  // private state properties.
  @state() protected isCategoryVisible?: boolean;
  @state() protected categoryId?: string;

  /** Array of items to display in the media list. */
  protected override mediaList!: Array<ICategory> | undefined;

  /** Array of category playlists to display in the media list. */
  private categoryPlaylists!: Array<IPlaylistSimplified> | undefined;

  /** Date and time (in epoch format) of when the media list was last updated. */
  private categoryPlaylistsLastUpdatedOn!: number;

  /** Filter criteria used for the category list. */
  private categoryListFilter!: string | undefined;

  /** Saved scroll position of the category list. */
  private categoryListScrollTopSaved!: number | undefined;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.CATEGORYS);
    this.filterCriteriaPlaceholder = "filter by category name";

  }


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // invoke base class method.
    super.render();

    // format title and sub-title details based on list that is currently displayed.
    let title: string | undefined = "";
    let subtitle: string | undefined = "";
    if (this.isCategoryVisible) {
      title = formatTitleInfo(this.config.categoryBrowserTitle, this.config, this.player, this.categoryPlaylistsLastUpdatedOn, this.categoryPlaylists);
      subtitle = formatTitleInfo(this.config.categoryBrowserSubTitle, this.config, this.player, this.categoryPlaylistsLastUpdatedOn, this.categoryPlaylists);
    } else {
      title = formatTitleInfo(this.config.categoryBrowserTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList);
      subtitle = formatTitleInfo(this.config.categoryBrowserSubTitle, this.config, this.player, this.mediaListLastUpdatedOn, this.mediaList);
    }

    // render html.
    return html`
      <div class="media-browser-section">
        ${title ? html`<div class="media-browser-section-title">${title}</div>` : html``}
        ${subtitle ? html`<div class="media-browser-section-subtitle">${subtitle}</div>` : html``}
        <div class="media-browser-controls">
          ${(this.isActionsVisible || this.isCategoryVisible || false) ?html`${this.btnHideActionsHtml}` : html``}
          ${this.filterCriteriaHtml}${this.refreshMediaListHtml}
        </div>
        <div id="mediaBrowserContentElement" class="media-browser-content">
          ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
          ${this.alertInfo ? html`<ha-alert alert-type="info" dismissable @alert-dismissed-clicked=${this.alertInfoClear}>${this.alertInfo}</ha-alert>` : ""}
          ${(() => {
            if (this.isActionsVisible) {
              // if actions are visbile, then render the actions display.
              return html`<spc-playlist-actions class="media-browser-actions" .store=${this.store} .mediaItem=${this.mediaItem}></spc-playlist-actions>`;
            } else if (this.isCategoryVisible) {
              // if category is visible, then render the playlists for the category.
              const filterName = (this.filterCriteria || "").toLocaleLowerCase();
              if (this.config.categoryBrowserItemsPerRow === 1) {
                return (
                  html`<spc-media-browser-list 
                        class="media-browser-list"
                        .items=${this.categoryPlaylists?.filter((item: IPlaylistSimplified) => item.name.toLocaleLowerCase().indexOf(filterName) !== -1)}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-list>`
                )
              } else {
                return (
                  html`<spc-media-browser-icons 
                        class="media-browser-list"
                        .items=${this.categoryPlaylists?.filter((item: IPlaylistSimplified) => item.name.toLocaleLowerCase().indexOf(filterName) !== -1)}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-icons>`
                )
              }
            } else {
              // if category is not visbile, then render the category list.
              const filterName = (this.filterCriteria || "").toLocaleLowerCase();
              if (this.config.categoryBrowserItemsPerRow === 1) {
                return (
                  html`<spc-media-browser-list 
                        class="media-browser-list"
                        .items=${this.mediaList?.filter((item: ICategory) => item.name.toLocaleLowerCase().indexOf(filterName) !== -1)}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-list>`
                )
              } else {
                return (
                  html`<spc-media-browser-icons 
                        class="media-browser-list"
                        .items=${this.mediaList?.filter((item: ICategory) => item.name.toLocaleLowerCase().indexOf(filterName) !== -1)}
                        .store=${this.store}
                        @item-selected=${this.onItemSelected}
                        @item-selected-with-hold=${this.onItemSelectedWithHold}
                       ></spc-media-browser-icons>`
                )
              }
            }
          })()}  
        </div>
      </div>
    `;
  }


  /**
   * Handles the `click` event fired when the hide or refresh actions icon is clicked.
   * 
   * @param evArgs Event arguments that contain the icon that was clicked on.
   */
  protected override onFilterActionsClick(ev: MouseEvent) {

    // get action to perform.
    const action = (ev.currentTarget! as HTMLElement).getAttribute("action")!;

    // was hide actions requested?
    if (action === "hideactions") {

      // if detail actions are visible then let the base class handle it;
      if (this.isActionsVisible) {

        // let base class handle the event.
        super.onFilterActionsClick(ev);

      } else if (this.isCategoryVisible) {

        // if category playlist items are visible, then reset category id and 
        // display the category list.
        this.categoryId = "";
        this.isCategoryVisible = false;
        this.filterCriteria = this.categoryListFilter;
        this.scrollTopSaved = this.categoryListScrollTopSaved;

        // set a timeout to re-apply media list items scroll position, as some of the shadowRoot
        // elements may not have completed updating when the re-render occured.
        setTimeout(() => {
          this.requestUpdate();
        }, 50);
      }

    } else {

      // let base class handle the event.
      super.onFilterActionsClick(ev);

    }

  }


  /**
   * Handles the `item-selected` event fired when a media browser item is clicked.
   * 
   * @param evArgs Event arguments that contain the media item that was clicked on.
   */
  protected override onItemSelected(evArgs: CustomEvent) {

    if (debuglog.enabled) {
      debuglog("onItemSelected - media item selected:\n%s",
        JSON.stringify(evArgs.detail, null, 2),
      );
    }

    // event could contain a category item, or a category playlist item.
    const eventType = evArgs.detail.type;

    // was a category clicked?
    if (eventType == "category") {

      // main category was selected; event argument is an ICategory item.
      const args = evArgs.detail as ICategory;

      // save scroll position.
      this.scrollTopSaved = this.mediaBrowserContentElement.scrollTop;

      // save category id and display playlists for the selected category.
      this.categoryId = args.id;
      this.isCategoryVisible = true;
      this.categoryListFilter = this.filterCriteria;
      this.categoryListScrollTopSaved = this.scrollTopSaved;
      this.filterCriteria = "";
      this.categoryPlaylists = undefined;
      this.requestUpdate();
      this.updateMediaList(this.player);

    } else {

      // category playlist was selected; event argument is an IPlayListSimplified item.
      // just call base class method to play the media item (it's a playlist).
      super.onItemSelected(evArgs);

    }

  }


  /**
   * Handles the `item-selected-with-hold` event fired when a media browser item is clicked and held.
   * 
   * @param evArgs Event arguments that contain the media item that was clicked on.
   */
  protected override onItemSelectedWithHold(evArgs: CustomEvent) {

    if (debuglog.enabled) {
      debuglog("onItemSelectedWithHold - media item selected:\n%s",
        JSON.stringify(evArgs.detail, null, 2),
      );
    }

    // event could contain a category item, or a playlist item.
    const eventType = evArgs.detail.type;

    // was a category clicked?
    if (eventType == "category") {

      // main category was selected; event argument is an ICategory item.
      // no details can be displayed for the category, so just select it.
      this.onItemSelected(evArgs);

    } else {

      // otherwise, just invoke the base class method to handle the event.
      // this will display the tracks in the category playlist.
      super.onItemSelectedWithHold(evArgs);

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

      // we use the `Promise.allSettled` approach here like we do with actions, so
      // that we can easily add promises if more data gathering is needed in the future.
      const promiseRequests = new Array<Promise<unknown>>();

      if (this.isCategoryVisible) {

        // create promise - get playlists for category.
        const promiseGetCategorysList = new Promise((resolve, reject) => {

          // set service parameters.
          const country = null;
          const limitTotal = this.config.searchMediaBrowserSearchLimit || 50;
          const sortResult = this.config.searchMediaBrowserItemsSortTitle || false;

          // call the service to retrieve the media list.
          this.spotifyPlusService.GetCategoryPlaylists(player.id, this.categoryId, 0, 0, country, limitTotal, sortResult)
            .then(result => {

              // load media list results.
              this.categoryPlaylists = result.items;
              this.categoryPlaylistsLastUpdatedOn = result.date_last_refreshed || getUtcNowTimestamp();

              // call base class method, indicating media list update succeeded.
              super.updatedMediaListOk();
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.categoryPlaylists = undefined;
              this.categoryPlaylistsLastUpdatedOn = 0;

              // call base class method, indicating media list update failed.
              super.updatedMediaListError("Get Category Playlist failed: " + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseGetCategorysList);

      } else {

        // create promise - get browse categorys list.
        const promiseGetCategorysList = new Promise((resolve, reject) => {

          // set service parameters.
          const country = null;
          const locale = null;
          const refresh = true;

          // call the service to retrieve the media list.
          this.spotifyPlusService.GetBrowseCategorysList(player.id, country, locale, refresh)
            .then(result => {

              // load media list results.
              this.mediaList = result.items;
              this.mediaListLastUpdatedOn = result.date_last_refreshed || getUtcNowTimestamp();

              // call base class method, indicating media list update succeeded.
              super.updatedMediaListOk();
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.mediaList = undefined;
              this.mediaListLastUpdatedOn = 0;

              // call base class method, indicating media list update failed.
              super.updatedMediaListError("Get Category List failed: " + (error as Error).message);
              reject(error);

            })
        });

        promiseRequests.push(promiseGetCategorysList);

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
      super.updatedMediaListError("Category List refresh failed: " + (error as Error).message);
      return true;

    }
    finally {
    }
  }

}