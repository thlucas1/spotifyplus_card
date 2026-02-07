// lovelace card imports.
import { LovelaceCardConfig } from '../types/home-assistant-frontend/lovelace-card-config';

// our imports.
import { Section } from './section';
import { CustomImageUrls } from './custom-image-urls';
import { IUserPreset } from './spotifyplus/user-preset';
import { SearchMediaTypes } from './search-media-types';

/**
 * Card configuration settings.
 */
export interface CardConfig extends LovelaceCardConfig {

  /** 
   * Contains the unique ID of the card - do not edit this value!
   * This value is used to find the specific card entry in the lovelace storage file,
   * so that it can be updated programatically (no editor) if need be.
   */
  cardUniqueId?: string;

  /**
   * Entity ID of the SpotifyPlus device that will process the request. 
   */
  entity: string;

  /** 
   * Sections of the card to display. 
   * 
   * Valid values must match defined names in `secion.ts`.
   */
  sections?: Section[];

  /** 
   * Section of the card to display by default; the specified section value must
   * be a valid section identifier name, and the section must be enabled via the
   * `sections` list.
   * 
   * Valid value must match a defined name in `secion.ts`.
   */
  sectionDefault?: Section;

  /**
   * Title that is displayed at the top of the card, above the section area.
   * This value supports Title Formatter Options.
   */
  title?: string;

  /**
   * Width of the card (in 'rem' units).
   * A value of "fill" can also be used (requires manual editing) to use 100% of 
   * the available horizontal space (good for panel dashboards).
   * Default is 35.15rem.
   */
  width?: string | number;

  /**
   * Height of the card (in 'rem' units).
   * A value of "fill" can also be used (requires manual editing) to use 100% of 
   * the available vertical space (good for panel dashboards).
   * Default is 35.15rem.
   * Note that card will always maintain a minimum height value of at least 15rem
   * for header and footer areas.
   */
  height?: string | number;

  /**
   * Card content section margin value.
   * Default is 0.0rem.
   */
  cardContentMargin?: string;

  /**
   * True to disable touch events and force mouse events for media browser items;
   * otherwise, False to enable touch events if they are detected.
   * Default is false.
   */
  touchSupportDisabled?: boolean;

  /**
   * Title displayed at the top of the Album Favorites media browser section form.
   * Omit this parameter to hide the title display area.
   * This value supports Title Formatter Options.
   */
  albumFavBrowserTitle?: string;

  /**
   * Sub-title displayed at the top of the Album Favorites media browser section form.
   * Omit this parameter to hide the sub-title display area.
   * This value supports Title Formatter Options.
   */
  albumFavBrowserSubTitle?: string;

  /**
   * Number of items to display in a single row of the Album Favorites media browser section form.
   * Use a value of 1 to display the items as a vertical list.
   * Default is 3.
   */
  albumFavBrowserItemsPerRow?: number;

  /** 
   * Hide titles displayed for Album Favorites media browser items.
   * Default is false.
   */
  albumFavBrowserItemsHideTitle?: boolean;

  /** 
   * Hide sub-titles displayed for Album Favorites media browser items.
   * Default is false.
   */
  albumFavBrowserItemsHideSubTitle?: boolean;

  /**
   * Maximum number of items to be returned by the Album Favorites media browser.
   * Default is 200.
   */
  albumFavBrowserItemsLimit?: number;

  /**
   * True to enable refresh of Album Favorites media browser items when the 
   * section is initially displayed;
   * otherwise, False to display cached media browser items.
   * Default is false.
   */
  albumFavBrowserItemsRefreshOnEntry?: boolean;

  /**
   * True to sort displayed Album Favorites media browser item titles by name;
   * Otherwise, False to display in the order returned from the Spotify Web API. 
   * Default is false.
   */
  albumFavBrowserItemsSortTitle?: boolean;

  /**
   * True to enable shuffle prior to starting play of the context;
   * Otherwise, False to start the context with the current shuffle mode.  
   * Default is false.
   */
  albumFavBrowserShuffleOnPlay?: boolean;

