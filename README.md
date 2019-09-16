<h1 align="center">HTB Custom Client</h1>
<h3 align="center">A set of extended funcionalities for HTB website embedded in a desktop application</h3>

<p align="center">
  <img src="http://forthebadge.com/images/badges/built-with-love.svg"/>
  <img src="https://forthebadge.com/images/badges/gluten-free.svg"/>
</p>

## Added functionalities

### (NEW) Discord account verification
This feature is the trickiest one to the date, but yet so simple to use. You are now able to verify your HTB account in the Official HTB Discord by pressing one single button.

#### How to set up
Q: How does this actually work?
A: As of now, I need to attach a script on Discord's boot in order to grab the auth token. It is simpler than it sounds. Discord desktop app is done with Electron (Node.js), Node.js has a parameter called *NODE_OPTIONS* which allows you to set special options to any script ran with **node**. I promise I will find an easier way to do this.

Q: What do I need to do?
A: Download [this script](https://github.com/Xh4H/htb-custom-client/blob/master/custom_dependencies/discord.js) in your computer. Add (or edit if exists already) the following system variable: NODE_OPTIONS. Assing the following value: **--require </path/to/downloaded_script.js>**. Restart discord and you are done.
![](https://i.imgur.com/dx4mXdU.gifv)

### Activity show off!
You are now able to use Discord Rich Presence to show the latest machine you are working on.
![](https://i.gyazo.com/ea88da8c095f78ce4251372d4e6eca81.gif)

### Respect from Shoutbox
You are now able to respect people directly from the shoutbox. Simply click the half-drawn star :)
![](https://i.gyazo.com/13691dc18cad64b8efaa632a5e7f68f1.gif)

### Custom challenge opener
You are now able to open a challenge directly from the shoutbox
![](https://i.gyazo.com/4b0f28376a2be926208f55642e9cd103.gif)

### IppSec youtube links in retired machines
You are now displayed a youtube icon in `Retired Machines` tab next to every single machine. Those who do not have a video made by IppSec are not displayed.
![](https://i.gyazo.com/d6d95b1b6f28bb4c90659c3a4b2a8cde.gif)

### Display relevant submissions!
You are now only displayed those machines and challenges submissions that were not `rejected` or `released`.
![](https://i.gyazo.com/9d2dd33b468e9265b0f815a7153b7e10.gif)

### Releases
Releases can be found [here](https://github.com/Xh4H/htb-custom-client/releases).

### Important
If you have any ideas, issues... please let me know either via Discord or open up an issue. Pull requests are welcome.


Please note, this client does not save any kind of information about the user. Let's maintain the privacy untouched :)
