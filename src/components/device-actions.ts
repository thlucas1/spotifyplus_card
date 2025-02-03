// lovelace card imports.
import { css, html, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map.js';
import {
  mdiDotsHorizontal,
  mdiLanConnect,
  mdiLanDisconnect,
} from '@mdi/js';

// our imports.
import { sharedStylesGrid } from '../styles/shared-styles-grid';
import { sharedStylesMediaInfo } from '../styles/shared-styles-media-info';
import { sharedStylesFavActions } from '../styles/shared-styles-fav-actions';
import { FavActionsBase } from './fav-actions-base';
import { Section } from '../types/section';
import { MediaPlayer } from '../model/media-player';
import { copyToClipboard, getHomeAssistantErrorMessage } from '../utils/utils';
import { ISpotifyConnectDevice } from '../types/spotifyplus/spotify-connect-device';

/**
 * Device actions.
 */
enum Actions {
  DeviceDisconnect = "DeviceDisconnect",
  DeviceConnect = "DeviceConnect",
  DeviceGetInfo = "DeviceGetInfo",
}


class DeviceActions extends FavActionsBase {

  // public state properties.
  @property({ attribute: false }) mediaItem!: ISpotifyConnectDevice;

  // private state properties.
  @state() private deviceInfo?: ISpotifyConnectDevice;


  /**
   * Initializes a new instance of the class.
   */
  constructor() {

    // invoke base class method.
    super(Section.DEVICES);

  }


 /**
  * Invoked on each update to perform rendering tasks. 
  * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
  * Setting properties inside this method will *not* trigger the element to update.
  */
  protected override render(): TemplateResult | void {

    // invoke base class method.
    super.render();

    // if device info not set, then use media item that was passed from fav-browser
    // for the initial display.
    if (!this.deviceInfo) {
      this.deviceInfo = this.mediaItem;
    }

    // set Spotify Connect device list status indicator.
    const deviceListClass = (this.deviceInfo?.IsInDeviceList) ? "device-list-in" : "device-list-out";

    // define dropdown menu actions - artist.
    const actionsDeviceHtml = html`
      <ha-md-button-menu slot="selection-bar" positioning="popover">
        <ha-assist-chip slot="trigger">
          <ha-svg-icon slot="icon" .path=${mdiDotsHorizontal}></ha-svg-icon>
        </ha-assist-chip>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.DeviceConnect)}>
          <ha-svg-icon slot="start" .path=${mdiLanConnect}></ha-svg-icon>
          <div slot="headline">Connect / Login to this device</div>
        </ha-md-menu-item>
        <ha-md-menu-item @click=${() => this.onClickAction(Actions.DeviceDisconnect)}>
          <ha-svg-icon slot="start" .path=${mdiLanDisconnect}></ha-svg-icon>
          <div slot="headline">Disconnect / Logout from this device</div>
        </ha-md-menu-item>
      </ha-md-button-menu>
      `;

    // render html.
    return html` 
      <div class="device-actions-container">
        ${this.alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this.alertErrorClear}>${this.alertError}</ha-alert>` : ""}
        ${this.alertInfo ? html`<ha-alert alert-type="info" dismissable @alert-dismissed-clicked=${this.alertInfoClear}>${this.alertInfo}</ha-alert>` : ""}
        <div class="media-info-content">
          <div class="img" style=${this.styleMediaBrowserItemImage(this.deviceInfo?.image_url)}></div>
          <div class="media-info-details">
            <div class="media-info-text-ms-c">
              ${this.deviceInfo?.Name}
              <span class="actions-dropdown-menu padL">
                ${actionsDeviceHtml}
              </span>
            </div>
            <div class="media-info-text-ms">${this.deviceInfo?.DeviceInfo.BrandDisplayName}</div>
            <div class="media-info-text-s">${this.deviceInfo?.DeviceInfo.ModelDisplayName}</div>
            ${(this.deviceInfo?.IsSonos) ? html`
              <div class="media-info-text-s padT">
                Sonos device (will not appear in Spotify Web API device list)
              </div>
            ` : ""}
            ${(this.deviceInfo?.IsChromeCast) ? html`
              <div class="media-info-text-s padT">
                Chromecast device
              </div>
            ` : ""}
          </div>
        </div>
        <div class="grid-container-scrollable">
          <div class="grid device-grid">
            
            <div class="grid-action-info-hdr-s">Device ID</div>
            <div class="grid-action-info-text-s copy2cb" @click=${copyToClipboard}>${this.deviceInfo?.DeviceInfo.DeviceId}</div>
                    
            <div class="grid-action-info-hdr-s">Device Name</div>
            <div class="grid-action-info-text-s copy2cb" @click=${copyToClipboard}>${this.deviceInfo?.DiscoveryResult.DeviceName}</div>
            
            <div class="grid-action-info-hdr-s">Device Type</div>
            <div class="grid-action-info-text-s">${this.deviceInfo?.DeviceInfo.DeviceType}</div>
                    
            <div class="grid-action-info-hdr-s">Product ID</div>
            <div class="grid-action-info-text-s">${this.deviceInfo?.DeviceInfo.ProductId}</div>
                    
            <div class="grid-action-info-hdr-s">Voice Support?</div>
            <div class="grid-action-info-text-s">${this.deviceInfo?.DeviceInfo.VoiceSupport}</div>

            <div class="grid-action-info-hdr-s">IP DNS Alias</div>
            <div class="grid-action-info-text-s copy2cb" @click=${copyToClipboard}>${this.deviceInfo?.DiscoveryResult.Server}</div>
            
            <div class="grid-action-info-hdr-s">IP Address</div>
            <div class="grid-action-info-text-s copy2cb" @click=${copyToClipboard}>${this.deviceInfo?.DiscoveryResult.HostIpAddress}</div>
            
            <div class="grid-action-info-hdr-s">Zeroconf IP Port</div>
            <div class="grid-action-info-text-s copy2cb" @click=${copyToClipboard}>${this.deviceInfo?.DiscoveryResult.HostIpPort}</div>
            
            <div class="grid-action-info-hdr-s">Zeroconf CPath</div>
            <div class="grid-action-info-text-s copy2cb" @click=${copyToClipboard}>${this.deviceInfo?.DiscoveryResult.SpotifyConnectCPath}</div>

            <div class="grid-action-info-hdr-s">Is Dynamic Device?</div>
            <div class="grid-action-info-text-s">${this.deviceInfo?.DiscoveryResult.IsDynamicDevice}</div>

            <div class="grid-action-info-hdr-s">Is in Device List?</div>
            <div class="grid-action-info-text-s ${deviceListClass}">${this.deviceInfo?.IsInDeviceList}</div>

            <div class="grid-action-info-hdr-s">Auth Token Type</div>
            <div class="grid-action-info-text-s copy2cb" @click=${copyToClipboard}>${this.deviceInfo?.DeviceInfo.TokenType}</div>
                    
            <div class="grid-action-info-hdr-s">Client ID</div>
            <div class="grid-action-info-text-s copy2cb" @click=${copyToClipboard}>${this.deviceInfo?.DeviceInfo.ClientId}</div>

            <div class="grid-action-info-hdr-s">Library Version</div>
            <div class="grid-action-info-text-s copy2cb" @click=${copyToClipboard}>${this.deviceInfo?.DeviceInfo.LibraryVersion}</div>

            <div class="grid-action-info-hdr-s">Active User</div>
            <div class="grid-action-info-text-s copy2cb" @click=${copyToClipboard}>${this.deviceInfo?.DeviceInfo.ActiveUser}</div>

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

      .device-actions-container {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;  
      }

      .device-grid {
        grid-template-columns: auto auto;
        justify-content: left;
      }

      .device-list-in {
        color: limegreen;
        font-weight: bold;
      }

      .device-list-out {
        color: red;
        font-weight: bold;
      }

      /* reduce image size for device */
      .media-info-content .img {
        background-size: cover !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        mask-repeat: no-repeat !important;
        mask-position: center !important;
        max-width: 100px;
        min-height: 100px;
        border-radius: var(--control-button-border-radius, 10px) !important;
      }

      .padT {
        padding-top: 0.2rem;
      }

      .padL {
        padding-left: 0.2rem;
      }

      .copy2cb:hover {
        cursor: copy;
      }

      /* style ha-alert controls */
      ha-alert {
        display: block;
        margin-bottom: 0.25rem;
      }

    `
    ];
  }


  /**
   * Style definition used to style a media browser item background image.
   */
  protected styleMediaBrowserItemImage(thumbnail: string | undefined) {

    // build style info object.
    // if thumbnail contains an svg icon, then use a mask; otherwise, use a background-image.
    // this allows the user to theme the svg icon color.
    const styleInfo: StyleInfo = <StyleInfo>{};
    if (thumbnail?.includes("svg+xml")) {
      styleInfo['mask-image'] = `url(${thumbnail})`;
      styleInfo['background-color'] = `var(--spc-media-browser-items-svgicon-color, #2196F3)`;
    } else {
      styleInfo['background-image'] = `url(${thumbnail})`;
      styleInfo['background-color'] = `var(--spc-media-browser-items-svgicon-color, transparent)`;
    }
    return styleMap(styleInfo);

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
      // nothing to process.

      // show progress indicator.
      this.progressShow();

      // call service based on requested action, and refresh affected action component.
      if (action == Actions.DeviceConnect) {

        if (this.deviceInfo?.DiscoveryResult.IsDynamicDevice) {

          // if dynamic device, then it cannot be managed.
          this.alertInfoSet("Dynamic devices cannot be managed.");
          this.progressHide();

        } else if (this.mediaItem.IsChromeCast) {

          // chromecast devices do not support Spotify Connect Connect.
          this.alertInfoSet("Chromecast devices do not support Spotify Connect connect.");
          this.progressHide();

        } else {

          // connect the device.
          this.alertInfoSet("Connecting to Spotify Connect device ...");
          await this.spotifyPlusService.ZeroconfDeviceConnect(this.player, this.mediaItem, null, null, null, true, true, 1.0);
          this.alertInfoSet("Spotify Connect device should be connected.");
          this.updateActions(this.player, [Actions.DeviceGetInfo]);

        }

      } else if (action == Actions.DeviceDisconnect) {

        if (this.mediaItem.DiscoveryResult.IsDynamicDevice) {

          // if dynamic device, then it cannot be managed.
          this.alertInfoSet("Dynamic devices cannot be managed.");
          this.progressHide();

        } else if (this.mediaItem.IsChromeCast) {

          // chromecast does not support Spotify Connect disconnect.
          this.alertInfoSet("Chromecast devices do not support Spotify Connect disconnect.");
          this.progressHide();

        } else if (this.mediaItem.DeviceInfo.BrandDisplayName == 'librespot') {

          // librespot does not support Spotify Connect disconnect.
          this.alertInfoSet("Librespot devices do not support Spotify Connect disconnect.");
          this.progressHide();

        } else {

          // disconnect the device.
          this.alertInfoSet("Disconnecting from Spotify Connect device ...");
          await this.spotifyPlusService.ZeroconfDeviceDisconnect(this.player, this.mediaItem, 1.0);
          this.alertInfoSet("Spotify Connect device was disconnected.");
          this.updateActions(this.player, [Actions.DeviceGetInfo]);

        }

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
    finally {
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

      const promiseRequests = new Array<Promise<unknown>>();

      // was this action chosen to be updated?
      if (updateActions.indexOf(Actions.DeviceGetInfo) != -1) {

        // create promise for this action.
        const promiseDeviceGetInfo = new Promise((resolve, reject) => {

          // update status.
          this.alertInfo = "Retrieving Spotify Connect status for \"" + this.mediaItem.Name + "\" ...";

          // set service parameters.
          const refresh_device_list = true;
          const activate_device = false;

          // get Spotify Connect device info.
          this.spotifyPlusService.GetSpotifyConnectDevice(player, this.mediaItem.Id, null, null, refresh_device_list, activate_device)
            .then(device => {

              // clear certain info messsages if they are temporary.
              if (this.alertInfo?.startsWith("Retrieving ")) {
                this.alertInfoClear();
              }

              // stash the result into state, and resolve the promise.
              // we will also update the mediaItem with the latest info, in case it changed.
              this.deviceInfo = device;
              if (device) {
                //console.log("updateActions - updating mediaItem:\n%s", JSON.stringify(device, null, 2));
                this.mediaItem = device;
                //this.mediaItem.DeviceInfo = device.DeviceInfo;
                //this.mediaItem.DiscoveryResult = device.DiscoveryResult;
              }
              resolve(true);

            })
            .catch(error => {

              // clear results, and reject the promise.
              this.deviceInfo = undefined;
              this.alertErrorSet("Get Spotify Connect Device failed: " + getHomeAssistantErrorMessage(error));
              reject(error);

            })
        });

        promiseRequests.push(promiseDeviceGetInfo);
      }

      // show visual progress indicator.
      this.progressShow();

      // execute all promises, and wait for all of them to settle.
      // we use `finally` logic so we can clear the progress indicator.
      // any exceptions raised should have already been handled in the 
      // individual promise definitions; nothing else to do at this point.
      Promise.allSettled(promiseRequests).finally(() => {

        // clear the progress indicator.
        this.progressHide();

      });
      return true;

    }
    catch (error) {

      // clear the progress indicator and set alert error message.
      this.progressHide();
      this.alertErrorSet("Update device actions failed: " + getHomeAssistantErrorMessage(error));
      return true;

    }
    finally {
    }
  }

}


customElements.define('spc-device-actions', DeviceActions);