  /**
   * Title displayed at the top of the Artist Favorites media browser section form.
   * Omit this parameter to hide the title display area.
   * This value supports Title Formatter Options.
   */
  artistFavBrowserTitle?: string;

  /**
   * Sub-title displayed at the top of the Artist Favorites media browser section form.
   * Omit this parameter to hide the sub-title display area.
   * This value supports Title Formatter Options.
   */
  artistFavBrowserSubTitle?: string;

  /**
   * Number of items to display in a single row of the Artist Favorites media browser section form.
   * Use a value of 1 to display the items as a vertical list.
   * Default is 3.
   */
  artistFavBrowserItemsPerRow?: number;

  /** 
   * Hide titles displayed for Artist Favorites media browser items.
   * Default is false.
   */
  artistFavBrowserItemsHideTitle?: boolean;

  /** 
   * Hide sub-titles displayed for Artist Favorites media browser items.
   * Default is false.
   */
  artistFavBrowserItemsHideSubTitle?: boolean;

  /**
   * Maximum number of items to be returned by the Artist Favorites media browser.
   * Default is 200.
   */
  artistFavBrowserItemsLimit?: number;

  /**
   * True to enable refresh of Artist Favorites media browser items when the 
   * section is initially displayed;
   * otherwise, False to display cached media browser items.
   * Default is false.
   */
  artistFavBrowserItemsRefreshOnEntry?: boolean;

  /**
   * True to sort displayed Artist Favorites media browser item titles by name;
   * Otherwise, False to display in the order returned from the Spotify Web API. 
   * Default is false.
   */
  artistFavBrowserItemsSortTitle?: boolean;

  /**
   * True to enable shuffle prior to starting play of the context;
   * Otherwise, False to start the context with the current shuffle mode.  
   * Default is false.
   */
  artistFavBrowserShuffleOnPlay?: boolean;

  /**
   * Title displayed at the top of the Audiobook Favorites media browser section form.
   * Omit this parameter to hide the title display area.
   * This value supports Title Formatter Options.
   */
  audiobookFavBrowserTitle?: string;

  /**
   * Sub-title displayed at the top of the Audiobook Favorites media browser section form.
   * Omit this parameter to hide the sub-title display area.
   * This value supports Title Formatter Options.
   */
  audiobookFavBrowserSubTitle?: string;

  /**
   * Number of items to display in a single row of the Audiobook Favorites media browser section form.
   * Use a value of 1 to display the items as a vertical list.
   * Default is 3.
   */
  audiobookFavBrowserItemsPerRow?: number;

  /** 
   * Hide titles displayed for Audiobook Favorites media browser items.
   * Default is false.
   */
  audiobookFavBrowserItemsHideTitle?: boolean;

  /** 
   * Hide sub-titles displayed for Audiobook Favorites media browser items.
   * Default is false.
   */
  audiobookFavBrowserItemsHideSubTitle?: boolean;

  /**
   * Maximum number of items to be returned by the Audiobook Favorites media browser.
   * Default is 200.
   */
  audiobookFavBrowserItemsLimit?: number;

  /**
   * True to enable refresh of Audiobook Favorites media browser items when the 
   * section is initially displayed;
   * otherwise, False to display cached media browser items.
   * Default is false.
   */
  audiobookFavBrowserItemsRefreshOnEntry?: boolean;

  /**
   * True to sort displayed Audiobook Favorites media browser item titles by name;
   * Otherwise, False to display in the order returned from the Spotify Web API. 
   * Default is false.
   */
  audiobookFavBrowserItemsSortTitle?: boolean;

  /**
   * Title displayed at the top of the Category media browser section form.
   * Omit this parameter to hide the title display area.
   * This value supports Title Formatter Options.
   */
  categoryBrowserTitle?: string;

  /**
   * Sub-title displayed at the top of the Category media browser section form.
   * Omit this parameter to hide the sub-title display area.
   * This value supports Title Formatter Options.
   */
  categoryBrowserSubTitle?: string;

  /**
   * Number of items to display in a single row of the Category media browser section form.
   * Use a value of 1 to display the items as a vertical list.
   * Default is 3.
   */
  categoryBrowserItemsPerRow?: number;

