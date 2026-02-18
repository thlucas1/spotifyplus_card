// lovelace card imports.
import { css, html, TemplateResult, nothing, unsafeCSS } from 'lit';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map.js';
import { property } from 'lit/decorators.js';
import {
  mdiPower,
  mdiVolumeHigh,
  mdiVolumeMinus,
  mdiVolumeMute,
  mdiVolumePlus
} from '@mdi/js';

// our imports.
import {
  PLAYER_CONTROLS_ICON_SIZE_DEFAULT,
  PLAYER_CONTROLS_ICON_TOGGLE_COLOR_DEFAULT
} from '../constants';
import { CardConfig } from '../types/card-config';
import { MediaPlayer } from '../model/media-player';
import { MediaPlayerEntityFeature, MediaPlayerState } from '../services/media-control-service';
import { SpotifyPlusService } from '../services/spotifyplus-service';
import { closestElement, getHomeAssistantErrorMessage } from '../utils/utils';
import { Player } from '../sections/player';
import { AlertUpdatesBase } from '../sections/alert-updates-base';

const { TURN_OFF, TURN_ON, VOLUME_MUTE, VOLUME_SET, VOLUME_STEP } = MediaPlayerEntityFeature;
const VOLUME_DOWN = 900000000000;
const VOLUME_UP = 900000000001;


class Volume extends AlertUpdatesBase {

  // public state properties.
  @property({ attribute: false }) player!: MediaPlayer;
  @property() slim: boolean = false;

  /** Card configuration data. */
  private config!: CardConfig;

  /** SpotifyPlus services instance. */
  protected spotifyPlusService!: SpotifyPlusService;


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // set common references from application common storage area.
    this.config = this.store.config;
    this.spotifyPlusService = this.store.spotifyPlusService;

    // get volume hide configuration setting.
    const hideMute = this.config.playerVolumeControlsHideMute || false;
    const hideLevels = this.config.playerVolumeControlsHideLevels || false;
    const muteIcon = this.player.isMuted() ? mdiVolumeMute : mdiVolumeHigh;
    const showPlusMinus = this.config.playerVolumeControlsShowPlusMinus && true;

    // set button color based on selected option.
    const colorPower = (this.player.state == MediaPlayerState.OFF);
    const colorMute = (this.player.attributes.is_volume_muted);

    // assign volume level values.
    const volumeStep = 1;
    const volumeMin = 0;
    const volumeMax = 100;
    const volumeValue = this.player.getVolume();
    const volumeValuePct = Math.round(Math.abs(100 * ((volumeValue - volumeMin) / (volumeMax - volumeMin))));

