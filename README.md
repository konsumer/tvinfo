# tvinfo

This uses promises with [tvrage](http://tvrage.com) & [epguides](http://epguides.com/) to get info about tv shows and figures out tv info from filename. It seems to be pretty fast for most things.

It includes every tvrage API function.

[![npm](https://nodei.co/npm/tvinfo.png)](https://www.npmjs.com/package/tvinfo)
[![Build Status](https://travis-ci.org/konsumer/tvinfo.svg?branch=master)](https://travis-ci.org/konsumer/tvinfo)
[![Code Climate](https://codeclimate.com/github/konsumer/tvinfo/badges/gpa.svg)](https://codeclimate.com/github/konsumer/tvinfo)

### installation
Install with `npm install --save tvinfo`.

## usage

Have a look at `test/tvinfo.test.js` for some examples, but here is quick overview:

```javascript
tvinfo = require('tvinfo');

// Get full list of shows
tvinfo.shows().then(console.log);

// Search for Buffy
tvinfo.search("Buffy").then(console.log);

// Get more info including episodes
tvinfo.search("Buffy", true).then(console.log);

// Get current upcoming schedule
tvinfo.schedule().then(console.log);

// Get current upcoming US schedule
tvinfo.schedule('US').then(console.log);

// Get current upcoming UK schedule
tvinfo.schedule('UK').then(console.log);

// Get current upcoming NL schedule
tvinfo.schedule('NL').then(console.log);

// Get info about Buffy the Vampire Slayer
tvinfo.show(2930).then(console.log);

// Get more info including episodes
tvinfo.show(2930, true).then(console.log);

// Get episodes for Buffy the Vampire Slayer
tvinfo.episodes(2930).then(console.log);

// Get info about the pilot episode of Buffy the Vampire Slayer
tvinfo.episode('Buffy the Vampire Slayer', 1, 1).then(console.log);

// Try to guess TV info, based on the filename
console.log( tvinfo.filename('Buffy_The_Vampire_Slayer-S01E04.mp4') );

// Use functions together to get more info about file
var show = tvinfo.filename('Buffy_The_Vampire_Slayer-S01E04.mp4');
tvinfo.episode(show.name, show.season, show.episode).then(console.log);
```