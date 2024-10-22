import { IFollowers } from './followers';
import { IPlaylistPage } from './playlist-page';
import { IPlaylistSimplified } from './playlist-simplified';
import { ITrack } from './track';

import { GetPlaylistPageTracks } from './playlist-page';

/**
 * Spotify Web API Playlist object.
 */
export interface IPlaylist extends IPlaylistSimplified {


  /** 
   * Information about the followers of the playlist.
   */
  followers: IFollowers;


  /** 
   * The tracks of the playlist.
   * 
   * This is a `PlaylistPage` object, meaning only 50 tracks max are listed per request.
   */
  tracks: IPlaylistPage;

}


/**
 * Gets a list of all tracks contained in the underlying `Tracks.Items` list.
 *
 * This is a convenience method so one does not have to loop through the `Tracks.Items`
 * array of PlaylistPage objects to get the list of tracks.
 * 
 * @returns An array of `PlaylistTrack` objects that exist in the collection; otherwise, an empty array.
 */
export function GetPlaylistTracks(playlist: IPlaylist | undefined): Array<ITrack> {

  //console.log("GetTracks (playlist)\n- pages:\n%s",
  //  JSON.stringify(page),
  //);

  let result = new Array<ITrack>();
  if (playlist) {
    if (playlist.tracks) {
      result = GetPlaylistPageTracks(playlist.tracks)
    }
  }

  //console.log("GetTracks (playlist)\n- tracks (result):\n%s",
  //  JSON.stringify(result),
  //);

  return result
}
