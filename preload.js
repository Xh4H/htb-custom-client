// Custom events
const challenge_opener = require("./events/challenge_opener");
const machines_discord = require("./events/machines_discord");
const machines_youtube = require("./events/machines_youtube");
const shoutbox = require("./events/shoutbox");
const hide = require("./events/hide");

// window configs
const ippsec_videos = require("./custom_dependencies/ippsec_videos");

let actions = [shoutbox, challenge_opener, machines_discord, machines_youtube, hide];

function startActions(url) {
	actions.forEach(action => action(url));
}

window.onload = function() {
	let url = new URL(window.location.href);
	window.ippsec = ippsec_videos;
	window.apiToken = window.Laravel.apiToken;
	startActions(url);
};
