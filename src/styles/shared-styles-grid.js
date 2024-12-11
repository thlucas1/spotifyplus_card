import { css } from 'lit';

/**
 * Shared styles for grid formatting.
 * 
 * See the following link for more information:
 * https://codepen.io/neoky/pen/mGpaKN
 */
export const sharedStylesGrid = css`

  /* define a style in the main object to specify the "grid-template-columns: 80px auto ..." value. */
  .grid {
    display: grid;
    width: 100%;
  }

  /* style grid container */
  .grid-container-scrollable {
    overflow-y: auto;
    scrollbar-color: var(--primary-text-color) var(--secondary-background-color);
    scrollbar-width: inherit;
    max-height: 100vh;
    margin: 0.25rem;
    align-self: stretch
  }

  .grid-entry, .grid-header {
    padding: 2px;
    align-self: normal;
    /* background-color: white; */
    /* border-right: 1px solid gray; */
    /* border-bottom: 1px solid gray; */
  }

  .grid-entry-last, .grid-header-last {
    margin-right: 4px;    /* a little padding if scrollbars are present */
    /* border-right: none; */
  }

  .grid-entry-r {
    padding: 2px;
    justify-self: right;
  }

  .grid-entry-c {
    padding: 2px;
    justify-self: center;
  }

  /* scrolling text bleeds through if you set BG-COLOR to transparent! */
  .grid-header {
    background-color: var(--card-background-color);
    color: var(--accent-color);
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 2px;
    border-bottom: 1px solid gray;
    border-top: 1px solid gray;
  }

  .grid-header-fixed-left {
    z-index: 2;
  }

  .grid-fixed-left {
    position: sticky;
    left: 0;
  }

  .grid-fixed-right {
    /* border-left: 1px solid gray; */
    /* border-right: none; */
    position: sticky;
    right: 0;
  }

  .grid-fixed-right2 {
    /* border-left: 1px solid gray; */
    /* border-right: none; */
    position: sticky;
    right: 200px;
  }

  .grid-placeholder {
    grid-column-start: 1;
    grid-column-end: 21;
    /* border-right: none; */
  }

  /* styles for action item info grid items. */
  .grid-action-info-hdr-s {
    font-size: 0.85rem;
    line-height: 1rem;
    justify-self: right;
    padding-right: 6px;
    color: var(--accent-color);
  }

  .grid-action-info-text-s {
    font-size: 0.85rem;
    line-height: 1rem;
    justify-self: left;
  }

`;
