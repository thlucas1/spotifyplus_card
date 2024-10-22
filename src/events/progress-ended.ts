import { DOMAIN_SPOTIFYPLUS } from '../constants';

/** 
 * Uniquely identifies the event. 
 * */
export const PROGRESS_ENDED = DOMAIN_SPOTIFYPLUS + '-card-progress-ended';


/**
 * Event constructor.
 */
export function ProgressEndedEvent() {

  // this event has no arguments.
  return new CustomEvent(PROGRESS_ENDED, {
    bubbles: true,
    composed: true,
    detail: {},
  });

}
