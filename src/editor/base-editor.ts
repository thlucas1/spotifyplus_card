// lovelace card imports.
import { css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { HomeAssistant } from '../types/home-assistant-frontend/home-assistant';
import { fireEvent } from '../types/home-assistant-frontend/fire-event';

// our imports.
import { CardConfig } from '../types/card-config';
import { Store } from '../model/store';
import { ConfigArea } from '../types/config-area';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { SpotifyPlusService } from '../services/spotifyplus-service';
import { dispatch, getObjectDifferences, getSectionForConfigArea } from '../utils/utils';
import { CONFIG_UPDATED } from '../constants';
import { EditorConfigAreaSelectedEvent } from '../events/editor-config-area-selected';


export abstract class BaseEditor extends LitElement {

  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config!: CardConfig;
  @property({ attribute: false }) store!: Store;
  @property({ attribute: true }) section!: Section;
  @property({ attribute: false }) footerBackgroundColor?: string;

  /** MediaPlayer instance created from the configuration entity id. */
  public player!: MediaPlayer;

  /** SpotifyPlus services instance. */
  public spotifyPlusService!: SpotifyPlusService;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super();

  }


  /**
   * Style definitions used by this TemplateResult.
   */
  static get styles() {
    return css`
      ha-svg-icon {
        margin: 5px;
      }
      ha-control-button {
        white-space: nowrap;
      }
      ha-control-button-group {
        margin: 5px;
      }
      div {
        margin-top: 20px;
      }
    `;
  }


  /**
   * Home Assistant will call setConfig(config) when the configuration changes.  This
   * is most likely to occur when changing the configuration via the UI editor, but
   * can also occur if YAML changes are made (for cards without UI config editor).
   * 
   * If you throw an exception in this method (e.g. invalid configuration, etc), then
   * Home Assistant will render an error card to notify the user.  Note that by doing
   * so will also disable the Card Editor UI, and the card must be configured manually!
   * 
   * The config argument object contains the configuration specified by the user for
   * the card.  It will minimally contain:
   *   `config.type = "custom:my-custom-card"`
   * 
   * The `setConfig` method MUST be defined, and is in fact the only function that must be.
   * It doesn't need to actually DO anything, though.
   * 
   * Note that setConfig will ALWAYS be called at the start of the lifetime of the card
   * BEFORE the `hass` object is first provided.  It MAY be called several times during 
   * the lifetime of the card, e.g. if the configuration of the card is changed.
   * 
   * We use it here to update the internal config property, as well as perform some
   * basic validation and initialization of the config.
   * 
   * @param config Contains the configuration specified by the user for the card.
   */
  public setConfig(config: CardConfig): void {

    //console.log("setConfig (base-editor) enter\n- this.section=%s\n- Store.selectedConfigArea=%s",
    //  JSON.stringify(this.section),
    //  JSON.stringify(Store.selectedConfigArea),
    //);

    // copy the passed configuration object to create a new instance.
    const newConfig: CardConfig = JSON.parse(JSON.stringify(config));

    // if no sections are configured then configure the default.
    if (!newConfig.sections || newConfig.sections.length === 0) {
      newConfig.sections = [Section.PLAYER];
      Store.selectedConfigArea = ConfigArea.GENERAL;
    }

    // store configuration so other card sections can access them.
    this.config = newConfig;

    //console.log("setConfig (base-editor) - configuration:\n%s",
    //  JSON.stringify(this.config, null, 2), // prettyprint
    //);

    //console.log("setConfig (base-editor) exit\n- this.section=%s\n- Store.selectedConfigArea=%s",
    //  JSON.stringify(this.section),
    //  JSON.stringify(Store.selectedConfigArea),
    //);

  }


  /**
   * Called by the various editor forms when a value has been changed in the configuration editor(s).
   * 
   * @param changedConfig A CardConfig object that contains changes made in the editor.
   */
  protected configChanged(changedConfig: CardConfig | undefined = undefined) {

    //console.log("configChanged (base-editor) - configuration settings changed\n- this.section=%s\n- Store.selectedConfigArea=%s",
    //  JSON.stringify(this.section),
    //  JSON.stringify(Store.selectedConfigArea),
    //);

    //console.log("configChanged (base-editor) - configuration settings changed\n- this.section=%s\n- Store.selectedConfigArea=%s\n- Values changed:\n%s",
    //  JSON.stringify(this.section),
    //  JSON.stringify(Store.selectedConfigArea),
    //  JSON.stringify(getObjectDifferences(this.config, changedConfig), null, 2),
    //);

    // were configuration changes supplied?
    let changedValues = {}
    if (changedConfig) {

      // get configuration changes.
      changedValues = getObjectDifferences(this.config, changedConfig);

      // update the existing configuration with supplied changes.
      this.config = {
        ...this.config,
        ...changedConfig,
      };
    }

    // get section to display based upon selected configarea, and ensure that the
    // section area is displayed.
    const configAreaSection = getSectionForConfigArea(Store.selectedConfigArea);
    if (this.section != configAreaSection) {

      //console.log("configChanged (base-editor) - forcing selected section to match selected ConfigArea\n- this.section=%s\n- configAreaSection=%s\n- config.sections=%s",
      //  JSON.stringify(this.section),
      //  JSON.stringify(configAreaSection),
      //  JSON.stringify(this.config.sections),
      //);

      // show the config area and set the section references.
      this.section = configAreaSection;
      this.store.section = this.section;

      // inform the card that it needs to show the section for the selected ConfigArea
      // by dispatching the EDITOR_CONFIG_AREA_SELECTED event.
      document.dispatchEvent(EditorConfigAreaSelectedEvent(this.section));
    }

    //console.log("configChanged (base-editor) - configuration settings changed\n- changedConfig:\n%s",
    //  JSON.stringify(changedConfig,null,2)
    //);

    // inform Home assistant dashboard that our configuration has changed.
    fireEvent(this, 'config-changed', { config: this.config });

    // request an update, which will force the card editor to re-render.
    super.requestUpdate();

    // inform configured component of the changes; we will let them decide whether to
    // re-render the component, refresh media lists, etc.
    dispatch(CONFIG_UPDATED, changedValues);

    //const configAreaSection2 = getSectionForConfigArea(Store.selectedConfigArea);
    //console.log("configChanged (base-editor) - after requestUpdate\n- this.section=%s\n- Store.selectedConfigArea=%s",
    //  JSON.stringify(this.section),
    //  JSON.stringify(configAreaSection2),
    //  JSON.stringify(Store.selectedConfigArea),
    //);

  }


  protected dispatchClose() {
    //console.log("dispatchClose (base-editor) - method called - close form?");
    return super.dispatchEvent(new CustomEvent('closed'));
  }


  /**
   * Creates the common services and data areas that are used by the various card editors.
   * 
   * Note that this method cannot be called from `setConfig` method, as the `hass` property 
   * has not been set set!
  */
  public createStore(): void {

    // have we already created the store? if so, then don't do it again.
    // we check this here, as most of the `x-editor` inherit from BaseEditor and call this method.
    if (this.store) {
      return;
    }

    // get section to display based upon selected configarea.
    const configAreaSection = getSectionForConfigArea(Store.selectedConfigArea);

    // if no sections are configured then configure the default.
    if (!this.config.sections || this.config.sections.length === 0) {
      this.config.sections = [Section.PLAYER];
      Store.selectedConfigArea = ConfigArea.GENERAL;
    }

    // create the store.
    this.store = new Store(this.hass, this.config, this, configAreaSection, this.config.entity);

    // set other references obtained from the store.
    this.player = this.store.player;
    this.section = this.store.section;

    //console.log("createStore (base-editor) - store created\n- this.section=%s\n- Store.selectedConfigArea=%s",
    //  JSON.stringify(this.section),
    //  JSON.stringify(Store.selectedConfigArea),
    //);

  }


  /**
   * Sets the section value and requests an update to show the section.
   * 
   * @param section Section to show.
  */
  public SetSection(section: Section): void {

    // is the session configured for display?
    if (!this.config.sections || this.config.sections.indexOf(section) > -1) {

      //console.log("SetSection (base-editor) - set section reference and display the section\n- OLD section=%s\n- NEW section=%s",
      //  JSON.stringify(this.section),
      //  JSON.stringify(section)
      //);

      this.section = section;
      this.store.section = this.section;
      super.requestUpdate();

    } else {

      //console.log("SetSection (base-editor) - section is not active: %s",
      //  JSON.stringify(section)
      //);

    }
  }
}