  /** 
   * Hide titles displayed for Category media browser items.
   * Default is false.
   */
  categoryBrowserItemsHideTitle?: boolean;

  /** 
   * Hide sub-titles displayed for Category media browser items.
   * Default is false.
   */
  categoryBrowserItemsHideSubTitle?: boolean;

  /**
   * True to sort displayed Category Playlist media browser item titles by name;
   * Otherwise, False to display in the order returned from the Spotify Web API. 
   * Default is false.
   */
  categoryBrowserItemsSortTitle?: boolean;

  /**
   * Title displayed at the top of the Device browser section form.
   * Omit this parameter to hide the title display area.
   * This value supports Title Formatter Options.
   */
  deviceBrowserTitle?: string;

  /**
   * Sub-title displayed at the top of the Device browser section form.
   * Omit this parameter to hide the sub-title display area.
   * This value supports Title Formatter Options.
   */
  deviceBrowserSubTitle?: string;

  /**
   * Number of items to display in a single row of the Device browser section form.
   * Use a value of 1 to display the items as a vertical list.
   * Default is 3.
   */
  deviceBrowserItemsPerRow?: number;

  /** 
   * Hide titles displayed for Device browser items.
   * Default is false.
   */
  deviceBrowserItemsHideTitle?: boolean;

  /** 
   * Hide sub-titles displayed for Device browser items.
   * Default is false.
   */
  deviceBrowserItemsHideSubTitle?: boolean;

  /** 
   * Show SpotifyPlus configured hidden devices in Device browser.
   * Default is false.
   */
  deviceBrowserItemsShowHiddenDevices?: boolean;

  /**
   * Device ID to use for all SpotifyPlus service calls that require a deviceId argument.
   * This allows you to hide the Devices section, and utilize the specific device for
   * all service requests that require a deviceId.
   * 
   * A Spotify Premium account is required to use this feature, as it utilizes the transfer 
   * playback service to transfer player control to the specified device.
   */
  deviceDefaultId: string;

  /** 
   * 
   * Determines how devices will be resolved by the underlying SpotifyPlus service.
   * If False (default), the device id will be passed to the service;
   * If True, the device name will be passed to the service;
   * 
   * Set this option to true if one or more of your devices register a different device id
   * when awakening from sleep / idle state.
   */
  deviceControlByName: boolean;

  /**
   * Title displayed at the top of the Episode Favorites media browser section form.
   * Omit this parameter to hide the title display area.
   * This value supports Title Formatter Options.
   */
  episodeFavBrowserTitle?: string;

  /**
   * Sub-title displayed at the top of the Episode Favorites media browser section form.
   * Omit this parameter to hide the sub-title display area.
   * This value supports Title Formatter Options.
   */
  episodeFavBrowserSubTitle?: string;

  /**
   * Number of items to display in a single row of the Episode Favorites media browser section form.
   * Use a value of 1 to display the items as a vertical list.
   * Default is 3.
   */
  episodeFavBrowserItemsPerRow?: number;

  /** 
   * Hide titles displayed for Episode Favorites media browser items.
   * Default is false.
   */
  episodeFavBrowserItemsHideTitle?: boolean;

  /** 
   * Hide sub-titles displayed for Episode Favorites media browser items.
   * Default is false.
   */
  episodeFavBrowserItemsHideSubTitle?: boolean;

  /**
   * Maximum number of items to be returned by the Episode Favorites media browser.
   * Default is 200.
   */
  episodeFavBrowserItemsLimit?: number;

  /**
   * True to enable refresh of Episode Favorites media browser items when the 
   * section is initially displayed;
   * otherwise, False to display cached media browser items.
   * Default is false.
   */
  episodeFavBrowserItemsRefreshOnEntry?: boolean;

  /**
   * True to sort displayed Episode Favorites media browser item titles by name;
   * Otherwise, False to display in the order returned from the Spotify Web API. 
   * Default is false.
   */
  episodeFavBrowserItemsSortTitle?: boolean;

  /**
   * Size of the player background image.
   * Suggested values:
   * - "100% 100%" image size is 100%, stretching to fill available space.
   * - "contain" image is contained in the boundaries without stretching.
   * - "cover" image covers the entire background, stretching to fill available space.
   * Default is "100% 100%".
   */
  playerBackgroundImageSize?: string;

