// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { customElement, property, state } from "lit/decorators.js";
import { styleMap, StyleInfo } from 'lit-html/directives/style-map.js';

// our imports - card components.
import '../components/player-header';
import '../components/player-body-audiobook';
import '../components/player-body-idle';
import '../components/player-body-queue';
import '../components/player-body-show';
import '../components/player-body-track';
import '../components/player-controls';
import '../components/player-volume';

// our imports.
import {
  BRAND_LOGO_IMAGE_BASE64,
  BRAND_LOGO_IMAGE_SIZE,
  PLAYER_CONTROLS_BACKGROUND_COLOR_DEFAULT,
  PLAYER_CONTROLS_ICON_SIZE_DEFAULT
} from '../constants';
import { CardConfig } from '../types/card-config';
import { MediaPlayer } from '../model/media-player';
import { AlertUpdatesBase } from './alert-updates-base';


@customElement("spc-player")
export class Player extends AlertUpdatesBase {

  // public state properties.
  @property({ attribute: false }) mediaContentId!: string;

  // private storage.
  @state() private config!: CardConfig;

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

    // get idle state in case we are minimizing height.
    const isOffIdle = this.player.isPoweredOffOrIdle();

    // render html.
    return html`
      <div class="player-section-container" style=${this.stylePlayerSection()}>
        <spc-player-header style=${this.stylePlayerHeader()}
          class="player-section-header"
          .store=${this.store}
        ></spc-player-header>
        <div class="player-section-body">
          <div class="player-alert-bgcolor">
            ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
            ${this.alertInfo ? html`<ha-alert alert-type="info" dismissable @alert-dismissed-clicked=${this.alertInfoClear}>${this.alertInfo}</ha-alert>` : ""}
          </div>
          ${(() => {
            if (isOffIdle && this.config.playerMinimizeOnIdle && this.config.height != "fill") {
              return (html`<spc-player-body-idle class="player-section-body-content" style="display:block" .store=${this.store}></spc-player-body-idle>`);
            } else if ((this.config.playerControlsHideFavorites || false) == true) {
              return (html``); // if favorites disabled then we don't need to display favorites body.
            } else if (this.player.attributes.sp_item_type == 'track') {
              return (html`<spc-player-body-track class="player-section-body-content" .store=${this.store} .mediaContentId=${this.mediaContentId}></spc-player-body-track>`);
            } else if (this.player.attributes.sp_item_type == 'podcast') {
              return (html`<spc-player-body-show class="player-section-body-content" .store=${this.store} .mediaContentId=${this.mediaContentId}></spc-player-body-show>`);
            } else if (this.player.attributes.sp_item_type == 'audiobook') {
              return (html`<spc-player-body-audiobook class="player-section-body-content" .store=${this.store} .mediaContentId=${this.mediaContentId}></spc-player-body-audiobook>`);
            } else {
              return (html`<div class="player-section-body-content"></div>`);
            }
          })()}
          ${(() => {
            if (isOffIdle && this.config.playerMinimizeOnIdle && this.config.height != "fill") {
              return (html``); // if idle then we don't need to display queue body.
            } else  if ((this.config.playerControlsHidePlayQueue || false) == true) {
              return (html``); // if play queue disabled then we don't need to display queue body.
            } else if (this.player.attributes.sp_item_type == 'track') {
              return (html`<spc-player-body-queue class="player-section-body-queue" .store=${this.store} .mediaContentId=${this.mediaContentId} id="elmPlayerBodyQueue"></spc-player-body-queue>`);
            } else if (this.player.attributes.sp_item_type == 'podcast') {
              return (html`<spc-player-body-queue class="player-section-body-queue" .store=${this.store} .mediaContentId=${this.mediaContentId} id="elmPlayerBodyQueue"></spc-player-body-queue>`);
            } else if (this.player.attributes.sp_item_type == 'audiobook') {
              return (html`<spc-player-body-queue class="player-section-body-queue" .store=${this.store} .mediaContentId=${this.mediaContentId} id="elmPlayerBodyQueue"></spc-player-body-queue>`);
            } else {
              return (html`<div class="player-section-body-queue"></div>`);
            }
          })()}
        </div>
        <spc-player-controls style=${this.stylePlayerControls()}
          class="player-section-controls"
          .store=${this.store}
          .mediaContentId=${this.mediaContentId}
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
        background-position: center;
        background-repeat: no-repeat;
        background-size: var(--spc-player-background-size, var(--spc-player-background-size-default, 100% 100%));  /* PLAYER_BACKGROUND_IMAGE_SIZE_DEFAULT */
        text-align: -webkit-center;
        height: 100%;
        width: 100%;
      }

      .player-section-header {
        /* border: 1px solid red;      /* FOR TESTING CONTROL LAYOUT CHANGES */
        grid-area: header;
        background: linear-gradient(180deg, var(--spc-player-header-bg-color) 30%, transparent 100%);
        background-repeat: no-repeat;
        padding: 0.2rem;
      }

      .player-section-body {
        /* border: 1px solid orange;   /* FOR TESTING CONTROL LAYOUT CHANGES */
        grid-area: body;
        height: 100%;
        overflow: hidden;
        padding: 0rem 0.5rem 0rem 0.5rem;
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

      .player-section-body-queue {
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
   * Returns an element style for the player section.
   */
  private stylePlayerSection() {

    // build style info object.
    const styleInfo: StyleInfo = <StyleInfo>{};

    // get player states.
    const isOff = this.player.isPoweredOffOrUnknown();
    const isIdle = this.player.isIdle();

    // get default player background size.
    let backgroundImageUrl: string | undefined;
    let headerBackgroundColor = 'transparent';
    let controlsBackgroundColor = 'transparent';

    // get various image source settings.
    const configImageDefault = this.config.customImageUrls?.['default'];
    const configImagePlayerBg = this.config.customImageUrls?.['playerBackground'];
    const configImagePlayerBgIdle = this.config.customImageUrls?.['playerIdleBackground'];
    const configImagePlayerBgOff = this.config.customImageUrls?.['playerOffBackground'];

    // get current media player image and media content id values.
    let playerMediaContentId:string | undefined = undefined;
    let playerImage:string | undefined = undefined;
    if (this.store.player) {
      playerMediaContentId = this.store.player.attributes.media_content_id;
      playerImage = (this.store.player.attributes.entity_picture || this.store.player.attributes.entity_picture_local);
      if (playerImage) {
        // get fully-qualified url of the player image since we are using entity_picture attribute.
        playerImage = this.store.hass.hassUrl(playerImage);
      }
    }

    //console.log("%cstylePlayerSection - styling player section:\n- isOff = %s\n- isIdle = %s\n- playerImage = %s\n- playerMinimizeOnIdle = %s\n- configImageDefault = %s\n- configImagePlayerBg = %s",
    //  "color:red",
    //  JSON.stringify(isOff),
    //  JSON.stringify(isIdle),
    //  JSON.stringify(playerImage),
    //  JSON.stringify(this.config.playerMinimizeOnIdle),
    //  JSON.stringify(configImageDefault),
    //  JSON.stringify(configImagePlayerBg),
    //);

    // is specific background size specified in config? if so, then use it.
    // otherwise, do not stretch the background image if in fill mode.
    if (this.config.playerBackgroundImageSize) {
      styleInfo['--spc-player-background-size'] = `${this.config.playerBackgroundImageSize}`;
    } else if (this.config.width == 'fill') {
      styleInfo['--spc-player-background-size-default'] = 'contain';
    }

    // set player background image to display.
    if (isOff) {

      // set image to display for OFF state.
      this.store.card.playerMediaContentId = "configImagePlayerBgOff"
      if ((configImagePlayerBgOff || "").toLowerCase() == "none") {
        // force no image.
        styleInfo['background-image'] = undefined;
      } else if (configImagePlayerBgOff) {
        // image specified in card config.
        styleInfo['background-image'] = `url(${configImagePlayerBgOff})`;
        backgroundImageUrl = configImagePlayerBgOff;
      } else if (this.config.playerMinimizeOnIdle) {
        // player is minimized, so use theme file image if defined (do not display brand logo).
        styleInfo['background-image'] = `var(--spc-player-background-image-off)`;
      } else {
        // player is not minimized, so use theme file image if defined; otherwise, use brand logo.
        styleInfo['background-image'] = `var(--spc-player-background-image-off, url(${BRAND_LOGO_IMAGE_BASE64}))`;
        styleInfo['--spc-player-background-size-default'] = `${BRAND_LOGO_IMAGE_SIZE}`;
      }

      // set image size.
      if (this.config.playerBackgroundImageSize) {
        styleInfo['--spc-player-background-size'] = `${this.config.playerBackgroundImageSize}`;
      }

    } else if (isIdle) {

      // set image to display for IDLE state.
      this.store.card.playerMediaContentId = "configImagePlayerBgIdle"
      if ((configImagePlayerBgIdle || "").toLowerCase() == "none") {
        // force no image.
        styleInfo['background-image'] = undefined;
      } else if (configImagePlayerBgIdle) {
        // image specified in card config.
        styleInfo['background-image'] = `url(${configImagePlayerBgIdle})`;
        backgroundImageUrl = configImagePlayerBgIdle;
      } else if (this.config.playerMinimizeOnIdle) {
        // player is minimized, so use theme file image if defined (do not display brand logo).
        styleInfo['background-image'] = `var(--spc-player-background-image-off)`;
      } else {
        // player is not minimized, so use theme file image if defined; otherwise, use brand logo.
        styleInfo['background-image'] = `var(--spc-player-background-image-off, url(${BRAND_LOGO_IMAGE_BASE64}))`;
        styleInfo['--spc-player-background-size-default'] = `${BRAND_LOGO_IMAGE_SIZE}`;
      }

      // set image size.
      if (this.config.playerBackgroundImageSize) {
        styleInfo['--spc-player-background-size'] = `${this.config.playerBackgroundImageSize}`;
      }

    } else if (configImagePlayerBg) {

      // use configured player background image (static image, does not change).
      this.store.card.playerMediaContentId = "configImagePlayerBg"
      if ((configImagePlayerBg || "").toLowerCase() == "none") {
        // force no image.
        styleInfo['background-image'] = undefined;
      } else if (configImagePlayerBg) {
        // image specified in card config.
        styleInfo['background-image'] = `url(${configImagePlayerBg})`;
        backgroundImageUrl = configImagePlayerBg;
      }
      headerBackgroundColor = this.config.playerHeaderBackgroundColor || PLAYER_CONTROLS_BACKGROUND_COLOR_DEFAULT;
      controlsBackgroundColor = this.config.playerControlsBackgroundColor || PLAYER_CONTROLS_BACKGROUND_COLOR_DEFAULT;

    } else if (playerImage) {

      // use currently playing artwork background image; image changes with the track.
      // note that theming variable will override this value if specified.
      this.store.card.playerMediaContentId = playerMediaContentId;
      headerBackgroundColor = this.config.playerHeaderBackgroundColor || PLAYER_CONTROLS_BACKGROUND_COLOR_DEFAULT;
      controlsBackgroundColor = this.config.playerControlsBackgroundColor || PLAYER_CONTROLS_BACKGROUND_COLOR_DEFAULT;
      backgroundImageUrl = playerImage;
      styleInfo['background-image'] = `var(--spc-player-background-image, url(${playerImage}))`;

    } else if (configImageDefault) {

      // use configured default background image.
      this.store.card.playerMediaContentId = "configImageDefault"
      backgroundImageUrl = configImageDefault;
      styleInfo['background-image'] = `url(${configImageDefault}`;

    } else {

      // set image to display for all other possibilities.
      this.store.card.playerMediaContentId = "BRAND_LOGO_IMAGE_BASE64"
      if (this.config.playerMinimizeOnIdle) {
        // player is minimized, so use theme file image if defined (do not display brand logo).
        styleInfo['background-image'] = `var(--spc-player-background-image-off)`;
      } else {
        // player is not minimized, so use theme file image if defined; otherwise, use brand logo.
        styleInfo['background-image'] = `var(--spc-player-background-image-off, url(${BRAND_LOGO_IMAGE_BASE64}))`;
        styleInfo['--spc-player-background-size-default'] = `${BRAND_LOGO_IMAGE_SIZE}`;
      }

      // set image size.
      if (this.config.playerBackgroundImageSize) {
        styleInfo['--spc-player-background-size'] = `${this.config.playerBackgroundImageSize}`;
      }

    }

    // set player controls and volume controls icon size.
    const playerControlsIconSize = this.config.playerControlsIconSize || PLAYER_CONTROLS_ICON_SIZE_DEFAULT;
    const playerControlsIconColor = this.config.playerControlsIconColor;
    const playerControlsIconToggleColor = this.config.playerControlsIconToggleColor;
    const playerControlsColor = this.config.playerControlsColor;
    const playerHeaderTitle1Color = this.config.playerHeaderTitle1Color;
    const playerHeaderTitle1FontSize = this.config.playerHeaderTitle1FontSize;
    const playerHeaderTitle2Color = this.config.playerHeaderTitle2Color;
    const playerHeaderTitle2FontSize = this.config.playerHeaderTitle2FontSize;
    const playerHeaderTitle3Color = this.config.playerHeaderTitle3Color;
    const playerHeaderTitle3FontSize = this.config.playerHeaderTitle3FontSize;
    const playerMinimizedTitleColor = this.config.playerMinimizedTitleColor;
    const playerMinimizedTitleFontSize = this.config.playerMinimizedTitleFontSize;
    const playerProgressSliderColor = this.config.playerProgressSliderColor;
    const playerProgressLabelColor = this.config.playerProgressLabelColor;
    const playerProgressLabelPaddingLR = this.config.playerProgressLabelPaddingLR;
    const playerVolumeSliderColor = this.config.playerVolumeSliderColor;
    const playerVolumeLabelColor = this.config.playerVolumeLabelColor;

    // build style info object.
    this.store.card.playerImage = backgroundImageUrl;
    styleInfo['--spc-player-header-bg-color'] = `${headerBackgroundColor}`;
    styleInfo['--spc-player-controls-bg-color'] = `${controlsBackgroundColor} `;
    if (playerControlsColor)
      styleInfo['--spc-player-controls-color'] = `${playerControlsColor}`;
    if (playerControlsIconToggleColor)
      styleInfo['--spc-player-controls-icon-toggle-color'] = `${playerControlsIconToggleColor}`;
    if (playerControlsIconColor)
      styleInfo['--spc-player-controls-icon-color'] = `${playerControlsIconColor}`;
    if (playerControlsIconSize)
      styleInfo['--spc-player-controls-icon-size'] = `${playerControlsIconSize}`;
    styleInfo['--spc-player-controls-icon-button-size'] = `var(--spc-player-controls-icon-size, ${PLAYER_CONTROLS_ICON_SIZE_DEFAULT}) + 0.75rem`;
    if (playerHeaderTitle1Color)
      styleInfo['--spc-player-header-title1-color'] = `${playerHeaderTitle1Color}`;
    if (playerHeaderTitle1FontSize)
      styleInfo['--spc-player-header-title1-font-size'] = `${playerHeaderTitle1FontSize}`;
    if (playerHeaderTitle2Color)
      styleInfo['--spc-player-header-title2-color'] = `${playerHeaderTitle2Color}`;
    if (playerHeaderTitle2FontSize)
      styleInfo['--spc-player-header-title2-font-size'] = `${playerHeaderTitle2FontSize}`;
    if (playerHeaderTitle3Color)
      styleInfo['--spc-player-header-title3-color'] = `${playerHeaderTitle3Color}`;
    if (playerHeaderTitle3FontSize)
      styleInfo['--spc-player-header-title3-font-size'] = `${playerHeaderTitle3FontSize}`;
    if (playerMinimizedTitleColor)
      styleInfo['--spc-player-minimized-title-color'] = `${playerMinimizedTitleColor}`;
    if (playerMinimizedTitleFontSize)
      styleInfo['--spc-player-minimized-title-font-size'] = `${playerMinimizedTitleFontSize}`;
    if (playerProgressLabelColor)
      styleInfo['--spc-player-progress-label-color'] = `${playerProgressLabelColor}`;
    if (playerProgressLabelPaddingLR)
      styleInfo['--spc-player-progress-label-padding-lr'] = `${playerProgressLabelPaddingLR}`;
    if (playerProgressSliderColor)
      styleInfo['--spc-player-progress-slider-color'] = `${playerProgressSliderColor}`;
    if (playerVolumeLabelColor)
      styleInfo['--spc-player-volume-label-color'] = `${playerVolumeLabelColor}`;
    if (playerVolumeSliderColor)
      styleInfo['--spc-player-volume-slider-color'] = `${playerVolumeSliderColor}`;

    return styleMap(styleInfo);

  }


  /**
   * Returns an element style for the header portion of the form.
   */
  private stylePlayerHeader() {

    // build style info object.
    const styleInfo: StyleInfo = <StyleInfo>{};

    // show / hide the header.
    if (this.config.playerHeaderHide || false)
      styleInfo['display'] = `none`;

    // adjust css styling for minimized player format.
    if (this.config.playerMinimizeOnIdle && this.store.player.isPoweredOffOrIdle()) {
      if (this.config.height != 'fill') {
        styleInfo['display'] = `none`;
      }
    }

    return styleMap(styleInfo);
  }


  /**
   * Returns an element style for the player controls portion of the form.
   */
  private stylePlayerControls() {

    // build style info object.
    const styleInfo: StyleInfo = <StyleInfo>{};

    // show / hide the media controls.
    if (this.config.playerControlsHide || false)
      styleInfo['display'] = `none`;

    // adjust css styling for minimized player format.
    if (this.config.playerMinimizeOnIdle && this.store.player.isPoweredOffOrIdle()) {
      if (this.config.height != 'fill') {
        styleInfo['justify-items'] = `flex-start`;
      }
    }

    return styleMap(styleInfo);
  }

}
