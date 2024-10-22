import { DOMAIN_SPOTIFYPLUS } from '../constants';

/** 
 * Uniquely identifies the event. 
 * */
export const PROGRESS_STARTED = DOMAIN_SPOTIFYPLUS + '-card-progress-started';


/**
 * Event constructor.
 */
export function ProgressStartedEvent() {

  // this event has no arguments.
  return new CustomEvent(PROGRESS_STARTED, {
    bubbles: true,
    composed: true,
    detail: {},
  });

}
