import { formatDateHHMMSSFromMilliseconds } from "../../utils/utils";

/**
 * Spotify Web API Content ResumePoint object.
 * 
 * Contains information about the user's most recent position in the episode.
 */
export interface IResumePoint {

  /** 
   * Whether or not the episode has been fully played by the user.
   */
  fully_played: boolean;


  /** 
   * The user's most recent position in the episode in milliseconds.
   */
  resume_position_ms: number;

}


/**
 * Gets a user-friendly description of the object.
 * 
 * @returns A string that contains a user-friendly description of the object.
 */
export function GetResumeInfo(item: IResumePoint | undefined): string {

  let result = "";
  if (item) {
    if (item.fully_played) {
      result = "completed";
    } else if ((item.resume_position_ms || 0) == 0) {
      result = "starts at beginning";
    } else {
      result = "resumes at " + formatDateHHMMSSFromMilliseconds(item.resume_position_ms || 0);
    }
  }
  return result
}
