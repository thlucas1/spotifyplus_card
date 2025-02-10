## Change Log

All notable changes to this project are listed here.  

Change are listed in reverse chronological order (newest to oldest).  

<span class="changelog">

###### [ 1.0.39 ] - 2025/02/09

  * Added card configuration option `albumFavBrowserShuffleOnPlay`; True to enable shuffle prior to starting play of the context; otherwise, False to start the context with the current shuffle mode.  
  * Added card configuration option `artistFavBrowserShuffleOnPlay`; True to enable shuffle prior to starting play of the context; otherwise, False to start the context with the current shuffle mode.  
  * Added card configuration option `playlistFavBrowserShuffleOnPlay`; True to enable shuffle prior to starting play of the context; otherwise, False to start the context with the current shuffle mode.  
  * Added theme variable `--spc-media-browser-items-list-color` and `mediaBrowserItemsListColor` card configuration option; Media browser items title and sub-title text colors when list is configured for non-icon format (default `#2196F3`).

###### [ 1.0.38 ] - 2025/02/07

  * Added card configuration option `searchMediaBrowserQueueSelection`; True to add track / episode to play queue when search result is clicked; Otherwise, false to play the track / episode immediately when track search result is clicked. Default is false.
  * Added theme variable `--spc-card-wait-progress-slider-color` and `cardWaitProgressSliderColor` card configuration option; Color of the card area wait progress indicator (default `#2196F3`).
  * Added theme variable `--spc-player-progress-label-color` and `playerProgressLabelColor` card configuration option; Color of the player progress text labels (default `#ffffff`).
  * Added theme variable `--spc-player-progress-slider-color` and `playerProgressSliderColor` card configuration option; Color of the player progress slider bar (default `#2196F3`).
  * Added theme variable `--spc-player-volume-label-color` and `playerVolumeLabelColor` card configuration option; Color of the player volume text labels (default `#ffffff`).
  * Added theme variable `--spc-player-volume-slider-color` and `playerVolumeSliderColor` card configuration option; Color of the player volume slider bar (default `#2196F3`).
  * Corrected a bug when displaying player queue; the queue would not render when it contained a mix of tracks, podcast episodes, and audiobook chapters.  Queue will now be displayed on the type of items in the queue, and not based on what the player is currently playing.

###### [ 1.0.37 ] - 2025/02/05

  * Updated favorite browsers to clear cached filter criteria if the filter criteria textbox was cleared.

###### [ 1.0.36 ] - 2025/02/02

  * Updated section filter criteria to include both the name and subtitle value when filtering the list of items.  This was applied to the following sections: Albums, Audiobooks, Episodes, UserPresets, and Tracks.
  * Added theme variable `--spc-media-browser-items-svgicon-color` and `mediaBrowserItemsSvgIconColor` card configuration option for styling media browser svg icon items color.
  * Added theme variable `--spc-player-controls-color` and `playerControlsColor` card configuration option; Color of the player media control labels (default `#ffffff`).
  * Added theme variable `--spc-player-controls-icon-color` and `playerControlsIconColor` card configuration option; Color of the player media control icons (default `#ffffff`).
  * Added theme variable `--spc-player-controls-icon-toggle-color` and `playerControlsIconToggleColor` card configuration option; Color of the player media control icons when they are toggled (default `#2196F3`).
  * Defaulted some theme variables so that card look and feel is ready to use.  Prior to this fix, some details would not show correctly out of the box (e.g. device names).

###### [ 1.0.35 ] - 2025/02/01

  * This release requires the SpotifyPlus Integration v1.0.90+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Added `utils.getHomeAssistantErrorMessage` function to make error messages and warnings a little more user-friendly.
  * Added card version to General Editor form.
  * Added refresh of media list when a userpreset filtersection event is processed, which ensures that cached values are refreshed and any newly added favorites are displayed.

###### [ 1.0.34 ] - 2025/01/26

  * Added card configuration option `deviceDefaultId` for specifying a Device ID to use for all SpotifyPlus service calls that require a deviceId argument.  This allows you to hide the Devices section, and utilize the specific device for all service requests that require a deviceId.
  * Added card configuration option `playerVolumeMaxValue` for specifying the maximum volume value allowed to be set via the card user-interface.  This value does not apply if adjusting the volume via services or other media player UI's.

