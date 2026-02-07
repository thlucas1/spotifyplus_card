// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import copyTextToClipboard from 'copy-text-to-clipboard';
import {
  mdiDotsHorizontal,
  mdiTrashCan,
} from '@mdi/js';

// our imports.
import { sharedStylesGrid } from '../styles/shared-styles-grid.js';
import { sharedStylesMediaInfo } from '../styles/shared-styles-media-info.js';
import { sharedStylesFavActions } from '../styles/shared-styles-fav-actions.js';
import { getHomeAssistantErrorMessage } from '../utils/utils.js';
import { FavActionsBase } from './fav-actions-base';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { IUserPreset } from '../types/spotifyplus/user-preset';
import { updateCardConfigurationStorage } from '../utils/lovelace-config-util.js';
import { Store } from '../model/store.js';
import { ConfigArea } from '../types/config-area.js';

/**
 * UserPreset actions.
 */
enum Actions {
  UserPresetRemove = "UserPresetRemove",
}


class UserPresetActions extends FavActionsBase {

  // public state properties.
  @property({ attribute: false }) mediaItem!: IUserPreset;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.USERPRESETS);

  }


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected override render(): TemplateResult | void {

    // invoke base class method.
    super.render();

    // define dropdown menu actions - userpreset.
    const actionsUserPresetHtml = html`
      <ha-dropdown slot="actionItems">
        <ha-icon-button
          slot="trigger"
          .label="UserPreset Actions"
          .path=${mdiDotsHorizontal}
        ></ha-icon-button>
        <ha-dropdown-item @click=${() => this.onClickAction(Actions.UserPresetRemove)}>
          <ha-svg-icon slot="icon" .path=${mdiTrashCan}></ha-svg-icon>
          Remove User Preset Item
        </ha-dropdown-item>
      </ha-md-button-menu>
      `;

    // render html.
    return html` 
      <div class="userpreset-actions-container">
        ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
        ${this.alertInfo ? html`<ha-alert alert-type="info" dismissable @alert-dismissed-clicked=${this.alertInfoClear}>${this.alertInfo}</ha-alert>` : ""}
        <div class="media-info-content">
          <div class="img copy2cb" style="background:url(${this.mediaItem.image_url});" @click=${() => copyTextToClipboard(this.mediaItem.image_url || '')}></div>
          <div class="media-info-details">
            <div class="grid userpreset-info-grid">
              <div class="grid-action-info-hdr-s">Name</div>
              <div class="grid-action-info-text-s">${this.mediaItem.name}</div>

              <div class="grid-action-info-hdr-s">Sub-Title</div>
              <div class="grid-action-info-text-s">${this.mediaItem.subtitle}</div>

              <div class="grid-action-info-hdr-s">Type</div>
              <div class="grid-action-info-text-s">${this.mediaItem.type}</div>

              <div class="grid-action-info-hdr-s">URI</div>
              <div class="grid-action-info-text-s">${this.mediaItem.uri}</div>

              <div class="grid-action-info-hdr-s">Origin</div>
              <div class="grid-action-info-text-s">${this.mediaItem.origin}</div>

            </div>
            <div class="media-info-text-ms-c pad-top">
              <span class="actions-dropdown-menu">
                ${actionsUserPresetHtml}
              </span>
            </div>
          </div>
        </div>
      </div>`;
  }


  /**
   * style definitions used by this component.
   * */
  static get styles() {
    return [
      sharedStylesGrid,
      sharedStylesMediaInfo,
      sharedStylesFavActions,
      css`

      .userpreset-info-grid {
        grid-template-columns: auto auto;
        justify-content: left;
      }

      .userpreset-actions-container {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;  
      }

      .pad-top {
        padding-top: 0.50rem;
      }
    `
    ];
  }


  /**
   * Handles the `click` event fired when a control icon is clicked.
   * 
   * @param action Action to execute.
   * @param args Action arguments.
   */
  protected override async onClickAction(action: Actions): Promise<boolean> {

    // if card is being edited, then don't bother.
    if (this.isCardInEditPreview) {
      return true;
    }

    try {

      // process actions that don't require a progress indicator.
      // n/a

      // show progress indicator.
      this.progressShow();

      // call service based on requested action, and refresh affected action component.
      if (action == Actions.UserPresetRemove) {

        // if preset is not in the card config, then we can't do it.
        if (this.mediaItem.origin != "card config") {
          this.progressHide();
          this.alertInfoSet("JSON File preset items must be removed via a file editor, since they may affect other card configurations.");
          return true;
        }

        // remove user preset from card configuration.
        const presets = this.store.config.userPresets || [];
        for (let i = presets.length - 1; i >= 0; i--) {
          if ((presets[i].name == this.mediaItem.name) && (presets[i].subtitle == this.mediaItem.subtitle) && ((presets[i].image_url || "") == (this.mediaItem.image_url || ""))) {
            presets.splice(i, 1);
            break;
          }
        }

        // update configuration with changes.
        this.store.config.userPresets = presets;
        await updateCardConfigurationStorage(this.store.config);
        this.progressHide();

        // re-select the userpreset browser for display; otherwise, the player section 
        // is automatically selected when the configuration is reloaded.
        Store.selectedConfigArea = ConfigArea.USERPRESET_BROWSER;

        this.alertInfoSet("User Preset was removed: \"" + this.mediaItem.name + "\".");

      } else {

        // no action selected - hide progress indicator.
        this.progressHide();

      }

      return true;
    }
    catch (error) {

      // clear the progress indicator and set alert error message.
      this.progressHide();
      this.alertErrorSet("Action failed: " + getHomeAssistantErrorMessage(error));
      return true;

    }
  }


  /**
   * Updates body actions.
   * 
   * @param player Media player instance that will process the update.
   * @param updateActions List of actions that need to be updated, or an empty list to update DEFAULT actions.
   * @returns True if actions update should continue after calling base class method; otherwise, False to abort actions update.
   */
  protected override updateActions(
    player: MediaPlayer,
    updateActions: any[],
  ): boolean {

    // invoke base class method; if it returns false, then we should not update actions.
    if (!super.updateActions(player, updateActions)) {
      return false;
    }

    try {

      // no actions to update for this media type.
      return true;

    }
    catch (error) {

      // clear the progress indicator and set alert error message.
      this.progressHide();
      this.alertErrorSet("UserPreset actions refresh failed: " + getHomeAssistantErrorMessage(error));
      return true;

    }
    finally {
    }
  }

}

customElements.define('spc-userpreset-actions', UserPresetActions);
