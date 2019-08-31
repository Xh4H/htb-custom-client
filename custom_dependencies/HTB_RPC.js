const DiscordRPC = require("discord-rpc")
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

// dont change
const clientId = '616985953856389156';
let startTimestamp;

let lastActivity = {};
function updateActivity(t) {
	if (!rpc) return false;

	startTimestamp = new Date();
	lastActivity = t;
	setActivity();

	return true;
}

async function setActivity() {
	if (!rpc || !lastActivity.details) {
		return;
	}

	rpc.setActivity({
		details: lastActivity.details, // Zetta
		state: lastActivity.state, // Owning Zetta
		startTimestamp,
		largeImageKey: lastActivity.large, // zetta
		largeImageText: lastActivity.largeText, // Zetta by jkr
		smallImageKey: 'logo', // logo
		smallImageText: 'HackTheBox.eu', // HackTheBox.eu
		instance: false,
	});
}

rpc.on('ready', () => {
	setActivity();

	// activity can only be set every 15 seconds
	setInterval(() => {
		setActivity();
	}, 15e3);
});

function start() {
	return rpc.login({clientId}).catch(console.error);
}

module.exports = {updateActivity, start};