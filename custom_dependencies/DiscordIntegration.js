const fs = require("fs");
const crypto = require('crypto');
const axios = require("axios");
const {
	exec,
	execSync
} = require('child_process');

const dataFolder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : process.env.HOME + "/.local/share");
const algorithm = 'aes-256-cbc';

let {
	platform
} = process,
win32RegBinPath = {
		native: '%windir%\\System32',
		mixed: '%windir%\\sysnative\\cmd.exe /c %windir%\\System32'
	},
	guid = {
		darwin: 'ioreg -rd1 -c IOPlatformExpertDevice',
		win32: `${win32RegBinPath[isWindowsProcessMixedOrNativeArchitecture()]}\\REG.exe ` +
			'QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography ' +
			'/v MachineGuid',
		linux: '( cat /var/lib/dbus/machine-id /etc/machine-id 2> /dev/null || hostname ) | head -n 1 || :',
		freebsd: 'kenv -q smbios.system.uuid || sysctl -n kern.hostuuid'
	};

function isWindowsProcessMixedOrNativeArchitecture() {
	// detect if the node binary is the same arch as the Windows OS.
	// or if this is 32 bit node on 64 bit windows.
	if (process.platform !== 'win32') {
		return '';
	}
	if (process.arch === 'ia32' && process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432')) {
		return 'mixed';
	}
	return 'native';
}

function hash(guid) {
	return crypto.createHash('sha256').update(guid).digest('hex');
}

function expose(result) {
	switch (platform) {
		case 'darwin':
			return result
				.split('IOPlatformUUID')[1]
				.split('\n')[0].replace(/\=|\s+|\"/ig, '')
				.toLowerCase();
		case 'win32':
			return result
				.toString()
				.split('REG_SZ')[1]
				.replace(/\r+|\n+|\s+/ig, '')
				.toLowerCase();
		case 'linux':
			return result
				.toString()
				.replace(/\r+|\n+|\s+/ig, '')
				.toLowerCase();
		case 'freebsd':
			return result
				.toString()
				.replace(/\r+|\n+|\s+/ig, '')
				.toLowerCase();
		default:
			throw new Error(`Unsupported platform: ${process.platform}`);
	}
}

function machineIdSync(original) {
	let id = expose(execSync(guid[platform]).toString());
	return original ? id : hash(id);
}

function decrypt(iv, data) {
	iv = Buffer.from(iv, 'hex');
	let encryptedText = Buffer.from(data, 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', crypto.createHash('sha256').update(String(machineIdSync(false))).digest('base64').substr(0, 32), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString();
}


class DiscordConnection {
	getToken() {
		let f;
		try {
			f = fs.readFileSync(`${dataFolder}/d.t`, "utf8").split(":-:");
			f = decrypt(f[0], f[1]);
		} catch (e) {
			f = "";
		} finally {
			return f.replace(/^\s+|\s+$/g, "");
		}
	}

	get(url, payload) {
		return this.requestHandler.get(url, payload || {});
	}

	post(url, payload) {
		return this.requestHandler.post(url, payload || {});
	}

	constructor() {
		this.token = this.getToken();
		this.requestHandler = axios.create({
			baseURL: "https://discordapp.com/api/v6",
			headers: {
				Authorization: this.token,
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) htb_client/0.0.1"
			}
		});
	}
}

module.exports = DiscordConnection;
