// lovelace card imports.
import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

// our imports.
import { Store } from '../model/store';
import { ProgressEndedEvent } from '../events/progress-ended';
import { ProgressStartedEvent } from '../events/progress-started';
import { isCardInEditPreview } from '../utils/utils';


export class AlertUpdatesBase extends LitElement {

  // public state properties.
  @property({ attribute: false }) protected store!: Store;

  // private state properties.
  @state() protected alertError?: string;
  @state() protected alertInfo?: string;

  /** Indicates if an async update is in progress (true) or not (false). */
  protected isUpdateInProgress!: boolean;

  /** True if the card is in edit preview mode (e.g. being edited); otherwise, false. */
  protected isCardInEditPreview!: boolean;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super();

    // initialize storage.
    this.isUpdateInProgress = false;
    this.isCardInEditPreview = false;

  }


  /**
   * Invoked when the component is added to the document's DOM.
   *
   * In `connectedCallback()` you should setup tasks that should only occur when
   * the element is connected to the document. The most common of these is
   * adding event listeners to nodes external to the element, like a keydown
   * event handler added to the window.
   */
  public connectedCallback() {

    // invoke base class method.
    super.connectedCallback();

    // determine if card configuration is being edited.
    if ((this.store) && (this.store.card)) {
      this.isCardInEditPreview = isCardInEditPreview(this.store.card);
    }

  }


  /**
   * Clears the error and informational alert text.
   */
  protected alertClear() {
    this.alertError = undefined;
    this.alertInfo = undefined;
  }


  /**
   * Clears the error alert text.
   */
  protected alertErrorClear() {
    this.alertError = undefined;
  }


  /**
   * Sets the alert error message, and clears the informational alert message.
   */
  public alertErrorSet(message: string): void {
    this.alertError = message;
    this.alertInfo = undefined;
  }


  /**
   * Clears the info alert text.
   */
  protected alertInfoClear() {
    this.alertInfo = undefined;
  }


  /**
   * Sets the alert info message, and clears the informational alert message.
   */
  public alertInfoSet(message: string): void {
    this.alertInfo = message;
    this.alertError = undefined;
  }


  /**
   * Hide visual progress indicator.
   */
  protected progressHide(): void {
    this.isUpdateInProgress = false;
    if ((this.store) && (this.store.card)) {
      this.store.card.dispatchEvent(ProgressEndedEvent());
    }
  }


  /**
   * Show visual progress indicator.
   */
  protected progressShow(): void {
    if ((this.store) && (this.store.card)) {
      this.store.card.dispatchEvent(ProgressStartedEvent());
    }
  }

}
