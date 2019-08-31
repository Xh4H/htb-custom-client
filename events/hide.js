// hide rejected / released "plugin"

function action(url) {
	if (url.pathname == "/home/challenges/submissions" || url.pathname == "/home/machines/submissions") {
		let table_rows = document.getElementsByClassName("table")[0].rows;
		let count = 0;
		for (let row of table_rows) {
			if (count++ === 0) continue; // start at index 1 because 0 contains table headers
			let cell = (row.cells[5] || row.cells[4]).innerHTML; // 5 -> machines | 4 -> challenges
			if (cell.includes("Rejected") || cell.includes("Released")) row.style.display= 'none';
		}
	}
		
}

module.exports = action;