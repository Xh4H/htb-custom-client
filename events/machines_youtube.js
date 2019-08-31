// IppSec youtube icons "plugin"

const youtube = (url) => { return `<a href="https://www.youtube.com/watch?v=${url}"><i class="fab fa-youtube" style="color: #db524b;cursor: pointer;vertical-align: middle;"></i></a> `};

let isActive = false;
let yt_button, yt_link, retired_button;

function load_youtube_icons() {

	for (let machine of document.getElementsByClassName("machine-list-item")) {
		for (let node of machine.childNodes) { // nodes for machine's name
			let machineName = node.childNodes[4];
			if (machineName) {
				if (!machineName.innerHTML.includes("<i")) {
					machineName = machineName.innerText;
					yt_link = window.ippsec[machineName];

					if (yt_link) {
						yt_button = youtube(yt_link);
						node.innerHTML = yt_button + node.innerHTML
					}
				}
			}
		}
	}
}

function action(url) {
	if (url.pathname === "/home/machines") {
		retired_button = document.getElementsByClassName("status-tab")[1]; // 0 active - 1 retired

		for (const cl of retired_button.classList) {
			if (cl === "active") isActive = true;
		}

		if (isActive) { // Retired machines tab is opened
			load_youtube_icons();
		} else { // Add click event
			retired_button.onclick = () => {load_youtube_icons()};
		}
	}
}

module.exports = action;
