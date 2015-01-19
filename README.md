[![npm version](https://badge.fury.io/js/tvino.svg)](http://badge.fury.io/js/tvinfo)
[![Build Status](https://travis-ci.org/konsumer/tvino.svg?branch=master)](https://travis-ci.org/konsumer/tvino)

This uses promises with tvrage to get info about tv shows and fugures out tv info from filename.

It includes every tvrage API function.

### installation
Install with `npm install --save tvinfo`.

## usage

```javascript
tvinfo = require('tvinfo');

// Get full list of shows
tvinfo.shows().then(console.log);

// Search for Buffy
tvinfo.search("Buffy").then(console.log);

// Get more info (slower)
tvinfo.search("Buffy", true).then(console.log);

// Get current upcoming schedule
tvinfo.schedule().then(console.log);

// Get current upcoming US schedule
tvinfo.schedule('US').then(console.log);

// Get current upcoming UK schedule
tvinfo.schedule('UK').then(console.log);

// Get current upcoming NL schedule
tvinfo.schedule('NL').then(console.log);

// Get detailed (slower) current upcoming US schedule
tvinfo.schedule('US', true).then(console.log);

// Get info about Buffy the Vampire Slayer
tvinfo.show(2930).then(console.log);

// Get detailed (slower) info about Buffy the Vampire Slayer
tvinfo.show(2930, true).then(console.log);

// Get episodes for Buffy the Vampire Slayer
tvinfo.episodes(2930).then(console.log);

// Get info about the pilot episode of Buffy the Vampire Slayer
tvinfo.episode('Buffy the Vampire Slayer', 1, 1).then(console.log);

```