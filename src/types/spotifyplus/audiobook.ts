import { IAudiobookSimplified } from './audiobook-simplified';
import { IChapterPageSimplified } from './chapter-page-simplified';

/**
 * Spotify Web API Audiobook object.
 */
export interface IAudiobook extends IAudiobookSimplified {


  /**
   * The chapters of the audiobook.
   * 
   * This is a `IChapterPageSimplified` object.
   */
  chapters?: Array<IChapterPageSimplified>;

}