  /**
   * Title displayed in the header area of the Player section form.
   * Omit this parameter to hide the title display area.
   * This value supports Title Formatter Options.
   */
  playerHeaderTitle?: string;

  /**
   * Artist and Track info displayed in the header area of the Player section form.
   * Omit this parameter to hide this area.
   * This value supports Title Formatter Options.
   */
  playerHeaderArtistTrack?: string;

  /**
   * Album info displayed in the header area of the Player section form.
   * Omit this parameter to hide this area.
   * This value supports Title Formatter Options.
   */
  playerHeaderAlbum?: string;

  /**
   * Text to display in the header area of the Player section form
   * when no media is currently playing.
   * Omit this parameter to display the default 'No Media Playing' value.
   * This value supports Title Formatter Options.
   */
  playerHeaderNoMediaPlayingText?: string;

  /** 
   * Hide progress bar in the header area of the Player section form.
   * Default is false.
   */
  playerHeaderHideProgressBar?: boolean;

  /**
   * Color value (e.g. "#hhrrggbb") for the Player header area background gradient.
   * Specify 'transparent' to hide the background area.
   * Default is '#000000bb'.
   */
  playerHeaderBackgroundColor?: string;

  /** 
   * Hide header area of the Player section form.
   * Default is false.
   */
  playerHeaderHide?: boolean;

  /** 
   * Hide favorites action button in the controls area of the Player section form.
   * Default is false.
   */
  playerControlsHideFavorites?: boolean;

  /**
   * Hide play queue button in the controls area of the Player section form.
   * Default is false.
   */
  playerControlsHidePlayQueue?: boolean;

  /**
   * Hide play / pause button in the controls area of the Player section form.
   * Default is false.
   */
  playerControlsHidePlayPause?: boolean;

  /**
   * Hide repeat button in the controls area of the Player section form.
   * Default is false.
   */
  playerControlsHideRepeat?: boolean;

  /**
   * Hide shuffle button in the controls area of the Player section form.
   * Default is false.
   */
  playerControlsHideShuffle?: boolean;

  /**
   * Hide next track button in the controls area of the Player section form.
   * Default is false.
   */
  playerControlsHideTrackNext?: boolean;

  /**
   * Hide previous track button in the controls area of the Player section form.
   * Default is false.
   */
  playerControlsHideTrackPrev?: boolean;

  /**
   * Hide controls area of the Player section form.
   * Default is false.
   */
  playerControlsHide?: boolean;

  /**
   * Color value (e.g. "#hhrrggbb") for the Player controls area background gradient.
   * Specify 'transparent' to hide the background area.
   * Default is '#000000bb'.
   */
  playerControlsBackgroundColor?: string;

  /**
   * Color of the player media control labels.
   * Default is '#ffffff'.
   */
  playerControlsColor?: string;

  /**
   * Size of the icons in the Player controls area.
   * Default is '2.0rem'.
   */
  playerControlsIconSize?: string;

  /**
   * Color of the icons in the Player controls area.
   * Default is '#ffffff'.
   */
  playerControlsIconColor?: string;

  /**
   * Color of the toggled icons in the Player controls area.
   * Default is '#ffffff'.
   */
  playerControlsIconToggleColor?: string;

  /**
   * Margin of the icons in the Player controls area.
   * Default is '0px'.
   */
  playerControlsIconMargin?: string;

  /**
   * True to minimize player card height when player state goes to idle (or off) AND card height is not set to `fill`;
   * otherwise, False to use specified card `height` value.
   * Default is false.
   */
  playerMinimizeOnIdle?: boolean;

  /**
   * Color of the player progress text labels.
   * Default is '#ffffff'.
   */
  playerProgressLabelColor?: string;

  /**
   * Horizontal padding value for the player progress text labels.
   * Default is '0px'.
   */
  playerProgressLabelPaddingLR?: string;

  /**
   * Color of the player progress slider bar.
   * Default is '#2196F3'.
   */
  playerProgressSliderColor?: string;

