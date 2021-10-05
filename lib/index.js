const express = require('express')
const db = require('./db')
const app = express()
const config = {
  port: 3000
}


app.get('/', (req, res) => {
  // Project homepage
  // Return some HTML content inside `body` with:
  // * The page title
  // * A link to the `/channels` page
  // Don't bother with the `head` tag
  res.send(
  '<body>'
  + '<title>Homepage</title>'
  + '<a href="/channels">Click here to access channels</a>'
  + '</body>');
})

app.get('/channels', async (req, res) => {
  // List of channels
  // Return some HTML content inside `body` with:
  // * The page title
  // * A list of every channel with a link to the channel page
  // Notes:
  // * Channels are identified by channel ids.
  // * Make sure to find the appropriate HTML tag to respect the HTML semantic
  //   of a list
  const data = await db.list();
  var list = '<ol>';

  for(var channel of data)
      list += '<li>' + '<a href="/channel/' + channel.id + '">' + channel.name + '</a>' + '</li>';
  list += '</ol>';

  res.send(
  '<body>'
  + '<title>Channels</title>'
  + list
  + '</body>');
})

app.get('/channel/:id', async (req, res) => {
  // Channel information
  // Print the channel Ttitle
  const data = await db.get(req.params.id);
  res.send("Channel name is " + data.name);
})

app.listen(config.port, () => {
  console.log(`Chat is waiting for you at http://localhost:${config.port}`)
})
