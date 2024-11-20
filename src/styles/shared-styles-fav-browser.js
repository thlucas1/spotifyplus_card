import { css } from 'lit';

/**
 * Shared styles for favorites browsers.
 * 
 * See the following link for more information:
 * https://codepen.io/neoky/pen/mGpaKN
 */
export const sharedStylesFavBrowser = css`

  .media-browser-section {
    color: var(--secondary-text-color);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .media-browser-section-title {
    margin-top: 0.5rem;
    align-items: center;
    display: flex;
    flex-shrink: 0;
    flex-grow: 0;
    justify-content: center;
    text-align: center;
    font-weight: bold;
    font-size: 1.0rem;
    color: var(--secondary-text-color);
  }

  .media-browser-section-subtitle {
    margin: 0.1rem 0;
    align-items: center;
    display: flex;
    justify-content: center;
    text-align: center;
    font-weight: normal;
    font-size: 0.85rem;
    color: var(--secondary-text-color);
  }

  .media-browser-controls {
    margin-top: 0.25rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    margin-bottom: 0rem;
    white-space: nowrap;
    --ha-select-height: 2.5rem;           /* ha dropdown control height */
    --mdc-menu-item-height: 2.5rem;       /* mdc dropdown list item height */
    --mdc-icon-button-size: 2.5rem;       /* mdc icon button size */
    --md-menu-item-top-space: 0.5rem;     /* top spacing between items */
    --md-menu-item-bottom-space: 0.5rem;  /* bottom spacing between items */
    --md-menu-item-one-line-container-height: 2.0rem;  /* menu item height */
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
  }

  .media-browser-control-filter {
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    width: 100%;
  }

  .media-browser-control-filter-disabled {
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    width: 100%;
    align-self: center;
    color: var(--dark-primary-color);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .media-browser-content {
    margin: 0.5rem;
    flex: 3;
    max-height: 100vh;
    overflow-y: auto;
  }

  .media-browser-list {
    height: 100%;
  }

  .media-browser-actions {
    height: 100%;
  }

  ha-alert {
    display: block;
    margin-bottom: 0.25rem;
  }

  *[hide] {
    display: none;
  }

`;
