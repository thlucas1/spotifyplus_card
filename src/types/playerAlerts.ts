export interface playerAlerts {

  /**
   * Clears the error alert text.
   */
  alertErrorClear(): void;


  /**
   * Clears the informational alert text.
   */
  alertInfoClear(): void;


  /**
   * Sets the alert info message.
   * 
   * @param message alert message text.
   */
  alertInfoSet(message: string): void;


  /**
   * Sets the alert error message.
   * 
   * @param message alert message text.
   */
  alertErrorSet(message: string): void;

}
