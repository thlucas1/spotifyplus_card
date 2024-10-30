## Change Log

All notable changes to this project are listed here.  

Change are listed in reverse chronological order (newest to oldest).  

<span class="changelog">

###### [ 1.0.9 ] - 2024/10/30

  * This release requires the SpotifyPlus v1.0.63 release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Added `searchMediaBrowserSearchTypes` config option to enable / disable selected search types.
  * Added `playerControlsHidePlayQueue` config option to enable / disable play queue information area.

###### [ 1.0.8 ] - 2024/10/27

  * Added exception processing for various media controls: seek, volume set, mute.
  * Fixed code in the `buildMediaBrowserItems` method that was causing exceptions to be logged for null content.

###### [ 1.0.7 ] - 2024/10/25

  * Added an outline to the player progress bar.
  * Fixed background color of card title when player is turned off.

###### [ 1.0.6 ] - 2024/10/24

  * Updated `fav-browser-base` to check for the existence of `search-input-outlined` and `ha-md-button-menu` controls in the `customElements` array, and force a load of the controls if they are not present.  These controls may not be loaded by default when a page refresh (F5) occurs, so they must be forced to load in order to render correctly on the page.
  * Updated README documentation.
  * Cleaned up documentation images, and re-organized the media files in the `images` folder.

###### [ 1.0.5 ] - 2024/10/23

  * Updated README.md with lastest form examples.

###### [ 1.0.4 ] - 2024/10/23

  * Added debug logging instructions to console.log version information.

###### [ 1.0.3 ] - 2024/10/23

  * Changed all references of "spotifyplus-card.js" to "spotifyplus_card.js" to match github repository name.

###### [ 1.0.2 ] - 2024/10/23

  * Version 1 initial release.

</span>