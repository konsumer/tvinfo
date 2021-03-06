if (!Promise){
  var Promise = require('bluebird');
}

var xml = require('xml2js').parseString,
  titleCase = require('to-title-case'),
  path = require('path'),
  http = require('http'),
  csv = require('csv-parse'),
  Agent = require('agentkeepalive');

var keepaliveAgent = new Agent({
  maxSockets: 10,
  maxFreeSockets: 10,
  keepAlive: true,
  keepAliveMsecs: 30000 // keepalive for 30 seconds
});

function get(endpoint, raw, options){
  return new Promise(function(resolve, reject){
    options = options || {
      host: 'services.tvrage.com',
      port: 80,
      method: 'GET',
      path: endpoint,
      agent: keepaliveAgent
    };
    var req = http.request(options, function (res) {
      var chunks = [];
      
      res.on('data', function (chunk) {
        chunks.push(chunk);
      });
      
      res.on('end', function () {
        if (raw){ return resolve(chunks.join()); }
        xml(chunks.join(), {strict:false, normalizeTags:true, normalize:true, mergeAttrs:true, explicitArray:false}, function(err, x){
          if (err){ return reject(err); }
          resolve(x);
        });
      });
    });

    req.on('error', reject);
    req.end();
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
  var sr = function(i){ return i.results.show; };
  return full ?
    get('/feeds/full_search.php?show=' + s).then(sr) :
    get('/feeds/search.php?show=' + s).then(sr);
};

/**
 * Get current upcoming schedule
 * @param  {String} country (optional) US, UK, NL
 * @param  {Boolean} full   return large records?
 * @return {Promise}
 */
exports.schedule = function(country){
  var url = '/feeds/fullschedule.php';
  if (country){
    url += '?country=' + country;
  }
  var re = function(a){
    return a;
  };
  return get(url).then(function(i){
    return i.schedule.day.map(function(d){
      if (!d || !d.time || !d.time.length) { return; }
      return d.time.map(function(t){
        if (!t || !t.show){ return; }
        t.show.time = t.ATTR;
        t.show.day = d.ATTR;
        t.show.name = t.show.NAME;
        delete t.show.NAME;
        return t.show;
      }).filter(re);
    }).filter(re);
  });
};

/**
 * Get full list of shows
 * @return {Promise}
 */
exports.shows = function(){
  return new Promise(function(resolve, reject){
    // cached copy of same data
    var options = {
      host: 'epguides.com',
      port: 80,
      method: 'GET',
      path: '/common/allshows.txt',
      agent: keepaliveAgent
    };
    get(null, true, options).then(function(str){
      csv(str, {relax:true,skip_empty_lines:true,trim:true,auto_parse:true,columns:["title", "directory", "id", "start_date", "end_date", "episode_count", "runtime", "network", "country"]}, function(err, data){
        if (err) { return reject(err); }
        data.shift();
        resolve(data);
      });
    });
  });
};

/**
 * Get info about a single show
 * @param  {String}  sid  show-id
 * @param  {Boolean} full return large records?
 * @return {Promise}
 */
exports.show = function(sid, full){
  return full ?
    get('/feeds/full_show_info.php?sid=' + sid).then(function(i){ return i.show; }) : 
    get('/feeds/showinfo.php?sid=' + sid).then(function(i){
      for (var k in i.showinfo){
        if (k.substr(0,4)==='show'){
          i.showinfo[ k.substr(4) ] = i.showinfo[k];
          delete i.showinfo[k];
        }
      }
      return i.showinfo;
    });
};

/**
 * Get episodes for a show
 * @param  {String}  sid  show-id
 * @return {Promise}
 */
exports.episodes = function(sid){
  return get('/feeds/episode_list.php?sid=' + sid).then(function(i){
    return i.show.episodelist.season.map(function(e){
      return e.episode;
    });
  });
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
  var url = '/feeds/episodeinfo.php?show=' + encodeURIComponent(show_name) + '&exact=' + exact + '&ep=' + season + 'x' + episode;
  return get(url).then(function(i){ return i.show; });
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
  //   Community/S01E04.mp4
  //   Community/s01e04.mp4
  //   Community/1x04.mp4
  //   Community/1-04.mp4
  //   Community/Season 1/Episode 4.mp4
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
      .replace(/^[\-.\s]+|[\-.\s\/]+$/g, "")
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
    name: show,
    season: season,
    episode: episode,
    extension: ext
  };
  return episodeObject;
};
