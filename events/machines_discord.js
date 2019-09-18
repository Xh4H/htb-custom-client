// Machine discord "plugin"

const electron = require('electron');
const update = electron.remote.require('./index').update;

function action(url) {
	// Check if we are inside a machine profile
	let machineID = url.pathname.match(/home\/machines\/profile\/(\d{1,3})/); // Get machine ID

	if (machineID) {
		// ["home/machines/profile/204", "204", index: 1, input: "/home/machines/profile/204", groups: undefined]
		machineID = machineID[1];

		let machineName = document.getElementsByClassName("m-n")[0].innerText.trim();
		let machineOwner;
		for (const el of document.getElementsByClassName("no-margins")) {
			if (el.innerHTML.indexOf("profile/") !== -1) {
				machineOwner = el.innerText;
				break;
			}
		}

		let newButton = document.createElement("BUTTON");
		newButton.style = "border-color: #7289DA; background-color: transparent; color: #7289DA";
		newButton.innerHTML = `<i class="fab fa-discord"></i> Discord`;
		newButton.classList.add("btn");
		newButton.classList.add("btn-default");
		newButton.classList.add("btn-xs");
		newButton.onclick = () => {
			let success = update({
				details: `${machineName} (ID: ${machineID})`,
				state: "Owning " + machineName,
				large: machineName.toLowerCase(),
				largeText: "Box made by " + machineOwner
			});

			if (success) toastr["success"]("Success!", "Rich Presence set!");
		};

		buttonRows = document.getElementById("btnRespect");
		if (buttonRows) {
			buttonRows.appendChild(newButton);
		}
	}
}

module.exports = action;