  /**
   * Hide volume level numbers and percentages in the volume controls area of the Player 
   * section form.  Volume slider control is not affected by this setting.
   * Default is false.
   */
  playerVolumeControlsHideLevels?: boolean;

  /**
   * Hide mute button in the volume controls area of the Player section form.
   * Default is false.
   */
  playerVolumeControlsHideMute?: boolean;

  /**
   * Hide power button in the volume controls area of the Player section form.
   * Default is false.
   */
  playerVolumeControlsHidePower?: boolean;

  /**
   * Hide volume slider and levels in the volume controls area of the Player section form.
   * Default is false.
   */
  playerVolumeControlsHideSlider?: boolean;

  /**
   * Show plus / minus buttons in the volume controls area of the Player section form.
   * Default is false.
   */
  playerVolumeControlsShowPlusMinus?: boolean;

  /**
   * Maximum volume value allowed to be set via the card user-interface.  This value does
   * not apply if adjusting the volume via services or other media player UI's.
   * Default is 100.
   */
  playerVolumeMaxValue?: number;

  /**
   * Amount used to adjust volume when step buttons are used.  This value does
   * not apply if adjusting the volume via the slider.
   * Range is 1 - 30.
   * Default is 10.
   */
  playerVolumeStepValue?: number;

  /**
   * Color of the player volume text labels.
   * Default is '#ffffff'.
   */
  playerVolumeLabelColor?: string;

  /**
   * Color of the player volume slider bar.
   * Default is '#2196F3'.
   */
  playerVolumeSliderColor?: string;

  /**
   * Title displayed at the top of the Playlist Favorites media browser section form.
   * Omit this parameter to hide the title display area.
   * This value supports Title Formatter Options.
   */
  playlistFavBrowserTitle?: string;

  /**
   * Sub-title displayed at the top of the Playlist Favorites media browser section form.
   * Omit this parameter to hide the sub-title display area.
   * This value supports Title Formatter Options.
   */
  playlistFavBrowserSubTitle?: string;

  /**
   * Number of items to display in a single row of the Playlist Favorites media browser section form.
   * Use a value of 1 to display the items as a vertical list.
   * Default is 3.
   */
  playlistFavBrowserItemsPerRow?: number;

  /** 
   * Hide titles displayed for Playlist Favorites media browser items.
   * Default is false.
   */
  playlistFavBrowserItemsHideTitle?: boolean;

  /** 
   * Hide sub-titles displayed for Playlist Favorites media browser items.
   * Default is false.
   */
  playlistFavBrowserItemsHideSubTitle?: boolean;

  /**
   * Maximum number of items to be returned by the Playlist Favorites media browser.
   * Default is 200.
   */
  playlistFavBrowserItemsLimit?: number;

  /**
   * True to enable refresh of Playlist Favorites media browser items when the 
   * section is initially displayed;
   * otherwise, False to display cached media browser items.
   * Default is false.
   */
  playlistFavBrowserItemsRefreshOnEntry?: boolean;

  /**
   * True to sort displayed Playlist Favorites media browser item titles by name;
   * Otherwise, False to display in the order returned from the Spotify Web API. 
   * Default is false.
   */
  playlistFavBrowserItemsSortTitle?: boolean;

  /**
   * True to enable shuffle prior to starting play of the context;
   * Otherwise, False to start the context with the current shuffle mode.  
   * Default is false.
   */
  playlistFavBrowserShuffleOnPlay?: boolean;

  /**
   * Title displayed at the top of the Recently Played media browser section form.
   * Omit this parameter to hide the title display area.
   * This value supports Title Formatter Options.
   */
  recentBrowserTitle?: string;

  /**
   * Sub-title displayed at the top of the Recently Played media browser section form.
   * Omit this parameter to hide the sub-title display area.
   * This value supports Title Formatter Options.
   */
  recentBrowserSubTitle?: string;

  /**
   * Number of items to display in a single row of the Recently Played media browser section form.
   * Use a value of 1 to display the items as a vertical list.
   * Default is 3.
   */
  recentBrowserItemsPerRow?: number;

  /** 
   * Hide titles displayed for Recently Played media browser items.
   * Default is false.
   */
  recentBrowserItemsHideTitle?: boolean;

