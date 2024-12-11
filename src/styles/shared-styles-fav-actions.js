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
    scrollbar-color: var(--primary-text-color) var(--secondary-background-color);
    scrollbar-width: inherit;
    color: white;
  }

  /* style actions 3 dots ("...") <ha-md-button-menu> dropdown menu */
  .actions-dropdown-menu {
    white-space: nowrap;
    display: inline-flex;
    flex-direction: row;
    justify-content: left;
    vertical-align: text-top;
    --ha-select-height: 2.5rem;           /* ha dropdown control height */
    --mdc-menu-item-height: 2.5rem;       /* mdc dropdown list item height */
    --mdc-icon-button-size: 2.5rem;       /* mdc icon button size */
    --md-menu-item-top-space: 0.5rem;     /* top spacing between items */
    --md-menu-item-bottom-space: 0.5rem;  /* bottom spacing between items */
    --md-menu-item-one-line-container-height: 2.0rem;  /* menu item height */
  }

  /* style actions 3 dots ("...") <ha-md-button-menu><ha-assist-chip> dropdown menu */
  .actions-dropdown-menu > ha-md-button-menu > ha-assist-chip {
    /*--ha-assist-chip-container-color: var(--card-background-color);*/ /* transparent is default. */
    --ha-assist-chip-container-shape: 10px;     /* 0px=square corner, 10px=rounded corner */
    --md-assist-chip-trailing-space: 0px;       /* no label, so no trailing space */
    --md-assist-chip-container-height: 1.5rem;  /* height of the dropdown menu container */
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

  *[hide="true"] {
    display: none !important;
  }

  *[hide="false"] {
    display: block !important;
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
