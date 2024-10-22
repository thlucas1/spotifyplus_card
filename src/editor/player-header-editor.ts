// lovelace card imports.
import { css, html, TemplateResult } from 'lit';

// our imports.
import { BaseEditor } from './base-editor';
import { Section } from '../types/section';
import { PLAYER_CONTROLS_BACKGROUND_COLOR_DEFAULT } from '../sections/player';


const CONFIG_SETTINGS_SCHEMA = [
  {
    name: 'playerHeaderTitle',
    label: 'Section title text displayed in the header area',
    required: false,
    type: 'string',
  },
  {
    name: 'playerHeaderArtistTrack',
    label: 'Artist and Track info displayed in the header area',
    required: false,
    type: 'string',
  },
  {
    name: 'playerHeaderAlbum',
    label: 'Album info displayed in the header area',
    required: false,
    type: 'string',
  },
  {
    name: 'playerHeaderNoMediaPlayingText',
    label: 'Text to display in the header area when no media is currently playing',
    required: false,
    type: 'string',
  },
  {
    name: 'playerHeaderBackgroundColor',
    label: 'Color value (e.g. "#hhrrggbb") for header area background gradient',
    help: "'transparent' to disable",
    required: false,
    type: 'string',
    default: PLAYER_CONTROLS_BACKGROUND_COLOR_DEFAULT,
  },
  {
    name: 'playerHeaderHideProgressBar',
    label: 'Hide progress bar in the header area',
    required: false,
    selector: { boolean: {} },
  },
  {
    name: 'playerHeaderHide',
    label: 'Hide header area of the Player section form',
    required: false,
    selector: { boolean: {} },
  },
];


class PlayerHeaderSettingsEditor extends BaseEditor {

  /**
   * Invoked on each update to perform rendering tasks. 
   * 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult {

    // ensure store is created.
    super.createStore();

    // render html.
    return html`
      <div class="schema-title">
        Player Header Status area settings
      </div>
      <spc-editor-form
        .schema=${CONFIG_SETTINGS_SCHEMA}
        .section=${Section.PLAYER}
        .store=${this.store}
        .config=${this.config}
        .hass=${this.hass}
      ></spc-editor-form>
    `;
  }


  /**
   * Style definitions used by this TemplateResult.
   */
  static get styles() {
    return css`
      .schema-title {
        margin: 0.4rem 0;
        text-align: left;
        font-size: 1rem;
        color: var(--secondary-text-color);
      }
      `;
  }

}

customElements.define('spc-player-header-editor', PlayerHeaderSettingsEditor);
