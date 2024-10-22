/**
 * Spotify Web API Content Copyright object.
 * 
 * Contains information about content copyrights.
 */
export interface ICopyright {


  /** 
   * The copyright text for this content.
   */
  text: string;


  /**
   * The type of copyright: C = the copyright, P = the sound recording (performance) copyright.
   */
  type: string;

}


/**
 * Gets a user-friendly description of the `copyrights` object(s).
 * 
 * @param mediaItem Media item that contains a copyrights property.
 * @returns A string that contains a user-friendly description of the copyrights.
 */
export function GetCopyrights(mediaItem: any | undefined, delimiter: string): string {

  if (delimiter == null)
    delimiter = "; ";

  let result = "";
  if (mediaItem) {
    for (const item of mediaItem.copyrights || []) {
      if ((item != null) && (item.text != null) && (item.text.length > 0)) {
        if (result.length > 0)
          result += delimiter;
        result += item.text;
      }
    }
  }

  return result
}
