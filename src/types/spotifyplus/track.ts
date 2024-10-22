import { IAlbum } from './album';
import { IExternalUrls } from './external-urls';
import { ITrackSimplified } from './track-simplified';

/**
 * Spotify Web API Track object.
 */
export interface ITrack extends ITrackSimplified {


  /** 
   * The album on which the track appears.
   * 
   * The album object includes a link in href to full information about the album.
   */
  album: IAlbum;


  /** 
   * Known external id's for the album.
   */
  external_ids: IExternalUrls;


  /**
   * The first image url in the album `Images` list, if images are defined;
   * otherwise, null.
   */
  image_url?: string | undefined;


  /** 
   * The popularity of the track.
   * 
   * The value will be between 0 and 100, with 100 being the most popular.
   */
  popularity: number;

}

//    @property
//    def ImageUrl(self) -> str:
//        """
//        Gets the first image url in the album `Images` list, if images are defined;
//        otherwise, null.
//        """
//        if self._Album is not None:
//            return self._Album.ImageUrl
//        return None