  /** 
   * Hide sub-titles displayed for Recently Played media browser items.
   * Default is false.
   */
  recentBrowserItemsHideSubTitle?: boolean;

  /**
   * True to enable refresh of Recently Played media browser items when the 
   * section is initially displayed;
   * otherwise, False to display cached media browser items.
   * Default is false.
   */
  recentBrowserItemsRefreshOnEntry?: boolean;

  /**
   * Title displayed at the top of the Search media browser section form.
   * Omit this parameter to hide the title display area.
   * This value supports Title Formatter Options.
   */
  searchMediaBrowserTitle?: string;

  /**
   * Sub-title displayed at the top of the Search media browser section form.
   * Omit this parameter to hide the sub-title display area.
   * This value supports Title Formatter Options.
   */
  searchMediaBrowserSubTitle?: string;

  /**
   * Use search display settings when displaying results
   * If true, the search type values will be used for the ItemsPerRow, HideTitle, and HideSubTitle values.
   * If false, the media type values will be used for the ItemsPerRow, HideTitle, and HideSubTitle values.
   * Default is false.
   */
  searchMediaBrowserUseDisplaySettings?: boolean;

  /**
   * Number of items to display in a single row of the Search media browser section form.
   * Use a value of 1 to display the items as a vertical list.
   * Default is 3.
   */
  searchMediaBrowserItemsPerRow?: number;

  /** 
   * Hide titles displayed for Search media browser items.
   * Default is false.
   */
  searchMediaBrowserItemsHideTitle?: boolean;

  /** 
   * Hide sub-titles displayed for Search media browser items.
   * Default is false.
   */
  searchMediaBrowserItemsHideSubTitle?: boolean;

  /** 
   * True to add track / episode to play queue when search result is clicked;
   * Otherwise, play the track / episode immediately when search result is clicked.
   * Default is false.
   */
  searchMediaBrowserQueueSelection?: boolean;

  /**
   * Maximum number of items to be returned by the search via the Search media browser section form.
   * Default is 50.
   */
  searchMediaBrowserSearchLimit?: number;

  /**
   * Search media types to enable for searching.  If empty, then ALL 
   * types are available for search.
   * 
   * Valid values must match defined names in `search-media-types.ts`.
   */
  searchMediaBrowserSearchTypes?: SearchMediaTypes[];

  /**
   * True to sort displayed Search media browser item titles by name;
   * Otherwise, False to display in the order returned from the Spotify Web API. 
   * Default is false.
   */
  searchMediaBrowserItemsSortTitle?: boolean;

  /**
   * Title displayed at the top of the Show Favorites media browser section form.
   * Omit this parameter to hide the title display area.
   * This value supports Title Formatter Options.
   */
  showFavBrowserTitle?: string;

  /**
   * Sub-title displayed at the top of the Show Favorites media browser section form.
   * Omit this parameter to hide the sub-title display area.
   * This value supports Title Formatter Options.
   */
  showFavBrowserSubTitle?: string;

  /**
   * Number of items to display in a single row of the Show Favorites media browser section form.
   * Use a value of 1 to display the items as a vertical list.
   * Default is 3.
   */
  showFavBrowserItemsPerRow?: number;

  /** 
   * Hide titles displayed for Show Favorites media browser items.
   * Default is false.
   */
  showFavBrowserItemsHideTitle?: boolean;

  /** 
   * Hide sub-titles displayed for Show Favorites media browser items.
   * Default is false.
   */
  showFavBrowserItemsHideSubTitle?: boolean;

  /**
   * Maximum number of items to be returned by the Show Favorites media browser.
   * Default is 200.
   */
  showFavBrowserItemsLimit?: number;

  /**
   * True to enable refresh of Show Favorites media browser items when the 
   * section is initially displayed;
   * otherwise, False to display cached media browser items.
   * Default is false.
   */
  showFavBrowserItemsRefreshOnEntry?: boolean;

  /**
   * True to sort displayed Show Favorites media browser item titles by name;
   * Otherwise, False to display in the order returned from the Spotify Web API. 
   * Default is false.
   */
  showFavBrowserItemsSortTitle?: boolean;

