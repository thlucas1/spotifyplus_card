import { DOMAIN_SPOTIFYPLUS } from '../constants';
import { Section } from '../types/section';

/** 
 * Uniquely identifies the event. 
 * */
export const EDITOR_CONFIG_AREA_SELECTED = DOMAIN_SPOTIFYPLUS + '-card-editor-config-area-selected';


/**
 * Event arguments.
 */
export class EditorConfigAreaSelectedEventArgs {

  // property storage.
  public section: Section;

  /**
   * Initializes a new instance of the class.
   *
   * @param section Section that was selected.
   */
  constructor(section?: Section) {

    this.section = section || Section.UNDEFINED;
  }
}


/**
 * Event constructor.
 */
export function EditorConfigAreaSelectedEvent(section:Section) {

  const args = new EditorConfigAreaSelectedEventArgs();
  args.section = section;

  return new CustomEvent(EDITOR_CONFIG_AREA_SELECTED, {
    bubbles: true,
    composed: true,
    detail: args,
  });
}
