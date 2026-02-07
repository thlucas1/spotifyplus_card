# SpotifyPlus Card

[![GitHub Release][releases-shield]][releases] [![License][license-shield]](LICENSE) [![docs][docs-shield]][docs] [![hacs][hacs-shield]][hacs]

![Project Maintenance][maintenance-shield] [![BuyMeCoffee][buymecoffee-shield]][buymecoffee]

_Home Assistant UI card that supports features unique to the [SpotifyPlus](https://github.com/thlucas1/homeassistantcomponent_spotifyplus) custom integration._  
Extended support for the Spotify Service for use in Home Assistant.

## Features

* Spotify Media player interface with customizable controls and information display.
* Search Spotify catalog for all media types (tracks, playlists, albums, artists, shows, audiobooks, episodes, categories, etc).
* Display / Select your Spotify favorites: Albums, Artists, Audiobooks, Episodes, Shows, Tracks.
* Display / Select Spotify Connect device outputs.
* User-defined media item presets (both file and code edited supported).
* User-defined recommendation presets; play dynamically generated content based on user-defined criteria (e.g. energy, loudness, danceability, etc).
* Favorite status / add / remove support for all media types.
* View Player Queue information.
* Card Configuration Editor User-Interface for changing options.

and more!

## How it Looks

Here's a quick overview on what the card can look like.  The card is highly customizable when it comes to the information displayed.  Check out the [UI Dashboards wiki](https://github.com/thlucas1/spotifyplus_card/wiki/UI-Dashboards) page for more examples and YAML configuration.

#### Media Player Control / Actions (Masonry Mode)  
![masonry_player_track](./images/ui/masonry/player_track.png?v20241024) 
![masonry_player_track_actions](./images/ui/masonry/player_track_actions.png?v20241024) 
![masonry_player_audiobook](./images/ui/masonry/player_audiobook.png?v20241024) 
![masonry_player_audiobook_actions](./images/ui/masonry/player_audiobook_actions.png?v20241024) 
![masonry_player_show](./images/ui/masonry/player_show.png?v20241024) 
![masonry_player_show_actions](./images/ui/masonry/player_show_actions.png?v20241024) 

#### Media Favorites (Masonry Mode)  
![masonry_playlist_favorites](./images/ui/masonry/playlist_favorites.png?v20241024) 
![masonry_album_favorites](./images/ui/masonry/album_favorites.png?v20241024) 
![masonry_artist_favorites](./images/ui/masonry/artist_favorites.png?v20241024) 
![masonry_track_favorites](./images/ui/masonry/track_favorites.png?v20241024) 
![masonry_audiobook_favorites](./images/ui/masonry/audiobook_favorites.png?v20241024) 
![masonry_show_favorites](./images/ui/masonry/show_favorites.png?v20241024) 
![masonry_episode_favorites](./images/ui/masonry/episode_favorites.png?v20241024) 
![masonry_recently_played](./images/ui/masonry/recents.png?v20241024) 
![masonry_userpresets](./images/ui/masonry/userpresets.png?v20241024) 

#### Spotify Media Search (Masonry Mode)  
![masonry_search_playlists](./images/ui/masonry/search_playlists.png?v20241024) 
![masonry_search_albums](./images/ui/masonry/search_albums.png?v20241024) 
![masonry_search_artists](./images/ui/masonry/search_artists.png?v20241024) 
![masonry_search_tracks](./images/ui/masonry/search_tracks.png?v20241024) 
![masonry_search_audiobooks](./images/ui/masonry/search_audiobooks.png?v20241024) 
![masonry_search_shows](./images/ui/masonry/search_shows.png?v20241024) 
![masonry_search_episodes](./images/ui/masonry/search_episodes.png?v20241024) 

#### Devices / Actions (Masonry Mode)  
![masonry_devices](./images/ui/masonry/devices.png?v20241024) 
![masonry_devices_actions](./images/ui/masonry/devices_actions.png?v20241024) 

#### Editor UI  
![config_editor_general](./images/config/editor_general.png?v20241024) 

#### Card Picker
![config_cardpicker](./images/config/cardpicker.png?v20241024) 

## HACS Installation Instructions (recommended)

Use the following link to open (and add) the custom repository in HACS:  

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=thlucas1&repository=spotifyplus_card&category=Plugin)

