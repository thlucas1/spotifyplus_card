// lovelace card imports.
import { css, html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';

// our imports.
import { sharedStylesGrid } from '../styles/shared-styles-grid.js';
import { sharedStylesMediaInfo } from '../styles/shared-styles-media-info.js';
import { Store } from '../model/store';
import { ISpotifyConnectDevice } from '../types/spotifyplus/spotify-connect-device';


class DeviceActions extends LitElement {

  // public state properties.
  @property({ attribute: false }) store!: Store;
  @property({ attribute: false }) mediaItem!: ISpotifyConnectDevice;

  // private state properties.
  @state() private _alertError?: string;


  /**
   * Invoked on each update to perform rendering tasks. 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult | void {

    // render html.
    return html` 
      <div class="device-actions-container">
        ${this._alertError ? html`<ha-alert alert-type="error" dismissable @alert-dismissed-clicked=${this._alertErrorClear}>${this._alertError}</ha-alert>` : ""}
        <div class="media-info-content">
          <div class="img" style="background:url(${this.mediaItem.image_url});"></div>
          <div class="media-info-details">
            <div class="media-info-text-l">${this.mediaItem.Name}</div>
            <div class="media-info-text-m">${this.mediaItem.DeviceInfo.BrandDisplayName}</div>
            <div class="media-info-text-s">${this.mediaItem.DeviceInfo.ModelDisplayName}</div>
            <div class="media-info-text-s">Product ID: ${this.mediaItem.DeviceInfo.ProductId}</div>
          </div>
        </div>
        <div class="grid-container-scrollable">
          <div class="grid device-grid">
            
            <div class="grid-action-info-hdr-s">Device ID</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DeviceInfo.DeviceId}</div>
                    
            <div class="grid-action-info-hdr-s">Device Name</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DiscoveryResult.DeviceName}</div>
            
            <div class="grid-action-info-hdr-s">Device Type</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DeviceInfo.DeviceType}</div>
                    
            <div class="grid-action-info-hdr-s">IP DNS Alias</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DiscoveryResult.Server}</div>
            
            <div class="grid-action-info-hdr-s">IP Address</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DiscoveryResult.HostIpAddress}</div>
            
            <div class="grid-action-info-hdr-s">Zeroconf IP Port</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DiscoveryResult.HostIpPort}</div>
            
            <div class="grid-action-info-hdr-s">Zeroconf CPath</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DiscoveryResult.SpotifyConnectCPath}</div>

            <div class="grid-action-info-hdr-s">Is Dynamic Device?</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DiscoveryResult.IsDynamicDevice}</div>

            <div class="grid-action-info-hdr-s">Is in Device List?</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DeviceInfo.IsInDeviceList}</div>

            <div class="grid-action-info-hdr-s">Auth Token Type</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DeviceInfo.TokenType}</div>
                    
            <div class="grid-action-info-hdr-s">Client ID</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DeviceInfo.ClientId}</div>

            <div class="grid-action-info-hdr-s">Library Version</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DeviceInfo.LibraryVersion}</div>

            <div class="grid-action-info-hdr-s">Group Status</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DeviceInfo.GroupStatus}</div>

            <div class="grid-action-info-hdr-s">Voice Support?</div>
            <div class="grid-action-info-text-s">${this.mediaItem.DeviceInfo.VoiceSupport}</div>

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

      /* style ha-alert controls */
      ha-alert {
        display: block;
        margin-bottom: 0.25rem;
      }

    `
    ];
  }


  /**
   * Called when the element has rendered for the first time. Called once in the
   * lifetime of an element. Useful for one-time setup work that requires access to
   * the DOM.
   */
  protected firstUpdated(changedProperties: PropertyValues): void {

    // invoke base class method.
    super.firstUpdated(changedProperties);

  }


  /**
   * Clears the error alert text.
   */
  private _alertErrorClear() {
    this._alertError = undefined;
  }

}


customElements.define('spc-device-actions', DeviceActions);