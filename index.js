var Promise = require('bluebird'),
  xml = require('xml2js').parseString,
  request = Promise.promisifyAll(require('request')),
  titleCase = require('to-title-case'),
  path = require('path');

function get(endpoint){
  return new Promise(function(resolve, reject){
    request.getAsync('http://services.tvrage.com' + endpoint)
      .then(function(r){
        xml(r[1], {strict:false, normalizeTags:true, normalize:true, mergeAttrs:true, explicitArray:false}, function(err, x){
          if (err) return reject(err);
          resolve(x);
        });
      }, reject);
  });
}

/**
 * Search for a show
 * @param  {String}  show_name the show to sarch for
 * @param  {Boolean} full      return large records?
 * @return {Promise}
 */
exports.search = function(show_name, full){
  var s = encodeURIComponent(show_name);
  return full ?
    get('/feeds/full_search.php?show=' + s) :
    get('/feeds/search.php?show=' + s);
};

/**
 * Get current upcoming schedule
 * @param  {String} country (optional) US, UK, NL
 * @param  {Boolean} full   return large records?
 * @return {Promise}
 */
exports.schedule = function(country, full){
  var url = full ? '/feeds/fullschedule.php' : '/feeds/quickschedule.php';
  if (country){
    url += '?country=' + country;
  }
  return get(url);
};

/**
 * Get full list of shows
 * @return {Promise}
 */
exports.shows = function(){
  return get('/feeds/show_list.php');
};

/**
 * Get info about a single show
 * @param  {String}  sid  show-id
 * @param  {Boolean} full return large records?
 * @return {Promise}
 */
exports.show = function(sid, full){
  return full ?
    get('/feeds/full_show_info.php?sid=' + sid) : 
    get('/feeds/showinfo.php?sid=' + sid);
};

/**
 * Get episodes for a show
 * @param  {String}  sid  show-id
 * @return {Promise}
 */
exports.episodes = function(sid){
  return get('/feeds/episode_list.php?sid=' + sid);
};

/**
 * Get info about a single episode
 * @param  {String} show_name the show to sarch for
 * @param  {Number} season     Season number
 * @param  {Number} episode   Episode number
 * @param  {Boolean} exact    Is show_name exact or a search?
 * @return {Promise}
 */
exports.episode = function(show_name, season, episode, exact){
  exact = exact ? 1 : 0;
  return get('/feeds/episodeinfo.php?show=' + encodeURIComponent(show_name) + '&exact=' + exact + '&ep=' + season, + 'x' + episode);
};

/**
 * Given a video filename, try to guess TV info
 * big time ripoff: https://www.npmjs.com/package/episoder
 * @param  {String} filename the filename you are trying to guess things from
 * @param  {Object} options  options from episoder
 * @return {Object}          TV info
 */
exports.filename = function(filename, options) {
  var ext = path.extname(filename).toLowerCase(),
  // the following regex should match:
  //   Community S01E04.mp4
  //   Community s01e04.mp4
  //   Community 1x04.mp4
  //   Community 1-04.mp4
    re = /(.*)\D(\d{1,2})[ex\-](\d{1,2})/i,
    searchResults = filename.match(re),
    show,
    season,
    episode,
    offset,
    episodeObject = {};

  options = options || {};

  offset = options.offset || 0;
  if (searchResults === null) {
    // this regex should match:
    //   Community Season 1 Episode 4.mp4
    // (case insensitive)
    re = /(.*)Season.*?(\d{1,2}).*Episode\D*?(\d{1,2})/i;
    searchResults = filename.match(re);
  }

  if (searchResults === null) {
    // this regex should match:
    //   Community 104.mp4
    re = /(.*)\D(\d)(\d\d)\D/;
    searchResults = filename.match(re);
  }

  if (searchResults === null && options.season) {
    // this regex should match:
    //   Community 04.mp4
    // but only if we've specified a season with season flag
    re = /(.*)\D(\d+)\D/;
    searchResults = filename.match(re);
  }

  if (searchResults === null && options.season && options.show) {
    // this regex should match:
    //   04.mp4
    // but only if we've specified a season and show with flags
    re = /(\d+)\D/;
    searchResults = filename.match(re);
  }

  try {
    show = options.show || searchResults[1];
  } catch (e) {
    return null;
  }
  show = titleCase(show
      // remove hanging characters
      .replace(/^[\-.\s]+|[\-.\s]+$/g, "")
      .trim());

  if (options.episode) {
    episode = options.episode + offset;
    if (searchResults !== null) {
      searchResults.pop();
    }
  } else {
    try {
      episode = Number(searchResults.pop()) + offset;
    } catch (e) {
      return null;
    }
  }

  season = options.season || Number(searchResults.pop());

  episodeObject = {
    originalFilename: filename,
    show: show.replace(/\//g,''),
    season: season,
    episode: episode,
    extension: ext
  };
  return episodeObject;
};
