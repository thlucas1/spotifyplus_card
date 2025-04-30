// lovelace card imports.
import { css, html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';

// our imports.
import { BaseEditor } from './base-editor';
import { CardConfig } from '../types/card-config';


class Form extends BaseEditor {

  @property({ attribute: false }) schema!: unknown;
  @property({ attribute: false }) data!: unknown;
  @property() changed!: (ev: CustomEvent) => void;
  @property() isRenderRootStylesUpdated!: boolean;

  /** query selector for the currently selected <ha-form> element. */
  @query("#elmHaForm") private _elmHaForm!: LitElement;


  /**
   * Invoked on each update to perform rendering tasks. 
   * 
   * This method may return any value renderable by lit-html's `ChildPart` (typically a `TemplateResult`). 
   * Setting properties inside this method will *not* trigger the element to update.
  */
  protected render(): TemplateResult {

    // style renderRoot elements.
    this._styleRenderRootElements();

    // render the control.
    return html`
      <ha-form id="elmHaForm"
        .data=${this.data || this.config}
        .schema=${this.schema}
        .computeLabel=${formatLabel}
        .hass=${this.hass}
        @value-changed=${this.changed || this.onValueChanged}
      ></ha-form>
    `;
  }


  /**
   * Style definitions used by this TemplateResult.
   */
  static get styles() {
    return css`

  //    #elmHaForm::part(root) {
  //      border: 1px solid gold !important;
  //    }

      //ha-md-menu-item[type="option"] {
      //  border: 1px solid red;
      //  height: 2.5rem !important;
      //}

    `;
  }


  /**
   * Called when the element has rendered for the first time. Called once in the
   * lifetime of an element. Useful for one-time setup work that requires access to
   * the DOM.
   */
  protected firstUpdated(changedProperties: PropertyValues): void {

    // invoke base class method.
    super.firstUpdated(changedProperties);

    // if renderRoot elements were not styled, then request another update.
    if (!this.isRenderRootStylesUpdated) {
      this.requestUpdate();
    }

  }


  /**
   * Handles a "value-changed" event.
   * This event is raised whenever a form value is changed in the UI.
   */
  protected onValueChanged(args: CustomEvent): void {

    //console.log("onValueChanged (editor-form) - event:\n%s",
    //  JSON.stringify(args,null,2)
    //);

    // get the updated changes from event details.
    const changedConfig = (args.detail.value as CardConfig);

    // call configuration changed method to update the existing config with our changes,
    // fire an event that something has changed, and re-render the card preview.
    this.configChanged(changedConfig);

  }


  /**
   * Styles all renderRoot elements under the <ha-form> element to make them
   * more compact and remove wasted space.
   */
  private _styleRenderRootElements() {

    // have we already updated the renderRoot styles?
    if (this.isRenderRootStylesUpdated) {
      return;
    }

    // <ha-form> element may not be present when the configuration editor is initially displayed.
    // we have to wait for a section to be displayed first.
    if (!this._elmHaForm) {
      this.requestUpdate();
      return;
    }

    // if shadowRoot has not updated yet then we can't do anything.
    if (!this._elmHaForm.shadowRoot) {
      this.requestUpdate();
      return;
    }

    // if <ha-form> has not completely updated yet then we can't do anything.
    if (!this._elmHaForm?.updateComplete) {
      this.requestUpdate();
      return;
    }

    // if <ha-form> has not completely updated yet then we can't do anything.
    // has renderRoot happened yet?  if not, then don't bother!
    if (!this.hasUpdated) {
      this.requestUpdate();
      return;
    }

    // get all controls defined to the root <div> element.
    const root = this._elmHaForm.renderRoot.querySelector(".root");
    if (!root) {
      //console.log("_styleRenderRootElements (editor-form) - this._elmHaForm.renderRoot.querySelector('.root') is undefined");
    } else {

      // process all child elements of the root.
      for (let idx = 0; idx < root.children.length; idx++) {

        const child = root.children[idx];

        // only need to process specified tagNames.
        // other tagnames may need to be added, as we only use a small set of the allowed controls.
        if (child.tagName == "HA-FORM-STRING") {
          child.setAttribute("style", "margin-bottom: var(--ha-form-style-string-margin-bottom, 24px);");

        } else if (child.tagName == "HA-SELECTOR") {
          child.setAttribute("style", "margin-bottom: var(--ha-form-style-selector-margin-bottom, 24px);");

          // HA-SELECTOR elements can have different underlying types (HA-SELECTOR-BOOLEAN, etc).
          // we will style the underlying type based on its tagName.
          const grandChild = root.children[idx].shadowRoot?.firstElementChild;
          if (grandChild) {

            //console.log("HA-SELECTOR child shadowRoot firstElementChild tagName = %s", JSON.stringify(grandChild.tagName));
            if (grandChild.tagName == "HA-SELECTOR-BOOLEAN") {
              const haFormField = grandChild.shadowRoot?.firstElementChild;
              //console.log("HA-SELECTOR-BOOLEAN first element = %s", JSON.stringify(haFormField?.tagName));
              if (haFormField?.tagName == "HA-FORMFIELD") {
                haFormField.setAttribute("style", "min-height: var(--ha-form-style-selector-boolean-min-height, 56px);");
              } else {
                console.log("%c HA-SELECTOR underlying type was not styled: %s", "color:red", child.tagName);
              }
            }

          } else {
            //console.log("_styleRenderRootElements (editor-form) - HA-SELECTOR firstElementChild has no shadowRoot!");
          }

        } else if (child.tagName == "HA-FORM-MULTI_SELECT") {
          child.setAttribute("style", "margin-bottom: var(--ha-form-style-multiselect-margin-bottom, 24px);");

        } else if (child.tagName == "HA-FORM-SELECT") {
          child.setAttribute("style", "margin-bottom: var(--ha-form-style-multiselect-margin-bottom, 24px); --mdc-menu-item-height: 2.5rem;");

        } else if (child.tagName == "HA-FORM-INTEGER") {
          child.setAttribute("style", "margin-bottom: var(--ha-form-style-integer-margin-bottom, 24px);");

        } else {
          console.log("%c _styleRenderRootElements (editor-form) - did not style %s element", "color:red", child.tagName);
        }
      }

      // set a timeout to re-apply styles in a few milliseconds, as some of the shadowRoot
      // elements may not have completed updating when the first render was ran.
      // we will also indicate that styles have been updated, so we don't do it again.
      setTimeout(() => {
        this._styleRenderRootElements();
        this.isRenderRootStylesUpdated = true;
      }, 50);

      // request an update to render the changes.
      this._elmHaForm.requestUpdate();
    }
  }

}


/**
 * Formats labels for each editable field in the supplied schema.  
 * 
 * It uses the value assigned to the "label" key as the title by default.
 * If a label key is not supplied, then it uses the value assigned to the "name" key, 
 * and converts it to proper-case (e.g. "myFieldName" returns "My Field Name").
 * 
 * If a "help" key value is supplied, then it adds the value to the label surrounded
 * by parenthesis (e.g. "My Field Name (this is the help value)".
 */
export function formatLabel({ help, label, name }: { name: string; help: string; label: string }) {

  // if label was supplied then just use it as-is.
  if (label) {
    return label + (help ? ` (${help})` : '');
  }

  // otherwise use the proper-case value of the name.
  let unCamelCased = name.replace(/([A-Z])/g, ' $1');
  unCamelCased = unCamelCased.charAt(0).toUpperCase() + unCamelCased.slice(1);

  // if help key supplied, then add the help value in parenthesis.
  return unCamelCased + (help ? ` (${help})` : '');
}


customElements.define('spc-editor-form', Form);