    // render control.
    return html`
      <div class="volume-container icons" slim=${this.slim || nothing}>
        ${!hideMute ? html`
          <ha-icon-button
            hide=${this.hideFeature(VOLUME_MUTE)}
            @click=${this.onMuteClick} 
            .path=${muteIcon} 
            label="Mute Toggle"
            style=${this.styleIcon(colorMute)}></ha-icon-button>
          ` : html``}
        ${showPlusMinus ? html`
          <ha-icon-button .path=${mdiVolumeMinus} @click=${() => this.onClickAction(VOLUME_DOWN)} hide=${this.hideFeature(VOLUME_STEP)} label="Decrease"></ha-icon-button>
          ` : html``}
        <div class="volume-slider" hide=${this.hideFeature(VOLUME_SET)} style=${this.styleVolumeSlider()}>
          <ha-control-slider
            .value=${volumeValue}
            step=${volumeStep}
            min=${volumeMin}
            max=${volumeMax}
            @value-changed=${this.onVolumeValueChanged}
          ></ha-control-slider>
          ${!hideLevels ? html`
            <div class="volume-level">
              <div class="volume-level-min">${volumeMin}%</div>
              <div class="volume-level-pct" style="flex: ${volumeValuePct}%;">${volumeValue}%</div>
              <div class="volume-level-max">${volumeMax}%</div>
            </div>
          ` : html``}
        </div>
        ${showPlusMinus ? html`
          <ha-icon-button .path=${mdiVolumePlus} @click=${() => this.onClickAction(VOLUME_UP)} hide=${this.hideFeature(VOLUME_STEP)} label="Increase"></ha-icon-button>
          ` : html``}
        <ha-icon-button .path=${mdiPower} @click=${() => this.onClickAction(TURN_ON)}  hide=${this.hideFeature(TURN_ON)}  label="Turn On"  style=${this.styleIcon(colorPower)}></ha-icon-button>
        <ha-icon-button .path=${mdiPower} @click=${() => this.onClickAction(TURN_OFF)} hide=${this.hideFeature(TURN_OFF)} label="Turn Off" style=${this.styleIcon()}></ha-icon-button>
      </div>
    `;
  }


  /**
   * Handles the `value-changed` event fired when the volume slider is changed.
   * 
   * @param args Event arguments.
   */
  private async onVolumeValueChanged(args: Event) {

    try {

      // show progress indicator.
      this.progressShow();

      // get volume value to apply.
      let newVolume = Number.parseInt((args?.target as HTMLInputElement)?.value);

      // check for max volume allowed configuration; if larger, then limit the volume value.
      const volumeMax: number = (this.config.playerVolumeMaxValue || 100);
      if (newVolume > volumeMax) {
        newVolume = volumeMax;
        const sliderControl = (args?.target as HTMLInputElement);
        if (sliderControl)
          sliderControl.value = newVolume + "";
        this.alertInfoSet("Selected volume level was greater than Max Volume limit set in card configuration; max limit value of " + volumeMax + " was applied.");
      }

      // adjust the volume.
      await this.spotifyPlusService.volume_set(this.player, newVolume);
      return true;

    }
    catch (error) {

      // set alert error message.
      this.alertErrorSet("Volume set failed: " + getHomeAssistantErrorMessage(error));
      return true;

    }
    finally {

      // hide progress indicator.
      this.progressHide();

    }

  }


  /**
   * Handles the `click` event fired when the mute button is clicked.
   */
  private async onMuteClick() {

    try {

      // show progress indicator.
      this.progressShow();

      // toggle mute.
      await this.spotifyPlusService.volume_mute_toggle(this.player);
      return true;

    }
    catch (error) {

      // set alert error message.
      this.alertErrorSet("Volume mute failed: " + getHomeAssistantErrorMessage(error));
      return true;

    }
    finally {

      // hide progress indicator.
      this.progressHide();

    }
  }


  /**
   * Returns an element style for the volume slider portion of the control.
   */
  private styleVolumeSlider(): string | undefined {

    // show / hide the header.
    const hideSlider = this.config.playerVolumeControlsHideSlider || false;
    if (hideSlider)
      return `display: none`;

    return
  }


  /**
   * Handles the `click` event fired when a control icon is clicked.
   * 
   * @param action Action to execute.
   */
  private async onClickAction(action: MediaPlayerEntityFeature | number): Promise<boolean> {

    try {

      // show progress indicator.
      this.progressShow();

      // call async service based on requested action.
      if (action == TURN_OFF) {

        await this.spotifyPlusService.turn_off(this.player);

      } else if (action == TURN_ON) {

        await this.spotifyPlusService.turn_on(this.player);

      } else if (action == VOLUME_DOWN) {

        await this.spotifyPlusService.volume_down(this.player);

      } else if (action == VOLUME_UP) {

        await this.spotifyPlusService.volume_up(this.player);

      }

      return true;

    }
    catch (error) {

      // set alert error message.
      this.alertErrorSet("Volume action failed: " + getHomeAssistantErrorMessage(error));
      return true;

    }
    finally {

      // hide progress indicator.
      this.progressHide();

    }

  }


  /**
   * Returns `nothing` if the specified feature is to be hidden from view.
   * The feature will be hidden from view if the media player does not support it,
   * or if the configuration settings "playerControlsHideX" is true.
   * 
   * @param feature Feature identifier to check.
   */
  private hideFeature(feature: MediaPlayerEntityFeature) {

    if (feature == TURN_ON) {

      if (this.player.supportsFeature(TURN_ON)) {
        if ([MediaPlayerState.OFF, MediaPlayerState.UNKNOWN, MediaPlayerState.STANDBY].includes(this.player.state)) {
          return (this.config.playerVolumeControlsHidePower) ? true : nothing;
        }
        return true; // hide icon
      }

    } else if (feature == TURN_OFF) {

      if (this.player.supportsFeature(TURN_OFF)) {
        if (![MediaPlayerState.OFF, MediaPlayerState.UNKNOWN, MediaPlayerState.STANDBY].includes(this.player.state)) {
          return (this.config.playerVolumeControlsHidePower) ? true : nothing;
        }
        return true; // hide icon
      }

    } else if (feature == VOLUME_MUTE) {

      if (this.player.supportsFeature(VOLUME_MUTE))
        return nothing;

    } else if (feature == VOLUME_SET) {

        if (this.player.supportsFeature(VOLUME_SET))
          return nothing;

    } else if (feature == VOLUME_STEP) {

      if (this.player.supportsFeature(VOLUME_STEP))
        return nothing;

    }

    // default is to hide the feature.
    return true;

  }


  /**
   * Sets the alert error message in the parent player.
   * 
   * @param message alert message text.
   */
  public override  alertErrorSet(message: string): void {

    // find the parent player reference, and update the message.
    // we have to do it this way due to the shadowDOM between this element and the player element.
    const spcPlayer = closestElement('#spcPlayer', this) as Player;
    if (spcPlayer) {
      spcPlayer.alertErrorSet(message);
    }

  }


  /**
   * Sets the alert info message in the parent player.
   * 
   * @param message alert message text.
   */
  public override  alertInfoSet(message: string): void {

    // find the parent player reference, and update the message.
    // we have to do it this way due to the shadowDOM between this element and the player element.
    const spcPlayer = closestElement('#spcPlayer', this) as Player;
    if (spcPlayer) {
      spcPlayer.alertInfoSet(message);
    }

  }


  /**
   * Returns an element style for control icon coloring.
   * 
   * @param isToggled True if the icon is in a toggle state; otherwise false if icon is in a non-toggled state.
   */
  private styleIcon(isToggled: boolean | undefined | null = null) {

    // build style info object.
    const styleInfo: StyleInfo = <StyleInfo>{};

    const playerControlsIconMargin = this.config.playerControlsIconMargin;
    if (playerControlsIconMargin) {
      styleInfo['margin'] = `${playerControlsIconMargin}`;
    }

    // if button is toggled, then use the icon toggle color; 
    // otherwise, default to regular icon color.
    if (isToggled) {
      styleInfo['color'] = `var(--spc-player-controls-icon-toggle-color, ${PLAYER_CONTROLS_ICON_TOGGLE_COLOR_DEFAULT})`;
    }

    return styleMap(styleInfo);
  }


  /**
   * style definitions used by this component.
   * */
  static get styles() {
    return css`
      ha-control-slider {
        --control-slider-color: var(--spc-player-volume-slider-color, var(--spc-player-controls-color, var(--dark-primary-color, ${unsafeCSS(PLAYER_CONTROLS_ICON_TOGGLE_COLOR_DEFAULT)})));
        --control-slider-thickness: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.10);
        box-sizing: border-box;
      }

      ha-control-slider[disabled] {
        --control-slider-color: var(--disabled-text-color);
        --control-slider-thickness: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.10);
        box-sizing: border-box;
      }

      .volume-container {
        flex: 1;
        /*border: 1px solid blue;  /*  FOR TESTING CONTROL LAYOUT CHANGES */
      }

      .volume-slider {
        flex: 1;
        padding-right: 0.0rem;
        align-content: flex-end;
        color: var(--spc-player-volume-label-color, var(--spc-player-controls-color, #ffffff));
      }

      .volume-level {
        font-size: var(--spc-player-volume-label-font-size, x-small);
        display: flex;
      }

      .volume-level-min {
        flex: 0;
        text-align: left;
        margin-right: 4px;
      }

      .volume-level-pct {
        text-align: right;
        color: var(--spc-player-volume-slider-color, var(--spc-player-controls-color, var(--dark-primary-color, ${unsafeCSS(PLAYER_CONTROLS_ICON_TOGGLE_COLOR_DEFAULT)})));
      }

      .volume-level-max {
        flex: 100;
        text-align: right;
        margin-left: 4px;
      }

      *[slim] * {
        --control-slider-thickness: 10px;
        --mdc-icon-button-size: 30px;
        --mdc-icon-size: 20px;
      }

      *[slim] .volume-level {
        display: none;
      }

      *[slim] .volume-slider {
        display: flex;
        align-items: center;
      }

      .icons {
        justify-content: center;
        display: inline-flex;
        align-items: center;
        mix-blend-mode: normal;
        overflow: hidden;
        color: var(--spc-player-controls-icon-color, #ffffff);
        width: 100%;
        --mdc-icon-button-size: var(--spc-player-controls-icon-button-size, 2.75rem);
        --mdc-icon-size: var(--spc-player-controls-icon-size, ${unsafeCSS(PLAYER_CONTROLS_ICON_SIZE_DEFAULT)});
      }

      *[hide] {
        display: none;
      }
    `;
  }
}


customElements.define('spc-player-volume', Volume);
