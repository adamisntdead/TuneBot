# TuneBot (Facebook Messenger Bot)

[![Join the chat at https://gitter.im/adamisntdead/TuneBot](https://badges.gitter.im/adamisntdead/TuneBot.svg)](https://gitter.im/adamisntdead/TuneBot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A Facebook Messenger bot that takes the name of an Irish music tune, and gives suggestions as to what you could play with it. Powered by the [TheSession.org](https://thesession.org/)

## Usage
### What You Need
To use this bot, you are going to need a place to host / test node.js apps, personally, I will be using Heroku, as will this guide. you will also need to make a facebook page

### Fork this repo
The first thing you want to do is to fork this repo (or download the files), into wherever you want, and then just leave that there, and go to the next step

### Create a facebook app
Next, you will want to create a facebook app [Here](https://developers.facebook.com/), and then Go to your app settings and, under Product Settings, click "Add Product." Select "Messenger."

![Add Product](https://scontent-lhr3-1.xx.fbcdn.net/t39.2178-6/12995587_195576307494663_824949235_n.png)

### Setup Webhook
Under the "PRODUCT SETTINGS" section, click on the "Messenger" product you just added, find the Webhooks section and click Setup Webhooks. Enter a URL for a webhook (ie. https://app.herokuapp.com/webhook) in this app the webhook url is /webhook, enter a Verify Token (for this app its 'verifytune') and select message_deliveries, messages, messaging_optins, and messaging_postbacks under Subscription Fields.

![Webhook](https://scontent-lhr3-1.xx.fbcdn.net/t39.2178-6/12057143_211110782612505_894181129_n.png)

### Get Page Access Token
In the Token Generation section, select your Page. A Page Access Token will be generated for you. Copy this Page Access Token, and go to your node dashboard and then settings. there should be a button to show config vars, click it and create a variable "PAGE_ACCESS_TOKEN" and in that field put the page token we generated a minute ago.

![Heroku Varibles](http://s32.postimg.org/d43qqlmv9/Heroku_Config.png)

### Subscribe app to the page
Now you want to go to your teminal in the directory where you put this apps files, and enter the command `curl -ik -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=<token>"`, replaceing `<token>` with the token we got a minute ago for the facebook page.

### Deploy
Now Deply to Heroku or whatever platform you are using!

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License
Released under GNU (General Public License)
Permission for individuals, Organizations and Companies to run, study, share (copy), and modify the software and its source.
Copyright Adam Kelly 2016-2017
