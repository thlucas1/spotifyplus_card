import { IChapterSimplified } from './chapter-simplified';
import { IAudiobookSimplified } from './audiobook-simplified';

/**
 * Spotify Web API Chapter object.
 */
export interface IChapter extends IChapterSimplified {


  /**
   * The audiobook for which the chapter belongs.
   * 
   * This is a `IAudiobookSimplified` object.
   */
  audiobook: IAudiobookSimplified;

}
