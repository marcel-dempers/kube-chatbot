
module.exports = {
  exec: function (args, callback) {
    var response = "";

    var child_process = require('child_process');
    var readline = require('readline');
    try {var proc = child_process.spawn("kubectl", args);
    readline.createInterface({
      input: proc.stdout,
      terminal: false
    }).on('line', function (line) {
      response = response + "<br/>" + line;
    }).on('close', function (line) {
      console.log(response);
      callback(response);
    });}
    catch(err){
      console.log(err);
      return null;
    }
  }
}