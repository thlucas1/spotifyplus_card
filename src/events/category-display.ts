import { DOMAIN_SPOTIFYPLUS } from '../constants';

/** 
 * Uniquely identifies the event. 
 * */
export const CATEGORY_DISPLAY = DOMAIN_SPOTIFYPLUS + '-card-category-display';


/**
 * Event arguments.
 */
export class CategoryDisplayEventArgs {

  /**
   * Criteria used to filter the category entries
   */
  public filterCriteria: string;

  /**
   * Title to search for.
   */
  public title: string | undefined | null;

  /**
   * Uri to search for.
   */
  public uri: string | undefined | null;

  /**
   * Initializes a new instance of the class.
   * 
   * @param filterCriteria Criteria used to filter the category entries.
   * @param title Title to search for.
   * @param uri Uri to search for.
   */
  constructor(
    filterCriteria: string | undefined | null = null,
    title: string | undefined | null = null,
    uri: string | undefined | null = null,
  ) {
    this.filterCriteria = filterCriteria || "";
    this.title = title || "";
    this.uri = uri || "";
  }
}


/**
 * Event constructor.
 * 
 * @param filterCriteria Criteria used to filter the category entries.
 * @param title Title to search for.
 * @param uri Uri to search for.
 */
export function CategoryDisplayEvent(
  filterCriteria: string | undefined | null,
  title: string | undefined | null = null,
  uri: string | undefined | null = null,
) {

  const args = new CategoryDisplayEventArgs();
  args.filterCriteria = (filterCriteria || "").trim();
  args.title = title || "";
  args.uri = uri || "";

  return new CustomEvent(CATEGORY_DISPLAY, {
    bubbles: true,
    composed: true,
    detail: args,
  });
}
