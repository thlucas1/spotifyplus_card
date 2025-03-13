// lovelace card imports.
import { css, html, TemplateResult } from 'lit';

// our imports.
import { PLAYER_BACKGROUND_IMAGE_SIZE_DEFAULT } from '../constants';
import { BaseEditor } from './base-editor';
import { Section } from '../types/section';


const CONFIG_SETTINGS_SCHEMA = [
  {
    name: 'playerBackgroundImageSize',
    label: 'Size of the player background image',
    help: 'default is "' + PLAYER_BACKGROUND_IMAGE_SIZE_DEFAULT + '"',
    required: false,
    type: 'string',
  },
  {
    name: 'playerMinimizeOnIdle',
    label: "Minimize player height when state is off / idle",
    help: 'if height not "fill"',
    required: false,
    selector: { boolean: {} },
  },
];


class PlayerGeneralSettingsEditor extends BaseEditor {

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
        Player General area settings
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

customElements.define('spc-player-general-editor', PlayerGeneralSettingsEditor);
