// lovelace card imports.
import { css, html, nothing, PropertyValues, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

// our imports.
import './editor-form';
import './general-editor';
import './player-editor';
import './album-fav-browser-editor';
import './artist-fav-browser-editor';
import './audiobook-fav-browser-editor';
import './device-browser-editor';
import './episode-fav-browser-editor';
import './playlist-fav-browser-editor';
import './recent-browser-editor';
import './search-media-browser-editor';
import './show-fav-browser-editor';
import './track-fav-browser-editor';
import './userpreset-browser-editor';
import { BaseEditor } from './base-editor';
import { ConfigArea } from '../types/config-area';
import { Section } from '../types/section';
import { Store } from '../model/store';
import { SHOW_SECTION } from '../constants';
import { EditorConfigAreaSelectedEvent } from '../events/editor-config-area-selected';
import {
  getConfigAreaForSection,
  getSectionForConfigArea,
} from '../utils/utils';


class CardEditor extends BaseEditor {

  @state() private configArea = ConfigArea.GENERAL;

  /**
   * Invoked on each update to perform rendering tasks. 
   * 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // just in case hass property has not been set yet.
    if (!this.hass) {
      return html``;
    }

    // just in case config property has not been set yet.
    if (!this.config) {
      return html``;
    }

    // ensure store is created.
    super.createStore();

    //console.log("render (editor) - rendering editor\n- this.store.section=%s\n- this.section=%s\n- Store.selectedConfigArea=%s",
    //  JSON.stringify(this.store.section),
    //  JSON.stringify(this.section),
    //  JSON.stringify(Store.selectedConfigArea),
    //);

    return html`
      <ha-control-button-group>
        ${[ConfigArea.GENERAL, ConfigArea.PLAYER, ConfigArea.DEVICE_BROWSER, ConfigArea.USERPRESET_BROWSER, ConfigArea.RECENT_BROWSER].map(
      (configArea) => html`
            <ha-control-button
              selected=${this.configArea === configArea || nothing}
              @click=${() => this.onConfigSectionClick(configArea)}
            >
              ${configArea}
            </ha-control-button>
          `,
        )}
      </ha-control-button-group>
      <ha-control-button-group>
        ${[ConfigArea.PLAYLIST_FAVORITES, ConfigArea.ALBUM_FAVORITES, ConfigArea.ARTIST_FAVORITES, ConfigArea.TRACK_FAVORITES, ConfigArea.AUDIOBOOK_FAVORITES].map(
      (configArea) => html`
            <ha-control-button
              selected=${this.configArea === configArea || nothing}
              @click=${() => this.onConfigSectionClick(configArea)}
            >
              ${configArea}
            </ha-control-button>
          `,
        )}
      </ha-control-button-group>
      <ha-control-button-group>
        ${[ConfigArea.EPISODE_FAVORITES, ConfigArea.SHOW_FAVORITES, ConfigArea.SEARCH_MEDIA_BROWSER].map(
          (configArea) => html`
            <ha-control-button
              selected=${this.configArea === configArea || nothing}
              @click=${() => this.onConfigSectionClick(configArea)}
            >
              ${configArea}
            </ha-control-button>
          `,
        )}
      </ha-control-button-group>

      <div class="spc-card-editor">
        ${this.subEditor()}
      </div>
    `;
  }


  /**
   * Style definitions used by this TemplateResult.
   * 
   * Use the following styles to control the HA-FORM look and feel; the values
   * listed in the style below give the dynamically generated content a more
   * compact look and feel, which is nice when a LOT of editor settings are defined.
   * They are applied to the shadowDOM via the _styleRenderRootElements function in editor.form.ts.
   * 
   * --ha-form-style-integer-margin-bottom: 0.5rem;
   * --ha-form-style-multiselect-margin-bottom: 0.5rem;
   * --ha-form-style-selector-margin-bottom: 0.5rem;
   * --ha-form-style-selector-boolean-min-height: 28px;
   * --ha-form-style-string-margin-bottom: 0.5rem;
   */
  static get styles() {
    return css`

      .spc-card-editor {
        /* control the look and feel of the HA-FORM element. */
        --ha-form-style-integer-margin-bottom: 0.5rem;
        --ha-form-style-multiselect-margin-bottom: 0.5rem;
        --ha-form-style-selector-margin-bottom: 0.5rem;
        --ha-form-style-selector-boolean-min-height: 28px;
        --ha-form-style-string-margin-bottom: 0.5rem;
      }

      ha-control-button-group {
        margin-bottom: 8px;
      }

      ha-control-button[selected] {
        --control-button-background-color: var(--primary-color);
      }
    `;
  }


  private subEditor() {

    // show the desired section editor.
    return choose(this.configArea, [
      [
        ConfigArea.ALBUM_FAVORITES,
        () => html`<spc-album-fav-browser-editor .config=${this.config} .hass=${this.hass}></spc-album-fav-browser-editor>`,
      ],
      [
        ConfigArea.ARTIST_FAVORITES,
        () => html`<spc-artist-fav-browser-editor .config=${this.config} .hass=${this.hass}></spc-artist-fav-browser-editor>`,
      ],
      [
        ConfigArea.AUDIOBOOK_FAVORITES,
        () => html`<spc-audiobook-fav-browser-editor .config=${this.config} .hass=${this.hass}></spc-audiobook-fav-browser-editor>`,
      ],
      [
        ConfigArea.DEVICE_BROWSER,
        () => html`<spc-device-browser-editor .config=${this.config} .hass=${this.hass}></spc-device-browser-editor>`,
      ],
      [
        ConfigArea.EPISODE_FAVORITES,
        () => html`<spc-episode-fav-browser-editor .config=${this.config} .hass=${this.hass}></spc-episode-fav-browser-editor>`,
      ],
      [
        ConfigArea.GENERAL,
        () => html`<spc-general-editor .config=${this.config} .hass=${this.hass}></spc-general-editor>`,
      ],
      [
        ConfigArea.PLAYER,
        () => html`<spc-player-editor .config=${this.config} .hass=${this.hass}></spc-player-editor>`,
      ],
      [
        ConfigArea.PLAYLIST_FAVORITES,
        () => html`<spc-playlist-fav-browser-editor .config=${this.config} .hass=${this.hass}></spc-playlist-fav-browser-editor>`,
      ],
      [
        ConfigArea.RECENT_BROWSER,
        () => html`<spc-recent-browser-editor .config=${this.config} .hass=${this.hass}></spc-recent-browser-editor>`,
      ],
      [
        ConfigArea.SEARCH_MEDIA_BROWSER,
        () => html`<spc-search-media-browser-editor .config=${this.config} .hass=${this.hass}></spc-search-media-browser-editor>`,
      ],
      [
        ConfigArea.SHOW_FAVORITES,
        () => html`<spc-show-fav-browser-editor .config=${this.config} .hass=${this.hass}></spc-show-fav-browser-editor>`,
      ],
      [
        ConfigArea.TRACK_FAVORITES,
        () => html`<spc-track-fav-browser-editor .config=${this.config} .hass=${this.hass}></spc-track-fav-browser-editor>`,
      ],
      [
        ConfigArea.USERPRESET_BROWSER,
        () => html`<spc-userpreset-browser-editor .config=${this.config} .hass=${this.hass}></spc-userpreset-browser-editor>`,
      ],
    ]);
  }


  /**
   * Handles the `click` event fired when an editor section button is clicked.
   * 
   * This will set the configArea attribute, which will display the selected editor section settings.
   * 
   * @param args Event arguments that contain the configArea that was clicked on.
   */
  private onConfigSectionClick(configArea: ConfigArea) {

    // show the section that we are editing.
    const sectionNew = getSectionForConfigArea(configArea);

    //console.log("onConfigSectionClick (editor)\n- OLD configArea=%s\n- NEW configArea=%s\n- OLD section=%s\n- NEW section=%s\n- Store.selectedConfigArea=%s",
    //  JSON.stringify(this.configArea),
    //  JSON.stringify(configArea),
    //  JSON.stringify(this.section),
    //  JSON.stringify(sectionNew),
    //  JSON.stringify(Store.selectedConfigArea),
    //);

    // store selected ConfigArea.
    Store.selectedConfigArea = configArea;

    // show the config area and set the section references.
    this.configArea = configArea;
    this.section = sectionNew;
    this.store.section = sectionNew;

    // inform the card that it needs to show the section for the selected ConfigArea
    // by dispatching the EDITOR_CONFIG_AREA_SELECTED event.
    document.dispatchEvent(EditorConfigAreaSelectedEvent(this.section));
  }


  /**
   * Invoked when the component is added to the document's DOM.
   *
   * In `connectedCallback()` you should setup tasks that should only occur when
   * the element is connected to the document. The most common of these is
   * adding event listeners to nodes external to the element, like a keydown
   * event handler added to the window.
   *
   * Typically, anything done in `connectedCallback()` should be undone when the
   * element is disconnected, in `disconnectedCallback()`.
   */
  connectedCallback() {

    // invoke base class method.
    super.connectedCallback();

    // add window level event listeners.
    window.addEventListener(SHOW_SECTION, this.onFooterShowSection);
  }


  /**
   * Invoked when the component is removed from the document's DOM.
   *
   * This callback is the main signal to the element that it may no longer be
   * used. `disconnectedCallback()` should ensure that nothing is holding a
   * reference to the element (such as event listeners added to nodes external
   * to the element), so that it is free to be garbage collected.
   *
   * An element may be re-connected after being disconnected.
   */
  disconnectedCallback() {

    // remove window level event listeners.
    window.removeEventListener(SHOW_SECTION, this.onFooterShowSection);

    // invoke base class method.
    super.disconnectedCallback();
  }


  /**
   * Called when the element has rendered for the first time. Called once in the
   * lifetime of an element. Useful for one-time setup work that requires access to
   * the DOM.
   */
  protected firstUpdated(changedProperties: PropertyValues): void {

    // invoke base class method.
    super.firstUpdated(changedProperties);

    //console.log("firstUpdated (editor) - 1st render complete - changedProperties keys:\n- %s",
    //  JSON.stringify(Array.from(changedProperties.keys())),
    //);

    // if there are things that you only want to happen one time when the configuration
    // is initially loaded, then do them here.

    // at this point, the first render has occurred.
    // select the configarea for the first section that has been configured so that its settings
    // are automatically displayed when the card editor dialog opens.
    // if the media player entity has not been configured then display the GENERAL configArea.
    // make sure we check if `this.config` has been set before attempting to access anything
    // in the configuration settings; otherwise, an uncaught exception is raised!
    let configArea = getConfigAreaForSection(this.section);
    if (this.config) {
      if (!this.config.entity) {
        configArea = ConfigArea.GENERAL;
      }
    }
    this.configArea = configArea;
    Store.selectedConfigArea = this.configArea;
    super.requestUpdate();

  }


  /**
   * Handles the footer `SHOW_SECTION` event.
   * 
   * This will select the appropriate editor configuration section when a footer
   * icon is clicked.
   * 
   * @param args Event arguments that contain the section that was selected.
  */
  protected onFooterShowSection = (args: Event) => {

    // get the ConfigArea value for the active footer section.
    const sectionToSelect = (args as CustomEvent).detail as Section;
    const configArea = getConfigAreaForSection(sectionToSelect);

    // select the configuration area.
    this.configArea = configArea;

    // store selected ConfigArea.
    Store.selectedConfigArea = this.configArea;
  }
}


customElements.define('spc-editor', CardEditor);