###### [ 1.0.33 ] - 2025/01/23

  * This release requires the SpotifyPlus Integration v1.0.86+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Added support for Google Chromecast devices.
  * Moved support for Sonos devices to the underlying `spotifywebapiPython` package.
  * Added support for new Zeroconf discovery process, in support of Chromecast devices.
  * Updated underlying `spotifywebapiPython` package requirement to version 1.0.156.
  * Updated underlying `smartinspectPython` package requirement to version 3.0.34.

###### [ 1.0.32 ] - 2025/01/17

  * Fixed issue with random track playing if shuffle mode was on while selecting a track favorite.  To fix, I had to disable shuffle prior to starting play of the track as the Spotify Web API would always play a shuffled track.  The only other alternative was to just play 1 track, which would then end play when the song ended.
  * Fixed play button icon sizing when player is idle.

###### [ 1.0.31 ] - 2025/01/14

  * Renamed theming variable `--spc-medialist-items-color` to `--spc-media-browser-items-color` to more closely align with new theme naming standards.
  * Added card configuration option `mediaBrowserItemsColor` for styling media browser items title and sub-title text colors.
  * Added theme variable `--spc-media-browser-items-title-font-size` and `mediaBrowserItemsTitleFontSize` card configuration option for styling media browser items title text font-size.
  * Added theme variable `--spc-media-browser-items-subtitle-font-size` and `mediaBrowserItemsSubTitleFontSize` card configuration option for styling media browser items sub-title text font-size.
  * Added theme variable `--spc-media-browser-section-title-font-size` and `mediaBrowserSectionTitleFontSize` card configuration option for styling media browser section title text font-size.
  * Added theme variable `--spc-media-browser-section-subtitle-font-size` and `mediaBrowserSectionSubTitleFontSize` card configuration option for styling media browser section title text font-size.
  * Added theme variable `--spc-player-header-title1-color` and `playerHeaderTitle1Color` card configuration option for styling player section header title 1 text color.
  * Added theme variable `--spc-player-header-title1-font-size` and `playerHeaderTitle1FontSize` card configuration option for styling player section header title 1 text font size.
  * Added theme variable `--spc-player-header-title2-color` and `playerHeaderTitle2Color` card configuration option for styling player section header title 2 text color.
  * Added theme variable `--spc-player-header-title2-font-size` and `playerHeaderTitle2FontSize` card configuration option for styling player section header title 2 text font size.
  * Added theme variable `--spc-player-header-title3-color` and `playerHeaderTitle3Color` card configuration option for styling player section header title 3 text color.
  * Added theme variable `--spc-player-header-title3-font-size` and `playerHeaderTitle3FontSize` card configuration option for styling player section header title 3 text font size.

