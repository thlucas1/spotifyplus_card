import { css } from 'lit';

/**
 * Shared styles for actions.
 * 
 * See the following link for more information:
 * https://codepen.io/neoky/pen/mGpaKN
 */
export const sharedStylesFavActions = css`

  .player-body-container {
    box-sizing: border-box;
    height: inherit;
    background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65));
    border-radius: 1.0rem;
    padding: 0.25rem;
    text-align: left;
  }

  .player-body-container-scrollable {
    /* border: 1px solid green;     /* FOR TESTING CONTROL LAYOUT CHANGES */
    box-sizing: border-box;
    height: inherit;
    overflow-y: auto;
    overflow-x: clip;
    color: white;
  }

  /* style ha-icon-button controls in header actions: icon size, title text */
  ha-icon-button[slot="icon-button"] {
    --mdc-icon-button-size: 30px;
    --mdc-icon-size: 24px;
    vertical-align: middle;
    padding: 2px;
  }

  ha-icon-button[slot="icon-button-selected"] {
    --mdc-icon-button-size: 30px;
    --mdc-icon-size: 24px;
    vertical-align: middle;
    padding: 2px;
    color: red;
  }

  /* style ha-icon-button controls in header actions: icon size, title text */
  ha-icon-button[slot="icon-button-small"] {
    --mdc-icon-button-size: 20px;
    --mdc-icon-size: 20px;
    vertical-align: middle;
    padding: 2px;
  }

  ha-icon-button[slot="icon-button-small-selected"] {
    --mdc-icon-button-size: 20px;
    --mdc-icon-size: 20px;
    vertical-align: middle;
    padding: 2px;
    color: red;
  }

  /* style ha-alert controls */
  ha-alert {
    display: block;
    margin-bottom: 0.25rem;
  }

  .icon-button {
    width: 100%;
  }

  *[hide] {
    display: none;
  }

  .flex-1 {
    flex: 1;
  }

  .flex-items {
    display: block;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    align-self: auto;
    order: 0;
  }

  .display-inline {
    display: inline;
  }
`;
