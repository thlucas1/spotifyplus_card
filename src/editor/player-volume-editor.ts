// lovelace card imports.
import { css, html, TemplateResult } from 'lit';

// our imports.
import { PLAYER_CONTROLS_BACKGROUND_COLOR_DEFAULT } from '../constants';
import { BaseEditor } from './base-editor';
import { Section } from '../types/section';


const CONFIG_SETTINGS_SCHEMA = [
  {
    name: 'playerControlsBackgroundColor',
    label: 'Color value (e.g. "#hhrrggbb") for controls area background gradient',
    help: "'transparent' to disable",
    required: false,
    type: 'string',
    default: PLAYER_CONTROLS_BACKGROUND_COLOR_DEFAULT,
  },
  {
    name: 'playerVolumeMaxValue',
    label: 'Maximum volume value allowed via card UI',
    help: 'range 10 - 100',
    required: true,
    type: 'integer',
    default: 100,
    valueMin: 10,
    valueMax: 100,
  },
  {
    name: 'playerVolumeControlsHideMute',
    label: 'Hide mute button in the volume controls area',
    required: false,
    selector: { boolean: {} },
  },
  {
    name: 'playerVolumeControlsHidePower',
    label: 'Hide power button in the volume controls area',
    required: false,
    selector: { boolean: {} },
  },
  {
    name: 'playerVolumeControlsHideSlider',
    label: 'Hide volume slider and levels in the volume controls area',
    required: false,
    selector: { boolean: {} },
  },
  {
    name: 'playerVolumeControlsHideLevels',
    label: "Hide volume level numbers / %'s in the volume controls area",
    required: false,
    selector: { boolean: {} },
  },
];


class PlayerVolumeSettingsEditor extends BaseEditor {

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
        Player Volume Control area settings
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

customElements.define('spc-player-volume-editor', PlayerVolumeSettingsEditor);
