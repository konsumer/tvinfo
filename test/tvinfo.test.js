var expect = require('chai').expect;
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
});