  /**
   * Title displayed at the top of the Track Favorites media browser section form.
   * Omit this parameter to hide the title display area.
   * This value supports Title Formatter Options.
   */
  trackFavBrowserTitle?: string;

  /**
   * Sub-title displayed at the top of the Track Favorites media browser section form.
   * Omit this parameter to hide the sub-title display area.
   * This value supports Title Formatter Options.
   */
  trackFavBrowserSubTitle?: string;

  /**
   * Number of items to display in a single row of the Track Favorites media browser section form.
   * Use a value of 1 to display the items as a vertical list.
   * Default is 3.
   */
  trackFavBrowserItemsPerRow?: number;

  /** 
   * Hide titles displayed for Track Favorites media browser items.
   * Default is false.
   */
  trackFavBrowserItemsHideTitle?: boolean;

  /** 
   * Hide sub-titles displayed for Track Favorites media browser items.
   * Default is false.
   */
  trackFavBrowserItemsHideSubTitle?: boolean;

  /**
   * Maximum number of items to be returned by the Track Favorites media browser.
   * Default is 200.
   */
  trackFavBrowserItemsLimit?: number;

  /**
   * True to enable refresh of Track Favorites media browser items when the 
   * section is initially displayed;
   * otherwise, False to display cached media browser items.
   * Default is false.
   */
  trackFavBrowserItemsRefreshOnEntry?: boolean;

  /**
   * True to sort displayed Track Favorites media browser item titles by name;
   * Otherwise, False to display in the order returned from the Spotify Web API. 
   * Default is false.
   */
  trackFavBrowserItemsSortTitle?: boolean;

  /**
   * True to enable shuffle prior to starting play of track favorites;
   * Otherwise, False to start the context with the current shuffle mode.  
   * Default is false.
   */
  trackFavBrowserShuffleOnPlay?: boolean;


  /**
   * Title displayed at the top of the Preset media browser section form.
   * Omit this parameter to hide the title display area.
   * This value supports Title Formatter Options.
   */
  userPresetBrowserTitle?: string;

  /**
   * Sub-title displayed at the top of the User Preset media browser section form.
   * Omit this parameter to hide the sub-title display area.
   * This value supports Title Formatter Options.
   */
  userPresetBrowserSubTitle?: string;

  /**
   * File path to a collection of user-defined preset items that can be displayed in 
   * various media browser displays.  This allows the user to define their own custom 
   * presets for Spotify favorites.
   * 
   * See `userPresets` configuration item for file content format.
   */
  userPresetsFile?: string;

  /**
   * Number of items to display in a single row of the User Preset media browser section form.
   * Use a value of 1 to display the items as a vertical list.
   * Default is 3.
   */
  userPresetBrowserItemsPerRow?: number;

  /** 
   * Hide titles displayed for User Preset media browser items.
   * Default is false.
   */
  userPresetBrowserItemsHideTitle?: boolean;

  /** 
   * Hide sub-titles displayed for User Preset media browser items.
   * Default is false.
   */
  userPresetBrowserItemsHideSubTitle?: boolean;

  /**
   * Collection of user-defined preset items that can be displayed in various media browser
   * displays.  This allows the user to define their own custom presets along with device presets.
   * 
   * This configuration data must be configured manually in the card configuration.
   * Some things to keep in mind when adding entries:
   * - attribute names are are CaSe-SeNsItIvE.
   * 
   * See wiki dicumentation for more examples.
   * 
   * Example:
   * userPresets:
   * - name: "Spotify Playlist Daily Mix 1"
   *   subtitle: "Various Artists"
   *   image_url: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebcd3f796bd7ea49ed7615a550/1/en/default"
   *   uri: "spotify:playlist:37i9dQZF1E39vTG3GurFPW"
   *   type: "playlist"
   * - name: ...
   */
  userPresets?: Array<IUserPreset>;

