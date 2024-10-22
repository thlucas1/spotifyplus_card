// lovelace card imports.
import { css, LitElement, TemplateResult } from 'lit';
import { eventOptions, property } from 'lit/decorators.js';

// our imports.
import { Store } from '../model/store';
import { CardConfig } from '../types/card-config';
import { Section } from '../types/section';
import { ITEM_SELECTED, ITEM_SELECTED_WITH_HOLD } from '../constants';
import { closestElement, customEvent, isTouchDevice } from '../utils/utils';
import { IMediaBrowserItem } from '../types/media-browser-item';
import {
  styleMediaBrowserItemTitle
} from '../utils/media-browser-utils';
import { SearchMediaTypes } from '../types/search-media-types';


export class MediaBrowserBase extends LitElement {

  // public state properties.
  @property({ attribute: false }) protected store!: Store;
  @property({ attribute: false }) protected items!: IMediaBrowserItem[];
  @property({ attribute: false }) protected mediaType!: any;

  protected config!: CardConfig;
  protected section!: Section;
  protected mousedownTimestamp!: number;
  protected touchstartScrollTop!: number;

  protected hideTitle!: boolean;
  protected hideSubTitle!: boolean;
  protected isTouchDevice!: boolean;
  protected itemsPerRow!: number;
  protected listItemClass!: string;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super();

