// lovelace card imports.
import { css, html, TemplateResult } from 'lit';

// our imports.
import { ITEM_SELECTED } from '../constants';
import { MediaBrowserBase } from './media-browser-base';
import { IMediaBrowserItem } from '../types/media-browser-item';
import { customEvent, formatStringProperCase } from '../utils/utils';


export class MediaBrowserIcons extends MediaBrowserBase {


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super();
  }


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // invoke base class method.
    super.render();

    // render html.
    return html`
      <div class="icons" style=${this.styleMediaBrowser()}>
        ${this.buildMediaBrowserItems().map((item, index) => html`
          ${this.styleMediaBrowserItemBackgroundImage(item.mbi_item.image_url, index)}
          ${(() => {
            if (this.isTouchDevice) {
              return (html`
                <ha-control-button
                  class="button"
                  isTouchDevice="${this.isTouchDevice}"
                  @touchstart=${{handleEvent: () => this.onMediaBrowserItemTouchStart(customEvent(ITEM_SELECTED, item)), passive: true }}
                  @touchend=${() => this.onMediaBrowserItemTouchEnd(customEvent(ITEM_SELECTED, item))}
                >
                  ${this.renderMediaBrowserItem(item, !item.mbi_item.image_url || !this.hideTitle, !this.hideSubTitle)}
                </ha-control-button>
              `);
            } else {
              return (html`
                <ha-control-button
                  class="button"
                  isTouchDevice="${this.isTouchDevice}"
                  @click=${() => this.onMediaBrowserItemClick(customEvent(ITEM_SELECTED, item))}
                  @mousedown=${() => this.onMediaBrowserItemMouseDown()}
                  @mouseup=${() => this.onMediaBrowserItemMouseUp(customEvent(ITEM_SELECTED, item))}
                >
                  ${this.renderMediaBrowserItem(item, !item.mbi_item.image_url || !this.hideTitle, !this.hideSubTitle)}
                </ha-control-button>
              `);
            }
          })()}
        `)}
      </div>
    `;
  }


  /**
   * Render the media item.
  */
  protected renderMediaBrowserItem(
    item: IMediaBrowserItem,
    showTitle: boolean = true,
    showSubTitle: boolean = true,
  ) {

    let clsActive = ''
    let divNowPlayingBars = html``
    if (item.mbi_item.is_active) {
      clsActive = ' title-active';
      divNowPlayingBars = this.nowPlayingBars
    }

    return html`
      <div class="thumbnail">
        ${divNowPlayingBars}
      </div>
      <div class="title${clsActive}" ?hidden=${!showTitle}>
        ${item.mbi_item.title}
        <div class="subtitle" ?hidden=${!showSubTitle}>${formatStringProperCase(item.mbi_item.subtitle || '')}</div>
      </div>
    `;
  }


  /**
   * Style definitions used by this card section.
   * 
   * --control-button-padding: 0px;   // image with rounded corners
   */
  static get styles() {
    return [
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
          background-size: 100%;
          background-repeat: no-repeat;
          background-position: center;
          mask-repeat: no-repeat;
          mask-position: center;
        }

        .title {
          color: var(--spc-media-browser-items-color, #ffffff);
          font-size: var(--spc-media-browser-items-title-font-size, 0.8rem);
          font-weight: normal;
          line-height: 160%;
          padding: 0.75rem 0.5rem 0rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: absolute;
          width: 100%;
          bottom: 0;
          background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
        }

        .title-active {
          color: var(--spc-media-browser-items-color, #ffffff);
        }

        .subtitle {
          font-size: var(--spc-media-browser-items-subtitle-font-size, 0.8rem);
          line-height: 120%;
          width: 100%;
          padding-bottom: 0.25rem;
        }

        /* *********************************************************** */
        /* the remaining styles are used for the sound animation icon. */
        /* *********************************************************** */
        .bars {
          position: absolute;
          width: 20px;
          height: 10px;
          margin-top: 20px;
          margin-left: 10px;

          /*height: 30px;*/
          /*left: 10%;*/
          /*margin: 0 0 0 0;*/
          /*position: absolute;*/
          /*top: -4%;*/
          /*width: 40px;*/
        }

        .bar {
          background: var(--dark-primary-color);
          bottom: 1px;
          height: 3px;
          position: absolute;
          width: 3px;      
          animation: sound 0ms -800ms linear infinite alternate;
          display: block;
        }

        @keyframes sound {
          0% {
            opacity: .35;
            height: 3px; 
          }
          100% {
            opacity: 1;       
            height: 1rem;        
          }
        }

        .bar:nth-child(1)  { left: 1px; animation-duration: 474ms; }
        .bar:nth-child(2)  { left: 5px; animation-duration: 433ms; }
        .bar:nth-child(3)  { left: 9px; animation-duration: 407ms; }
        .bar:nth-child(4)  { left: 13px; animation-duration: 458ms; }
        /*.bar:nth-child(5)  { left: 17px; animation-duration: 400ms; }*/
        /*.bar:nth-child(6)  { left: 21px; animation-duration: 427ms; }*/
        /*.bar:nth-child(7)  { left: 25px; animation-duration: 441ms; }*/
        /*.bar:nth-child(8)  { left: 29px; animation-duration: 419ms; }*/
        /*.bar:nth-child(9)  { left: 33px; animation-duration: 487ms; }*/
        /*.bar:nth-child(10) { left: 37px; animation-duration: 442ms; }*/

      `,
    ];
  }
}

customElements.define('spc-media-browser-icons', MediaBrowserIcons);
