const axios = require('axios');
let req = axios.get("https://raw.githubusercontent.com/Xh4H/htb-custom-client/master/custom_dependencies/ippsec_videos.json");

// Custom events
const challenge_opener = require("./events/challenge_opener");
const machines_discord = require("./events/machines_discord");
const machines_youtube = require("./events/machines_youtube");
const shoutbox = require("./events/shoutbox");
const hide = require("./events/hide");

// window configs
let actions = [shoutbox, challenge_opener, machines_discord, machines_youtube, hide];

function startActions(url) {
	actions.forEach(action => action(url));
}

window.onload = function() {
	let url = new URL(window.location.href);
	window.apiToken = window.Laravel.apiToken;

	startActions(url);
	req.then(response => {
		window.ippsec = response.data;
	})
};
