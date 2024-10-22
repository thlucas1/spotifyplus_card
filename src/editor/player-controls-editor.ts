// lovelace card imports.
import { css, html, TemplateResult } from 'lit';

// our imports.
import { BaseEditor } from './base-editor';
import { Section } from '../types/section';


const CONFIG_SETTINGS_SCHEMA = [
  {
    name: 'playerControlsHideShuffle',
    label: 'Hide shuffle control button in the controls area',
    required: false,
    selector: { boolean: {} },
  },
  {
    name: 'playerControlsHideTrackPrev',
    label: 'Hide previous track control button in the controls area',
    required: false,
    selector: { boolean: {} },
  },
  {
    name: 'playerControlsHidePlayPause',
    label: 'Hide play / pause control button in the controls area',
    required: false,
    selector: { boolean: {} },
  },
  {
    name: 'playerControlsHideTrackNext',
    label: 'Hide next track control button in the controls area',
    required: false,
    selector: { boolean: {} },
  },
  {
    name: 'playerControlsHideRepeat',
    label: 'Hide repeat control button in the controls area',
    required: false,
    selector: { boolean: {} },
  },
  {
    name: 'playerControlsHideFavorites',
    label: 'Hide favorite actions control button in the controls area',
    required: false,
    selector: { boolean: {} },
  },
  {
    name: 'playerControlsHide',
    label: 'Hide controls area of the Player section form',
    required: false,
    selector: { boolean: {} },
  },
];


class PlayerControlsSettingsEditor extends BaseEditor {

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
        Player Media Control area settings
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

customElements.define('spc-player-controls-editor', PlayerControlsSettingsEditor);
