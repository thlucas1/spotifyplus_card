// lovelace card imports.
import { css, html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from 'lit-html/directives/style-map.js';

// ** IMPORTANT - Vibrant notes:
// ensure that you have "compilerOptions"."lib": [ ... , "WebWorker" ] specified
// in your tsconfig.json!  If not, the Vibrant module will not initialize correctly
// and you will tear your hair out trying to figure out why it doesn't work!!!
import Vibrant from 'node-vibrant/dist/vibrant';

// our imports.
import '../components/player-header';
import '../components/player-body-track';
import '../components/player-body-show';
import '../components/player-body-audiobook';
import '../components/player-controls';
import '../components/player-volume';
import { CardConfig } from '../types/card-config';
import { Store } from '../model/store';
import { BRAND_LOGO_IMAGE_BASE64, BRAND_LOGO_IMAGE_SIZE } from '../constants';
import { MediaPlayer } from '../model/media-player';
import { HomeAssistantEx } from '../types/home-assistant-ex';
import { Palette } from '@vibrant/color';
import { isCardInEditPreview } from '../utils/utils';
import { playerAlerts } from '../types/playerAlerts';

// debug logging.
import Debug from 'debug/src/browser.js';
import { DEBUG_APP_NAME } from '../constants';
const debuglog = Debug(DEBUG_APP_NAME + ":player");

/** default color value of the player header / controls background gradient. */
export const PLAYER_CONTROLS_BACKGROUND_COLOR_DEFAULT = '#000000BB';


@customElement("spc-player")
export class Player extends LitElement implements playerAlerts {

  // public state properties.
  @property({ attribute: false }) store!: Store;

  // private storage.
  @state() private alertError?: string;
  @state() private alertInfo?: string;
  @state() private config!: CardConfig;
  @state() private playerImage?: string;
  @state() private _colorPaletteVibrant?: string;
  @state() private _colorPaletteMuted?: string;
  @state() private _colorPaletteDarkVibrant?: string;
  @state() private _colorPaletteDarkMuted?: string;
  @state() private _colorPaletteLightVibrant?: string;
  @state() private _colorPaletteLightMuted?: string;

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

    // render html.
    return html`
      <div class="player-section-container" style=${this.styleBackgroundImage()}>
        <spc-player-header style=${this.styleHeader()}
          class="player-section-header"
          .store=${this.store}
        ></spc-player-header>
        <div class="player-section-body">
          <div class="player-alert-bgcolor">
            ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
            ${this.alertInfo ? html`<ha-alert alert-type="info" dismissable @alert-dismissed-clicked=${this.alertInfoClear}>${this.alertInfo}</ha-alert>` : ""}
          </div>
          ${(() => {
            // if favorites disabled then we don't need to display anything in the body.
            if ((this.config.playerControlsHideFavorites || false) == true) {
              return (html``);
            } else if (this.player.attributes.media_content_type == 'music') {
              return (html`<spc-player-body-track class="player-section-body-content" .store=${this.store}></spc-player-body-track>`);
            } else if (this.player.attributes.sp_item_type == 'podcast') {
              return (html`<spc-player-body-show class="player-section-body-content" .store=${this.store}></spc-player-body-show>`);
            } else if (this.player.attributes.sp_item_type == 'audiobook') {
              return (html`<spc-player-body-audiobook class="player-section-body-content" .store=${this.store}></spc-player-body-audiobook>`);
            } else {
              return (html`<div class="player-section-body-content"></div>`);
            }
          })()}
        </div>
        <spc-player-controls style=${this.styleControls()}
          class="player-section-controls"
          .store=${this.store}
        ></spc-player-controls>
      </div>
    `;
  }


  /**
   * style definitions used by this component.
   * */
  static get styles() {
    return css`

      .hoverable:focus,
      .hoverable:hover {
        color: var(--dark-primary-color);
      }

      .hoverable:active {
        color: var(--primary-color);
      }

      .player-section-container {
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: min-content auto min-content;
        grid-template-areas:
          'header'
          'body'
          'controls';
        align-items: center;
        /*background-color: #000000;*/
        background-position: center;
        background-repeat: no-repeat;
        background-size: var(--spc-player-background-size);
        text-align: -webkit-center;
        height: 100%;
        width: 100%;
      }

      .player-section-header {
        /* border: 1px solid red;      /* FOR TESTING CONTROL LAYOUT CHANGES */
        grid-area: header;
        background: linear-gradient(180deg, var(--spc-player-header-bg-color) 30%, transparent 100%);
        background-repeat: no-repeat;
      }

      .player-section-body {
        /* border: 1px solid orange;   /* FOR TESTING CONTROL LAYOUT CHANGES */
        grid-area: body;
        height: 100%;
        overflow: hidden;
        padding: 0.5rem;
        box-sizing: border-box;
        background: transparent;
      }

      .player-section-body-content {
        /* border: 1px solid yellow;   /* FOR TESTING CONTROL LAYOUT CHANGES */
        height: inherit;
        background: transparent;
        overflow: hidden;
        display: none;              /* don't display initially */

        /* for fade-in, fade-out support */
        transition: opacity 0.25s, display 0.25s;
        transition-behavior: allow-discrete;    /* Note: be sure to write this after the shorthand */
      }

      .player-section-controls {
        /* border: 1px solid blue;     /* FOR TESTING CONTROL LAYOUT CHANGES */
        grid-area: controls;
        overflow-y: auto;
        background: linear-gradient(0deg, var(--spc-player-controls-bg-color) 30%, transparent 100%);
        background-repeat: no-repeat;
      }

      /* have to set a background color for alerts due to parent background transparency. */
      .player-alert-bgcolor {
        background-color: rgba(var(--rgb-card-background-color), 0.92);
      }

    `;
  }


  /**
   * Returns a background image style.
   */
  private styleBackgroundImage() {

    // stretch the background cover art to fit the entire player.
    //const backgroundSize = 'cover';
    //const backgroundSize = 'contain';
    let backgroundSize = '100% 100%';
    if (this.config.width == 'fill') {
      // if in fill mode, then do not stretch the image.
      backgroundSize = 'contain';
    }

    // get various image source settings.
    const configImagePlayerBg = this.config.customImageUrls?.['playerBackground'];
    const configImagePlayerOffBg = this.config.customImageUrls?.['playerOffBackground'];
    const configImageDefault = this.config.customImageUrls?.['default'];

    // set header and controls section gradient background.
    let headerBackgroundColor = this.config.playerHeaderBackgroundColor || PLAYER_CONTROLS_BACKGROUND_COLOR_DEFAULT;
    let controlsBackgroundColor = this.config.playerControlsBackgroundColor || PLAYER_CONTROLS_BACKGROUND_COLOR_DEFAULT;

    // if player is off or unknown, then reset the playerImage value so that one
    // of the default images is selected below.
    if (this.player.isPoweredOffOrUnknown()) {
      this.playerImage = undefined;
      this.store.card.footerBackgroundColor = undefined;
    }

    // set background image to display (first condition that is true):
    // - if customImageUrls `playerOffBackground` is configured AND player is off, then use it.
    // - if customImageUrls `playerBackground` is configured, then use it (static image).
    // - if media player entity_picture present, then use it (changes with each song).
    // - use static logo image (if none of the above).
    let imageUrl: string = '';
    if (configImagePlayerOffBg && this.player.isPoweredOffOrUnknown()) {
      imageUrl = configImagePlayerOffBg;
    } else if (configImagePlayerBg) {
      imageUrl = configImagePlayerBg;
    } else if (this.playerImage) {
      imageUrl = this.playerImage;
    } else {
      imageUrl = configImageDefault || BRAND_LOGO_IMAGE_BASE64;
      headerBackgroundColor = 'transparent';
      controlsBackgroundColor = 'transparent';
      backgroundSize = BRAND_LOGO_IMAGE_SIZE;
    }

    return styleMap({
      'background-image': `url(${imageUrl})`,
      '--spc-player-background-size': `${backgroundSize}`,
      '--spc-player-header-bg-color': `${headerBackgroundColor}`,
      '--spc-player-header-color': `#ffffff`,
      '--spc-player-controls-bg-color': `${controlsBackgroundColor}`,
      '--spc-player-controls-color': `#ffffff`,
      '--spc-player-palette-vibrant': `${this._colorPaletteVibrant}`,
      '--spc-player-palette-muted': `${this._colorPaletteMuted}`,
      '--spc-player-palette-darkvibrant': `${this._colorPaletteDarkVibrant}`,
      '--spc-player-palette-darkmuted': `${this._colorPaletteDarkMuted}`,
      '--spc-player-palette-lightvibrant': `${this._colorPaletteLightVibrant}`,
      '--spc-player-palette-lightmuted': `${this._colorPaletteLightMuted}`,
    });
  }


  /**
   * Returns an element style for the header portion of the control.
   */
  private styleHeader(): string | undefined {

    // show / hide the header.
    const hideHeader = this.config.playerHeaderHide || false;
    if (hideHeader)
      return `display: none`;

    return
  }


  /**
   * Returns an element style for the header portion of the control.
   */
  private styleControls(): string | undefined {

    // show / hide the media controls.
    const hideControls = this.config.playerControlsHide || false;
    if (hideControls)
      return `display: none`;

    return
  }


  /**
   * Clears the error alert text.
   */
  public alertErrorClear(): void {
    this.alertError = undefined;
  }


  /**
   * Clears the informational alert text.
   */
  public alertInfoClear(): void {
    this.alertInfo = undefined;
  }


  /**
   * Sets the alert info message.
   * 
   * @param message alert message text.
   */
  public alertInfoSet(message: string): void {
    this.alertInfo = message;
  }


  /**
   * Sets the alert error message.
   * 
   * @param message alert message text.
   */
  public alertErrorSet(message: string): void {
    this.alertError = message;
  }


  /**
   * Invoked before `update()` to compute values needed during the update.
   * 
   * We will check for changes in the media player background image.  If a
   * change is being made, then we will analyze the new image for the vibrant
   * color palette.  We will then set some css variables with those values for
   * use by the different player sections (header, progress, volume, etc). 
   */
  protected willUpdate(changedProperties: PropertyValues): void {

    // invoke base class method.
    super.willUpdate(changedProperties);

    // get list of changed property keys.
    const changedPropKeys = Array.from(changedProperties.keys())

    //if (debuglog.enabled) {
    //  debuglog("willUpdate - changed property keys:\n",
    //    JSON.stringify(changedPropKeys),
    //  );
    //}

    // we only care about "store" property changes at this time, as it contains a
    // reference to the "hass" property.  we are looking for background image changes.
    if (!changedPropKeys.includes('store')) {
      return;
    }

    let oldImage: string | undefined = undefined;
    let newImage: string | undefined = undefined;
    let oldMediaContentId: string | undefined = undefined;
    let newMediaContentId: string | undefined = undefined;

    // get the old property reference.
    const oldStore = changedProperties.get('store') as Store;
    if (oldStore) {

      // if a media player was assigned to the store, then get the player image.
      // convert the image url from a relative value to a fully-qualified url.
      const oldPlayer = oldStore.player;
      if (oldPlayer) {
        oldImage = (oldPlayer.attributes.entity_picture || oldPlayer.attributes.entity_picture_local);
        if (oldImage) {
          oldImage = (this.store.hass as HomeAssistantEx).hassUrl(oldImage);
          oldMediaContentId = oldPlayer.attributes.media_content_id;
        }
      }
    }

    // check if the player reference is set (in case it was set to undefined).
    if (this.store.player) {

      // get the current media player image.
      // if image not set, then there's nothing left to do.
      newImage = (this.store.player.attributes.entity_picture || this.store.player.attributes.entity_picture_local);
      if (newImage) {
        newImage = (this.store.hass as HomeAssistantEx).hassUrl(newImage);
        newMediaContentId = this.store.player.attributes.media_content_id;
        this.playerImage = newImage;
      } else {
        return;
      }
    }
    
    // did the content change?  if so, then extract the color differences from the associated image.
    // if we are editing the card, then we don't care about vibrant colors.
    // note that we cannot compare images here, as it's a cached value and the `cache` portion of
    // image url could change even though it's the same content that's playing!
    if ((oldMediaContentId != newMediaContentId) && (!isCardInEditPreview(this.store.card))) {

      if (debuglog.enabled) {
        debuglog("willUpdate - player content changed:\n- OLD CONTENT ID = %s\n- NEW CONTENT ID = %s\n- OLD IMAGE = %s\n- NEW IMAGE = %s",
          JSON.stringify(oldMediaContentId),
          JSON.stringify(newMediaContentId),
          JSON.stringify(oldImage),
          JSON.stringify(newImage),
        );
      }

      // extract the color differences from the new image and set the player colors.
      this._extractColors();

    }
  }


  /**
   * Extracts color compositions from the background image, which will be used for 
   * rendering controls that are displayed on top of the background image.
   * 
   * Good resource on the Vibrant package parameters, examples, and other info:
   * https://github.com/Vibrant-Colors/node-vibrant
   * https://kiko.io/post/Get-and-use-a-dominant-color-that-matches-the-header-image/
   * https://jariz.github.io/vibrant.js/
   * https://github.com/Vibrant-Colors/node-vibrant/issues/44
   */
  private async _extractColors(): Promise<void> {

    //console.log("_extractColors (player) - colors before extract:\n- Vibrant      = %s\n- Muted        = %s\n- DarkVibrant  = %s\n- DarkMuted    = %s\n- LightVibrant = %s\n- LightMuted   = %s",
    //  this._colorPaletteVibrant,
    //  this._colorPaletteMuted,
    //  this._colorPaletteDarkVibrant,
    //  this._colorPaletteDarkMuted,
    //  this._colorPaletteLightVibrant,
    //  this._colorPaletteLightMuted,
    //);

    if (this.playerImage) {

      // set options for vibrant call.
      const vibrantOptions = {
        "colorCount": 64, // amount of colors in initial palette from which the swatches will be generated.
        "quality": 3,     // quality. 0 is highest, but takes way more processing.
      //  "quantizer": 'mmcq',
      //  "generators": ['default'],
      //  "filters": ['default'],
      }

      // create vibrant instance with our desired options.
      const vibrant: Vibrant = new Vibrant(this.playerImage || '', vibrantOptions);

      // get the color palettes for the player background image.
      await vibrant.getPalette().then(
        (palette: Palette) => {

          //console.log("_extractColors (player) - colors found by getPalette:\n- Vibrant      = %s\n- Muted        = %s\n- DarkVibrant  = %s\n- DarkMuted    = %s\n- LightVibrant = %s\n- LightMuted   = %s",
          //  (palette['Vibrant']?.hex) || 'undefined',
          //  (palette['Muted']?.hex) || 'undefined',
          //  (palette['DarkVibrant']?.hex) || 'undefined',
          //  (palette['DarkMuted']?.hex) || 'undefined',
          //  (palette['LightVibrant']?.hex) || 'undefined',
          //  (palette['LightMuted']?.hex) || 'undefined',
          //);

          // set player color palette values.
          this._colorPaletteVibrant = (palette['Vibrant']?.hex) || undefined;
          this._colorPaletteMuted = (palette['Muted']?.hex) || undefined;
          this._colorPaletteDarkVibrant = (palette['DarkVibrant']?.hex) || undefined;
          this._colorPaletteDarkMuted = (palette['DarkMuted']?.hex) || undefined;
          this._colorPaletteLightVibrant = (palette['LightVibrant']?.hex) || undefined;
          this._colorPaletteLightMuted = (palette['LightMuted']?.hex) || undefined;

          // set card footer background color.
          this.store.card.footerBackgroundColor = this._colorPaletteVibrant;

        },
        (_reason: string) => {

          if (debuglog.enabled) {
            debuglog("_extractColors - Could not retrieve color palette info for player background image\nreason = %s",
              JSON.stringify(_reason),
            );
          }

          // reset player color palette values.
          this._colorPaletteVibrant = undefined;
          this._colorPaletteMuted = undefined;
          this._colorPaletteDarkVibrant = undefined;
          this._colorPaletteDarkMuted = undefined;
          this._colorPaletteLightVibrant = undefined;
          this._colorPaletteLightMuted = undefined;

          // set card footer background color.
          this.store.card.footerBackgroundColor = this._colorPaletteVibrant;

        }
      );
    }
  }
}