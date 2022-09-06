require('dotenv').config();
'use strict';


const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: 'WblupvwwWW5IbQ1KmARod4KCHX5U8K6wCTPSW+GzAUUWRWrlr9Dofu4VKOPXnRGnN+PJ+yAgraZCSLfsKc248nfr4hLqIVtjUUxW/URPRiRPWk5mfKIAojWtjiNoGIFVVV6m9A4aL8ec58KIPvUsgAdB04t89/1O/w1cDnyilFU=', //process.env.ACCESS_TOKEN,
  channelSecret: '53dbbf75ecca5c5874423d9ff8c7151c'//process.env.CHANNAL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  // const echo = { type: 'text', text: event.message.id };
  const echo = { type: 'text', text: event.source.userId };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