If the above does not work for you, then use the following steps to add the custom repository manually.
- On your Home Assistant sidebar menu, go to HACS > FrontendIf the above does not work for you, then use the following steps to add the custom repository manually.
- Click on the 3-dot overflow menu in the upper right, and select `custom repositories` item.
- Copy / paste `https://github.com/thlucas1/spotifyplus_card` in the Repository textbox and select `Dashboard` for the category entry.
- Click on `Add` to add the custom repository.
- You can then click on the `SpotifyPlus Card` repository entry (you may need to filter your list first to find the new entry).

Note at this point you have only added the repository to the HACS Repository List.  Now it's time to actually download the contents of the repository itself.  You should now be displaying the repository details, which will also display a `Download` button (lower right corner) that can be used to download the repository contents.  

- Click on `download` to start the download. It will install the card to your `/config/www/community/spotifyplus_card` directory.
- Go back on your dashboard and click on the icon at the right top corner then on Edit dashboard.
- You can now click on Add card in the bottom right corner and search for "Custom: SpotifyPlus Card".

## Manual Installation

- using the tool of choice open the directory (folder) for your HA configuration (where you find `configuration.yaml`).
- change directory to the `www` folder; if you don't have this directory, then create it.
- download the `spotifyplus_card.js` file from the [GitHub repository](https://github.com/thlucas1/spotifyplus_card) into your `<config>/www` folder.
- on your dashboard click on the icon at the right top corner then on Edit dashboard.
- click again on that icon and then on Manage resources.
- click on Add resource.
- copy and paste this: `/local/spotifyplus_card.js?v=1.0.40` (change version number to match what was downloaded).
- click on `JavaScript Module` then Create.
- go back and refresh your page.
- you can now click on Add card in the bottom right corner and search for "Custom: SpotifyPlus Card".
- after any update of the file you will have to edit `/local/spotifyplus_card.js?v=1` and change the version (e.g. `v=1`) to any higher number (e.g. `v=1.2`).


## More Information

Check out the following links for more information:

- [Card Wiki Home](https://github.com/thlucas1/spotifyplus_card/wiki)
- [Card Features](https://github.com/thlucas1/spotifyplus_card/wiki/Card-Features)
- [Card Configuration](https://github.com/thlucas1/spotifyplus_card/wiki/Configuration-Options)
- [Card UI Examples](https://github.com/thlucas1/spotifyplus_card/wiki/UI-Dashboards)
- [SpotifyPlus Integration](https://github.com/thlucas1/homeassistantcomponent_spotifyplus)


## Reporting a Problem

Submit a [Bug Report](https://github.com/thlucas1/spotifyplus_card/issues/new?labels=bug&template=bug.yml) to bring the issue to my attention. I receive a notification when a new issue is opened, and will do my best to address it in a prompt and professional manner.

## Request a New Feature

Do you have an idea for a new feature that could be added to the integration?  Submit a [Enhancement Request](https://github.com/thlucas1/spotifyplus_card/issues/new?labels=enhancement&template=enhancement.yml) to get your idea into the queue. I receive a notification when a new request is opened, and will do my best to turn your idea into the latest and greatest feature.

***

[releases-shield]: https://img.shields.io/github/release/thlucas1/spotifyplus_card.svg?style=for-the-badge
[releases]: https://github.com/thlucas1/spotifyplus_card/releases
[license-shield]: https://img.shields.io/github/license/thlucas1/spotifyplus_card.svg?style=for-the-badge
[docs]: https://github.com/thlucas1/spotifyplus_card/wiki
[docs-shield]: https://img.shields.io/badge/Docs-Wiki-blue.svg?style=for-the-badge
[hacs]: https://github.com/hacs/integration
[hacs-shield]: https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge

[maintenance-shield]: https://img.shields.io/badge/maintainer-Todd%20Lucas%20%40thlucas1-blue.svg?style=for-the-badge
[buymecoffee]: https://www.buymeacoffee.com/thlucas1
[buymecoffee-shield]: https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg?style=for-the-badge