    // initialize storage.
    this.mousedownTimestamp = 0;
    this.touchstartScrollTop = 0;

  }


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // set common references from application common storage area.
    this.config = this.store.config;
    this.section = this.store.section;

    // set title / source visibility based on selected section.
    this.hideTitle = true;
    this.hideSubTitle = true;
    this.itemsPerRow = 1;
    this.listItemClass = 'button';

    // assign the mediaType based on the section value.
    // for search, we will convert the SearchMediaType to a Section type.
    if (this.section != Section.SEARCH_MEDIA) {
      this.mediaType = this.section;
    } else {
      if (this.mediaType == SearchMediaTypes.ALBUMS) {
        this.mediaType = Section.ALBUM_FAVORITES;
      } else if (this.mediaType == SearchMediaTypes.ARTISTS) {
        this.mediaType = Section.ARTIST_FAVORITES;
      } else if (this.mediaType == SearchMediaTypes.AUDIOBOOKS) {
        this.mediaType = Section.AUDIOBOOK_FAVORITES;
      } else if (this.mediaType == SearchMediaTypes.EPISODES) {
        this.mediaType = Section.EPISODE_FAVORITES;
      } else if (this.mediaType == SearchMediaTypes.PLAYLISTS) {
        this.mediaType = Section.PLAYLIST_FAVORITES;
      } else if (this.mediaType == SearchMediaTypes.SHOWS) {
        this.mediaType = Section.SHOW_FAVORITES;
      } else if (this.mediaType == SearchMediaTypes.TRACKS) {
        this.mediaType = Section.TRACK_FAVORITES;
      }
    }

    // set item control properties from configuration settings.
    if (this.mediaType == Section.ALBUM_FAVORITES) {
      this.itemsPerRow = this.config.albumFavBrowserItemsPerRow || 4;
      this.hideTitle = this.config.albumFavBrowserItemsHideTitle || false;
      this.hideSubTitle = this.config.albumFavBrowserItemsHideSubTitle || false;
    } else if (this.mediaType == Section.ARTIST_FAVORITES) {
      this.itemsPerRow = this.config.artistFavBrowserItemsPerRow || 4;
      this.hideTitle = this.config.artistFavBrowserItemsHideTitle || false;
      this.hideSubTitle = this.config.artistFavBrowserItemsHideSubTitle || false;
    } else if (this.mediaType == Section.AUDIOBOOK_FAVORITES) {
      this.itemsPerRow = this.config.audiobookFavBrowserItemsPerRow || 4;
      this.hideTitle = this.config.audiobookFavBrowserItemsHideTitle || false;
      this.hideSubTitle = this.config.audiobookFavBrowserItemsHideSubTitle || false;
    } else if (this.mediaType == Section.DEVICES) {
      this.itemsPerRow = this.config.deviceBrowserItemsPerRow || 1;
      this.hideTitle = this.config.deviceBrowserItemsHideTitle || false;
      this.hideSubTitle = this.config.deviceBrowserItemsHideSubTitle || false;
      // for devices, make the source icons half the size of regular list buttons.
      this.listItemClass += ' button-source';
    } else if (this.mediaType == Section.EPISODE_FAVORITES) {
      this.itemsPerRow = this.config.episodeFavBrowserItemsPerRow || 4;
      this.hideTitle = this.config.episodeFavBrowserItemsHideTitle || false;
      this.hideSubTitle = this.config.episodeFavBrowserItemsHideSubTitle || false;
    } else if (this.mediaType == Section.PLAYLIST_FAVORITES) {
      this.itemsPerRow = this.config.playlistFavBrowserItemsPerRow || 4;
      this.hideTitle = this.config.playlistFavBrowserItemsHideTitle || false;
      this.hideSubTitle = this.config.playlistFavBrowserItemsHideSubTitle || false;
    } else if (this.mediaType == Section.RECENTS) {
      this.itemsPerRow = this.config.recentBrowserItemsPerRow || 4;
      this.hideTitle = this.config.recentBrowserItemsHideTitle || false;
      this.hideSubTitle = this.config.recentBrowserItemsHideSubTitle || false;
    } else if (this.mediaType == Section.SHOW_FAVORITES) {
      this.itemsPerRow = this.config.showFavBrowserItemsPerRow || 4;
      this.hideTitle = this.config.showFavBrowserItemsHideTitle || false;
      this.hideSubTitle = this.config.showFavBrowserItemsHideSubTitle || false;
    } else if (this.mediaType == Section.TRACK_FAVORITES) {
      this.itemsPerRow = this.config.trackFavBrowserItemsPerRow || 4;
      this.hideTitle = this.config.trackFavBrowserItemsHideTitle || false;
      this.hideSubTitle = this.config.trackFavBrowserItemsHideSubTitle || false;
    } else if (this.mediaType == Section.USERPRESETS) {
      this.itemsPerRow = this.config.userPresetBrowserItemsPerRow || 4;
      this.hideTitle = this.config.userPresetBrowserItemsHideTitle || false;
      this.hideSubTitle = this.config.userPresetBrowserItemsHideSubTitle || false;
    }

    // if search section was specified AND we are not using media type settings, then
    // use search config settings for ItemsPerRow, HideTitle, and HideSubTitle values.
    if (this.section == Section.SEARCH_MEDIA) {
      if (this.config.searchMediaBrowserUseDisplaySettings || false) {
        this.itemsPerRow = this.config.searchMediaBrowserItemsPerRow || 4;
        this.hideTitle = this.config.searchMediaBrowserItemsHideTitle || false;
        this.hideSubTitle = this.config.searchMediaBrowserItemsHideSubTitle || false;
      }
    }

    // all html is rendered in the inheriting class.
  }


  /**
   * Style definitions used by this card section.
   * 
   * --control-button-padding: 0px;   // image with rounded corners
   */
  static get styles() {
    return [
      styleMediaBrowserItemTitle,
      css`
        .icons {
          display: flex;
          flex-wrap: wrap;
        }

        .button {
          --control-button-padding: 0px;
          --margin: 0.6%;
          --width: calc(100% / var(--items-per-row) - (var(--margin) * 2));
          width: var(--width);
          height: var(--width);
          margin: var(--margin);
        }

        .thumbnail {
          width: 100%;
          padding-bottom: 100%;
          margin: 0 6%;
          background-size: 100%;
          background-repeat: no-repeat;
          background-position: center;
        }

        .title {
          font-size: 0.8rem;
          position: absolute;
          width: 100%;
          line-height: 160%;
          bottom: 0;
          background-color: rgba(var(--rgb-card-background-color), 0.733);
        }

        .title-active {
          color: var(--dark-primary-color) !important;
        }

        .title-source {
          font-size: 0.8rem;
          width: 100%;
          line-height: 160%;
        }
      `,
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

    // determine if this is a touch device (true) or not (false).
    this.isTouchDevice = isTouchDevice();

    if (this.isTouchDevice) {
      // for touch devices, prevent context menu from showing when user ends the touch.
      this.addEventListener('touchend', function (e) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  }


  /**
   * Event fired when a mouseup event takes place for a media browser 
   * item button.
   * 
   * This event is NOT fired for touch devices.
   * 
   * @param event Event arguments.
   */
  protected onMediaBrowserItemClick(event: CustomEvent): boolean {

    // have we already fired the click event?
    if (this.mousedownTimestamp == -1) {
      return true;
    }

    // calculate the duration of the mouse down / up operation.
    // we are looking to determine how long the mouse button was in the down
    // position (e.g.the duration).  if the duration was greater than 1.0 seconds,
    // then we will treat the event as a "click and hold" operation; otherwise,
    // we will treat the event as a "click" operation.
    const duration = Date.now() - this.mousedownTimestamp;
    this.mousedownTimestamp = -1;
    if (duration < 1000) {
      return this.dispatchEvent(customEvent(ITEM_SELECTED, event.detail));
    } else {
      return this.dispatchEvent(customEvent(ITEM_SELECTED_WITH_HOLD, event.detail));
    }

  }


  /**
   * Event fired when a mousedown event takes place for a media browser 
   * item button.
   * 
   * This event is NOT fired for touch devices.
   * 
   * The `@eventOptions` will prevent the following warning messages in Chrome:
   * [Violation] Added non-passive event listener to a scroll-blocking <some> event. 
   * Consider marking event handler as 'passive' to make the page more responsive.
   * This will tell browsers that `preventDefault()` will never be called on those 
   * events, which will increase performance as well as remove the warning message.
   */
  protected onMediaBrowserItemMouseDown(): boolean {

    // store the current time (in milliseconds) so that we can calculate
    // the duration in the "click" event (occurs after a mouseup event).
    this.mousedownTimestamp = Date.now();

    // automatically fire the click event in 1100 milliseconds.
    // we will handle any duplicate click event in the click event handler.
    setTimeout(() => {
      this.shadowRoot?.activeElement?.dispatchEvent(new Event('click'));
    }, 1100);

    return true;
  }


  /**
   * Event fired when a mouseup event takes place for a media browser 
   * item button.
   * 
   * This event is NOT fired for touch devices.
   * 
   * @param event Event arguments.
   */
  protected onMediaBrowserItemMouseUp(event: CustomEvent): boolean {

    // have we already fired the click event?
    if (this.mousedownTimestamp == -1) {
      return true;
    }

    // calculate the duration of the mouse down / up operation.
    // we are looking to determine how long the mouse button was in the down
    // position (e.g.the duration).  if the duration was greater than 1.0 seconds,
    // then we will treat the event as a "click and hold" operation; otherwise,
    // we will treat the event as a "click" operation.
    const duration = Date.now() - this.mousedownTimestamp;
    this.mousedownTimestamp = -1;
    if (duration < 1000) {
      return this.dispatchEvent(customEvent(ITEM_SELECTED, event.detail));
    } else {
      return this.dispatchEvent(customEvent(ITEM_SELECTED_WITH_HOLD, event.detail));
    }

  }


  /**
   * Event fired when a touchstart event takes place for a media browser 
   * item button.
   * 
   * This event is NOT fired for non-touch devices (e.g. mouse).
   * 
   * @param event Event arguments.
   * 
   * The event listener expression `{handleEvent: () => ... , passive: true }` syntax 
   * is used to set passive to true on the `addEventHandler` definition.  Using this
   * syntax prevents the `[Violation] Added non-passive event listener to a scroll-blocking 
   * <some> event. Consider marking event handler as 'passive' to make the page more 
   * responsive` warnings that are generated by Chrome and other browsers.  These
   * warnings only seem to appear for the `touchstart`, `touchmove`, and `scroll`
   * declarative events.
   * 
   * Note that the `@eventOptions({ passive: true })` has no effect when using a `() =>`
   * event expression on the declarative event listener!  We left it here though, just
   * in case we change the event listener expression in the future.
   */
  @eventOptions({ passive: true })
  protected onMediaBrowserItemTouchStart(event: CustomEvent): boolean {

    // store the current time (in milliseconds) so that we can calculate
    // the duration in the "click" event (occurs after a mouseup event).
    this.mousedownTimestamp = Date.now();

    // find the parent `mediaBrowserContentElement` and get the scroll position.
    // for touch devices, we need to determine if the touchstart / touchend
    // events are for scrolling or tap and hold.
    const divContainer = closestElement('#mediaBrowserContentElement', this) as HTMLDivElement;
    if (divContainer) {
      this.touchstartScrollTop = divContainer.scrollTop;
    }

    // fire the following logic in 1100 milliseconds (1.1 seconds) that will determine 
    // if a press-and-hold action took place (versus a press action).
    setTimeout(() => {

      // if a press action took place, then we are done.
      if (this.mousedownTimestamp == -1) {
        return;
      }

      // find the parent `mediaBrowserContentElement` and get the current scroll position.
      // for touch devices, we need to determine if the user is scrolling or if they
      // want to issue a press / press-and-hold action.
      // we do this by comparing the scroll position of the parent container when the touch
      // was initiated to the current scroll position.
      // if original and current scroll positions are not equal (or nearly so), then it's a 
      // scroll operation and we can ignore the event.
      const divContainer = closestElement('#mediaBrowserContentElement', this) as HTMLDivElement;
      let scrollTopDifference = 0;
      if (divContainer) {
        scrollTopDifference = this.touchstartScrollTop - divContainer.scrollTop;
        if (scrollTopDifference != 0) {
          return;
        }
      }

      // at this point, we know it's a press-and-hold action.
      // dispatch the ITEM_SELECTED_WITH_HOLD event, and reset timestamp to indicate it was handled.
      this.mousedownTimestamp = -1;
      return this.dispatchEvent(customEvent(ITEM_SELECTED_WITH_HOLD, event.detail));

    }, 1100);

    return true;
  }


  /**
   * Event fired when a touchend event takes place for a media browser 
   * item button.
   * 
   * This event is NOT fired for non-touch devices (e.g. mouse).
   * 
   * @param event Event arguments.
   * 
   * The `@eventOptions` will prevent the following warning messages in Chrome:
   * [Violation] Added non-passive event listener to a scroll-blocking <some> event. 
   * Consider marking event handler as 'passive' to make the page more responsive.
   * This will tell browsers that `preventDefault()` will never be called on those 
   * events, which will increase performance as well as remove the warning message.
   */
  protected onMediaBrowserItemTouchEnd(event: CustomEvent): boolean {

    // have we already fired the click event?
    if (this.mousedownTimestamp == -1) {
      return true;
    }

    // find the parent `mediaBrowserContentElement` and get the scroll position.
    // for touch devices, we need to determine if the touchstart / touchend
    // events are for scrolling or tap and hold.
    const divContainer = closestElement('#mediaBrowserContentElement', this) as HTMLDivElement;
    let scrollTopDifference = 0;
    if (divContainer) {
      scrollTopDifference = this.touchstartScrollTop - divContainer.scrollTop;

      // if scroll positions are not equal (or nearly so), then it's a scroll
      // operation and we can ignore the event.
      if (scrollTopDifference != 0) {
        return true;
      }
    }

    // calculate the duration of the mouse down / up operation.
    // we are looking to determine how long the mouse button was in the down
    // position (e.g.the duration).  if the duration was greater than 1.0 seconds,
    // then we will treat the event as a "click and hold" operation; otherwise,
    // we will treat the event as a "click" operation.
    const duration = Date.now() - this.mousedownTimestamp;
    this.mousedownTimestamp = -1;
    if (duration < 1000) {
      return this.dispatchEvent(customEvent(ITEM_SELECTED, event.detail));
    } else {
      return this.dispatchEvent(customEvent(ITEM_SELECTED_WITH_HOLD, event.detail));
    }

  }

}
