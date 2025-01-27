// lovelace card imports.
import { css, html, LitElement, TemplateResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import {
  mdiPower,
  mdiVolumeHigh,
  mdiVolumeMute
} from '@mdi/js';

// our imports.
import { CardConfig } from '../types/card-config';
import { Store } from '../model/store';
import { MediaPlayer } from '../model/media-player';
import { MediaPlayerEntityFeature, MediaPlayerState } from '../services/media-control-service';
import { SpotifyPlusService } from '../services/spotifyplus-service';
import { ProgressEndedEvent } from '../events/progress-ended';
import { ProgressStartedEvent } from '../events/progress-started';
import { closestElement } from '../utils/utils';
import { Player } from '../sections/player';

const { TURN_OFF, TURN_ON, VOLUME_MUTE, VOLUME_SET } = MediaPlayerEntityFeature;


class Volume extends LitElement {

  // public state properties.
  @property({ attribute: false }) store!: Store;
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

    // set button color based on selected option.
    const colorPower = (this.player.state == MediaPlayerState.OFF);
    const colorMute = (this.player.attributes.is_volume_muted);

    // get current and max volume levels.
    const volume = this.player.getVolume();
    const maxVolume = 100;

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
        <div class="volume-slider" hide=${this.hideFeature(VOLUME_SET)} style=${this.styleVolumeSlider()}>
          <ha-control-slider
            .value=${volume}
            max=${maxVolume}
            @value-changed=${this.onVolumeValueChanged}
          ></ha-control-slider>
          ${!hideLevels ? html`
            <div class="volume-level">
              <div style="flex: ${volume};text-align: left">0%</div>
              <div class="volume-percentage">${Math.round(volume)}%</div>
              <div style="flex: ${maxVolume - volume};text-align: right">${maxVolume}%</div>
            </div>
          ` : html``}
        </div>
        <ha-icon-button .path=${mdiPower} @click=${() => this.onClickAction(TURN_ON)}  hide=${this.hideFeature(TURN_ON)}  label="Turn On"  style=${this.styleIcon(colorPower)}></ha-icon-button>
        <ha-icon-button .path=${mdiPower} @click=${() => this.onClickAction(TURN_OFF)} hide=${this.hideFeature(TURN_OFF)} label="Turn Off"></ha-icon-button>
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
      this.alertErrorSet("Volume set failed: " + (error as Error).message);
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
      this.alertErrorSet("Volume mute failed: " + (error as Error).message);
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
  private async onClickAction(action: MediaPlayerEntityFeature): Promise<boolean> {

    try {

      // show progress indicator.
      this.progressShow();

      // call async service based on requested action.
      if (action == TURN_OFF) {

        await this.spotifyPlusService.turn_off(this.player);

      } else if (action == TURN_ON) {

        await this.spotifyPlusService.turn_on(this.player);

      }

      return true;

    }
    catch (error) {

      // set alert error message.
      this.alertErrorSet("Volume action failed: " + (error as Error).message);
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

    }

    // default is to hide the feature.
    return true;

  }


  /**
   * Hide visual progress indicator.
   */
  protected progressHide(): void {
    this.store.card.dispatchEvent(ProgressEndedEvent());
  }


  /**
   * Show visual progress indicator.
   */
  protected progressShow(): void {
    this.store.card.dispatchEvent(ProgressStartedEvent());
  }


  /**
   * Sets the alert error message in the parent player.
   * 
   * @param message alert message text.
   */
  private alertErrorSet(message: string): void {

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
  private alertInfoSet(message: string): void {

    // find the parent player reference, and update the message.
    // we have to do it this way due to the shadowDOM between this element and the player element.
    const spcPlayer = closestElement('#spcPlayer', this) as Player;
    if (spcPlayer) {
      spcPlayer.alertInfoSet(message);
    }

  }


  /**
   * Returns an element style for control icon coloring.
   */
  private styleIcon(isColored: boolean | undefined): string | undefined {

    // color the button if desired.
    if (isColored) {
      return `color: var(--dark-primary-color);`;
    }

    return undefined;
  }


  /**
   * style definitions used by this component.
   * */
  static get styles() {
    return css`
      ha-control-slider {
        --control-slider-color: var(--dark-primary-color);
        --control-slider-thickness: 1rem;
      }

      ha-control-slider[disabled] {
        --control-slider-color: var(--disabled-text-color);
        --control-slider-thickness: 1rem;
      }

      .volume-container {
        display: flex;
        flex: 1;
        justify-content: space-between;
        mix-blend-mode: screen;
        color: var(--spc-player-controls-color);
        /*border: 1px solid blue;  /*  FOR TESTING CONTROL LAYOUT CHANGES */
      }

      .volume-slider {
        flex: 1;
        padding-right: 0.0rem;
        align-content: flex-end;
      }

      .volume-level {
        font-size: x-small;
        display: flex;
      }

      .volume-percentage {
        flex: 2;
        padding-left: 2px;
        padding-right: 2px;
        font-weight: normal;
        font-size: 10px;
        color: var(--dark-primary-color);
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
        mix-blend-mode: screen;
        overflow: hidden;
        text-shadow: 0 0 2px var(--spc-player-palette-vibrant);
        color: white;
        width: 100%;
        --mdc-icon-button-size: var(--spc-player-controls-icon-button-size, 2.75rem);
        --mdc-icon-size: var(--spc-player-controls-icon-size, 2.0rem);
      }

      *[hide] {
        display: none;
      }
    `;
  }
}


customElements.define('spc-player-volume', Volume);
