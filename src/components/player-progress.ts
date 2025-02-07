// lovelace card imports.
import { css, html, LitElement, TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { styleMap } from 'lit-html/directives/style-map.js';

// our imports.
import { Store } from '../model/store';
import { MediaPlayer } from '../model/media-player';
import { ProgressStartedEvent } from '../events/progress-started';
import { ProgressEndedEvent } from '../events/progress-ended';
import { closestElement, getHomeAssistantErrorMessage } from '../utils/utils';
import { Player } from '../sections/player';


class Progress extends LitElement {

  // public state properties.
  @property({ attribute: false }) store!: Store;

  // private state properties.
  @state() private playingProgress!: number;

  /** MediaPlayer instance created from the configuration entity id. */
  private player!: MediaPlayer;

  /** Callback function that calculates the current progress (executed every 1 second). */
  private tracker?: NodeJS.Timeout;

  /** Current media duration value. */
  private mediaDuration = 0;

  /** Progress bar HTMLElement control. */
  @query('.bar') private progressBar?: HTMLElement;


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // set common references from application common storage area.
    this.player = this.store.player;

    // get media duration, and check if it progressing.
    this.mediaDuration = this.player?.attributes.media_duration || 0;
    const hasProgress = this.mediaDuration > 0;

    // show / hide the progress bar.
    if (hasProgress) {

      // start tracking progress.
      this.trackProgress();

      // render control.
      return html`
        <div class="progress">
          <span class="progress-time">${convertProgress(this.playingProgress)}</span>
          <div class="bar" @click=${this.onSeekBarClick}>
            <div class="progress-bar" style=${this.styleProgressBar(this.mediaDuration)}></div>
          </div>
          <span class="progress-time"> -${convertProgress(this.mediaDuration - this.playingProgress)}</span>
        </div>
      `;
    } else {
      return html``;
    }
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

    // are we currently tracking progress?  if so, then stop tracking and
    // indicate we are no longer tracking.
    if (this.tracker) {
      clearInterval(this.tracker);
      this.tracker = undefined;
    }

    // invoke base class method.
    super.disconnectedCallback();
  }


  /**
   * Handles the `click` event fired when the seek bar is clicked.
   * 
   * This will seek to the desired position of the playing track.
   * 
   * @param args Event arguments that contain the mouse pointer position.
   */
  private async onSeekBarClick(args: MouseEvent) {

    try {

      // calculate the desired position based on the mouse pointer position.
      const progressWidth = this.progressBar!.offsetWidth;
      const percent = args.offsetX / progressWidth;
      const position = this.mediaDuration * percent;

      // show progress indicator.
      this.progressShow();

      // call service to seek to track position.
      await this.store.mediaControlService.media_seek(this.player, position);
      return true;

    }
    catch (error) {

      // set alert error message.
      this.alertErrorSet("Seek position failed: " + getHomeAssistantErrorMessage(error));
      return true;

    }
    finally {

      // hide progress indicator.
      this.progressHide();

    }

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
   * Returns an element style for the progress bar portion of the control.
   */
  private styleProgressBar(mediaDuration: number) {
    return styleMap({ width: `${(this.playingProgress / mediaDuration) * 100}%` });
  }


  /**
   * Starts progress tracking; this method is repeatedly called at 1 second intervals
   * to update the position of the track.
   * 
   * It is stopped when the control instance is unloaded from the DOM (via disconnectedCallback).
   */
  private trackProgress() {

    // get current track positioning from media player attributes.
    const position = this.player?.attributes.media_position || 0;
    const playing = this.player?.isPlaying();
    const updatedAt = this.player?.attributes.media_position_updated_at || 0;

    // calculate progress.
    if (playing) {
      this.playingProgress = position + (Date.now() - new Date(updatedAt).getTime()) / 1000.0;
    } else {
      this.playingProgress = position;
    }

    // start tracking progress at 1 second intervals.
    if (!this.tracker) {
      this.tracker = setInterval(() => this.trackProgress(), 1000);
    }

    // if we are not playing, then clear the interval.
    if (!playing) {
      clearInterval(this.tracker);
      this.tracker = undefined;
    }
  }


  /**
   * style definitions used by this component.
   * */
  static get styles() {
    return css`
      .progress {
        width: 100%;
        font-size: x-small;
        display: flex;
        color: var(--spc-player-progress-label-color, var(--spc-player-controls-color, #ffffff));
        padding-bottom: 0.2rem;
      }

      .bar {
        display: flex;
        flex-grow: 1;
        align-items: center;
        align-self: center;
        margin-left: 5px;
        margin-right: 5px;
        height: 14px;
        cursor: pointer;
        background-clip: padding-box;
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 0.25rem;
      }

      .progress-bar {
        align-self: center;
        background-color: var(--spc-player-progress-slider-color, var(--spc-player-controls-color, var(--dark-primary-color, #2196F3)));
        margin-left: 2px;
        margin-right: 2px;
        height: 50%;
        transition: width 0.1s linear;
        border-radius: 0.18rem;
      }

      .progress-time {
        mix-blend-mode: screen;
      }
    `;
  }
}


/**
 * Converts a duration (in seconds) value to a current time value.
 * 
 * @param duration Duration to convert, specified in seconds.
 */
const convertProgress = (duration: number) => {

  // create a timestamp from the current duration value.
  const date = new Date(duration * 1000).toISOString().substring(11, 19);

  // return the minutes and seconds portion of the timestamp.
  return date.startsWith('00:') ? date.substring(3) : date;
};


customElements.define('spc-player-progress', Progress);
