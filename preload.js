// Custom events
const challenge_opener = require("./events/challenge_opener");
const machines_discord = require("./events/machines_discord");
const shoutbox = require("./events/shoutbox");

let actions = [shoutbox, challenge_opener, machines_discord];

function startActions(url) {
	actions.forEach(action => action(url));
}

window.onload = function() {
	let url = new URL(window.location.href);
	window.apiToken = window.Laravel.apiToken;
	startActions(url);
};
