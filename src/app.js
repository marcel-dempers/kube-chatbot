
var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [
  function (session) {

    var message = session.message.text.toLowerCase();
    if (message == "hey kubernetes" || message == "hey k8") {
      session.beginDialog('kubernetes', session.userData.profile);
    }
    else if (message == "!help" || message == "help") {
      session.beginDialog('help', session.userData.profile);
    }
    else {
      console.log('No defined action determined from message:' + session.message.text);
      session.send("I didn't get that, what did you say? Try !help to see what I can do :)");
      session.endDialogWithResult({ response: "I didn't get that, what did you say?" });
    }
  }
]);

bot.dialog('kubernetes', [
  function (session, args, next) {
    builder.Prompts.text(session, "Hey! Give me a kubectl command");
},
function (session, arg, next){
  session.send("Cool, I'm on it!");
  
  var k8 = require('./kubernetes/k8_exec');

  var response = k8.exec(['get', 'nodes'], function(response){

    if(response == null){
      session.endDialog("Something went wrong when I used `kubectl` please check my logs...")
    }
   
    var customMessage = new builder.Message(session)
      .text(response)
      .textFormat("markdown")
      .textLocale("en-us");

      session.send(customMessage);
      session.endDialog("Goodbye!")

  });
}]);

bot.dialog('help',function(session){

  var fs = require('fs');
  var data = '';
  
  var readStream = fs.createReadStream('help.md', 'utf8');
  
  readStream.on('data', function(chunk) {  
      data += chunk;
  }).on('end', function() {
    var customMessage = new builder.Message(session)
    .text(data)
    .textFormat("markdown")
    .textLocale("en-us");
  
    session.send(customMessage);
    session.endDialog("Goodbye!")
  });

  
})
