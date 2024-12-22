import { DOMAIN_SPOTIFYPLUS } from '../constants';

/** 
 * Uniquely identifies the event. 
 * */
export const FILTER_SECTION_MEDIA = DOMAIN_SPOTIFYPLUS + '-card-filter-section-media';


/**
 * Event arguments.
 */
export class FilterSectionMediaEventArgs {

  /**
   * Section type to filter.
   */
  public section: string;

  /**
   * Filter criteria.
   */
  public filterCriteria: string;


  /**
   * Initializes a new instance of the class.
   * 
   * @param section Section to be filtered.
   * @param filterCriteria Filter criteria that will be applied to the specified filter section.
   */
  constructor(
    section: string | undefined | null,
    filterCriteria: string | undefined | null = null,
  ) {
    this.section = section || "";
    this.filterCriteria = filterCriteria || "";
  }
}


/**
 * Event constructor.
 * 
 * @param section Section to be filtered.
 * @param filterCriteria Filter criteria that will be applied to the specified filter section.
 */
export function FilterSectionMediaEvent(
  section: string | undefined | null,
  filterCriteria: string | undefined | null,
) {

  const args = new FilterSectionMediaEventArgs(section);
  args.filterCriteria = (filterCriteria || "").trim();

  return new CustomEvent(FILTER_SECTION_MEDIA, {
    bubbles: true,
    composed: true,
    detail: args,
  });
}
