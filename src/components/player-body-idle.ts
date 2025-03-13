// lovelace card imports.
import { css, html, TemplateResult, unsafeCSS } from 'lit';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map.js';
import {
  mdiSpotify,
} from '@mdi/js';

// our imports.
import {
  PLAYER_CONTROLS_ICON_SIZE_DEFAULT,
  PLAYER_CONTROLS_ICON_TOGGLE_COLOR_DEFAULT
} from '../constants.js';
import { sharedStylesGrid } from '../styles/shared-styles-grid.js';
import { sharedStylesMediaInfo } from '../styles/shared-styles-media-info.js';
import { sharedStylesFavActions } from '../styles/shared-styles-fav-actions.js';
import { PlayerBodyBase } from './player-body-base';
import { formatTitleInfo, getMdiIconImageUrl } from '../utils/media-browser-utils';


export class PlayerBodyIdle extends PlayerBodyBase {

  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // invoke base class method.
    super.render();

    // get idle status text.
    const idleInfo = formatTitleInfo(this.store.config.playerHeaderNoMediaPlayingText, this.store.config, this.player) || 'No Media Playing';

    // render html.
    return html` 
      <div class="player-idle-container">
        <div class="thumbnail" style=${this.styleMediaBrowserItemImage(getMdiIconImageUrl(mdiSpotify))}></div>
        <div class="title">${idleInfo}</div>
      </div>`;
  }


  /**
   * style definitions used by this component.
   * */
  static get styles() {
    return [
      sharedStylesGrid,
      sharedStylesMediaInfo,
      sharedStylesFavActions,
      css`

        /* style container */
        .player-idle-container {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-top: 0.5rem;
        }

        .thumbnail {
          min-height: var(--spc-player-controls-icon-size, ${unsafeCSS(PLAYER_CONTROLS_ICON_SIZE_DEFAULT)});
          min-width: var(--spc-player-controls-icon-size, ${unsafeCSS(PLAYER_CONTROLS_ICON_SIZE_DEFAULT)});
          max-height: var(--spc-player-controls-icon-size, ${unsafeCSS(PLAYER_CONTROLS_ICON_SIZE_DEFAULT)});
          max-width: var(--spc-player-controls-icon-size, ${unsafeCSS(PLAYER_CONTROLS_ICON_SIZE_DEFAULT)});
          mask-repeat: no-repeat;
          mask-position: center center;
          mask-size: auto;
        }

        .title {
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: var(--spc-player-header-title1-font-size, 1.0rem);
          line-height: var(--spc-player-header-title1-font-size, 1.0rem);
          font-weight: 500;
          text-shadow: 0 0 2px var(--spc-player-palette-vibrant);
          color: var(--spc-player-header-title1-color, #ffffff);
          white-space: nowrap;
          mix-blend-mode: screen;
          min-height: 0.5rem;
          padding-left: 0.5rem;
        }
      `
    ];
  }


  /**
   * Style definition used to style a media browser item background image.
   */
  protected styleMediaBrowserItemImage(thumbnail: string | undefined) {

    // build style info object.
    // if thumbnail contains an svg icon, then use a mask; otherwise, use a background-image.
    // this allows the user to theme the svg icon color.
    const styleInfo: StyleInfo = <StyleInfo>{};
    if (thumbnail?.includes("svg+xml")) {
      styleInfo['mask-image'] = `url(${thumbnail})`;
      styleInfo['background-color'] = `var(--spc-media-browser-items-svgicon-color, ${unsafeCSS(PLAYER_CONTROLS_ICON_TOGGLE_COLOR_DEFAULT)})`;
    } else {
      styleInfo['background-image'] = `url(${thumbnail})`;
      styleInfo['background-color'] = `var(--spc-media-browser-items-svgicon-color, transparent)`;
    }
    return styleMap(styleInfo);

  }

}

customElements.define('spc-player-body-idle', PlayerBodyIdle);
