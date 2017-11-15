function ExecuteScript(strId)
{
  switch (strId)
  {
      case "5alsfN22saw":
        Script1();
        break;
      case "5l98nMQH5lx":
        Script2();
        break;
  }
}

function Script1()
{
  // sends a message to the parent app

console.log('preparing to send message from storyline');
// get the message input variable from the storyline
var player = window.GetPlayer()
var myMessage = player.GetVar("TextEntry")
console.log('my message',myMessage)
parent.postMessage(myMessage,"*");


/*
We use the 'parent' property as post messages should be sent from within the same container that they are received. Therefore from within the embedded iframe we need to go up one level (equally we could use window.parent)

The first argument in postMessage is the message contents itself. This is of type string, however more complex objects could be send using the JSON.stringify() method first and parsing at the other end

The second argument is the domain in which the receiver is targetting. For security reasons it is common to put the specific domain. If this is the same as the app you can access this using the location.domain property or specifying explicitly. If the location should be received from the app itself you can add a variable to update this property from the app. Alternatively use "*" to allow for any (less secure).
*/


// unused code
// example executing other javascript to parent app
// parent.document.body.style.backgroundColor = "#990000";




}

function Script2()
{
  window.postMessage("slide changed","*")
}

