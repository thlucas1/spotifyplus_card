// lovelace card imports.
import { css, html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit-html/directives/style-map.js';

// our imports.
import '../components/player-progress';
import { CardConfig } from '../types/card-config';
import { Store } from '../model/store';
import { MediaPlayer } from '../model/media-player';
import { formatTitleInfo } from '../utils/media-browser-utils';

class PlayerHeader extends LitElement {

  /** Application common storage area. */
  @property({ attribute: false }) store!: Store;

  /** Card configuration data. */
  private config!: CardConfig;

  /** MediaPlayer instance created from the configuration entity id. */
  private player!: MediaPlayer;


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // set common references from application common storage area.
    this.config = this.store.config;
    this.player = this.store.player;

    // get hide progress bar configuration setting.
    const hideProgress = this.config.playerHeaderHideProgressBar || false;

    // format title and sub-title details.
    const title = formatTitleInfo(this.config.playerHeaderTitle, this.config, this.player);
    let artistTrack = formatTitleInfo(this.config.playerHeaderArtistTrack, this.config, this.player);
    let album = formatTitleInfo(this.config.playerHeaderAlbum, this.config, this.player);

    // just in case nothing is playing, get rid of any ' - ' sequences.
    if (artistTrack) {
      artistTrack = artistTrack.replace(/^ - | - $/g, '');
    }

    // if nothing is playing then display configured 'no media playing' text.
    if (!this.player.attributes.media_title) {
      artistTrack = formatTitleInfo(this.config.playerHeaderNoMediaPlayingText, this.config, this.player) || 'No Media Playing';
      album = undefined;
    }

    // render html.
    return html` 
      <div class="player-header-container" style=${this.styleContainer()}>
        ${!hideProgress ? html`<spc-player-progress .store=${this.store}></spc-player-progress>` : html``}
        <div class="header-title">${title}</div>
        ${artistTrack ? html`<div class="header-artist-track">${artistTrack}</div>` : html``}
        ${album ? html`<div class="header-artist-album">${album}</div>` : html``}
      </div>`;
  }

  /**
   * Returns an element style for the progress bar portion of the control.
   */
  private styleContainer() {
    return styleMap({
    });
  }


  /**
   * style definitions used by this component.
   * */
static get styles() {
    return css`

      .player-header-container {
        margin: 0.75rem 3.25rem;
        margin-top: 0rem;
        padding: 0.5rem;
        padding-top: 0rem;
        max-width: 40rem;
        text-align: center;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        /*border: 1px solid red;  /*  FOR TESTING CONTROL LAYOUT CHANGES */
      }

      .header-title {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1rem;
        font-weight: 500;
        text-shadow: 0 0 2px var(--spc-player-palette-vibrant);
        //color: var(--secondary-text-color);
        //color: var(--spc-player-palette-vibrant);
        color: var(--spc-player-header-color);
        white-space: nowrap;
        mix-blend-mode: screen;
        min-height: 0.5rem;
      }

      .header-artist-track {
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

      .header-artist-album {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1rem;
        font-weight: 300;
        text-shadow: 0 0 2px var(--spc-player-palette-vibrant);
        //color: var(--secondary-text-color);
        //color: var(--spc-player-palette-vibrant);
        color: var(--spc-player-header-color);
        mix-blend-mode: screen;
      }
    `;
  }
}

customElements.define('spc-player-header', PlayerHeader);
