/**
 * Spotify Zeroconf API GetInfo Alias object.
 */
export interface IZeroconfGetInfoAlias {


  /** 
   * Unique identifier of the alias.
   */
  Id: string;


  /** 
   * True if the alias is a group; otherwise, False.
   */
  IsGroup: boolean;


  /** 
   * Display name of the alias.
   */
  Name: string;


  /** 
   * Alias name and id value (e.g. '"Bose-ST10-1" (30fbc80e35598f3c242f2120413c943dfd9715fe)').
   */
  Title: string;

}
