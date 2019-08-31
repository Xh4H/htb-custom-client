// Shoutbox "plugin"

const respectUserTemplate = (user) => {return `$.ajax({type:'POST',dataType:'json',url:'/api/users/respect/${user}?api_token=${window.apiToken}',beforeSend:function(){},complete:function(){},success:function(e){1==e.success?toastr.success('Success!','User has been respected!'):console.log(e)},error:function(e){console.log(e)}});`};
const thumbsup = (respect) => {return `  <span class="text-success rating-pro" style="cursor: pointer;" data-toggle="tooltip" onclick=\"${respect}\""><i class="fas fa-star-half-alt" style="color: #f0c526;"></i></span>`};

function loadEdits() {
	// Add respect button to every user in the shoutbox
	let shouts = document.getElementById("shouts");
	for (const shout of shouts.childNodes) {

		let profile = shout.innerHTML.match(/\<a href\=\"https\:\/\/www.hackthebox.eu\/home\/users\/profile\/(\d+)\">\w+\<\/a\>/);

		if (profile) {
			let profileMatch = profile[0]; // capture the entire match
			let profileID = profile[1]; // capture ID
			shout.innerHTML = shout.innerHTML.replace(profileMatch, profileMatch + thumbsup(respectUserTemplate(profileID)));
		}
	}
}

let shoutboxNode = document.getElementsByClassName("panel-body")[0];
const config = {
	attributes: true,
	childList: true,
	subtree: true
};

const callback = function(mutationsList, observer) {
	for(let mutation of mutationsList) {
		if (mutation.type === 'childList') {
			let newLine = mutation.addedNodes[0];
			let innerHTML = newLine.innerHTML;
			let profile = innerHTML.match(/\<a href\=\"https\:\/\/www.hackthebox.eu\/home\/users\/profile\/(\d+)\">\w+\<\/a\>/);

			if (!profile) return;
			
			let profileMatch = profile[0]; // capture the entire match
			let profileID = profile[1]; // capture ID
			newLine.innerHTML = innerHTML.replace(profileMatch, profileMatch + thumbsup(respectUserTemplate(profileID)));
		}
	}
};

const observer = new MutationObserver(callback);
let started = false;

function action(url) {
	if (url.pathname === "/home/shoutbox") {
		// Attach mutation observer
		if (shoutboxNode == undefined) shoutboxNode = document.getElementsByClassName("panel-body")[0];

		if (!started && shoutboxNode) {
			observer.observe(shoutboxNode, config);
			started = true;
		}

		loadEdits();
		
		// Challenge opener dispatcher
		document.addEventListener("click", function(e) {
			e = e || window.event;
			let target = e.target || e.srcElement,
				text = target.textContent || target.innerText;  

			if (target.parentNode && (target.parentNode.parentNode != undefined)) {
				if (target.parentNode.parentNode.innerHTML.indexOf("solved challenge") !== -1) { // clicked on a challenge shout
					let base = target.parentNode.parentNode.childNodes;

					if (!base[4] || !base[6]) return;

					let challengeName = base[4].innerText;
					let challengeCategory = base[6].innerText;
					window.location.href = `https://www.hackthebox.eu/home/challenges/${challengeCategory}?challenge=${challengeName}`;
				}
			}
		}, false);
	}
}

module.exports = action;
