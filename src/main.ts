// our imports.
import { CARD_VERSION } from './constants';
import './card';

/* import HA WebAwesome bundle */
import '@home-assistant/webawesome/dist/webawesome.js';

// Good source of help documentation on HA custom cards:
// https://gist.github.com/thomasloven/1de8c62d691e754f95b023105fe4b74b

// Display card version details in console, as well as a link to help docs.
console.groupCollapsed(
  `%cSPOTIFYPLUS-CARD ${CARD_VERSION} IS INSTALLED`,
  "color: green; font-weight: bold"
);
console.log(
  "SpotifyPlus Card Wiki Docs:",
  "https://github.com/thlucas1/spotifyplus_card/wiki/Configuration-Options"
);
console.log(
  "SpotifyPlus Integration Wiki Docs:",
  "https://github.com/thlucas1/homeassistantcomponent_spotifyplus/wiki"
);
console.log(
  "SpotifyPlus Card Debug Logging Console Commands:\n",
  "- enable:  localStorage.setItem('debug', 'spotifyplus-card:*');\n",
  "- disable: localStorage.setItem('debug', '');"
 );
console.groupEnd();

// Register our card for the card picker dialog in the HA UI dashboard
// by adding it to the "window.customCards" array with attributes that
// describe the card and what it provides ("type" and "name" are required).
window.customCards.push({
  type: 'spotifyplus-card',
  name: 'SpotifyPlus Card',
  description: 'Home Assistant UI card that supports features unique to the SpotifyPlus custom integration',
  //documentationURL: 'https://github.com/thlucas1/spotifyplus_card/wiki/Configuration-Options',
  preview: true,
});
