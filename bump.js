var fs = require('fs');
var pkg = require('./package.json');
var exec = require('child_process').exec;

var v = pkg.version.split('.');
v[2]++;
pkg.version = v.join('.');

fs.writeFile('package.json', JSON.stringify(pkg,null,2), function(err){
  if (err){
    console.error(err);
    process.exit(1);
  }
  exec('git add -A && git commit -am "bump to v"'+pkg.version+' && git tag v' + pkg.version + '&& git push --tags && git push', function(err, stdout, stderr){
    if (err){
      console.error(err);
      process.exit(1);
    }
    console.log('bumped to v' + pkg.version);
  });
});