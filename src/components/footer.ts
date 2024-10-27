// lovelace card imports.
import { css, html, LitElement, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  mdiAccountMusic,
  mdiAlbum,
  mdiBookmarkMusicOutline,
  mdiBookOpenVariant,
  mdiHistory,
  mdiMicrophone,
  mdiMusic,
  mdiPlayCircle,
  mdiPlaylistPlay,
  mdiPodcast,
  mdiSearchWeb,
  mdiSpeaker,
} from '@mdi/js';

// our imports.
import { SHOW_SECTION } from '../constants';
import { CardConfig } from '../types/card-config';
import { Section } from '../types/section';
import { customEvent } from '../utils/utils';


@customElement("spc-footer")
export class Footer extends LitElement {

  @property({ attribute: false }) config!: CardConfig;
  @property() section!: Section;

  /** 
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    return html`
      <ha-icon-button
        .path=${mdiPlayCircle}
        label="Player"
        @click=${() => this.onSectionClick(Section.PLAYER)}
        selected=${this.getSectionSelected(Section.PLAYER)}
        hide=${this.getSectionEnabled(Section.PLAYER)}
      ></ha-icon-button>
      <ha-icon-button
        .path=${mdiSpeaker}
        label="Devices"
        @click=${() => this.onSectionClick(Section.DEVICES)}
        selected=${this.getSectionSelected(Section.DEVICES)}
        hide=${this.getSectionEnabled(Section.DEVICES)}
      ></ha-icon-button>
      <ha-icon-button
        .path=${mdiBookmarkMusicOutline}
        label="User Presets"
        @click=${() => this.onSectionClick(Section.USERPRESETS)}
        selected=${this.getSectionSelected(Section.USERPRESETS)}
        hide=${this.getSectionEnabled(Section.USERPRESETS)}
      ></ha-icon-button>
      <ha-icon-button
        .path=${mdiHistory}
        label="Recently Played"
        @click=${() => this.onSectionClick(Section.RECENTS)}
        selected=${this.getSectionSelected(Section.RECENTS)}
        hide=${this.getSectionEnabled(Section.RECENTS)}
      ></ha-icon-button>
      <ha-icon-button
        .path=${mdiPlaylistPlay}
        label='Playlist Favorites'
        @click=${() => this.onSectionClick(Section.PLAYLIST_FAVORITES)}
        selected=${this.getSectionSelected(Section.PLAYLIST_FAVORITES)}
        hide=${this.getSectionEnabled(Section.PLAYLIST_FAVORITES)}
      ></ha-icon-button>
      <ha-icon-button
        .path=${mdiAlbum}
        label='Album Favorites'
        @click=${() => this.onSectionClick(Section.ALBUM_FAVORITES)}
        selected=${this.getSectionSelected(Section.ALBUM_FAVORITES)}
        hide=${this.getSectionEnabled(Section.ALBUM_FAVORITES)}
      ></ha-icon-button>
      <ha-icon-button
        .path=${mdiAccountMusic}
        label='Artist Favorites'
        @click=${() => this.onSectionClick(Section.ARTIST_FAVORITES)}
        selected=${this.getSectionSelected(Section.ARTIST_FAVORITES)}
        hide=${this.getSectionEnabled(Section.ARTIST_FAVORITES)}
      ></ha-icon-button>
      <ha-icon-button
        .path=${mdiMusic}
        label='Track Favorites'
        @click=${() => this.onSectionClick(Section.TRACK_FAVORITES)}
        selected=${this.getSectionSelected(Section.TRACK_FAVORITES)}
        hide=${this.getSectionEnabled(Section.TRACK_FAVORITES)}
      ></ha-icon-button>
      <ha-icon-button
        .path=${mdiBookOpenVariant}
        label='Audiobook Favorites'
        @click=${() => this.onSectionClick(Section.AUDIOBOOK_FAVORITES)}
        selected=${this.getSectionSelected(Section.AUDIOBOOK_FAVORITES)}
        hide=${this.getSectionEnabled(Section.AUDIOBOOK_FAVORITES)}
      ></ha-icon-button>
      <ha-icon-button
        .path=${mdiPodcast}
        label='Show Favorites'
        @click=${() => this.onSectionClick(Section.SHOW_FAVORITES)}
        selected=${this.getSectionSelected(Section.SHOW_FAVORITES)}
        hide=${this.getSectionEnabled(Section.SHOW_FAVORITES)}
      ></ha-icon-button>
      <ha-icon-button
        .path=${mdiMicrophone}
        label='Episode Favorites'
        @click=${() => this.onSectionClick(Section.EPISODE_FAVORITES)}
        selected=${this.getSectionSelected(Section.EPISODE_FAVORITES)}
        hide=${this.getSectionEnabled(Section.EPISODE_FAVORITES)}
      ></ha-icon-button>
      <ha-icon-button
        .path=${mdiSearchWeb}
        label='Search Spotify'
        @click=${() => this.onSectionClick(Section.SEARCH_MEDIA)}
        selected=${this.getSectionSelected(Section.SEARCH_MEDIA)}
        hide=${this.getSectionEnabled(Section.SEARCH_MEDIA)}
      ></ha-icon-button>
    `;
  }


  /**
   * Style definitions used by this card section.
   */
  static get styles() {
    return css`
      :host > *[selected] {
        color: var(--dark-primary-color);
      }

      :host > *[hide] {
        display: none;
      }

      .ha-icon-button {
        --mwc-icon-button-size: 3rem;
        --mwc-icon-size: 2rem;
      }
    `;
  }


  /**
   * Handles the `click` event fired when a section icon is clicked.
   * 
   * @param section Event arguments.
   */
  private onSectionClick(section: Section) {

    this.dispatchEvent(customEvent(SHOW_SECTION, section));

  }


  /**
   * Checks to see if a section is active or not, and returns true for the specified
   * section if it's the active section.  This is what shows the selected section
   * in the footer area.
   * 
   * @param section Section identifier to check.
   */
  private getSectionSelected(section: Section | typeof nothing) {

    return this.section === section || nothing;

  }


  /**
   * Returns nothing if the specified section value is NOT enabled in the configuration,
   * which will cause the section icon to be hidden (via css styling).
   * 
   * @param section Section identifier to check.
   */
  private getSectionEnabled(searchElement: Section) {

    return (this.config.sections && !this.config.sections?.includes(searchElement)) || nothing;

  }
}
