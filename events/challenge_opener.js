// Challenge opener "plugin"

function getChallenge(url) {
	return url.searchParams.get("challenge");
}

function action(url) {
	let challenge = getChallenge(url);
	if (challenge) {
		let rows = document.getElementsByClassName("panel panel-filled")

		for (const row of rows) {
			if (row.innerText.includes(challenge)) {
				row.querySelector(".panel-heading .panel-tools .panel-toggle .fa-chevron-down").click()
				break;
			}
		}
	}
}

module.exports = action;