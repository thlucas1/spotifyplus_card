// lovelace card imports.
import { css, html, TemplateResult } from 'lit';

// our imports.
import { BaseEditor } from './base-editor';
import { Section } from '../types/section';


const CONFIG_SETTINGS_SCHEMA = [
  {
    name: 'userPresetBrowserTitle',
    label: 'Section title text',
    help: 'displayed at the top of the section',
    required: false,
    type: 'string',
  },
  {
    name: 'userPresetBrowserSubTitle',
    label: 'Section sub-title text',
    help: 'displayed below the section title',
    required: false,
    type: 'string',
  },
  {
    name: 'userPresetBrowserItemsPerRow',
    label: '# of items to display per row',
    help: 'use 1 for list format',
    required: true,
    type: 'integer',
    default: 4,
    valueMin: 1,
    valueMax: 12,
  },
  {
    name: 'userPresetBrowserItemsHideTitle',
    label: 'Hide item row title text',
    required: false,
    selector: { boolean: {} },
  },
  {
    name: 'userPresetBrowserItemsHideSubTitle',
    label: 'Hide item row sub-title text',
    help: 'if Title visible',
    required: false,
    selector: { boolean: {} },
  },
];


class UserPresetSettingsEditor extends BaseEditor {

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
        Settings that control the User Preset Browser section look and feel
      </div>
      <spc-editor-form class="spc-editor-form"
        .schema=${CONFIG_SETTINGS_SCHEMA}
        .section=${Section.USERPRESETS}
        .store=${this.store}
        .config=${this.config}
        .hass=${this.hass}
      ></spc-editor-form>
      <div class="schema-title">
        User Preset items must be defined manually in the configuration code editor.
        Please refer to the <a href="https://github.com/thlucas1/spotifyplus_card/wiki/Configuration-Options#userpresets-user-preset-content-items" target="_blank">
        wiki documentation</a> for more details and examples.
      </div>
    `;
  }


  /**
   * Style definitions used by this TemplateResult.
   * 
   * Use the "spc-editor-form" class to apply styling to the elements that are dynamically defined by 
   * the HA-FORM element.  This gives you the ability to generate a more compact look and feel to the
   * element, which can save quite a bit of screen real-estate in the process!
   * See the static "styles()" function in the "editor.ts" module for more details.
   */
  static get styles() {
    return css`

      .schema-title {
        margin: 0.4rem 0;
        text-align: left;
        font-size: 1rem;
        color: var(--secondary-text-color);
      }

      /* control the look and feel of the HA-FORM element. */
      .spc-editor-form {
      }

      `;
  }

}

customElements.define('spc-userpreset-browser-editor', UserPresetSettingsEditor);
