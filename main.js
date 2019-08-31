const HTB_RPC = require("./custom_dependencies/HTB_RPC");
const electron = require('electron');
const path = require("path");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.on('window-all-closed', function() {
	app.quit();
});

app.on('ready', function() {
	HTB_RPC.start()

	/*
	// **** Select secondary screen ****
	var electronScreen = electron.screen;
	var displays = electronScreen.getAllDisplays();
	for (var i in displays) {
		if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
			externalDisplay = displays[i];
			break;
		}
	}
	*/

	// **** Start new window ****
	mainWindow = new BrowserWindow(
		{	
			//x: externalDisplay.bounds.x + 100,
			//y: externalDisplay.bounds.y + 20,
			width: 1250,
			height: 1000,
			icon: __dirname + "/images/htbicon.ico",
			webPreferences: {
				preload: path.join(__dirname, 'preload.js'),
				nodeIntegration: false
			}
		}
	);

	mainWindow.setMenuBarVisibility(false);
	mainWindow.setRepresentedFilename(__dirname + "/images/htbicon.jpg");
	mainWindow.loadURL('https://hackthebox.eu/home/shoutbox');
	//mainWindow.loadURL('https://www.hackthebox.eu/home/challenges/Pwn?challenge=ropmev2');
	mainWindow.webContents.openDevTools();
});

module.exports = {update: HTB_RPC.updateActivity}