  /**
   * Collection of custom imageUrl's that can be displayed in various media browser
   * displays.  This allows the user to override the image that is supplied by the
   * media player service, as well as provide imageUrl's for items that do not contain
   * an image.  
   * 
   * This configuration data must be configured manually in the card configuration.
   * Some things to keep in mind when adding entries:
   * - imageUrl titles are CaSe-SeNsItIvE.
   * - imageUrl titles can contain special characters, but they are removed under the covers for the comparison process.
   * - you can use "local" references for the imageUrl; any spaces in the filename are replaced with "%20".
   * - you can use home assistant brands for the imageUrl; "logo.png" reference is replaced with "icon.png".
   * - the "default" imageUrl title is used to supply an imageUrl for items that do not have an image.
   * 
   * Example:
   * customImageUrls:
   *   default: /local/images/spotifyplus_card_customimages/default.png
   *   empty preset: /local/images/spotifyplus_card_customimages/empty_preset.png
   *   Daily Mix 1: /local/images/spotifyplus_card_customimages/logo_spotify.png
   *   I Need You: https://i.scdn.co/image/ab67616d0000b2734bfd0e91bf806bc73d736cfd
   *   LiGhT rAiLs *?????: /local/images/spotifyplus_card_customimages/LiGhT rAiLs.png
   *   My Private Playlist: https://brands.home-assistant.io/spotifyplus/icon.png
   *   My Private Playlist2: https://brands.home-assistant.io/spotifyplus/logo.png
   */
  customImageUrls?: CustomImageUrls;

  // **********************************************************************************************************************************
  // * Card theming options:
  // **********************************************************************************************************************************

  /**
   * Color of the card area wait progress indicator.
   * Default is '#2196F3'.
   */
  cardWaitProgressSliderColor?: string;

  /**
   * Card footer background color.
   */
  footerBackgroundColor?: string;

  /**
   * Card footer background image / gradient.
   */
  footerBackgroundImage?: string;

  /**
   * Card footer icon color.
   */
  footerIconColor?: string;

  /**
   * Card footer selected icon color.
   */
  footerIconColorSelected?: string;

  /**
   * Size of the icons in the Footer controls area.
   * Default is '2rem'.
   */
  footerIconSize?: string;

  /**
   * Media Browser section title text color.
   */
  mediaBrowserSectionTitleColor?: string;

  /**
   * Media Browser section title text font-size (in 'rem' units).
   */
  mediaBrowserSectionTitleFontSize?: string;

  /**
   * Media Browser section sub-title text color.
   */
  mediaBrowserSectionSubTitleColor?: string;

  /**
   * Media Browser section sub-title text font-size (in 'rem' units).
   */
  mediaBrowserSectionSubTitleFontSize?: string;

  /**
   * Media list item title and sub-title text color.
   */
  mediaBrowserItemsColor?: string;

  /**
   * Media list item title and sub-title text color when list is configured
   * for non-icon format.
   */
  mediaBrowserItemsListColor?: string;

  /**
   * Media browser list item svg icon color.
   */
  mediaBrowserItemsSvgIconColor?: string;

  /**
   * Media browser items title text font-size (in 'rem' units).
   */
  mediaBrowserItemsTitleFontSize?: string;

  /**
   * Media browser items sub-title text font-size (in 'rem' units).
   */
  mediaBrowserItemsSubTitleFontSize?: string;

  /**
   * Player header title 1 text color (in #xxxxxx hex format).
   */
  playerHeaderTitle1Color?: string;

  /**
   * Player header title 1 text font-size (in 'rem' units).
   */
  playerHeaderTitle1FontSize?: string;

  /**
   * Player header title 2 text color (in #xxxxxx hex format).
   */
  playerHeaderTitle2Color?: string;

  /**
   * Player header title 2 text font-size (in 'rem' units).
   */
  playerHeaderTitle2FontSize?: string;

  /**
   * Player header title 3 text color (in #xxxxxx hex format).
   */
  playerHeaderTitle3Color?: string;

  /**
   * Player header title 3 text font-size (in 'rem' units).
   */
  playerHeaderTitle3FontSize?: string;

  /**
   * Player minimized title text color (in #xxxxxx hex format).
   */
  playerMinimizedTitleColor?: string;

  /**
   * Player minimized title text font-size (in 'rem' units).
   */
  playerMinimizedTitleFontSize?: string;

}
