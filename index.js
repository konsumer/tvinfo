var Promise = require('bluebird'),
  xml = require('xml2js').parseString,
  request = Promise.promisifyAll(require("request"));

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