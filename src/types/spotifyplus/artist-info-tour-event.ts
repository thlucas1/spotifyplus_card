/**
 * Artist Information Tour object.
 */
export interface IArtistInfoTourEvent {


  /** 
   * Date and time the tour event starts in the local timezone of the 
   * venue location, if supplied; otherwise, null.
   */
  event_datetime: Date | null;


  /** 
   * Link to the concert information, if supplied; otherwise, null.
   */
  href: string | null;


  /**
   * Title given to the event by the promoter, if supplied; otherwise, null.
   */
  title: string | null;


  /** 
   * The venue name of where the event will take place, if supplied; otherwise, null.
   */
  venue_name: string | null;

}
