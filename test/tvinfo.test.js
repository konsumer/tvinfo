var chai = require('chai');
var expect = chai.expect;
var tvinfo = require('..');

describe('tvinfo', function(){
  describe('.shows()', function(){
    it('should get full list of shows', function(done){
      tvinfo.shows().then(function(res){
        done();
      }, done); 
    });
  });
  
  describe('.search()', function(){
    it('should search for Buffy', function(done){
      tvinfo.search("Buffy").then(function(res){
        done();
      }, done); 
    });
    it('should get more info (slower)', function(done){
      tvinfo.search("Buffy", true).then(function(res){
        done();
      }, done); 
    });
  });
  
  describe('.schedule()', function(){
    it('should get current upcoming schedule', function(done){
      tvinfo.schedule().then(function(res){
        done();
      }, done); 
    });

    it('should get current upcoming US schedule', function(done){
      tvinfo.schedule('US').then(function(res){
        done();
      }, done); 
    });
    it('should get current upcoming UK schedule', function(done){
      tvinfo.schedule('UK').then(function(res){
        done();
      }, done); 
    });

    it('should get current upcoming NL schedule', function(done){
      tvinfo.schedule('NL').then(function(res){
        done();
      }, done); 
    });
    it('should get detailed (slower) current upcoming US schedule', function(done){
      tvinfo.schedule('US', true).then(function(res){
        done();
      }, done); 
    });
  });

  describe('.show()', function(){
    it('should get info about Buffy the Vampire Slayer', function(done){
      tvinfo.show(2930).then(function(res){
        done();
      }, done); 
    });
    it('should get detailed (slower) info about Buffy the Vampire Slayer', function(done){
      tvinfo.show(2930, true).then(function(res){
        done();
      }, done); 
    });
  });
  
  describe('.episodes()', function(){
    it('should get episodes for Buffy the Vampire Slayer', function(done){
      tvinfo.episodes(2930).then(function(res){
        done();
      }, done); 
    });
  });

  describe('.episode()', function(){
    it('should get info about the pilot episode of Buffy the Vampire Slayer', function(done){
      tvinfo.episode('Buffy the Vampire Slayer', 1, 1).then(function(res){
        done();
      }, done); 
    });
  });

  describe('.filename()', function(){
    it('should parse `Buffy_The_Vampire_Slayer-S01E04.mp4`', function(){
      var show = tvinfo.filename('Buffy_The_Vampire_Slayer-S01E04.mp4');
      expect(show).to.be.ok();
      expect(show.show).to.equal('Buffy the Vampire Slayer');
      expect(show.season).to.equal(1);
      expect(show.episode).to.equal(4);
      expect(show.extension).to.equal('.mp4');
    });

    it('should parse `Buffy The Vampire Slayer-1x04.avi`', function(){
      var show = tvinfo.filename('Buffy The Vampire Slayer-1x04.avi');
      expect(show).to.be.ok();
      expect(show.show).to.equal('Buffy the Vampire Slayer');
      expect(show.season).to.equal(1);
      expect(show.episode).to.equal(4);
      expect(show.extension).to.equal('.avi');
    });

    it('should parse `Buffy_The_Vampire_Slayer.104.mp4`', function(){
      var show = tvinfo.filename('Buffy_The_Vampire_Slayer.104.mp4');
      expect(show).to.be.ok();
      expect(show.show).to.equal('Buffy the Vampire Slayer');
      expect(show.season).to.equal(1);
      expect(show.episode).to.equal(4);
      expect(show.extension).to.equal('.mp4');
    });

    it('should parse `Buffy The Vampire Slayer - Season 1 Episode 4.mp4`', function(){
      var show = tvinfo.filename('Buffy The Vampire Slayer - Season 1 Episode 4.mp4');
      expect(show).to.be.ok();
      expect(show.show).to.equal('Buffy the Vampire Slayer');
      expect(show.season).to.equal(1);
      expect(show.episode).to.equal(4);
      expect(show.extension).to.equal('.mp4');
    });

    it('should parse `Buffy The Vampire Slayer/Season 1/Episode 4.mp4`', function(){
      var show = tvinfo.filename('Buffy The Vampire Slayer/Season 1/Episode 4.mp4');
      expect(show).to.be.ok();
      expect(show.show).to.equal('Buffy the Vampire Slayer');
      expect(show.season).to.equal(1);
      expect(show.episode).to.equal(4);
      expect(show.extension).to.equal('.mp4');
    });

  });
});