###### [ 1.0.30 ] - 2025/01/12

  * Added `touchSupportDisabled` config option to disable touch events and force mouse events for media browser items.  More info can be found on the [wiki docs](https://github.com/thlucas1/spotifyplus_card/wiki/Configuration-Options#touchSupportDisabled).

###### [ 1.0.29 ] - 2025/01/11

  * This release requires the SpotifyPlus Integration v1.0.85+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Modified `isTouchDevice` method to better detect touchscreen support for dual-monitor setups.

###### [ 1.0.28 ] - 2025/01/09

  * This release requires the SpotifyPlus Integration v1.0.85+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Added `deviceBrowserItemsShowHiddenDevices` config option to show SpotifyPlus configured hidden devices in Device browser.  If true, the SpotifyPlus configuration option to hide specified device names in the media source list is ignored and ALL known devices are listed.
  * Added play button icon to player section, which will be displayed if the player state is IDLE.

###### [ 1.0.27 ] - 2024/12/28

  * This release requires the SpotifyPlus Integration v1.0.76+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Updated Devices section to remove device entries that wish to be hidden as specified by SpotifyPlus integration configuration "hide devices" option.
  * Added ability to play recently played tracks starting from selected track, which will now automatically add the following tracks (up to 50) to the player queue.  Prior to this, only the selected track would play and then play would stop.  Note that the 50 track limitation is a Spotify Web API limit.
  * Added ability to play player queue tracks starting from selected track, which will now automatically add the following tracks (up to 50) to the player queue.  Prior to this, only the selected track would play and then play would stop.  Note that the 50 track limitation is a Spotify Web API limit.

###### [ 1.0.26 ] - 2024/12/24

  * Added `playerBackgroundImageSize` config option that specifies the size of the player background image.  Defaults to "100% 100%"; More info can be found on the [wiki docs](https://github.com/thlucas1/spotifyplus_card/wiki/Configuration-Options#playerbackgroundimagesize).

###### [ 1.0.25 ] - 2024/12/23

  * Added ability to play track favorites starting from selected favorite track, which will now automatically add the following tracks (up to 50) to the player queue.  Prior to this, only the selected track would play and then play would stop.  Note that the 50 track limitation is a Spotify Web API limit.

###### [ 1.0.24 ] - 2024/12/22

  * Added new userpreset type `filtersection`, which can be used to quickly display a section with the specified filter criteria applied.  More info can be found on the [wiki docs](https://github.com/thlucas1/spotifyplus_card/wiki/Configuration-Options#userpresets-filter-section-media).

###### [ 1.0.23 ] - 2024/12/20

  * This release requires the SpotifyPlus Integration v1.0.73+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Fixed hidden volume controls, which was caused by a bug introduced with v1.0.20.
  * Added the ability to disable image caching for userpreset images.  More info can be found on the [wiki docs](https://github.com/thlucas1/spotifyplus_card/wiki/Configuration-Options#userpresets-image-url-caching).

###### [ 1.0.22 ] - 2024/12/18

  * This release requires the SpotifyPlus Integration v1.0.72+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Fixed card not rendering correctly in the card picker and when an entity id was not selected.

###### [ 1.0.21 ] - 2024/12/18

  * This release requires the SpotifyPlus Integration v1.0.72+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Added new user-defined preset type `trackfavorites`, which allows you to play all track favorites by simply selecting the preset.  There is also the "Play All Track Favorites" action in the track favorites section actions, but the preset makes it easier to play all tracks.

###### [ 1.0.20 ] - 2024/12/17

  * This release requires the SpotifyPlus Integration v1.0.71+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Corrected a bug that was causing the wrong media player to be displayed when multiple SpotifyPlus media players were defined with the same prefix.
  * Hide Media controls for Spotify Free accounts, as a Spotify Premium membership is required for those functions.
  * Hide Volume controls for Spotify Free accounts, as a Spotify Premium membership is required for those functions.

###### [ 1.0.19 ] - 2024/12/15

  * Added favorite indicator to the player section form for track, show episode, and audiobook items.  The heart icon will be displayed to the right of the item name.  A solid red heart indicates the item is a favorite; a transparent heart indicates the item is not a favorite.
  * Added "Play All Track Favorites" action to the track favorites section actions.  This will get a list of the tracks saved in the current Spotify user's 'Your Library' and starts playing them, with shuffle enabled.
  * Added logic to player `PREVIOUS_TRACK` control so that if more than 8 seconds have passed the currently playing track is just restarted from the beginning; otherwise, the previous track is selected if progress is past the 8 second point.

###### [ 1.0.18 ] - 2024/12/11

  * This release requires the SpotifyPlus Integration v1.0.69+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Added `playerVolumeControlsHideLevels` config option that hides volume level numbers and percentages in the volume controls area of the Player section form.  Volume slider control is not affected by this setting.
  * Added `albumFavBrowserItemsLimit` config option that specifies the maximum number of items to be returned by the Album Favorites media browser.
  * Added `artistFavBrowserItemsLimit` config option that specifies the maximum number of items to be returned by the Artist Favorites media browser.
  * Added `audiobookFavBrowserItemsLimit` config option that specifies the maximum number of items to be returned by the Audiobook Favorites media browser.
  * Added `episodeFavBrowserItemsLimit` config option that specifies the maximum number of items to be returned by the Episode Favorites media browser.
  * Added `playlistFavBrowserItemsLimit` config option that specifies the maximum number of items to be returned by the Playlist Favorites media browser.
  * Added `showFavBrowserItemsLimit` config option that specifies the maximum number of items to be returned by the Show Favorites media browser.
  * Added `trackFavBrowserItemsLimit` config option that specifies the maximum number of items to be returned by the Track Favorites media browser.
  * Added "Copy X Preset JSON to Clipboard" action for all section detail displays that contain a "Copy X Preset Info to Clipboard" action.  This will create a user-preset JSON format configuration entry for the selected media and copy it to the clipboard; the entry can then be pasted into the `userPresets.json` file, which will create a user preset for the media item.
  * Added theme variable `--spc-card-footer-background-color` to set card footer area background color; default value for the player section is vibrant color (based on cover art colors); default value for all other sections is card background color.
  * Added theme variable `--spc-card-footer-background-image` to set card footer area background image; default value for the player section is a gradient, which provides good contrast; default value for all other sections is card background color.
  * Added theme variable `--spc-card-footer-color` to set card footer icon foreground color; default value is `inherit`, which is card foreground color value.
  * Adjusted scrollbar colors to more closely match selected theme.

###### [ 1.0.17 ] - 2024/12/09

  * This release requires the SpotifyPlus Integration v1.0.69+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Modified the media list items' text color to use the `--spc-medialist-items-color` variable (defaults to `white`) instead of the `--secondary-text-color`, as well as the title and sub-title background gradient.  Media list item text was difficult to read using certain themes.
  * Disabled `Categories` section by default when adding instance from card picker.  Spotify Web API functionality was deprecated unexpectedly (and without prior notice!) by the Spotify Development Team.
  * Updated underlying `turn_on` service to first check if the previously selected source is active or not; if so, then play is resumed immediately; if not, then a `source_select` is performed to activate the selected source.  This result in a faster time to play when powering on the media player.
  * Updated various underlying `SpotifyClient` methods to discard favorites that do not contain a valid URI value.  Sometimes the Spotify Web API returns favorite items with no information, which causes exceptions in the card while trying to display them!  The following methods were updated: `GetAlbumFavorites`, `GetEpisodeFavorites`, `GetShowFavorites`, `GetTrackFavorites`.

###### [ 1.0.16 ] - 2024/12/06

  * This release requires the SpotifyPlus Integration v1.0.68+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Added "Active User" information to Spotify Connect Device details display.

###### [ 1.0.15 ] - 2024/12/02

  * This release requires the SpotifyPlus Integration v1.0.67+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Some Spotify Web API functionality has been deprecated unexpectedly (and without prior notice!) by the Spotify Development Team, and has affected SpotifyPlus Card functionality.  More information can be found on the [SpotifyPlus Card Troubleshooting Guide](https://github.com/thlucas1/spotifyplus_card/wiki/Troubleshooting-Guide#issue---sam1010e-deprecated-error-messages) wiki page, as well as the [Spotify Developer Forum Blog](https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api).
  * Due to the above chnages made by Spotify, any Algorithmic and Spotify-owned editorial playlists are no longer accessible or have more limited functionality.  This means that you can no longer obtain details via the `SpotifyClient.GetPlaylist` and `SpotifyClient.GetPlaylistItems` methods for Spotify-owned / generated content (e.g. "Made For You", etc).  A `404 - Not Found` error will be returned when trying to retrieve information for these playlist types.
  * Added category shortcut capability to user-defined presets. This will allow you to quickly display category playlists.  This change is irrelevant though, as the support for category playlists was deprecated by the above Spotify Development team changes to their API!
  * I am leaving the deprecated functionality within the card for the time being, with the hope that Spotify changes it's mind and restores the functionality.

###### [ 1.0.14 ] - 2024/11/25

  * Non-Administrator accounts can now use the card without receiving the `unauthorized` message.  Note that non-administrators cannot change the card configuration (as designed).
  * Changed the way calls are made to the underlying SpotifyPlus integration services.  Calls are now made using the `hass.callService` method instead of the `hass.connection.sendMessagePromise` with type `execute_script`.  This was causing all calls that returned service response data to fail with `unauthorized` errors.
  * Removed references to `custom-card-helpers` npm package, as it was outdated and is not being maintained.  We will now create our own card helpers when needed.
  * Added reference to `home-assistant-js-websocket` version 9.4.0, as it was a dependency of `custom-card-helpers` npm package.

###### [ 1.0.13 ] - 2024/11/20

  * This release requires the SpotifyPlus Integration v1.0.66+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Added "Copy Preset Info to Clipboard" action for track and artist in the player track details action menu.  This will create a user-preset configuration entry for the selected media and copy it to the clipboard; the entry can then be pasted into the configuration editor under the `userPresets:` key, which will create a user preset for the media item.
  * Added "Copy Preset Info to Clipboard" action for track and artist in the favorites track details action menu.  This will create a user-preset configuration entry for the selected media and copy it to the clipboard; the entry can then be pasted into the configuration editor under the `userPresets:` key, which will create a user preset for the media item.
  * Added "Show Album Tracks" action for all album action menus.  This will display all tracks on the album in the search browser.
  * Added "Connect / Login to this device" action menu item to Spotify Connect device browser action menu. This will add the device to the Spotify Connect player device list.
  * Added "Disconnect / Logout from this device" action menu item to Spotify Connect device browser action menu. This will remove the device from the Spotify Connect player device list.
  * Fixed a bug in userpreset details display that was causing an error alert of "MediaItem not set in updateActions" when a userpreset with type "recommendations" was selected.

###### [ 1.0.12 ] - 2024/11/15

  * This release requires the SpotifyPlus Integration v1.0.65+ release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Added category browser: browse Spotify playlists by categories; existing card configurations have to enable the section in the general configuration settings.
  * Added dynamic track recommendation capability to user-defined presets. Simply put, you define a preset with the parameters of what you want to play and Spotify searches its media catalog for tracks that match. The matching tracks are then added to a play queue and played in random order. The matching tracks will change over time, as Spotify adds new content to its media catalog.
  * Added action for all playable media types: Copy Preset Info to Clipboard.  This will create a user-preset configuration entry for the selected media and copy it to the clipboard; the entry can then be pasted into the configuration editor under the `userPresets:` key, which will create a user preset for the media item.
  * Updated artist details to show more information about the artist.  Note that actions menu can be used to display more artist-related details (albums, top tracks, etc).
  * Added artist action: show artist albums; lists only the artist albums (no compilations, no appears on, no singles, etc).
  * Added artist action: show artist album compilations; lists only the artist compilation albums (no appears on, no singles, etc).
  * Added artist action: show artist albums appears on (aka collaborations); lists only the artist appears on albums (no compilations, no singles, etc).
  * Added artist action: show artist album singles; lists only the artist single release albums (no compilations, no appears on, etc).
  * Added artist action: show artist related artists; lists artists that are similar to the selected artist.
  * Added show action: search show episodes; lists show episodes with cover art for the selected show.
  * Updated show details form to only display the first 20 episodes of the show after the show description.  This will make the UI much more responsive, as most shows have 200+ episodes.  More shows can be listed by using the actions menu drop down.

###### [ 1.0.11 ] - 2024/11/04

  * Fixed a bug in all media list rendering controls that was causing the media list not to render for some browser types (Fire HD, iPad Air, etc).
  * Replaced all `lastupdatedon` properties with `date_last_refreshed` property that is populated by the spotifywebapiPython package.

###### [ 1.0.10 ] - 2024/11/03

  * This release requires the SpotifyPlus Integration v1.0.64 release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
  * Added `footerIconSize` general config option to change the size of the footer area icons.
  * Added `playerControlsIconSize` player controls config option to change the size of the player control area icons, volume mute icon, and power on/off icons.
  * Added actions dropdown menu to all section favorites browser details; most of these are the ability to search for related details.  More actions to come in future releases.
  * Added actions dropdown menu to all player information details; most of these are the ability to search for related details.  More actions to come in future releases.
  * Added ability to copy device details to the clipboard; for example, click on the value next to the `Device ID` title to copy the device id to the clipboard.
  * Added (all browsers) action: copy Spotify URI to clipboard.
  * Added playlist action: recover playlists via Spotify web ui.
  * Added playlist action: delete (unfollow) a playlist.
  * Updated playlist item action: track will now be added to the play queue instead of being played.  This will avoid wiping out the play queue.
  * Updated album item action: track will now be added to the play queue instead of being played.  This will avoid wiping out the play queue.
  * Updated podcast show item action: episode will now be added to the play queue instead of being played.  This will avoid wiping out the play queue.
  * Updated audiobook item action: chapter will now be added to the play queue instead of being played.  This will avoid wiping out the play queue.

###### [ 1.0.9 ] - 2024/10/30

  * This release requires the SpotifyPlus Integration v1.0.63 release; please make sure you update the SpotifyPlus integration prior to updating this SpotifyPlus Card release.
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