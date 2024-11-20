// lovelace card imports.
import { css, html, TemplateResult } from 'lit';

// our imports.
import { MediaBrowserBase } from './media-browser-base';
import { ITEM_SELECTED } from '../constants';
import { customEvent } from '../utils/utils';


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
      <div class="icons" style="--items-per-row: ${this.itemsPerRow}">
        ${this.buildMediaBrowserItems().map(
          (item, index) => html`
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
          `,
        )}
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
          /* margin: 0.6%; */
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
          color: var(--secondary-text-color);
          font-weight: normal;
          padding: 0 0.5rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .subtitle {
          font-size: 0.8rem;
          width: 100%;
          line-height: 160%;
        }
      `,
    ];
  }
}

customElements.define('spc-media-browser-icons', MediaBrowserIcons);
